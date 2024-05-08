import clerkClient from "../clients/clerkClient.js";

//! all passwords are hardcoded to Test123$567*
const SEED_USERNAMES = [
  // child1, child2, child3 associated with parent1
  "parent1",
  "child1",
  "child2",
  "child3",

  // child4 associated with parent2
  "parent2",
  "child4",
];

const createUser = async (
  firstName,
  lastName,
  username,
  emailAddresses,
  parent
) => {
  let privateMetadata = {};
  let publicMetadata = {};
  if (parent) {
    privateMetadata = {
      dob: "01/01/2000",
    };
    publicMetadata = {
      verificationCode: Math.floor(100000 + Math.random() * 900000).toString(),
      role: "parent",
    };
  } else {
    privateMetadata = {
      dob: "01/01/2010",
    };
    publicMetadata = {
      role: "child",
      verified: false,
      // completedQuestionIds will be populated to [] upon verifyChild
      // parentId will be populated upon verifyChild
    };
  }

  const createdUser = await clerkClient.users.createUser({
    firstName,
    lastName,
    username,
    emailAddress: emailAddresses,
    password: "Test123$567*",
    privateMetadata,
    publicMetadata,
  });
  return createdUser;
};

const deleteAllUsers = async () => {
  let allUsers = await clerkClient.users.getUserList();
  allUsers = allUsers.data;
  console.log("Deleting all previous seed users...");
  for (const user of allUsers) {
    // only delete users from the seed file, not externally created users
    if (SEED_USERNAMES.includes(user.username)) {
      const deletedUser = await clerkClient.users.deleteUser(user.id);
      // console.log("Deleted User in Clerk: ", deletedUser);
    }
  }
  console.log("Deleted all previous seed users ✅");
};

export const createUsers = async () => {
  let createdUsers = [];
  await deleteAllUsers();
  console.log("Creating seed users...");
  for (const username of SEED_USERNAMES) {
    const parent = username.includes("parent");
    const email = username + "@gmail.com";
    const createdUser = await createUser(
      username,
      username.split("").reverse().join(""),
      username,
      [email],
      parent
    );
    createdUsers.push(createdUser);
  }
  console.log("Created seed users ✅");
  return createdUsers;
};
