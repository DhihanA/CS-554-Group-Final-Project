import { GraphQLError } from 'graphql';
import {ObjectId} from 'mongodb';
import redis from 'redis';
import {
  transactions as transactionsCollection,
  users as usersCollection,
  savingsAccount as savingsAccountCollection,
  checkingAccount as checkingAccountCollection
} from './config/mongoCollections.js';

const client = redis.createClient();
client.connect().then(() => {});
client.on('error', function(err){
    console.log('Something went wrong ', err)
  });

await client.flushAll();

export const resolvers = {
  Query: {
    getAllTransactions: async (_, args) => {
      let cacheKey = `allTransactions:${args.userId.trim()}:${args.accountType.trim()}`
      let exists = await client.exists(cacheKey);
      if (exists) {
        let list = await client.lRange(`allTransactions:${args.userId.trim()}:${args.accountType.trim()}`, 0, -1);
        return list.map(str => JSON.parse(str));
      } else {
        const transactions = await transactionsCollection();
        const savingsAccounts = await savingsAccountCollection();
        const checkingAccounts = await checkingAccountCollection();
        if (args.accountType.trim() === "savings") {
          const foundAccount = await savingsAccounts.findOne(
            {ownerId: new ObjectId(args.userId.trim())},
            {projection: {_id:1}}
          );
          if (!foundAccount) {
            throw new GraphQLError('Account Not Found', {
              extensions: {code: 'BAD_USER_INPUT'}
            });
          }
          const foundTransactions = await transactions.find({
            $or: [
              { senderId: foundAccount._id },
              { receiverId: foundAccount._id }
            ]
          }).toArray();
          if (!foundTransactions) {
            throw new GraphQLError('User has no transactions', {
              extensions: {code: 'BAD_USER_INPUT'}
            });
          }

          //push transactions to the redis object
          foundTransactions.forEach(transaction => {
            client.rPush(`allTransactions:${args.userId.trim()}:${args.accountType.trim()}`, JSON.stringify(transaction));
          })
          //set expiration
          await client.expire(`allTransactions:${args.userId.trim()}:${args.accountType.trim()}`, 3600);

          return foundTransactions;
        }
        if (args.accountType.trim() === "checking") {
          const foundAccount = await checkingAccounts.findOne(
            {ownerId: new ObjectId(args.userId.trim())},
            {projection: {_id:1}}
          );
          if (!foundAccount) {
            throw new GraphQLError('Account Not Found', {
              extensions: {code: 'BAD_USER_INPUT'}
            });
          }
          const foundTransactions = await transactions.find({
            $or: [
              { senderId: foundAccount._id },
              { receiverId: foundAccount._id }
            ]
          }).toArray();
          if (!foundTransactions) {
            throw new GraphQLError('User has no transactions', {
              extensions: {code: 'BAD_USER_INPUT'}
            });
          }

          //push transactions to the redis object
          foundTransactions.forEach(transaction => {
            client.rPush(`allTransactions:${args.userId.trim()}:${args.accountType.trim()}`, JSON.stringify(transaction));
          })
          //set expiration
          await client.expire(`allTransactions:${args.userId.trim()}:${args.accountType.trim()}`, 3600);

          return foundTransactions;
        }
      }
    },
    // getUserInfo: async (_, { userId }) => {
    //   try {
    //     const user = await usersCollection.findOne({ _id: userId });
    //     if (!user) throw new GraphQLError('User Not Found');
    //     return user;
    //   } catch (error) {
    //     console.error('Error fetching user info:', error);
    //     throw new GraphQLError('Internal Server Error');
    //   }
    // },
    

getCheckingAccountInfo: async (_, { userId }) => {
  try {
    const cacheKey = `checkingAccount:${userId}`;  
    let accountString = await client.get(cacheKey);

    if (accountString) {
      console.log("Account info found in cache.");
      return JSON.parse(accountString);
    } else {
      console.log("Account info not found in cache, querying database."); 
      const accountCollection = await checkingAccountCollection();
      const objectId = new ObjectId(userId); 
      const account = await accountCollection.findOne({ ownerId: objectId }); 

      if (!account) {
        console.log("Account not found in database."); 
        throw new GraphQLError('Checking Account Not Found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      console.log("Account found, caching and returning."); 
      await client.set(cacheKey, JSON.stringify(account), 'EX', 3600); 

      return account;
    }
  } catch (error) {
    console.error('Error fetching checking account info:', error);
    if (error instanceof TypeError && error.message.includes('ObjectId')) {
      console.error('Invalid ObjectId format:', userId);
      throw new GraphQLError('Invalid ObjectId Format', {
        extensions: { code: 'INVALID_ID' }
      });
    }
    throw new GraphQLError('Internal Server Error', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' }
    });
  }
}
,
getSavingsAccountInfo: async (_, { userId }) => {
  try {
    const cacheKey = `savingsAccount:${userId}`;
    let accountString = await client.get(cacheKey);

    if (accountString) {
      return JSON.parse(accountString);
    } else {
      const accountCollection = await savingsAccountCollection();
      const objectId = new ObjectId(userId);
      const account = await accountCollection.findOne({ ownerId: objectId });

      if (!account) {
        throw new GraphQLError('Savings Account Not Found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      await client.set(cacheKey, JSON.stringify(account), 'EX', 3600);
      return account;
    }
  } catch (error) {
    throw new GraphQLError('Internal Server Error', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' }
    });
  }
},
  },
  Mutation: {
    createUser: async (_, { firstName, lastName, emailAddress, username, dob, parentId, verificationCode }) => {
      try {
        const userId = uuidv4();
        await usersCollection.insertOne({
          _id: userId,
          parentId,
          verificationCode,
          firstName,
          lastName,
          emailAddress,
          username,
          dob,
          completedQuestionIds: []
        });
        await checkingAccountCollection.insertOne({
          _id: uuidv4(),
          ownerId: userId,
          balance: 100, // Initialize balance
          transactions: []
        });
        await savingsAccountCollection.insertOne({
          _id: uuidv4(),
          ownerId: userId,
          currentBalance: 100,
          previousBalance: 100,
          interestRate: 0.01, // Example interest rate
          lastDateUpdated: new Date(),
          transactions: []
        });
        return usersCollection.findOne({ _id: userId });
      } catch (error) {
        console.error('Error creating user:', error);
        throw new GraphQLError('Internal Server Error');
      }
    },
    editUser: async (_, { _id, ...updates }) => {
      try {
        const result = await usersCollection.updateOne({ _id }, { $set: updates });
        if (result.modifiedCount === 0) throw new GraphQLError('User Not Found or No Changes Made');
        return usersCollection.findOne({ _id });
      } catch (error) {
        console.error('Error editing user:', error);
        throw new GraphQLError('Internal Server Error');
      }
    },
    updateSavingsBalanceForLogin: async (_, { currentBalance, lastDateUpdated, currentDate }) => {
      try {
        // Example of how you might calculate this
        const interestRate = 0.01; // Assuming a static interest rate for demonstration
        const days = (new Date(currentDate) - new Date(lastDateUpdated)) / (1000 * 60 * 60 * 24);
        const interest = currentBalance * interestRate * days / 365; // Simple daily compound
        const newBalance = currentBalance + interest;

        await savingsAccountCollection.updateOne({ lastDateUpdated }, {
          $set: { currentBalance: newBalance, lastDateUpdated: new Date(currentDate) }
        });

        return savingsAccountCollection.findOne({ lastDateUpdated });
      } catch (error) {
        console.error('Error updating savings balance:', error);
        throw new GraphQLError('Internal Server Error');
      }
    },
  }
}
    // Define other mutations as necessary...
