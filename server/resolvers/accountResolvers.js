import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import {
  savingsAccount as savingsAccountCollection,
  checkingAccount as checkingAccountCollection,
} from "../config/mongoCollections.js";

export const accountResolvers = {
  Query: {
    getCheckingAccountInfo: async (_, { userId }) => {
      try {
        const accountCollection = await checkingAccountCollection();
        
        const account = await accountCollection.findOne({
          ownerId: userId,
        });
        
        if (!account) {
          throw new GraphQLError("Checking Account Not Found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return account;
      } catch (error) {
        if (error instanceof TypeError && error.message.includes("ObjectId")) {
          // console.error("Invalid ObjectId format:", userId);
          throw new GraphQLError("Invalid ObjectId Format", {
            extensions: { code: "INVALID_ID" },
          });
        }
        throw new GraphQLError(error.message, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    getSavingsAccountInfo: async (_, { userId }) => {
      try {
        const accountCollection = await savingsAccountCollection();
        const account = await accountCollection.findOne({
          ownerId: userId,
        });

        if (!account) {
          throw new GraphQLError("Savings Account Not Found", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        return account;
      } catch (error) {
        throw new GraphQLError("Internal Server Error", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    getAccountByAccountId: async (_, { accountId }) => {
      const accountId_ = accountId.toString().trim();
      let account;
      try {
        const checkingCollection = await checkingAccountCollection();
        account = await checkingCollection.findOne({
          _id: new ObjectId(accountId_),
        });
        if (account) return account;
      } catch (e) {
        throw new GraphQLError("Internal Server Error", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      try {
        const savingsCollection = await savingsAccountCollection();
        account = await savingsCollection.findOne({
          _id: new ObjectId(accountId_),
        });
        if (account) return account;
      } catch (e) {
        throw new GraphQLError("Internal Server Error", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      if (!account) {
        throw new GraphQLError("No account with this accountId found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
    },
  },
  Mutation: {
    updateSavingsBalanceForLogin: async (_, { accountId }) => {
      const savingsAccounts = await savingsAccountCollection();
      let theAccount = await savingsAccounts.findOne({
        _id: new ObjectId(accountId.trim()),
      });
      if (!theAccount) {
        throw new GraphQLError("Account Not Found!");
      }
      try {
        const interestRate = theAccount.interestRate / 100;
        const days =
          (new Date() - new Date(theAccount.lastDateUpdated)) /
          (1000 * 60 * 60 * 24);
        const interest =
          theAccount.currentBalance * (1 + interestRate) ** (days / 365) -
          theAccount.currentBalance;
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
        // console.error("Error updating savings balance:", error);
        throw new GraphQLError("Internal Server Error");
      }
    },
    addMoneyFromQuestions: async (_, {accountId, correctQuestions}) => {
      const checkingAccounts = await checkingAccountCollection();
      let theAccount = await checkingAccounts.findOne({
        ownerId: accountId.trim(),
      });
      console.log("theAccount user:", theAccount.ownerId);
  
      if (!theAccount) {
          throw new GraphQLError("Account Not Found!");
      }
      if (correctQuestions < 0) {
        throw new GraphQLError("Invalid number of correct questions");
      }
      try {
          if (correctQuestions === 0) {
              return theAccount;
          }
  
          const rewardPerCorrectQuestion = 20; 
          const rewardAmount = correctQuestions * rewardPerCorrectQuestion;
          const newBalance = theAccount.balance + rewardAmount;
  
          return await checkingAccounts.findOneAndUpdate(
              { _id: new ObjectId(theAccount._id)},
              {
                  $set: {
                      balance: newBalance,
                  },
              },
              { returnDocument: "after" } 
          );
      } catch (error) {
          console.error("Error updating checking balance:", error);
          throw new GraphQLError("Internal Server Error");
      }
  },
  },
};
