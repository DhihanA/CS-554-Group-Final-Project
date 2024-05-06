import { userResolvers } from "./userResolvers.js";
import { transactionResolvers } from "./transactionResolvers.js";
import { accountResolvers } from "./accountResolvers.js";
import clerkClient from "../clients/clerkClient.js";

export const resolvers = {
  AccountType: {
    __resolveType(obj, contextValue, info) {
      // only SavingsAccount has interestRate
      if (obj.interestRate) {
        return "SavingsAccount";
      }
      // only CheckingAccount has balance
      if (obj.balance) {
        return "CheckingAccount";
      }
      return null;
    },
  },

  CheckingAccount: {
    owner: async (ParentValue) => {
      const ownerId = ParentValue.ownerId.trim();
      const user = await clerkClient.users.getUser(ownerId);
      return user;
    },
  },
  SavingsAccount: {
    owner: async (ParentValue) => {
      const ownerId = ParentValue.ownerId.trim();
      const user = await clerkClient.users.getUser(ownerId);
      return user;
    },
  },
  
  Transactions: {
    sender: async (ParentValue) => {
      // const userId = ParentValue.ownerOfSender;
      const accountId = ParentValue.senderId;
      let account = await accountResolvers.Query.getAccountByAccountId(null, {
        accountId,
      });

      // if (!account) {
      //   account = await accountResolvers.Query.getSavingsAccountInfo(null, {
      //     userId: accountId,
      //   });
      // }

      if (!account)
        throw new GraphQLError("Account with that _id does not exist", {
          extensions: { code: "NOT_FOUND" },
        });

      return account;
    },
    receiver: async (ParentValue) => {
      // const userId = ParentValue.ownerOfReceiver;
      const accountId = ParentValue.receiverId;

      let account = await accountResolvers.Query.getAccountByAccountId(null, {
        accountId,
      });

      // if (!account) {
      //   account = await accountResolvers.Query.getCheckingAccountInfo(null, {
      //     userId: accountId,
      //   });
      // }

      if (!account)
        throw new GraphQLError("Account with that _id does not exist", {
          extensions: { code: "NOT_FOUND" },
        });

      return account;
    },
  },
  Query: {
    ...userResolvers.Query,
    ...transactionResolvers.Query,
    ...accountResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...transactionResolvers.Mutation,
    ...accountResolvers.Mutation,
  },
};
