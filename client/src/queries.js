import { gql } from "@apollo/client";

//#region GET ALL QUERIES
const GET_ALL_TRANSACTIONS = gql`
  query getAllTransactions($userId: String!, $accountType: String!) {
    getAllTransactions(userId: $userId, accountType: $accountType) {
      _id
      amount
      date
      description
      receiverId
      senderId
      type
    }
  }
`;
//#endregion

//#region GET BY ID QUERIES
const CHECKING_ACCOUNT_INFO_BY_USER_ID = gql`
  query GetCheckingAccountInfo($userId: String!) {
    getCheckingAccountInfo(userId: $userId) {
      _id
      balance
      ownerId
    }
  }
`;
const SAVINGS_ACCOUNT_INFO_BY_USER_ID = gql`
  query GetSavingsAccountInfo($userId: String!) {
    getSavingsAccountInfo(userId: $userId) {
      _id
      currentBalance
      interestRate
      lastDateUpdated
      ownerId
      previousBalance
    }
  }
`;
// const GET_USER_INFO_BY_ID = gql`
// `;

//#endregion

//#region ADD MUTATIONS
// const ADD_ARTIST = gql`
//   mutation createArtist(
//     $name: String!
//     $dateFormed: Date!
//     $members: [String!]!
//   ) {
//     addArtist(name: $name, date_formed: $dateFormed, members: $members) {
//       _id
//       dateFormed
//       members
//       name
//     }
//   }
// `;
//#endregion

//#region EDIT MUTATIONS
// const EDIT_ARTIST = gql`
//   mutation EditArtist(
//     $id: String!
//     $name: String
//     $dateFormed: Date
//     $members: [String!]
//   ) {
//     editArtist(
//       _id: $id
//       name: $name
//       date_formed: $dateFormed
//       members: $members
//     ) {
//       _id
//       dateFormed
//       name
//       members
//     }
//   }
// `;
//#endregion

//#region REMOVE MUTATIONS
// const REMOVE_ARTIST = gql`
//   mutation RemoveArtist($id: String!) {
//     removeArtist(_id: $id) {
//       _id
//       name
//     }
//   }
// `;
//#endregion

let exported = {
  // ADD ALL QUERIES/MUTATIONS BELOW:
  GET_ALL_TRANSACTIONS,
  CHECKING_ACCOUNT_INFO_BY_USER_ID,
  SAVINGS_ACCOUNT_INFO_BY_USER_ID,
  // GET_USER_INFO_BY_ID,
};

export default exported;
