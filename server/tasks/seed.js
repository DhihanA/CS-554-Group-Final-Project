import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { v4 as uuidv4 } from 'uuid';

//! Import collections like done below
import {users, transactions, savingsAccount, checkingAccount} from '../config/mongoCollections.js';

import {ObjectId} from 'mongodb';

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

  //! TODO: create seed data

  /* Create collections here: */
  const transactionsCollection = await transactions();
  const savingsCollection = await savingsAccount();
  const checkingCollection = await checkingAccount();

  const usersIds = [new ObjectId(), new ObjectId(), new ObjectId()]
  const transactionIds = [new ObjectId()]
  const savingsIds = [new ObjectId()]
  const checkingIds = [new ObjectId()]

  /* Call queries below */
  await transactionsCollection.insertMany([
    {
      _id: transactionIds[0],
      senderId: checkingIds[0],
      receiverId: savingsIds[0], //id of account money has been sent to
      amount: 200,
      description: "Payment for school supplies",
      type: "Transfer"
    },
    {
    _id: transactionIds[1],
    senderId: checkingIds[0],
    receiverId: savingsIds[0], //id of account money has been sent to
    amount: 100,
    description: "Payment for school supplies",
    type: "Transfer"
    }


  ]);

  await savingsCollection.insertMany([
    {
      _id: savingsIds[0],
      ownerId: usersIds[1],
      currentBalance: 200,
      previousBalance: 0,
      interestRate: 4.3,
      lastDateUpdated: new Date(),
    },
    {
      _id: savingsIds[1],
      ownerId: usersIds[2],
      currentBalance: 0,
      previousBalance: 0,
      interestRate: 5.3,
      lastDateUpdated: new Date(),
    }
  ]);

  await checkingCollection.insertMany([
    {
      _id: checkingIds[0],
      ownerId: usersIds[1],
      balance: 500,
    },
    {
      _id: checkingIds[1],
      ownerId: usersIds[2],
      balance: 1000,
    }
  ]);




    console.log('Done seeding database');
    await closeConnection();
};

main().catch(console.error);
