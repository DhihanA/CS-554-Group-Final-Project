import {GraphQLError} from 'graphql';
import helpers from './helpers.js';
import redis from 'redis';
import {
  transactions as transactionsCollection,
  users as usersCollection,
  savingsAccount as savingsAccountCollection,
  checkingAccount as checkingAccountCollection
} from './config/mongoCollections.js';


const client = redis.createClient();
client.connect().then(() => {});



//! TODO
export const resolvers = {
  Query: {
    savingsAccounts: async () => {
      try {
        const cacheKey = 'savingsAccounts';
        const keyType = await client.type(cacheKey);
        if (keyType !== 'list') {
          await client.del(cacheKey);
        }
        let savingsAccountStrings = await client.lRange(cacheKey, 0, -1);
        let savingsAccounts;
        if (savingsAccountStrings.length === 0) {
          savingsAccounts = await savingsAccountCollection.find({}).toArray();
          for (const account of savingsAccounts) {
            await client.rPush(cacheKey, JSON.stringify(account));
          }
          await client.expire(cacheKey, 3600); // Set cache expiration to 1 hour
        } else {
          savingsAccounts = savingsAccountStrings.map(str => JSON.parse(str));
        }
        return savingsAccounts;
      } catch (error) {
        console.error('Error fetching savings accounts:', error);
        throw new GraphQLError('Internal Server Error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', exception: error.message }
        });
      }
    },
    checkingAccounts: async () => {
      try {
        const cacheKey = 'checkingAccounts';
        const keyType = await client.type(cacheKey);
        if (keyType !== 'list') {
          await client.del(cacheKey);
        }
        let checkingAccountStrings = await client.lRange(cacheKey, 0, -1);
        let checkingAccounts;
        if (checkingAccountStrings.length === 0) {
          checkingAccounts = await checkingAccountCollection.find({}).toArray();
          for (const account of checkingAccounts) {
            await client.rPush(cacheKey, JSON.stringify(account));
          }
          await client.expire(cacheKey, 3600); // Set cache expiration to 1 hour
        } else {
          checkingAccounts = checkingAccountStrings.map(str => JSON.parse(str));
        }
        return checkingAccounts;
      } catch (error) {
        console.error('Error fetching checking accounts:', error);
        throw new GraphQLError('Internal Server Error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', exception: error.message }
        });
      }
    },
    users: async () => {
      try {
        const cacheKey = 'users';
        const keyType = await client.type(cacheKey);
        if (keyType !== 'list') {
          await client.del(cacheKey);
        }
        let userStrings = await client.lRange(cacheKey, 0, -1);
        let users;
        if (userStrings.length === 0) {
          users = await usersCollection.find({}).toArray();
          for (const user of users) {
            await client.rPush(cacheKey, JSON.stringify(user));
          }
          await client.expire(cacheKey, 3600); // Set cache expiration to 1 hour
        } else {
          users = userStrings.map(str => JSON.parse(str));
        }
        return users;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw new GraphQLError('Internal Server Error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', exception: error.message }
        });
      }
    },
    transactions: async () => {
      try {
        const cacheKey = 'transactions';
        const keyType = await client.type(cacheKey);
        if (keyType !== 'list') {
          await client.del(cacheKey);
        }
        let transactionStrings = await client.lRange(cacheKey, 0, -1);
        let transactions;
        if (transactionStrings.length === 0) {
          transactions = await transactionsCollection.find({}).toArray();
          for (const transaction of transactions) {
            await client.rPush(cacheKey, JSON.stringify(transaction));
          }
          await client.expire(cacheKey, 3600); // Set cache expiration to 1 hour
        } else {
          transactions = transactionStrings.map(str => JSON.parse(str));
        }
        return transactions;
      } catch (error) {
        console.error('Error fetching transactions:', error);
        throw new GraphQLError('Internal Server Error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', exception: error.message }
        });
      }
    },
    getSavingsAccountById: async (_, { _id }) => {
      try {
        _id = _id.trim();
        const cacheKey = `savingsAccount:${_id}`;
        let savingsAccount = await client.get(cacheKey);
        if (!savingsAccount) {
          savingsAccount = await savingsAccountCollection.findOne({ _id });
          if (!savingsAccount) throw new GraphQLError('Savings Account Not Found', { extensions: { code: 'NOT_FOUND' } });
          await client.set(cacheKey, JSON.stringify(savingsAccount), 'EX', 3600); // Cache for 1 hour
        } else {
          savingsAccount = JSON.parse(savingsAccount);
        }
        return savingsAccount;
      } catch (error) {
        console.error('Error fetching savings account:', error);
        throw new GraphQLError('Internal Server Error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', exception: error.message }
        });
      }
    },
    getCheckingAccountById: async (_, { _id }) => {
      try {
        _id = _id.trim();
        const cacheKey = `checkingAccount:${_id}`;
        let checkingAccount = await client.get(cacheKey);
        if (!checkingAccount) {
          checkingAccount = await checkingAccountCollection.findOne({ _id });
          if (!checkingAccount) throw new GraphQLError('Checking Account Not Found', { extensions: { code: 'NOT_FOUND' } });
          await client.set(cacheKey, JSON.stringify(checkingAccount), 'EX', 3600); // Cache for 1 hour
        } else {
          checkingAccount = JSON.parse(checkingAccount);
        }
        return checkingAccount;
      } catch (error) {
        console.error('Error fetching checking account:', error);
        throw new GraphQLError('Internal Server Error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', exception: error.message }
        });
      }
    },
    getUserById: async (_, { _id }) => {
      try {
        _id = _id.trim();
        const cacheKey = `user:${_id}`;
        let user = await client.get(cacheKey);
        if (!user) {
          user = await usersCollection.findOne({ _id });
          if (!user) throw new GraphQLError('User Not Found', { extensions: { code: 'NOT_FOUND' } });
          await client.set(cacheKey, JSON.stringify(user), 'EX', 3600); // Cache for 1 hour
        } else {
          user = JSON.parse(user);
        }
        return user;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw new GraphQLError('Internal Server Error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', exception: error.message }
        });
      }
    },
    getTransactionById: async (_, { _id }) => {
      try {
        _id = _id.trim();
        const cacheKey = `transaction:${_id}`;
        let transaction = await client.get(cacheKey);
        if (!transaction) {
          transaction = await transactionsCollection.findOne({ _id });
          if (!transaction) throw new GraphQLError('Transaction Not Found', { extensions: { code: 'NOT_FOUND' } });
          await client.set(cacheKey, JSON.stringify(transaction), 'EX', 3600); // Cache for 1 hour
        } else {
          transaction = JSON.parse(transaction);
        }
        return transaction;
      } catch (error) {
        console.error('Error fetching transaction:', error);
        throw new GraphQLError('Internal Server Error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', exception: error.message }
        });
      }
    },
  },
  // Additional type resolvers and mutations...
  // Add resolvers for User, CheckingAccount, etc., as needed...
  User: {
    checkingAccounts: async (parentValue) => {
      // Assuming there's a reference to checking accounts IDs in the User document
      return await checkingAccountCollection.find({_id: { $in: parentValue.checkingAccountIds }}).toArray();
    },
    savingsAccounts: async (parentValue) => {
      // Assuming there's a reference to savings accounts IDs in the User document
      return await savingsAccountCollection.find({_id: { $in: parentValue.savingsAccountIds }}).toArray();
    },
    transactions: async (parentValue) => {
      // Fetch all transactions for a user across all their accounts
      return await transactionsCollection.find({userId: parentValue._id}).toArray();
    }
  },
  CheckingAccount: {
    transactions: async (parentValue) => {
      // Transactions associated with a specific checking account
      return await transactionsCollection.find({accountId: parentValue._id}).toArray();
    },
    user: async (parentValue) => {
      // Fetch the owner of the checking account
      return await usersCollection.findOne({_id: parentValue.userId});
    }
  },
  SavingsAccount: {
    transactions: async (parentValue) => {
      // Transactions associated with a specific savings account
      return await transactionsCollection.find({accountId: parentValue._id}).toArray();
    },
    user: async (parentValue) => {
      // Fetch the owner of the savings account
      return await usersCollection.findOne({_id: parentValue.userId});
    }
  },
  Transaction: {
    senderAccount: async (parentValue) => {
      // Resolves the account from which money was sent
      const accountCollection = parentValue.senderType === 'Checking' ? checkingAccountCollection : savingsAccountCollection;
      return await accountCollection.findOne({_id: parentValue.senderId});
    },
    receiverAccount: async (parentValue) => {
      // Resolves the account to which money was received
      const accountCollection = parentValue.receiverType === 'Checking' ? checkingAccountCollection : savingsAccountCollection;
      return await accountCollection.findOne({_id: parentValue.receiverId});
    }
  },
  // Mutation: {
    
  // }
};