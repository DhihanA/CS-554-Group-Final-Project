import { gql } from "@apollo/client";

//#region GET ALL QUERIES
const GET_ALL_TRANSACTIONS = gql`
  query GetAllTransactions(
    $userId: String!
    $checkingAccountId: String!
    $savingsAccountId: String!
  ) {
    getAllTransactions(
      userId: $userId
      checkingAccountId: $checkingAccountId
      savingsAccountId: $savingsAccountId
    ) {
      _id
      amount
      dateOfTransaction
      description
      type
      receiver {
        ... on SavingsAccount {
          _id
          owner {
            firstName
            id
            imageUrl
            lastName
          }
        }
        ... on CheckingAccount {
          _id
          owner {
            firstName
            id
            imageUrl
            lastName
          }
        }
      }
      sender {
        ... on SavingsAccount {
          _id
          owner {
            firstName
            id
            imageUrl
            lastName
          }
        }
        ... on CheckingAccount {
          _id
          owner {
            firstName
            id
            imageUrl
            lastName
          }
        }
      }
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
      owner {
        id
      }
    }
  }
`;
const SAVINGS_ACCOUNT_INFO_BY_USER_ID = gql`
  query GetSavingsAccountInfo($userId: String!) {
    getSavingsAccountInfo(userId: $userId) {
      _id
      currentBalance
      previousBalance
      interestRate
      lastDateUpdated
      owner {
        id
      }
      previousBalance
    }
  }
`;
// const GET_USER_INFO_BY_ID = gql`
// `;

//#endregion

//#region ADD MUTATIONS
const VERIFY_CHILD_MUTATION = gql`
  mutation verifyChild($userId: String!, $verificationCode: String!) {
    verifyChild(userId: $userId, verificationCode: $verificationCode) {
      id
    }
  }
`;

const ADD_ROLE_AND_DOB_MUTATION = gql`
  mutation addRoleAndDOB($userId: String!, $dob: Date!, $role: Role!) {
    addRoleAndDOB(userId: $userId, dob: $dob, role: $role)
  }
`;

const CREATE_ACCOUNTS_MUTATION = gql`
  mutation createAccountsAndUpdateUserInClerk($userId: String!) {
    createAccountsAndUpdateUserInClerk(userId: $userId) {
      firstName
      lastName
    }
  }
`;

//#endregion

//#region EDIT MUTATIONS
// const UPDATE_USER_IN_DB = gql`
//   mutation updateUserInLocalDB($clerkUserId: String!) {
//     updateUser(clerkUserId: $clerkUserId) {
//       _id
//     }
//   }
// `;
const CREATE_OR_UPDATE_USER_IN_DB = gql`
  mutation Mutation($clerkUserId: String!) {
    createOrUpdateUserInLocalDB(clerkUserId: $clerkUserId) {
      _id
      clerkId
      completedQuestionIds
      firstName
      lastName
      parentId
      username
      verificationCode
      emailAddresses
      dob
    }
  }
`;
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

const GENERATE_PDF_MUTATION = gql`
  mutation Mutation($transactions: String!, $userId: String!) {
    downloadTransactions(transactions: $transactions, userId: $userId)
  }
`;

const GENERATE_PDF_OF_ALL_CHILDREN_MUTATION = gql`
  mutation Mutation($transactionsArray: String!, $userId: String!) {
    downloadTransactionsOfAllChildren(
      transactionsArray: $transactionsArray
      userId: $userId
    )
  }
`;

let exported = {
  // ADD ALL QUERIES/MUTATIONS BELOW:
  CREATE_OR_UPDATE_USER_IN_DB,
  // CREATE_USER_IN_DB,
  // UPDATE_USER_IN_DB,

  GET_ALL_TRANSACTIONS,
  CHECKING_ACCOUNT_INFO_BY_USER_ID,
  SAVINGS_ACCOUNT_INFO_BY_USER_ID,

  GENERATE_PDF_MUTATION,
  GENERATE_PDF_OF_ALL_CHILDREN_MUTATION,

  VERIFY_CHILD_MUTATION,
  ADD_ROLE_AND_DOB_MUTATION,
  CREATE_ACCOUNTS_MUTATION,
};

export default exported;
