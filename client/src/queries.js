import { gql } from "@apollo/client";

//#region GET ALL QUERIES
const GET_ALL_TRANSACTIONS = gql`
  query GetAllTransactions($userId: String!, $accountType: String!) {
    getAllTransactions(userId: $userId, accountType: $accountType) {
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

// GET ALL CHILDREN
const GET_ALL_CHILDREN = gql`
  query GetAllChildren {
    getAllChildren {
      id
      firstName
      lastName
      imageUrl
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
// const CREATE_USER_IN_DB = gql`
//   mutation createUserInLocalDB($clerkUserId: String!) {
//     createUser(clerkUserId: $clerkUserId) {
//       _id
//     }
//   }
// `;

const ADD_TRANSFER_TRANSACTION = gql`
  mutation AddTransferTransaction(
    $senderOwnerId: String!, 
    $receiverOwnerId: String!, 
    $amount: Float!, 
    $description: String!) {
      addTransferTransaction(
        senderOwnerId: $senderOwnerId, 
        receiverOwnerId: $receiverOwnerId, 
        amount: $amount, 
        description: $description) {
          sender {
            ... on CheckingAccount {
              _id
              balance
              owner {
                firstName
                lastName
              }
            }
          }
          receiver {
            ... on CheckingAccount {
              _id
              balance
              owner {
                firstName
                lastName
              }
            }
          }
          amount
          description
          dateOfTransaction
          type
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
  mutation Mutation($transactions: String!) {
    downloadTransactions(transactions: $transactions)
  }
`;

let exported = {
  // ADD ALL QUERIES/MUTATIONS BELOW:
  CREATE_OR_UPDATE_USER_IN_DB,
  // CREATE_USER_IN_DB,
  // UPDATE_USER_IN_DB,

  GET_ALL_TRANSACTIONS,
  GET_ALL_CHILDREN,

  CHECKING_ACCOUNT_INFO_BY_USER_ID,
  SAVINGS_ACCOUNT_INFO_BY_USER_ID,

  ADD_TRANSFER_TRANSACTION,
  GENERATE_PDF_MUTATION,

  // GET_USER_INFO_BY_ID,
};

export default exported;
