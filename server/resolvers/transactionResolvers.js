import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import {
  transactions as transactionsCollection,
  savingsAccount as savingsAccountCollection,
  checkingAccount as checkingAccountCollection,
} from "../config/mongoCollections.js";
import redisClient from "../clients/redisClient.js";
import wkhtmltopdf from "wkhtmltopdf";
import clerkClient from "../clients/clerkClient.js";
import { generateTransactionsHtml } from "./pdfHelpers/generateTransactionsHtml.js";

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

export const transactionResolvers = {
  Query: {
    getAllTransactions: async (
      _,
      { userId, checkingAccountId, savingsAccountId }
    ) => {
      let cacheKey = `allTransactions:${userId.trim()}`;
      let exists = await redisClient.exists(cacheKey);
      if (exists) {
        let list = await redisClient.lRange(
          `allTransactions:${userId.trim()}`,
          0,
          -1
        );
        return list.map((str) => JSON.parse(str));
      } else {
        const transactions = await transactionsCollection();
        const foundTransactions = await transactions
          .find({
            $or: [
              {
                $or: [
                  { senderId: new ObjectId(savingsAccountId) },
                  { senderId: new ObjectId(checkingAccountId) },
                ],
              },
              {
                $or: [
                  { receiverId: new ObjectId(savingsAccountId) },
                  { receiverId: new ObjectId(checkingAccountId) },
                ],
              },
            ],
          })
          .toArray();

        //push transactions to the redis object
        foundTransactions.forEach((transaction) => {
          redisClient.rPush(
            `allTransactions:${userId.trim()}`,
            JSON.stringify(transaction)
          );
        });
        //set expiration
        await redisClient.expire(`allTransactions:${userId.trim()}`, 3600);

        return foundTransactions;
      }
    },
  },
  Mutation: {
    addTransferTransaction: async (
      _,
      { senderOwnerId, receiverOwnerId, amount, description }
    ) => {
      if (senderOwnerId === receiverOwnerId) {
        throw new GraphQLError(
          "Sender and Receiver cannot be the same for transfer transactions"
        );
      }
      if (amount <= 0) {
        throw new GraphQLError("Amount must be greater than 0");
      }
      const caCollection = await checkingAccountCollection();
      const senderAccount = await caCollection.findOne({
        // _id: new ObjectId(senderId),
        ownerId: senderOwnerId,
      });
      const receiverAccount = await caCollection.findOne({
        // _id: new ObjectId(receiverId),
        ownerId: receiverOwnerId,

      });

      if (!senderAccount) {
        throw new GraphQLError("Sender checking account not found");
      }
      if (!receiverAccount) {
        throw new GraphQLError("Receiver checking account not found");
      }
      if (senderAccount.balance < amount) {
        throw new GraphQLError("Sender does not have sufficient balance");
      }
      try {
        const transaction = {
          _id: new ObjectId(),
          senderId: new ObjectId(senderAccount._id),
          receiverId: new ObjectId(receiverAccount._id),
          amount: amount,
          description: description.trim(),
          dateOfTransaction: new Date(),
          type: "Transfer",
        };

        const transactionsCol = await transactionsCollection();
        await transactionsCol.insertOne(transaction);
        const senderUser = await caCollection.findOne({
          _id: new ObjectId(senderAccount._id),
        });
        const receiverUser = await caCollection.findOne({
          _id: new ObjectId(receiverAccount._id),
        });

        await caCollection.updateOne(
          { _id: new ObjectId(senderAccount._id) },
          { $inc: { balance: -amount } }
        );
        await caCollection.updateOne(
          { _id: new ObjectId(receiverAccount._id) },
          { $inc: { balance: amount } }
        );
        await redisClient.del(`allTransactions:${senderUser.ownerId.trim()}`);
        await redisClient.del(`allTransactions:${receiverUser.ownerId.trim()}`);
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
      try {
        const transaction = {
          _id: new ObjectId(),
          senderId: new ObjectId(account._id),
          receiverId: new ObjectId(account._id),
          amount: amount,
          description: description.trim(),
          dateOfTransaction: new Date(),
          type: "Budgeted",
        };

        const transactionsCol = await transactionsCollection();
        await transactionsCol.insertOne(transaction);
        await redisClient.del(`allTransactions:${ownerId.trim()}`);
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
      try {
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
        await redisClient.del(`allTransactions:${ownerId.trim()}`);
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
      try {
        const transaction = {
          _id: new ObjectId(),
          senderId: savingsAccount._id,
          receiverId: checkingAccount._id,
          amount: amount,
          description: description.trim(),
          dateOfTransaction: new Date(),
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
        await redisClient.del(`allTransactions:${ownerId.trim()}`);
        return transaction;
      } catch (error) {
        console.error("Error during saving to checking transfer:", error);
        throw new GraphQLError("Internal Server Error");
      }
    },
    editBudgetedTransaction: async (
      _,
      { userId, transactionId, newAmount, newDescription }
    ) => {
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

      const theAccount = await checkingCol.findOne({
        ownerId: userId.trim(),
      });
      if (theAccount.balance < newAmount) {
        throw new GraphQLError("Account does not have sufficient balance");
      }

      try {
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
            { ownerId: userId.trim() },
            { $inc: { balance: -amountDifference } }
          );
        }
        await redisClient.del(`allTransactions:${userId.trim()}`);
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
      const transactionIdObj = new ObjectId(transactionId);
      const caCollection = await checkingAccountCollection();
      const transactionsCol = await transactionsCollection();

      const transaction = await transactionsCol.findOne({
        _id: transactionIdObj,
      });
      if (!transaction) {
        throw new GraphQLError("Transaction not found");
      }

      if (transaction.type !== "Budgeted") {
        throw new GraphQLError("Only budgeted transactions can be deleted");
      }

      // Check if the account associated with the transaction exists
      const account = await caCollection.findOne({ ownerId: ownerId.trim() });
      if (!account) {
        throw new GraphQLError("Checking account not found");
      }

      try {
        // Update the account balance by adding back the transaction amount
        await caCollection.updateOne(
          { _id: account._id },
          { $inc: { balance: transaction.amount } }
        );
        // Delete the transaction from the transactions collection
        await transactionsCol.deleteOne({ _id: transactionIdObj });
        await redisClient.del(`allTransactions:${ownerId.trim()}`);
        return { success: true, message: "Transaction deleted successfully" };
      } catch (error) {
        console.error("Error deleting budgeted transaction:", error);
        throw new GraphQLError("Internal Server Error");
      }
    },
    downloadTransactions: async (_, { transactions, userId }) => {
      const userId_ = userId.toString().trim();
      let thisUser;
      try {
        thisUser = await clerkClient.users.getUser(userId_);
        const userName = `${thisUser.firstName} ${thisUser.lastName}`;
        const avatarUrl = thisUser.imageUrl;

        // receive the transactions as a JSON string from the user and parse it
        let transactionsJson = JSON.parse(transactions);
        const htmlContent = generateTransactionsHtml(
          transactionsJson,
          userName
        );
        const pdfBase64 = await htmlToPdf(htmlContent);
        return pdfBase64;
      } catch (e) {
        console.log("Error downloading transactions PDF:", e);
        throw new GraphQLError("Failed to generate PDF", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    //! jesal: test
    downloadTransactionsOfAllChildren: async (
      _,
      { transactionsArray, userId }
    ) => {
      const userId_ = userId.toString().trim();
      let thisUser;
      try {
        thisUser = await clerkClient.users.getUser(userId_);
        const userName = `${thisUser.firstName} ${thisUser.lastName}`;

        let transactionsJson = JSON.parse(transactionsArray);
        let allHtml = ``;
        for (const transaction of transactionsJson) {
          const htmlContent = generateTransactionsHtml(transaction, userName);
          allHtml.concat(htmlContent);
        }

        const pdfBase64 = await htmlToPdf(allHtml);
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