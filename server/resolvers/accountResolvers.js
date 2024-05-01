import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import {
  savingsAccount as savingsAccountCollection,
  checkingAccount as checkingAccountCollection,
} from "../config/mongoCollections.js";
import redisClient from "../clients/redisClient.js";

export const accountResolvers = {
  Query: {
    getCheckingAccountInfo: async (_, { userId }) => {
      try {
        const cacheKey = `checkingAccount:${userId}`;
        let accountString = await redisClient.get(cacheKey);

        if (accountString) {
          console.log("Account info found in cache.");
          return JSON.parse(accountString);
        } else {
          console.log("Account info not found in cache, querying database.");
          const accountCollection = await checkingAccountCollection();
          const objectId = new ObjectId(userId);
          const account = await accountCollection.findOne({
            ownerId: objectId,
          });

          if (!account) {
            console.log("Account not found in database.");
            throw new GraphQLError("Checking Account Not Found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
          console.log("Account found, caching and returning.");
          await redisClient.set(cacheKey, JSON.stringify(account), "EX", 3600);
          return account;
        }
      } catch (error) {
        console.error("Error fetching checking account info:", error);
        if (error instanceof TypeError && error.message.includes("ObjectId")) {
          console.error("Invalid ObjectId format:", userId);
          throw new GraphQLError("Invalid ObjectId Format", {
            extensions: { code: "INVALID_ID" },
          });
        }
        throw new GraphQLError("Internal Server Error", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    getSavingsAccountInfo: async (_, { userId }) => {
      try {
        const cacheKey = `savingsAccount:${userId}`;
        let accountString = await redisClient.get(cacheKey);

        if (accountString) {
          return JSON.parse(accountString);
        } else {
          const accountCollection = await savingsAccountCollection();
          const objectId = new ObjectId(userId);
          const account = await accountCollection.findOne({
            ownerId: objectId,
          });

          if (!account) {
            throw new GraphQLError("Savings Account Not Found", {
              extensions: { code: "NOT_FOUND" },
            });
          }

          await redisClient.set(cacheKey, JSON.stringify(account), "EX", 3600);
          return account;
        }
      } catch (error) {
        throw new GraphQLError("Internal Server Error", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },
  Mutation: {
    updateSavingsBalanceForLogin: async (_, { accountId }) => {
      try {
        const savingsAccounts = await savingsAccountCollection();
        let theAccount = await savingsAccounts.findOne({
          _id: new ObjectId(accountId.trim()),
        });
        const interestRate = theAccount.interestRate;
        const days =
          (new Date() - new Date(theAccount.lastDateUpdated)) /
          (1000 * 60 * 60 * 24);
        const interest =
          (theAccount.currentBalance * interestRate * days) / 365;
        const newBalance = theAccount.currentBalance + interest;

        return await savingsAccounts.findOneAndUpdate(
          { _id: new ObjectId(accountId.trim()) },
          {
            $set: {
              previousBalance: theAccount.currentBalance,
              currentBalance: newBalance,
              lastDateUpdated: new Date(),
            },
          }
        );
      } catch (error) {
        console.error("Error updating savings balance:", error);
        throw new GraphQLError("Internal Server Error");
      }
    },
  },
};
