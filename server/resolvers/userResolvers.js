import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import { users as usersCollection } from "../config/mongoCollections.js";
import clerkClient from "../clients/clerkClient.js";

//!TESTING
async function updateUser(userId, privateMetadata, publicMetadata) {
  try {
    const updatedUser = await clerkClient.users.updateUser(userId, {
      privateMetadata: privateMetadata || {},
      publicMetadata: publicMetadata || {},
    });

    console.log("Updated user:", updatedUser);
  } catch (error) {
    console.error("Error updating user: ", error);
  }
}
// // adding verificationCode, dob to "parent tester 1" user to test
// await updateUser(
//   "user_2fvTlpi6NYrdtGUwDTSBH9bMBd0",
//   { verificationCode: "123456", dob: "01/03/2000" },
//   {}
// );

// // adding dob, verified, completedQuestionIds to "child tester 1" user to test
// await updateUser(
//   "user_2g1FcBlpiqWWC3zh6rbcpiFGo0e",
//   { dob: "01/03/2010" },
//   { verified: false, completedQuestionIds: [] }
// );

export const userResolvers = {
  Query: {
    //! TODO: Jesal edit seed to have clerkid
    getAllUsers: async () => {
      const usersCol = await usersCollection();
      const allUsers = await usersCol.find({}).toArray();
      return allUsers;
    },
    getUserInfo: async (_, { ownerId }) => {
      const usersCol = await usersCollection();
      const user = await usersCol.findOne({ _id: new ObjectId(ownerId) });
      return user;
    },
  },
  Mutation: {
    // //!TODO: Jesal: fix this
    // createOrUpdateUserInLocalDB: async (_, { clerkUserId }) => {
    //   try {
    //     const clerkUser = await clerkClient.users.getUser(clerkUserId);
    //     const usersCol = await usersCollection();
    //     const localUser = await usersCol.findOne({ clerkId: clerkUser.id });
    //     console.log("localUser: ", localUser);
    //     console.log("clerkUser: ", clerkUser);
    //     // const fiveSecondsAgo = new Date(Date.now() - 5000);

    //     let allEmailAddresses = [];
    //     for (const email of clerkUser.emailAddresses)
    //       allEmailAddresses.push(email.emailAddress);

    //     // if user in db, update them if their updatedAt date is within 5 sec
    //     if (localUser) {
    //       // if (new Date(clerkUser.updatedAt) > fiveSecondsAgo) {
    //       await usersCol.updateOne(
    //         { clerkUserId: clerkUser.id },
    //         {
    //           $set: {
    //             firstName: clerkUser.firstName,
    //             lastName: clerkUser.lastName,
    //             emailAddresses: allEmailAddresses,
    //             username: clerkUser.username,
    //             // dob: new Date (clerkUser.publicMetadata.dob),
    //           },
    //         }
    //       );
    //       const updatedUser = await usersCol.findOne({
    //         clerkUserId: clerkUser.id,
    //       });
    //       return updatedUser;
    //       // } else {
    //       //   return localUser;
    //       // }
    //     } else {
    //       // parentId is only populated for children; undefined for parents
    //       const parentId = clerkUser.publicMetadata.parentId || undefined;
    //       console.log(parentId);

    //       let completedQuestionIds;
    //       let verificationCode;
    //       let verified;
    //       if (!(parentId === undefined)) {
    //         completedQuestionIds = [];
    //         verificationCode = Math.floor(100000 + Math.random() * 900000);
    //         verified = false;
    //       } else {
    //         completedQuestionIds = undefined;
    //         verificationCode = undefined;
    //         verified = undefined;
    //       }

    //       const thisUser = await usersCol.insertOne({
    //         _id: new ObjectId(),
    //         clerkId: clerkUserId,
    //         parentId,
    //         verificationCode: verificationCode,
    //         verified: verified,
    //         firstName: clerkUser.firstName,
    //         lastName: clerkUser.lastName,
    //         emailAddresses: allEmailAddresses,
    //         username: clerkUser.username,
    //         dob: new Date(clerkUser.privateMetadata.dob),
    //         completedQuestionIds: completedQuestionIds, // empty for new children, undef for parents
    //       });

    //       const newUser = await usersCol.findOne({
    //         _id: new ObjectId(thisUser.insertedId),
    //       });

    //       //! TODO: create a checking account for this user (set ownerId as _id)
    //       // if they are a child, create checking + savings each with $500
    //       // if they are parent, create only checking with max money (99999999999 or sumn)

    //       return newUser;
    //     }
    //   } catch (e) {
    //     console.log("Error creating/updating user in local database:", e);
    //     throw new GraphQLError(e, {
    //       extensions: { code: "INTERNAL_SERVER_ERROR" },
    //     });
    //   }
    // },

    // // this mutation should be called directly AFTER the user has been created in clerk
    // // (WE ARE ASSUMING parentId IS GIVEN DURING SIGNUP, NOT AFTER)
    // // parentId should be added to publicMetadata of clerk user (if they are child) before calling this shit
    // createUserInLocalDB: async (_, { clerkUserId }) => {
    //   try {
    //     const clerkUser = await clerkClient.users.getUser(clerkUserId);

    //     // parentId is only populated for children; undefined for parents
    //     const parentId = clerkUser.publicMetadata.parentId || undefined;
    //     console.log(parentId);

    //     let completedQuestionIds;
    //     let verificationCode;
    //     let verified;
    //     if (!(parentId === undefined)) {
    //       completedQuestionIds = [];
    //       verificationCode = Math.floor(100000 + Math.random() * 900000);
    //       verified = false;
    //     } else {
    //       completedQuestionIds = undefined;
    //       verificationCode = undefined;
    //       verified = undefined;
    //     }

    //     const usersCol = await usersCollection();
    //     const thisUser = await usersCol.insertOne({
    //       _id: new ObjectId(),
    //       clerkId: clerkUserId,
    //       parentId,
    //       verificationCode: verificationCode,
    //       verified: verified,
    //       firstName: clerkUser.firstName,
    //       lastName: clerkUser.lastName,
    //       emailAddresses: clerkUser.emailAddresses,
    //       username: clerkUser.username,
    //       dob: clerkUser.publicMetadata.dob,
    //       completedQuestionIds: completedQuestionIds, // empty for new children, undef for parents
    //     });

    //     const newUser = await usersCol.findOne({
    //       _id: new ObjectId(thisUser.insertedId),
    //     });

    //     //! TODO: create a checking account for this user (set ownerId as _id)
    //     // if they are a child, create checking + savings each with $500
    //     // if they are parent, create only checking with max money (99999999999 or sumn)

    //     return newUser;
    //   } catch (e) {
    //     console.log("Error creating user in local database:", e);
    //     throw new GraphQLError(e, {
    //       extensions: { code: "INTERNAL_SERVER_ERROR" },
    //     });
    //   }
    // },

    // // TODO: Jesal
    // updateUserInLocalDB: async (_, { clerkUserId }) => {},

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
