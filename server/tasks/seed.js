import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import {
  transactions,
  savingsAccount,
  checkingAccount,
} from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import userIds from "./staticClerkIds.json" assert { type: "json" };

//! all passwords from users from seed.js are hardcoded to Test123$567*

const main = async () => {
  const db = await dbConnection();

  await db.dropDatabase();

  const transactionsCollection = await transactions();
  const savingsCollection = await savingsAccount();
  const checkingCollection = await checkingAccount();

  const transactionIds = [new ObjectId()];
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
      ownerOfReceiver: null,
      ownerOfSender: null,
      type: "Transfer",
    },
    {
      _id: transactionIds[1],
      senderId: checkingIds[0],
      receiverId: savingsIds[0], //id of account money has been sent to
      amount: 100,
      description: "Payment for school supplies",
      dateOfTransaction: new Date(),
      ownerOfReceiver: null,
      ownerOfSender: null,
      type: "Transfer",
    },
  ]);

  await savingsCollection.insertMany([
    //child 1's savings account
    {
      _id: savingsIds[0],
      ownerId: userIds.child1,
      currentBalance: 200,
      previousBalance: 0,
      interestRate: 4.3,
      lastDateUpdated: new Date(),
    },
    //child 2's savings account
    {
      _id: savingsIds[1],
      ownerId: userIds.child2,
      currentBalance: 0,
      previousBalance: 0,
      interestRate: 5.3,
      lastDateUpdated: new Date(),
    },
    //child 3's savings account
    {
      _id: savingsIds[2],
      ownerId: userIds.child3,
      currentBalance: 0,
      previousBalance: 0,
      interestRate: 5.3,
      lastDateUpdated: new Date(),
    },
    //child 4's savings account
    {
      _id: savingsIds[3],
      ownerId: userIds.child4,
      currentBalance: 0,
      previousBalance: 0,
      interestRate: 5.3,
      lastDateUpdated: new Date(),
    },
    //child 5's savings account
    {
      _id: savingsIds[4],
      ownerId: userIds.child5,
      currentBalance: 0,
      previousBalance: 0,
      interestRate: 5.3,
      lastDateUpdated: new Date(),
    },
    //child 6's savings account
    {
      _id: savingsIds[5],
      ownerId: userIds.child6,
      currentBalance: 0,
      previousBalance: 0,
      interestRate: 5.3,
      lastDateUpdated: new Date(),
    },
  ]);

  await checkingCollection.insertMany([
    //parent 1's checking account
    {
      _id: checkingIds[0],
      ownerId: userIds.parent1,
      balance: 500,
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
      balance: 1000,
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
      balance: 1000,
    },
    //child 5's checking account
    {
      _id: checkingIds[7],
      ownerId: userIds.child5,
      balance: 1000,
    },
    //child 6's checking account
    {
      _id: checkingIds[8],
      ownerId: userIds.child6,
      balance: 1000,
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
