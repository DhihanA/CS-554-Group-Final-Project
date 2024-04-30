import { dbConnection } from "./mongoConnection.js";

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
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

//! List actual collections below
// export const artists = getCollectionFn('artists');
export const transactions = getCollectionFn("transactions");
export const users = getCollectionFn("users");
export const savingsAccount = getCollectionFn("savingsAccount");
export const checkingAccount = getCollectionFn("checkingAccount");
