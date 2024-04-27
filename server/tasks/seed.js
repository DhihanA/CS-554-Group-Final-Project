import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { transactions, users, savingsAccount, checkingAccount } from '../config/mongoCollections.js';
import { v4 as uuidv4 } from 'uuid';

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    // Collections
    const transactionsCol = await transactions();
    const usersCol = await users();
    const savingsAccountCol = await savingsAccount();
    const checkingAccountCol = await checkingAccount();

    // Create mock users
    const user1 = {
        _id: uuidv4(),
        firstName: "John",
        lastName: "Doe",
        emailAddress: "john.doe@example.com",
        username: "johndoe",
        dob: new Date('1990-04-01'),
        phoneNumber: "123-456-7890",
        city: "SomeCity",
        state: "SomeState",
        completedQuestionIds: [1, 2, 3]
    };

    const user2 = {
        _id: uuidv4(),
        firstName: "Jane",
        lastName: "Smith",
        emailAddress: "jane.smith@example.com",
        username: "janesmith",
        dob: new Date('1985-08-15'),
        phoneNumber: "987-654-3210",
        city: "OtherCity",
        state: "OtherState",
        completedQuestionIds: [1, 2, 4]
    };

    await usersCol.insertMany([user1, user2]);

    // Create mock accounts
    const savings1 = {
        _id: uuidv4(),
        userId: user1._id,
        currentBalance: 5000.00,
        previousBalance: 4500.00,
        Interest_rate: 1.2,
        lastDateUpdated: new Date()
    };

    const checking1 = {
        _id: uuidv4(),
        userId: user1._id,
        balance: 1500.00
    };

    await savingsAccountCol.insertOne(savings1);
    await checkingAccountCol.insertOne(checking1);

    // Create mock transactions
    const transaction1 = {
        _id: uuidv4(),
        sender: { accountId: checking1._id, accountType: 'Checking' },
        receiver: { accountId: savings1._id, accountType: 'Savings' },
        amount: 200.00,
        date: new Date(),
        description: "Transfer from checking to savings",
        type: 'Transfer'
    };

    await transactionsCol.insertOne(transaction1);

    console.log('Done seeding database');
    await closeConnection();
};

main().catch(console.error);
