import clerkClient from "../clients/clerkClient.js";
import fs from "fs";

/* https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d */
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//! all passwords are hardcoded to Test123$567*
const SEED_USERNAMES = [
  // child1, child2, child3 associated with parent1
  "parent1",
  "child1",
  "child2",
  "child3",

  // child3 associated with parent2
  "parent2",
  "child4",
];

const writeToJson = async () => {
  const allUsers = await clerkClient.users.getUserList({ limit: 500 });
  const seedUsers = allUsers.data.filter((user) => {
    return SEED_USERNAMES.includes(user.firstName);
  });

  const userIds = seedUsers.reduce((acc, user) => {
    acc[user.firstName] = user.id;
    return acc;
  }, {});

  fs.writeFile(
    __dirname + "/clerkSeedUserIds.json",
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
