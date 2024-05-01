import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import { users as usersCollection } from "../config/mongoCollections.js";
import clerkClient from "../clients/clerkClient.js";

//!TESTING
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

export const userResolvers = {
  Query: {},
  Mutation: {
    // this mutation should be called directly AFTER the user has been created in clerk
    // (WE ARE ASSUMING parentId IS GIVEN DURING SIGNUP, NOT AFTER)
    // parentId should be added to publicMetadata of clerk user (if they are child) before calling this shit
    createUserInLocalDB: async (_, { clerkUserId }) => {
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
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          emailAddress: clerkUser.emailAddresses,
          username: clerkUser.username,
          dob: clerkUser.publicMetadata.dob,
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

    // TODO: Jesal
    updateUserInLocalDB: async (_, { clerkUserId }) => {},

    // this mutation should ONLY be called on children, NOT parents
    //!NOT WORKING/TESTED YET: Jesal
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
  },
};
