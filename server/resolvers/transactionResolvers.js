import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import {
  transactions as transactionsCollection,
  savingsAccount as savingsAccountCollection,
  checkingAccount as checkingAccountCollection,
} from "../config/mongoCollections.js";
import redisClient from "../clients/redisClient.js";
import wkhtmltopdf from "wkhtmltopdf";

const htmlToPdf = async (html) => {
  return new Promise((resolve, reject) => {
    wkhtmltopdf(html, { pageSize: "letter" }, (err, stream) => {
      if (err) {
        reject(err);
        return;
      }
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer.toString("base64"));
      });
    });
  });
};

const generateTransactionsHtml = (transactions) => {
  const rows = transactions
    .map(
      (t) => `
    <tr>
      <td>${t.dateOfTransaction}</td>
      <td>${t.description}</td>
      <td>${t.amount}</td>
      <td>${t.type}</td>
    </tr>
  `
    )
    .join("");

  return `
    <html>
    <head>
      <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <h1>Transaction Report</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </body>
    </html>
  `;
};

export const transactionResolvers = {
  Query: {
    getAllTransactions: async (_, args) => {
      let cacheKey = `allTransactions:${args.userId.trim()}:${args.accountType.trim()}`;
      let exists = await redisClient.exists(cacheKey);
      if (exists) {
        let list = await redisClient.lRange(
          `allTransactions:${args.userId.trim()}:${args.accountType.trim()}`,
          0,
          -1
        );
        return list.map((str) => JSON.parse(str));
      } else {
        const transactions = await transactionsCollection();
        const savingsAccounts = await savingsAccountCollection();
        const checkingAccounts = await checkingAccountCollection();
        if (args.accountType.trim() === "savings") {
          const foundAccount = await savingsAccounts.findOne(
            { ownerId: args.userId.trim() },
            { projection: { _id: 1 } }
          );
          if (!foundAccount) {
            throw new GraphQLError("Account Not Found", {
              extensions: { code: "BAD_USER_INPUT" },
            });
          }
          const foundTransactions = await transactions
            .find({
              $or: [
                { senderId: foundAccount._id },
                { receiverId: foundAccount._id },
              ],
            })
            .toArray();
          if (!foundTransactions) {
            throw new GraphQLError("User has no transactions", {
              extensions: { code: "BAD_USER_INPUT" },
            });
          }

          //push transactions to the redis object
          foundTransactions.forEach((transaction) => {
            redisClient.rPush(
              `allTransactions:${args.userId.trim()}:${args.accountType.trim()}`,
              JSON.stringify(transaction)
            );
          });
          //set expiration
          await redisClient.expire(
            `allTransactions:${args.userId.trim()}:${args.accountType.trim()}`,
            3600
          );

          return foundTransactions;
        }
        if (args.accountType.trim() === "checking") {
          const foundAccount = await checkingAccounts.findOne(
            { ownerId: args.userId.trim() },
            { projection: { _id: 1 } }
          );
          if (!foundAccount) {
            throw new GraphQLError("Account Not Found", {
              extensions: { code: "BAD_USER_INPUT" },
            });
          }
          const foundTransactions = await transactions
            .find({
              $or: [
                { senderId: foundAccount._id },
                { receiverId: foundAccount._id },
              ],
            })
            .toArray();
          if (!foundTransactions) {
            throw new GraphQLError("User has no transactions", {
              extensions: { code: "BAD_USER_INPUT" },
            });
          }

          //push transactions to the redis object
          foundTransactions.forEach((transaction) => {
            redisClient.rPush(
              `allTransactions:${args.userId.trim()}:${args.accountType.trim()}`,
              JSON.stringify(transaction)
            );
          });
          //set expiration
          await redisClient.expire(
            `allTransactions:${args.userId.trim()}:${args.accountType.trim()}`,
            3600
          );

          return foundTransactions;
        }
      }
    },
  },
  Mutation: {
    addTransferTransaction: async (_, { senderId, receiverId, amount, description }) => {
      try {
        if (senderId === receiverId) {
          throw new GraphQLError("Sender and Receiver cannot be the same for transfer transactions");
        }
        if (amount <= 0) {
          throw new GraphQLError("Amount must be greater than 0");
        }
        
        const senderAccount = await accountResolvers.Query.getCheckingAccountInfo(_, { userId: senderId });
        const receiverAccount = await accountResolvers.Query.getCheckingAccountInfo(_, { userId: receiverId });

        if (!senderAccount) {
          throw new GraphQLError("Sender checking account not found");
        }
        console.log("Sender Account:", senderAccount);
        if (!receiverAccount) {
          throw new GraphQLError("Receiver checking account not found");
        }
        console.log("Receiver Account:", receiverAccount);
        if (senderAccount.balance < amount) {
          throw new GraphQLError("Sender does not have sufficient balance");
        }

        const transaction = {
          _id: new ObjectId(),
          senderId: new ObjectId(senderId),
          receiverId: new ObjectId(receiverId),
          amount: amount,
          description: description.trim(),
          ownerOfReceiver: receiverAccount.ownerId,
          ownerOfSender: senderAccount.ownerId,
          dateOfTransaction: new Date(),
          type: "Transfer",
        };

        const transactionsCol = await transactionsCollection();
        await transactionsCol.insertOne(transaction);

        const caCollection = await checkingAccountCollection();
        await caCollection.updateOne(
          { ownerId: new ObjectId(senderId) },
          { $inc: { balance: -amount } }
        );
        await caCollection.updateOne(
          { ownerId: new ObjectId(receiverId) },
          { $inc: { balance: amount } }
        );

        return transaction;
      } catch (error) {
        console.error("Error creating transfer transaction:", error);
        throw new GraphQLError("Internal Server Error");
      }
    },


    addBudgetedTransaction: async (
      _,
      { ownerId, amount, description, type }
    ) => {
      try {
        // Validate the amount
        if (amount <= 0) {
          throw new GraphQLError("Amount must be greater than 0");
        }
        const caCollection = await checkingAccountCollection();
        const account = await caCollection.findOne({
          ownerId: ownerId,
        });
        if (!account) {
          throw new GraphQLError("Checking account not found");
        }

        if (account.balance < amount) {
          throw new GraphQLError("Account does not have sufficient balance");
        }

        await caCollection.updateOne(
          { _id: account._id },
          { $inc: { balance: -amount } }
        );

        const transaction = {
          _id: new ObjectId(),
          senderId: new ObjectId(account._id),
          receiverId: new ObjectId(account._id),
          amount: amount,
          description: description.trim(),
          ownerOfReceiver: ownerId,
          ownerOfSender: ownerId,
          dateOfTransaction: new Date(),
          type: "Budgeted",
        };

        const transactionsCol = await transactionsCollection();
        await transactionsCol.insertOne(transaction);
        return transaction;
      } catch (error) {
        console.error("Error creating budgeted transaction:", error);
        throw new GraphQLError("Internal Server Error");
      }
    },
    addCheckingToSavingTransfer: async (
      _,
      { ownerId, amount, description, type }
    ) => {
      try {
        if (amount <= 0) {
          throw new GraphQLError("Amount must be greater than 0");
        }
        const checkingAccounts = await checkingAccountCollection();
        const savingsAccounts = await savingsAccountCollection();

        const checkingAccount = await checkingAccounts.findOne({
          ownerId: ownerId,
        });
        const savingsAccount = await savingsAccounts.findOne({
          ownerId: ownerId,
        });

        if (!checkingAccount) {
          throw new GraphQLError("Checking account not found");
        }
        if (!savingsAccount) {
          throw new GraphQLError("Savings account not found");
        }
        if (checkingAccount.balance < amount) {
          throw new GraphQLError("Insufficient balance in checking account");
        }

        const transaction = {
          _id: new ObjectId(),
          senderId: checkingAccount._id,
          receiverId: savingsAccount._id,
          amount: amount,
          description: description.trim(),
          dateOfTransaction: new Date(),
          type: "CheckingToSavingTransfer",
        };

        const transactionsCol = await transactionsCollection();
        await transactionsCol.insertOne(transaction);

        await checkingAccounts.updateOne(
          { _id: checkingAccount._id },
          { $inc: { balance: -amount } }
        );
        await savingsAccounts.updateOne(
          { _id: savingsAccount._id },
          {
            $set: { previousBalance: savingsAccount.currentBalance },
            $inc: { currentBalance: amount },
          }
        );

        return transaction;
      } catch (error) {
        console.error("Error during checking to saving transfer:", error);
        throw new GraphQLError("Internal Server Error");
      }
    },

    addSavingToCheckingTransfer: async (
      _,
      { ownerId, amount, description, type }
    ) => {
      try {
        if (amount <= 0) {
          throw new GraphQLError("Amount must be greater than 0");
        }
        const savingsAccounts = await savingsAccountCollection();
        const checkingAccounts = await checkingAccountCollection();

        const savingsAccount = await savingsAccounts.findOne({
          ownerId: ownerId,
        });
        const checkingAccount = await checkingAccounts.findOne({
          ownerId: ownerId,
        });

        if (!savingsAccount) {
          throw new GraphQLError("Savings account not found");
        }
        if (!checkingAccount) {
          throw new GraphQLError("Checking account not found");
        }
        if (savingsAccount.currentBalance < amount) {
          throw new GraphQLError("Insufficient balance in savings account");
        }

        const transaction = {
          _id: new ObjectId(),
          senderId: savingsAccount._id,
          receiverId: checkingAccount._id,
          amount: amount,
          description: description.trim(),
          dateOfTransaction: new Date(),
          ownerOfReceiver: ownerId,
          ownerOfSender: ownerId,
          type: "SavingToCheckingTransfer",
        };

        const transactionsCol = await transactionsCollection();
        await transactionsCol.insertOne(transaction);

        await savingsAccounts.updateOne(
          { _id: savingsAccount._id },
          {
            $set: { previousBalance: savingsAccount.currentBalance },
            $inc: { currentBalance: -amount },
          }
        );
        await checkingAccounts.updateOne(
          { _id: checkingAccount._id },
          { $inc: { balance: amount } }
        );

        return transaction;
      } catch (error) {
        console.error("Error during saving to checking transfer:", error);
        throw new GraphQLError("Internal Server Error");
      }
    },
    editBudgetedTransaction: async (
      _,
      { transactionId, newAmount, newDescription }
    ) => {
      try {
        const transactionsCol = await transactionsCollection();
        const checkingCol = await checkingAccountCollection();

        const transaction = await transactionsCol.findOne({
          _id: new ObjectId(transactionId),
        });
        if (!transaction) {
          throw new GraphQLError("Transaction not found");
        }
        if (transaction.type !== "Budgeted") {
          throw new GraphQLError("Transaction is not a budgeted transaction");
        }

        // Calculate the amount difference if newAmount is provided
        let amountDifference = 0;
        if (newAmount !== undefined && newAmount !== transaction.amount) {
          if (newAmount <= 0) {
            throw new GraphQLError("Amount must be greater than 0");
          }
          amountDifference = newAmount - transaction.amount;
        }

        const updates = {};
        if (amountDifference !== 0) {
          updates.amount = newAmount;
        }
        if (newDescription !== undefined) {
          updates.description = newDescription;
        }

        await transactionsCol.updateOne(
          { _id: new ObjectId(transactionId) },
          { $set: updates }
        );

        if (amountDifference !== 0) {
          await checkingCol.updateOne(
            { ownerId: transaction.senderId },
            { $inc: { balance: -amountDifference } }
          );
        }

        return {
          _id: transactionId,
          senderId: transaction.senderId,
          receiverId: transaction.receiverId,
          amount: newAmount || transaction.amount,
          description: newDescription || transaction.description,
          dateOfTransaction: new Date(),
          type: "Budgeted",
        };
      } catch (error) {
        console.error("Error editing budgeted transaction:", error);
        throw new GraphQLError("Internal Server Error");
      }
    },

    deleteBudgetedTransaction: async (_, { ownerId, transactionId }) => {
      try {
        const ownerIdObj = new ObjectId(ownerId);
        const transactionIdObj = new ObjectId(transactionId);

        const caCollection = await checkingAccountCollection();
        const transactionsCol = await transactionsCollection();

        // Find the transaction to delete
        const transaction = await transactionsCol.findOne({
          _id: transactionIdObj,
          senderId: ownerIdObj,
        });
        if (!transaction) {
          throw new GraphQLError("Transaction not found");
        }

        // Check the type of transaction
        if (transaction.type !== "Budgeted") {
          throw new GraphQLError("Only budgeted transactions can be deleted");
        }

        // Check if the account associated with the transaction exists
        const account = await caCollection.findOne({ ownerId: ownerIdObj });
        if (!account) {
          throw new GraphQLError("Checking account not found");
        }

        // Update the account balance by adding back the transaction amount
        await caCollection.updateOne(
          { _id: account._id },
          { $inc: { balance: transaction.amount } }
        );

        // Delete the transaction from the transactions collection
        await transactionsCol.deleteOne({ _id: transactionIdObj });

        return { success: true, message: "Transaction deleted successfully" };
      } catch (error) {
        console.error("Error deleting budgeted transaction:", error);
        throw new GraphQLError("Internal Server Error");
      }
    },
    downloadTransactions: async (_, { transactions }) => {
      try {
        let transactionsJson = JSON.parse(transactions);

        const htmlContent = generateTransactionsHtml(transactionsJson);
        const pdfBase64 = await htmlToPdf(htmlContent);
        return pdfBase64;
      } catch (e) {
        console.log("Error downloading transactions PDF:", e);
        throw new GraphQLError("Failed to generate PDF", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },
};
