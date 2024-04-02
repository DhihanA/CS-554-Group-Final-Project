import { transactions } from "../mongoCollections";




export async function getTransactionById(id) {
    try {
        const transactionsCollection = await transactions();
        return await transactionsCollection.findOne({ _id: id });
    } catch (e) {
        throw e;
    }
    }

export async function sendTransaction(userId, recieverId, amount, date, description) {
    if (!userId) throw 'You must provide a userId';
    if (!recieverId) throw 'You must provide a recieverId';
    if (!amount) throw 'You must provide an amount';
    if (!date) throw 'You must provide a date';
    if (!description) throw 'You must provide a description';
    const transactionsCollection = await transactions();
    const newTransaction = {
        userId: userId,
        recieverId: recieverId,
        amount: amount,
        date: date,
        description: description
    };
    const insertInfo = await transactionsCollection.insertOne(newTransaction);
    if (insertInfo.insertedCount === 0) throw 'Could not add transaction';
    const newId = insertInfo.insertedId;
    const transaction = await getTransactionById(newId);
    return transaction;
}

export async function getAllTransactions() {
    try {
        const transactionsCollection = await transactions();
        return await transactionsCollection.find({}).toArray();
    } catch (e) {
        throw e;
    }
    }

export async function addTransaction(transaction) {
    try {
        const transactionsCollection = await transactions();
        const insertInfo = await transactionsCollection.insertOne(transaction);
        if (insertInfo.insertedCount === 0) throw 'Could not add transaction';
        return await getTransactionById(insertInfo.insertedId);
    } catch (e) {
        throw e;
    }
    }
