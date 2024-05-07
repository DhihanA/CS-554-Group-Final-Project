import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import {
  transactions,
  savingsAccount,
  checkingAccount,
} from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import userIds from "./staticClerkIds.json" assert { type: "json" };
import clerkClient from "../clients/clerkClient.js";

//! all passwords from users from seed.js are hardcoded to Test123$567*

const main = async () => {
  const db = await dbConnection();

  await db.dropDatabase();

  const transactionsCollection = await transactions();
  const savingsCollection = await savingsAccount();
  const checkingCollection = await checkingAccount();

  const transactionIds = [
    new ObjectId(), //first transfer transaction
    new ObjectId(), //second transfer transaction
    new ObjectId(), //first budgeted transaction
    new ObjectId(), //first checking to savings transaction
    new ObjectId(), //first savings to checking transaction
  ];
  const savingsIds = [
    new ObjectId(), //child 1's savings account
    new ObjectId(), //child 2's savings account
    new ObjectId(), //child 3's savings account
    new ObjectId(), //child 4's savings account
    new ObjectId(), //child 5's savings account
    new ObjectId(), //child 6's savings account
  ];
  const checkingIds = [
    new ObjectId(), //parent 1's checking account
    new ObjectId(), //parent 2's checking account
    new ObjectId(), //parent 3's checking account
    new ObjectId(), //child 1's checking account
    new ObjectId(), //child 2's checking account
    new ObjectId(), //child 3's checking account
    new ObjectId(), //child 4's checking account
    new ObjectId(), //child 5's checking account
    new ObjectId(), //child 6's checking account
  ];

  await transactionsCollection.insertMany([
    {
      _id: transactionIds[0],
      senderId: checkingIds[0],
      receiverId: savingsIds[0], //id of account money has been sent to
      amount: 200,
      description: "Payment for school supplies",
      dateOfTransaction: new Date(),
      type: "Transfer",
    },
    {
      _id: transactionIds[1],
      senderId: checkingIds[0],
      receiverId: savingsIds[0], //id of account money has been sent to
      amount: 100,
      description: "Payment for school supplies",
      dateOfTransaction: new Date(),
      type: "Transfer",
    },
    {
      _id: transactionIds[2],
      senderId: checkingIds[6],
      receiverId: checkingIds[6], //id of account money has been sent to
      amount: 100,
      description: "Budgeted for a new GameBoy",
      dateOfTransaction: new Date(),
      type: "Budgeted",
    },
    {
      _id: transactionIds[3],
      senderId: checkingIds[4], //child 2's checking account
      receiverId: savingsIds[1], //child 2's savings account
      amount: 200,
      description: "200 dollars to savings",
      dateOfTransaction: new Date(),
      type: "CheckingToSavingTransfer",
    },
    {
      _id: transactionIds[4],
      senderId: savingsIds[4], //child 5's savings account
      receiverId: checkingIds[7], //child 5's checking account
      amount: 50,
      description: "50 dollars to checking",
      dateOfTransaction: new Date(),
      type: "SavingToCheckingTransfer",
    },
  ]);

  const insertedSavingsAccountIds = await savingsCollection.insertMany([
    //child 1's savings account
    {
      _id: savingsIds[0],
      ownerId: userIds.child1,
      currentBalance: 1000,
      previousBalance: 1000,
      interestRate: 4.3,
      lastDateUpdated: new Date(),
    },
    //child 2's savings account
    {
      _id: savingsIds[1],
      ownerId: userIds.child2,
      currentBalance: 1000,
      previousBalance: 1000,
      interestRate: 5.3,
      lastDateUpdated: new Date(),
    },
    //child 3's savings account
    {
      _id: savingsIds[2],
      ownerId: userIds.child3,
      currentBalance: 1000,
      previousBalance: 1000,
      interestRate: 5.3,
      lastDateUpdated: new Date(),
    },
    //child 4's savings account
    {
      _id: savingsIds[3],
      ownerId: userIds.child4,
      currentBalance: 1000,
      previousBalance: 1000,
      interestRate: 5.3,
      lastDateUpdated: new Date(),
    },
    //child 5's savings account
    {
      _id: savingsIds[4],
      ownerId: userIds.child5,
      currentBalance: 950,
      previousBalance: 1000,
      interestRate: 5.3,
      lastDateUpdated: new Date(),
    },
    //child 6's savings account
    {
      _id: savingsIds[5],
      ownerId: userIds.child6,
      currentBalance: 1000,
      previousBalance: 1000,
      interestRate: 5.3,
      lastDateUpdated: new Date(),
    },
  ]);

  const insertedCheckingAccountIds = await checkingCollection.insertMany([
    //parent 1's checking account
    {
      _id: checkingIds[0],
      ownerId: userIds.parent1,
      balance: 1000,
    },
    //parent 2's checking account
    {
      _id: checkingIds[1],
      ownerId: userIds.parent2,
      balance: 1000,
    },
    //parent 3's checking account
    {
      _id: checkingIds[2],
      ownerId: userIds.parent3,
      balance: 1000,
    },
    //child 1's checking account
    {
      _id: checkingIds[3],
      ownerId: userIds.child1,
      balance: 1000,
    },
    //child 2's checking account
    {
      _id: checkingIds[4],
      ownerId: userIds.child2,
      balance: 800,
    },
    //child 3's checking account
    {
      _id: checkingIds[5],
      ownerId: userIds.child3,
      balance: 1000,
    },
    //child 4's checking account
    {
      _id: checkingIds[6],
      ownerId: userIds.child4,
      balance: 900,
    },
    //child 5's checking account
    {
      _id: checkingIds[7],
      ownerId: userIds.child5,
      balance: 1050,
    },
    //child 6's checking account
    {
      _id: checkingIds[8],
      ownerId: userIds.child6,
      balance: 1000,
    },
  ]);

  /* Add corresponding savings/checking account ids to publicMetadata of clerk users */
  console.log(
    "Adding savings account ids to publicMetadata of child users in clerk..."
  );
  let childCounter = 1;
  for (const key in insertedSavingsAccountIds.insertedIds) {
    let currentChildKey = `child${childCounter}`;
    let userId = userIds[currentChildKey];
    let thisUser = await clerkClient.users.getUser(userId);
    let publicMetadata = thisUser.publicMetadata;
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        ...publicMetadata,
        savingsAccountId: insertedSavingsAccountIds.insertedIds[key].toString(),
      },
    });
    childCounter++;
  }
  console.log("Added ✅");

  console.log(
    "Adding checking account ids to publicMetadata of all users in clerk..."
  );
  let parentCounter = 1;
  for (const key in Object.entries(
    insertedCheckingAccountIds.insertedIds
  ).slice(0, 3)) {
    let currentParentKey = `parent${parentCounter}`;
    let userId = userIds[currentParentKey];
    let thisUser = await clerkClient.users.getUser(userId);
    let publicMetadata = thisUser.publicMetadata;
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        ...publicMetadata,
        checkingAccountId:
          insertedCheckingAccountIds.insertedIds[key].toString(),
      },
    });
    parentCounter++;
  }

  childCounter = 1;
  for (let key in Object.entries(insertedCheckingAccountIds.insertedIds).slice(
    3
  )) {
    let currentChildKey = `child${childCounter}`;
    let userId = userIds[currentChildKey];
    let thisUser = await clerkClient.users.getUser(userId);
    let publicMetadata = thisUser.publicMetadata;
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        ...publicMetadata,
        checkingAccountId:
          insertedCheckingAccountIds.insertedIds[
            (parseInt(key) + 3).toString()
          ].toString(),
      },
    });
    childCounter++;
  }
  console.log("Added ✅");

  console.log("Done seeding database");
  await closeConnection();
};

try {
  await main();
} catch (e) {
  console.log(e);
}
