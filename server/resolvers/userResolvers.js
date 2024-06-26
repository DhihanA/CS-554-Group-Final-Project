import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import clerkClient from "../clients/clerkClient.js";
import {
  savingsAccount as savingsAccountCollection,
  checkingAccount as checkingAccountCollection,
} from "../config/mongoCollections.js";

export const userResolvers = {
  Query: {
    getAllChildren: async () => {
      const allUsers = await clerkClient.users.getUserList({ limit: 500 });
      const allChildren = allUsers.data.filter((user) => {
        if (user.publicMetadata.role === "child") return user;
      });
      return allChildren;
    },

    // parent will call this query on dashboard with THEIR own id
    getChildren: async (_, { parentUserId }) => {
      const parentId_ = parentUserId.toString().trim();
      const allUsers = await clerkClient.users.getUserList({ limit: 500 });
      // console.log(allUsers.data);
      const children = allUsers.data.filter((user) => {
        if (
          user.publicMetadata &&
          user.publicMetadata.role === "child" &&
          user.publicMetadata.parentId === parentId_
        )
          return user;
      });
      return children;
    },
  },
  Mutation: {
    addRoleAndDOB: async (_, { userId, dob, role }) => {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (role === "child" && age < 13) {
        throw new GraphQLError("child must be at least 13 years old", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      } else if (role === "parent" && age < 18) {
        throw new GraphQLError("parent must be at least 18 years old", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const thisUser = await clerkClient.users.getUser(userId);

      const publicMetadata = {
        ...thisUser.publicMetadata,
        role: role,
      };

      if (role === "parent") {
        publicMetadata["verificationCode"] = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
      }

      const privateMetadata = {
        dob: dob,
      };

      try {
        await clerkClient.users.updateUserMetadata(userId, {
          publicMetadata: publicMetadata,
          privateMetadata: privateMetadata,
        });

        return "role and dob successfully added";
      } catch (e) {
        throw new GraphQLError(e.message, {
          extensions: { code: "NOT_FOUND" },
        });
      }
    },
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
      let publicMetadataPrev = thisUser.publicMetadata;
      if (
        !(thisUser.publicMetadata && thisUser.publicMetadata.checkingAccountId)
      ) {
        try {
          // parents should have a max amount of money
          const maxFloat = Number.MAX_VALUE;

          const checkingCollection = await checkingAccountCollection();
          let createdCheckingAccount = await checkingCollection.insertOne({
            _id: new ObjectId(),
            ownerId: thisUser.id.toString(),
            balance: thisUser.publicMetadata.role === "child" ? 500 : maxFloat,
          });

          await clerkClient.users.updateUser(userId_, {
            publicMetadata: {
              ...publicMetadataPrev,
              checkingAccountId: createdCheckingAccount.insertedId.toString(),
            },
          });

          publicMetadataPrev.checkingAccountId =
            createdCheckingAccount.insertedId.toString();
        } catch (e) {
          throw new GraphQLError(
            "Could not create checking account for this user",
            {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            }
          );
        }
      }

      /* Create a savings account for children only + add to clerk public metadata if user does not already have */
      if (
        !(
          thisUser.publicMetadata && thisUser.publicMetadata.savingsAccountId
        ) &&
        thisUser.publicMetadata.role === "child"
      ) {
        try {
          const savingsCollection = await savingsAccountCollection();
          let createdSavingsAccount = await savingsCollection.insertOne({
            _id: new ObjectId(),
            ownerId: thisUser.id.toString(),
            currentBalance: 500,
            previousBalance: 500,
            interestRate: 5.3,
            lastDateUpdated: new Date(),
          });

          await clerkClient.users.updateUser(userId_, {
            publicMetadata: {
              ...publicMetadataPrev,
              savingsAccountId: createdSavingsAccount.insertedId.toString(),
            },
          });
          publicMetadataPrev.savingsAccountId =
            createdSavingsAccount.insertedId.toString();
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

      let thisUser;
      try {
        thisUser = await clerkClient.users.getUser(userId);
      } catch (e) {
        throw new GraphQLError("Account Not Found", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }

      let allClerkUsers;
      try {
        allClerkUsers = await clerkClient.users.getUserList({ limit: 500 });
      } catch (e) {
        throw new GraphQLError("Could not get all users", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }

      let parent;
      for (const user of allClerkUsers.data) {
        const metadata = user.publicMetadata;
        if (
          metadata &&
          metadata.verificationCode &&
          metadata.verificationCode.toString() === verificationCode
        ) {
          parent = user;
          break;
        }
      }

      if (parent === undefined) {
        throw new GraphQLError("Incorrect Verification Code", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      try {
        const publicMetadata = {
          ...thisUser.publicMetadata,
          verified: true,
          parentId: parent.id,
          completedQuestionIds: [],
        };
        await clerkClient.users.updateUserMetadata(userId, {
          publicMetadata: publicMetadata,
        });
      } catch (e) {
        throw new GraphQLError("Could not verify user", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }

      let updatedChild = await clerkClient.users.getUser(userId);
      return updatedChild;
    },
    updateMetadataQuestionIds: async (
      _,
      { userId, completedQuesIdsString, date }
    ) => {
      let completedQuestionIds;
      try {
        completedQuestionIds = JSON.parse(completedQuesIdsString);
      } catch (e) {
        throw new GraphQLError(
          "completedQuestionIds must be a stringified array",
          {
            extensions: { code: "BAD_USER_INPUT" },
          }
        );
      }
      if (
        !Array.isArray(completedQuestionIds) ||
        completedQuestionIds.length > 2
      ) {
        throw new GraphQLError(
          "completedQuestionIds should be an array of length at most 2",
          {
            extensions: { code: "BAD_USER_INPUT" },
          }
        );
      }
      let thisUser;
      console.log(completedQuestionIds);
      try {
        thisUser = await clerkClient.users.getUser(userId.toString().trim());
      } catch (e) {
        throw new GraphQLError("Invalid userId", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const newMetadata = thisUser.publicMetadata;
      newMetadata.completedQuestionIds.push(
        completedQuestionIds[0],
        completedQuestionIds[1]
      );
      newMetadata.lastDateSubmitted = new Date().toDateString();
      console.log(newMetadata);

      try {
        await clerkClient.users.updateUserMetadata(userId.toString().trim(), {
          publicMetadata: newMetadata,
        });
      } catch (e) {
        throw new GraphQLError("Could not update user metadata", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      return thisUser;
    },
  },
};
