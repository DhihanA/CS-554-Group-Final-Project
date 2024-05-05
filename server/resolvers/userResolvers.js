import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import clerkClient from "../clients/clerkClient.js";
import {
  savingsAccount as savingsAccountCollection,
  checkingAccount as checkingAccountCollection,
  savingsAccount,
} from "../config/mongoCollections.js";

export const userResolvers = {
  Query: {
    //! TODO: Ajit write user resolvers via clerkClient
    // These two queries are unneccesary
    // getAllUsers: async () => {
    //   // const usersCol = await usersCollection();
    //   // const allUsers = await usersCol.find({}).toArray();
    //   // return allUsers;
    // },
    // getUserInfo: async (_, { ownerId }) => {
    //   // const usersCol = await usersCollection();
    //   // const user = await usersCol.findOne({ _id: new ObjectId(ownerId) });
    //   // return user;
    // },
    getChildren: async (_, { parentId }) => {},
  },
  Mutation: {
    //! todo: jesal: test
    createAccountsAndUpdateUserInClerk: async (_, { userId }) => {
      const userId_ = userId.toString().trim();

      let thisUser;
      try {
        thisUser = await clerkClient.users.getUser(userId_);
      } catch (e) {
        throw new GraphQLError("Account Not Found", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }

      /* Create a checking account + add to clerk public metadata if user does not already have */
      if (
        !(thisUser.publicMetadata && thisUser.publicMetadata.checkingAccountId)
      ) {
        try {
          const checkingCollection = await checkingAccount();
          let createdCheckingAccount = await checkingCollection.insertOne({
            _id: new ObjectId(),
            ownerId: thisUser.id.toString(),
            balance: 500,
          });

          await clerkClient.users.updateUser(userId_, {
            publicMetadata: {
              checkingAccountId: createdCheckingAccount.insertedId.toString(),
            },
          });
        } catch (e) {
          throw new GraphQLError(
            "Could not create checking account for this user",
            {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            }
          );
        }
      }

      /* Create a savings account + add to clerk public metadata if user does not already have */
      if (
        !(thisUser.publicMetadata && thisUser.publicMetadata.savingsAccountId)
      ) {
        try {
          const savingsCollection = await savingsAccount();
          let createdSavingsAccount = await savingsCollection.insertOne({
            _id: new ObjectId(),
            ownerId: thisUser.id.toString(),
            balance: 500,
          });

          await clerkClient.users.updateUser(userId_, {
            publicMetadata: {
              savingsAccountId: createdSavingsAccount.insertedId.toString(),
            },
          });
        } catch (e) {
          throw new GraphQLError(
            "Could not create savings account for this user",
            {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            }
          );
        }
      }

      /* Get updated user + return them */
      return await clerkClient.users.getUser(userId_);
    },

    // this mutation should ONLY be called on children, NOT parents
    verifyChild: async (_, { userId, verificationCode }) => {
      userId = userId.toString().trim();
      verificationCode = verificationCode.toString().trim();
      if (verificationCode.length !== 6) {
        throw new GraphQLError(
          "Incorrect Verification Code; it should be 6 digits",
          {
            extensions: { code: "BAD_USER_INPUT" },
          }
        );
      }

      try {
        await clerkClient.users.getUser(userId);
      } catch (e) {
        throw new GraphQLError("Account Not Found", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }

      let allClerkUsers;
      try {
        allClerkUsers = await clerkClient.users.getUserList();
      } catch (e) {
        throw new GraphQLError("Could not get all users", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }

      let parent;
      for (const user of allClerkUsers.data) {
        const metadata = user.privateMetadata;
        if (
          metadata &&
          metadata.verificationCode &&
          metadata.verificationCode.toString() === verificationCode
        ) {
          parent = user;
          break;
        }
      }

      console.log("parent", parent);

      if (!parent) {
        throw new GraphQLError("Incorrect Verification Code", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      try {
        const publicMetadata = {
          verified: true,
          parentId: parent.id,
          completedQuestionIds: [],
        };
        await updateUser(userId, {}, publicMetadata);
      } catch (e) {
        throw new GraphQLError("Could not verify user", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }

      let updatedChild = await clerkClient.users.getUser(userId);
      console.log("updatedChild", updatedChild);
      return updatedChild;
    },
  },
};
