import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

export const transactions = getCollectionFn("transactions");
export const savingsAccount = getCollectionFn("savingsAccount");
export const checkingAccount = getCollectionFn("checkingAccount");
