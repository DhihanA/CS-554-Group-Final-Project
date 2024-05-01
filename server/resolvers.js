import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import {
  transactions as transactionsCollection,
  users as usersCollection,
  savingsAccount as savingsAccountCollection,
  checkingAccount as checkingAccountCollection,
} from "./config/mongoCollections.js";
import clerkClient from "./clients/clerkClient.js";
import redisClient from "./clients/redisClient.js";

// const response = await clerkClient.users.getUserList();
// console.log(response);

async function updateUserAddParent(userId) {
  try {
    const updatedUser = await clerkClient.users.updateUser(userId, {
      public_metadata: {
        parent: true,
      },
    });

    console.log("Updated user:", updatedUser);
  } catch (error) {
    console.error("Error updating user: ", error);
  }
}

// adding parent field to user jesal to test
await updateUserAddParent("user_2fk8aRObMHQDixP9M5hdA7mu0xY");

export const resolvers = {
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
    // getUserInfo: async (_, { userId }) => {
    //   try {
    //     const user = await usersCollection.findOne({ _id: userId });
    //     if (!user) throw new GraphQLError('User Not Found');
    //     return user;
    //   } catch (error) {
    //     console.error('Error fetching user info:', error);
    //     throw new GraphQLError('Internal Server Error');
    //   }
    // },

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
    // this mutation should be called directly AFTER the user has been created in clerk
    // (WE ARE ASSUMING parentId IS GIVEN DURING SIGNUP, NOT AFTER)
    // parentId should be added to publicMetadata of clerk user (if they are child) before calling this shit
    createUserInLocalDB: async (
      _,
      { clerkUserId, firstName, lastName, emailAddress, username, dob }
    ) => {
      try {
        const clerkUser = await clerkClient.users.getUser(clerkUserId);

        // parentId is only populated for children; undefined for parents
        const parentId = clerkUser.publicMetadata.parentId || undefined;
        console.log(parentId);

        let completedQuestionIds;
        let verificationCode;
        let verified;
        if (!(parentId === undefined)) {
          completedQuestionIds = [];
          verificationCode = Math.floor(100000 + Math.random() * 900000);
          verified = false;
        } else {
          completedQuestionIds = undefined;
          verificationCode = undefined;
          verified = undefined;
        }

        const usersCol = await usersCollection();
        const thisUser = await usersCol.insertOne({
          _id: new ObjectId(),
          clerkId: clerkUserId,
          parentId,
          verificationCode: verificationCode,
          verified: verified,
          firstName,
          lastName,
          emailAddress,
          username,
          dob,
          completedQuestionIds: completedQuestionIds, // empty for new children, undef for parents
        });

        const newUser = await usersCol.findOne({
          _id: new ObjectId(thisUser.insertedId),
        });

        //! TODO: create a checking account for this user (set ownerId as _id)
        // if they are a child, create checking + savings each with $500
        // if they are parent, create only checking with max money (99999999999 or sumn)

        return newUser;
      } catch (e) {
        console.log("Error creating user in local database:", e);
        throw new GraphQLError(e, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    // this mutation should ONLY be called on children, NOT parents
    //!NOT WORKING/TESTED YET
    verifyChild: async (_, { userId, verificationCode }) => {
      const usersCol = await usersCollection();

      const user = await usersCol.findOne(
        { _id: new ObjectId(userId) },
        {
          projection: {
            _id: 0,
            parentId: 1,
          },
        }
      );
      if (!user) {
        throw new GraphQLError("Account Not Found", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const parent = await usersCol.findOne(
        { _id: new ObjectId(user.parentId) },
        {
          projection: {
            _id: 0,
            verificationCode: 1,
          },
        }
      );
      if (!parent) {
        throw new GraphQLError("Parent account Not Found", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }

      let verifiedUser;
      if (verificationCode.toString() === parent.verificationCode.toString()) {
        try {
          verifiedUser = await usersCol.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { verified: true },
            { returnDocument: after }
          );
        } catch (e) {
          throw new GraphQLError("Unable to verify user", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      }
      return verifiedUser;
    },

    // createUser: async (_, { firstName, lastName, emailAddress, username, dob, parentId, verificationCode }) => {
    //   try {
    //     const userId = uuidv4();
    //     await usersCollection.insertOne({
    //       _id: userId,
    //       parentId,
    //       verificationCode,
    //       firstName,
    //       lastName,
    //       emailAddress,
    //       username,
    //       dob,
    //       completedQuestionIds: []
    //     });
    //     await checkingAccountCollection.insertOne({
    //       _id: uuidv4(),
    //       ownerId: userId,
    //       balance: 100, // Initialize balance
    //       transactions: []
    //     });
    //     await savingsAccountCollection.insertOne({
    //       _id: uuidv4(),
    //       ownerId: userId,
    //       currentBalance: 100,
    //       previousBalance: 100,
    //       interestRate: 0.01, // Example interest rate
    //       lastDateUpdated: new Date(),
    //       transactions: []
    //     });
    //     return usersCollection.findOne({ _id: userId });
    //   } catch (error) {
    //     console.error('Error creating user:', error);
    //     throw new GraphQLError('Internal Server Error');
    //   }
    // },
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

<<<<<<< HEAD
addBudgetedTransaction: async (_, { ownerId, amount, description, type }) => {
  try {
    if (amount <= 0) {
      throw new GraphQLError('Amount must be greater than 0');
    }
    const caCollection = await checkingAccountCollection();
    const account = await caCollection.findOne({ ownerId: new ObjectId(ownerId) });
    if (!account) {
      throw new GraphQLError('Checking account not found');
    }
    if (account.balance < amount) {
      throw new GraphQLError('Account does not have sufficient balance');
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
      type: 'Budgeted'  
    };
    const transactionsCol = await transactionsCollection();
    await transactionsCol.insertOne(transaction);
    return transaction;
  } catch (error) {
    console.error('Error creating budgeted transaction:', error);
    throw new GraphQLError('Internal Server Error');
  }
}
,
=======
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
>>>>>>> e288befeb52cbebe5dd539703947ad00e7f2c2ba
    editUser: async (_, { _id, ...updates }) => {
      try {
        const result = await usersCollection.updateOne(
          { _id },
          { $set: updates }
        );
        if (result.modifiedCount === 0)
          throw new GraphQLError("User Not Found or No Changes Made");
        return usersCollection.findOne({ _id });
      } catch (error) {
        console.error("Error editing user:", error);
        throw new GraphQLError("Internal Server Error");
      }
    },
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
          (theAccount.currentBalance * interestRate * days) / 365; // Simple daily compound
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
