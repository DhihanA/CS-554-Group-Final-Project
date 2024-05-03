import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import clerkClient from "../clients/clerkClient.js";

//! Import collections like done below
import {
  users,
  transactions,
  savingsAccount,
  checkingAccount,
} from "../config/mongoCollections.js";

import { ObjectId } from "mongodb";

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();

  //! TODO: create seed data

  /* Create collections here: */
  const usersCollection = await users();
  const transactionsCollection = await transactions();
  const savingsCollection = await savingsAccount();
  const checkingCollection = await checkingAccount();

  const usersIds = [
    new ObjectId(), //parent 1
    new ObjectId(), //parent 2
    new ObjectId(), //parent 3
    new ObjectId(), //child 1 to parent 1
    new ObjectId(), //child 2 to parent 1
    new ObjectId(), //child 3 to parent 1
    new ObjectId(), //child 4 to parent 2
    new ObjectId(), //child 5 to parent 2
    new ObjectId(), //child 6 to parent 3
  ];
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

  /* Call queries below */

  await usersCollection.insertMany([
    //parent 1
    {
      _id: usersIds[0],
      parentId: undefined,
      verificationCode: "123456",
      verified: undefined,
      firstName: "Luke",
      lastName: "Bianchi",
      emailAddresses: ["parent1@gmail.com"],
      username: "lkbnch",
      dob: new Date(2003, 5, 17),
      completedQuestionIds: undefined,
    },
    //child 1
    {
      _id: usersIds[3],
      parentId: usersIds[0],
      verificationCode: undefined,
      verified: true,
      firstName: "Kinga",
      lastName: "Kurcaba",
      emailAddresses: ["child1@gmail.com"],
      username: "giggleKing",
      dob: new Date(2005, 9, 12),
      completedQuestionIds: [],
    },
    //child 2
    {
      _id: usersIds[4],
      parentId: usersIds[0],
      verificationCode: undefined,
      verified: true,
      firstName: "Ilvya",
      lastName: "Gesh",
      emailAddresses: ["child2@gmail.com"],
      username: "IcelandicIceQueen369",
      dob: new Date(2003, 9, 27),
      completedQuestionIds: [],
    },
    //child 3
    {
      _id: usersIds[5],
      parentId: usersIds[0],
      verificationCode: undefined,
      verified: true,
      firstName: "Katarini",
      lastName: "Nikiforuk",
      emailAddresses: ["child3@gmail.com"],
      username: "NikiForuk49",
      dob: new Date(2004, 10, 12),
      completedQuestionIds: [],
    },
    //parent 2
    {
      _id: usersIds[1],
      parentId: undefined,
      verificationCode: "123457",
      verified: undefined,
      firstName: "Harshil",
      lastName: "Ganapathi",
      emailAddresses: ["parent2@gmail.com"],
      username: "harshilg03",
      dob: new Date(2003, 4, 20),
      completedQuestionIds: undefined,
    },
    //child 4
    {
      _id: usersIds[6],
      parentId: usersIds[1],
      verificationCode: undefined,
      verified: true,
      firstName: "Jack",
      lastName: "Gibson",
      emailAddresses: ["child4@gmail.com"],
      username: "GibsonIsDaddy",
      dob: new Date(2003, 11, 12),
      completedQuestionIds: [],
    },
    //child 5
    {
      _id: usersIds[7],
      parentId: usersIds[1],
      verificationCode: undefined,
      verified: true,
      firstName: "Natalia",
      lastName: "Rutgers",
      emailAddresses: ["child5@gmail.com"],
      username: "HooRahGoBigRed",
      dob: new Date(2005, 3, 9),
      completedQuestionIds: [],
    },
    //parent 3
    {
      _id: usersIds[2],
      parentId: undefined,
      verificationCode: "123458",
      verified: undefined,
      firstName: "Greg",
      lastName: "Plaskon",
      emailAddresses: ["parent3@gmail.com"],
      username: "InseminateTheAsshole420",
      dob: new Date(1965, 1, 20),
      completedQuestionIds: undefined,
    },
    //child 6
    {
      _id: usersIds[8],
      parentId: usersIds[2],
      verificationCode: undefined,
      verified: true,
      firstName: "Nick",
      lastName: "Plaskon",
      emailAddresses: ["child6@gmail.com"],
      username: "FoopahPain6969",
      dob: new Date(2003, 10, 1),
      completedQuestionIds: [],
    },
  ]);

  await transactionsCollection.insertMany([
    {
      _id: transactionIds[0],
      senderId: checkingIds[0],
      receiverId: savingsIds[0], //id of account money has been sent to
      amount: 200,
      description: "Payment for school supplies",
      type: "Transfer",
    },
    {
      _id: transactionIds[1],
      senderId: checkingIds[0],
      receiverId: savingsIds[0], //id of account money has been sent to
      amount: 100,
      description: "Payment for school supplies",
      type: "Transfer",
    },
  ]);

  await savingsCollection.insertMany([
    //child 1's savings account
    {
      _id: savingsIds[0],
      ownerId: usersIds[3],
      currentBalance: 200,
      previousBalance: 0,
      interestRate: 4.3,
      lastDateUpdated: new Date(),
    },
    //child 2's savings account
    {
      _id: savingsIds[1],
      ownerId: usersIds[4],
      currentBalance: 0,
      previousBalance: 0,
      interestRate: 5.3,
      lastDateUpdated: new Date(),
    },
    //child 3's savings account
    {
      _id: savingsIds[2],
      ownerId: usersIds[5],
      currentBalance: 0,
      previousBalance: 0,
      interestRate: 5.3,
      lastDateUpdated: new Date(),
    },
    //child 4's savings account
    {
      _id: savingsIds[3],
      ownerId: usersIds[6],
      currentBalance: 0,
      previousBalance: 0,
      interestRate: 5.3,
      lastDateUpdated: new Date(),
    },
    //child 5's savings account
    {
      _id: savingsIds[4],
      ownerId: usersIds[7],
      currentBalance: 0,
      previousBalance: 0,
      interestRate: 5.3,
      lastDateUpdated: new Date(),
    },
    //child 6's savings account
    {
      _id: savingsIds[5],
      ownerId: usersIds[8],
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
      ownerId: usersIds[0],
      balance: 500,
    },
    //parent 2's checking account
    {
      _id: checkingIds[1],
      ownerId: usersIds[1],
      balance: 1000,
    },
    //parent 3's checking account
    {
      _id: checkingIds[2],
      ownerId: usersIds[2],
      balance: 1000,
    },
    //child 1's checking account
    {
      _id: checkingIds[3],
      ownerId: usersIds[3],
      balance: 1000,
    },
    //child 2's checking account
    {
      _id: checkingIds[4],
      ownerId: usersIds[4],
      balance: 1000,
    },
    //child 3's checking account
    {
      _id: checkingIds[5],
      ownerId: usersIds[5],
      balance: 1000,
    },
    //child 4's checking account
    {
      _id: checkingIds[6],
      ownerId: usersIds[6],
      balance: 1000,
    },
    //child 5's checking account
    {
      _id: checkingIds[7],
      ownerId: usersIds[7],
      balance: 1000,
    },
    //child 6's checking account
    {
      _id: checkingIds[8],
      ownerId: usersIds[8],
      balance: 1000,
    },
  ]);

  console.log("Done seeding database");
  await closeConnection();
};

main().catch(console.error);
