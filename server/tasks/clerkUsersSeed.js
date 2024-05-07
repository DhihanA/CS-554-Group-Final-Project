import clerkClient from "../clients/clerkClient.js";
import fs from "fs";

/* https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d */
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEED_USERNAMES_UNVERIFIED = [
  // child1, child2 associated with parent1
  "parent1",
  "child1",
  "child2",

  // child3 associated with parent2
  "parent2",
  "child3",
];

const SEED_USERNAMES_VERIFIED = [
  // child4, child5, child6 associated with parent3
  // "parent3",
  "child4",
  "child5",
  "child6",
];

//! all passwords are hardcoded to Test123$567*
const createUser = async (
  firstName,
  lastName,
  username,
  emailAddresses,
  parent,
  verified,
  parentId // optional, only needed if verified true
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
      verified: verified,
      // completedQuestionIds will be populated to [] upon verifyChild for verified==false
      // parentId will be populated upon verifyChild for verified==false
    };
    if (parentId && verified) {
      publicMetadata = {
        ...publicMetadata,
        parentId: parentId,
        completedQuestionIds: [],
      };
    }
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
    if (
      SEED_USERNAMES_UNVERIFIED.includes(user.username) ||
      SEED_USERNAMES_VERIFIED.includes(user.username) ||
      user.username === "parent3"
    ) {
      await clerkClient.users.deleteUser(user.id);
    }
  }
  console.log("Deleted all previous seed users ✅");
};

const createUsers = async () => {
  let createdUsers = [];
  await deleteAllUsers();
  console.log("Creating seed users...");
  for (const username of SEED_USERNAMES_UNVERIFIED) {
    const parent = username.includes("parent");
    const email = username + "@gmail.com";
    const createdUser = await createUser(
      username,
      username.split("").reverse().join(""),
      username,
      [email],
      parent,
      false,
      null
    );
    createdUsers.push(createdUser);
  }

  /* Creating verified children (4,5,6) whose parent is parent3 */
  await createUser(
    "parent3",
    "parent3".split("").reverse().join(""),
    "parent3",
    ["parent3@gmail.com"],
    true,
    true,
    null
  );
  const users = await clerkClient.users.getUserList();
  const parent3 = users.data.filter((user) => user.username === "parent3");
  console.log();
  for (const username of SEED_USERNAMES_VERIFIED) {
    const parent = username.includes("parent");
    const email = username + "@gmail.com";
    const createdUser = await createUser(
      username,
      username.split("").reverse().join(""),
      username,
      [email],
      parent,
      true,
      parent3[0].id
    );
    createdUsers.push(createdUser);
  }

  console.log("Created seed users ✅");
  return createdUsers;
};

const writeToJson = async () => {
  const createdUsers = await createUsers();
  const userIds = createdUsers.reduce((acc, user) => {
    acc[user.username] = user.id;
    return acc;
  }, {});
  const users = await clerkClient.users.getUserList();
  const parent3 = users.data.filter((user) => user.username === "parent3");
  userIds["parent3"] = parent3[0].id;

  fs.writeFile(
    __dirname + "/staticClerkIds.json",
    JSON.stringify(userIds),
    (err) => {
      if (err) {
        console.log(err);
      }
      console.log("File saved!");
      console.log("Created users and Ids", userIds);
    }
  );
};

await writeToJson();
