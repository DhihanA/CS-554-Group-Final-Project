import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import clerkClient from "../clients/clerkClient.js";

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
    // todo: jesal: create checking / savings (if child) for user + add account ids to clerk publicMetadata
    createAccountsAndUpdateUserInClerk: async (_, { userId }) => {},

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
