import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import {
  transactions,
  savingsAccount,
  checkingAccount,
} from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import userIds from "./clerkSeedUserIds.json" assert { type: "json" };
const maxFloat = Number.MAX_VALUE;

//! all passwords from users in clerkSeedUsersIds are hardcoded to Test123$567*

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
  ];
  const checkingIds = [
    new ObjectId(), //child 1's checking account
    new ObjectId(), //child 2's checking account
    new ObjectId(), //child 3's checking account
    new ObjectId(), //child 4's checking account
    new ObjectId(), //parent 1's checking account
    new ObjectId(), //parent 2's checking account
  ];

  await savingsCollection.insertMany([
    //child 1's savings account
    {
      _id: savingsIds[0],
      ownerId: userIds.child1,
      currentBalance: 1000,
      previousBalance: 1000,
      interestRate: 5.3,
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
  ]);

  await checkingCollection.insertMany([
    //child 1's checking account
    {
      _id: checkingIds[0],
      ownerId: userIds.child1,
      balance: 1000,
    },
    //child 2's checking account
    {
      _id: checkingIds[1],
      ownerId: userIds.child2,
      balance: 1000,
    },
    //child 3's checking account
    {
      _id: checkingIds[2],
      ownerId: userIds.child3,
      balance: 1000,
    },
    //child 4's checking account
    {
      _id: checkingIds[3],
      ownerId: userIds.child4,
      balance: 1000,
    },
    //parent 1's checking account
    {
      _id: checkingIds[4],
      ownerId: userIds.parent1,
      balance: maxFloat,
    },
    //parent 2's checking account
    {
      _id: checkingIds[5],
      ownerId: userIds.parent2,
      balance: maxFloat,
    },
  ]);

  await transactionsCollection.insertMany([
    // transfer from child 1 to child 2
    {
      _id: transactionIds[0],
      senderId: checkingIds[0],
      receiverId: checkingIds[1],
      amount: 200,
      description: "Payment for school supplies",
      dateOfTransaction: new Date(),
      type: "Transfer",
    },

    // transfer from child 3 to child 4
    {
      _id: transactionIds[1],
      senderId: checkingIds[2],
      receiverId: checkingIds[3],
      amount: 100,
      description: "Payment for books and stuff",
      dateOfTransaction: new Date(),
      type: "Transfer",
    },

    // child 1 makes a budgeted transaction
    {
      _id: transactionIds[2],
      senderId: checkingIds[0],
      receiverId: checkingIds[0],
      amount: 100,
      description: "Budgeted for a new GameBoy",
      dateOfTransaction: new Date(),
      type: "Budgeted",
    },

    // transfer from child2's checking to savings
    {
      _id: transactionIds[3],
      senderId: checkingIds[1], //child 2's checking account
      receiverId: savingsIds[1], //child 2's savings account
      amount: 200,
      description: "200 dollars to savings",
      dateOfTransaction: new Date(),
      type: "CheckingToSavingTransfer",
    },

    // transfer from child 4's savings to checking
    {
      _id: transactionIds[4],
      senderId: savingsIds[3], //child 4's savings account
      receiverId: checkingIds[3], //child 4's checking account
      amount: 50,
      description: "50 dollars to checking",
      dateOfTransaction: new Date(),
      type: "SavingToCheckingTransfer",
    },
  ]);

  console.log("Done seeding database");
  await closeConnection();
};

try {
  await main();
} catch (e) {
  console.log(e);
}
