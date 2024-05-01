import { userResolvers } from "./userResolvers.js";
import { transactionResolvers } from "./transactionResolvers.js";
import { accountResolvers } from "./accountResolvers.js";

export const resolvers = {
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
