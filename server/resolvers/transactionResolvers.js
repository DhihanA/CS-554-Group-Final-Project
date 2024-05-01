import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import {
  transactions as transactionsCollection,
  savingsAccount as savingsAccountCollection,
  checkingAccount as checkingAccountCollection,
} from "../config/mongoCollections.js";
import redisClient from "../clients/redisClient.js";

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
            { ownerId: new ObjectId(args.userId.trim()) },
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
            { ownerId: new ObjectId(args.userId.trim()) },
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
    addTransferTransaction: async (
      _,
      { senderId, receiverId, amount, description }
    ) => {
      try {
        if (senderId === receiverId) {
          throw new GraphQLError(
            "Sender and Receiver cannot be the same for transfer transactions"
          );
        }
        if (amount <= 0) {
          throw new GraphQLError("Amount must be greater than 0");
        }
        const caCollection = await checkingAccountCollection();
        const senderAccount = await caCollection.findOne({
          _id: new ObjectId(senderId),
        });
        const receiverAccount = await caCollection.findOne({
          _id: new ObjectId(receiverId),
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

        const transaction = {
          _id: new ObjectId(),
          senderId: senderId,
          receiverId: receiverId,
          amount: amount,
          description: description.trim(),
          type: "Transfer",
        };

        const transactionsCol = await transactionsCollection();
        await transactionsCol.insertOne(transaction);

        await caCollection.updateOne(
          { _id: new ObjectId(senderId) },
          { $inc: { balance: -amount } }
        );
        await caCollection.updateOne(
          { _id: new ObjectId(receiverId) },
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
          ownerId: new ObjectId(ownerId),
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
          senderId: ownerId,
          receiverId: ownerId,
          amount,
          description: description.trim(),
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
  },
};
