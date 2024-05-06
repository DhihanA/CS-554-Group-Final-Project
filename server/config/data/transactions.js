import { transactions } from "../mongoCollections";

function isValidDate(dateString) {
    const regex = /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!regex.test(dateString)) {
      return false;
    }
  
    const [month, day, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }


export async function getTransactionById(id) {
    try {
        const transactionsCollection = await transactions();
        return await transactionsCollection.findOne({ _id: id });
    } catch (e) {
        throw e;
    }
    }

export async function makeTransaction(userId, recieverId, type, amount, date, description) {
    if (!userId) throw 'You must provide a userId';
    if (!recieverId) throw 'You must provide a recieverId';
    if (!type) throw 'You must provide a type';
    if (!amount) throw 'You must provide an amount';
    if (!amount > 0) throw 'You must provide a positive amount';
    if (typeof amount !== 'number') throw 'Amount must be a number';
    if (!date) throw 'You must provide a date';
    if (!isValidDate(date)) throw 'You must provide a valid date';
    if (!description) throw 'You must provide a description';
    const transactionsCollection = await transactions();
    const newTransaction = {
        userId: userId,
        recieverId: recieverId,
        type: type,
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
