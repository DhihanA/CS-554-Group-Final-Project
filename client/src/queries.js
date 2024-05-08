import { gql } from "@apollo/client";

//#region GET ALL QUERIES
const GET_ALL_TRANSACTIONS = gql`
  query GetAllTransactions($userId: String!) {
    getAllTransactions(userId: $userId) {
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
const GET_CHILDREN_BY_PARENT_ID = gql`
  query Query($parentUserId: String!) {
    getChildren(parentUserId: $parentUserId) {
      firstName
      id
      imageUrl
      lastName
    }
  }
`;
// const GET_USER_INFO_BY_ID = gql`
// `;

//#endregion

//#region ADD MUTATIONS
const ADD_TRANSFER_TRANSACTION = gql`
  mutation AddTransferTransaction(
    $senderOwnerId: String!
    $receiverOwnerId: String!
    $amount: Float!
    $description: String!
  ) {
    addTransferTransaction(
      senderOwnerId: $senderOwnerId
      receiverOwnerId: $receiverOwnerId
      amount: $amount
      description: $description
    ) {
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

const ADD_CHECKING_TO_SAVINGS_TRANSACTION = gql`
  mutation AddCheckingToSavingTransfer(
    $ownerId: String!
    $addCheckingToSavingTransferAmount2: Float!
    $addCheckingToSavingTransferDescription2: String!
  ) {
    addCheckingToSavingTransfer(
      ownerId: $ownerId
      amount: $addCheckingToSavingTransferAmount2
      description: $addCheckingToSavingTransferDescription2
    ) {
      amount
      dateOfTransaction
      description
      type
      receiver {
        ... on CheckingAccount {
          _id
          balance
          owner {
            firstName
            id
            imageUrl
            lastName
          }
        }
      }
      sender {
        ... on CheckingAccount {
          _id
          balance
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

const ADD_SAVINGS_TO_CHECKING_TRANSACTION = gql`
  mutation AddSavingToCheckingTransfer(
    $addSavingToCheckingTransferOwnerId2: String!
    $addSavingToCheckingTransferAmount2: Float!
    $addSavingToCheckingTransferDescription2: String!
  ) {
    addSavingToCheckingTransfer(
      ownerId: $addSavingToCheckingTransferOwnerId2
      amount: $addSavingToCheckingTransferAmount2
      description: $addSavingToCheckingTransferDescription2
    ) {
      _id
      amount
      dateOfTransaction
      description
      receiver {
        ... on CheckingAccount {
          _id
          balance
          owner {
            firstName
            id
            imageUrl
            lastName
          }
        }
      }
      sender {
        ... on CheckingAccount {
          _id
          balance
          owner {
            firstName
            id
            imageUrl
            lastName
          }
        }
      }
      type
    }
  }
`;

const ADD_BUDGETED_TRANSACTION = gql`
  mutation AddBudgetedTransaction(
    $addBudgetedTransactionOwnerId2: String!
    $addBudgetedTransactionAmount2: Float!
    $addBudgetedTransactionDescription2: String!
  ) {
    addBudgetedTransaction(
      ownerId: $addBudgetedTransactionOwnerId2
      amount: $addBudgetedTransactionAmount2
      description: $addBudgetedTransactionDescription2
    ) {
      amount
      description
      _id
      dateOfTransaction
      receiver {
        ... on CheckingAccount {
          _id
          balance
          owner {
            firstName
            id
            imageUrl
            lastName
          }
        }
      }
      sender {
        ... on CheckingAccount {
          _id
          balance
          owner {
            firstName
            id
            imageUrl
            lastName
          }
        }
      }
      type
    }
  }
`;

const ADD_MONEY_FROM_QUESTIONS = gql`
  mutation AddMoneyFromQuestions(
    $addMoneyFromQuestionsUserId2: String!
    $correctQuestions: Float!
  ) {
    addMoneyFromQuestions(
      userId: $addMoneyFromQuestionsUserId2
      correctQuestions: $correctQuestions
    ) {
      _id
      balance
      owner {
        id
        firstName
        lastName
        imageUrl
      }
    }
  }
`;

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

const EDIT_BUDGETED_TRANSACTION = gql`
  mutation EditBudgetedTransaction(
    $userId: String!
    $transactionId: String!
    $newAmount: Float
    $newDescription: String
  ) {
    editBudgetedTransaction(
      userId: $userId
      transactionId: $transactionId
      newAmount: $newAmount
      newDescription: $newDescription
    ) {
      _id
      amount
      dateOfTransaction
      description
      type
    }
  }
`;

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

const UPDATE_METADATA_QUESTION_IDS = gql`
  mutation UpdateMetadataQuestionIds(
    $updateMetadataQuestionIdsUserId2: String!
    $completedQuesIdsString: String!
  ) {
    updateMetadataQuestionIds(
      userId: $updateMetadataQuestionIdsUserId2
      completedQuesIdsString: $completedQuesIdsString
    ) {
      id
      firstName
      lastName
      imageUrl
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

const DELETE_BUDGETED_TRANSACTION = gql`
  mutation DeleteBudgetedTransaction(
    $ownerId: String!
    $transactionId: String!
  ) {
    deleteBudgetedTransaction(
      ownerId: $ownerId
      transactionId: $transactionId
    ) {
      message
      success
    }
  }
`;
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
  UPDATE_METADATA_QUESTION_IDS,
  // CREATE_USER_IN_DB,
  // UPDATE_USER_IN_DB,

  GET_ALL_TRANSACTIONS,
  GET_ALL_CHILDREN,

  CHECKING_ACCOUNT_INFO_BY_USER_ID,
  SAVINGS_ACCOUNT_INFO_BY_USER_ID,
  GET_CHILDREN_BY_PARENT_ID,

  ADD_TRANSFER_TRANSACTION,
  ADD_CHECKING_TO_SAVINGS_TRANSACTION,
  ADD_SAVINGS_TO_CHECKING_TRANSACTION,
  ADD_BUDGETED_TRANSACTION,
  ADD_MONEY_FROM_QUESTIONS,

  GENERATE_PDF_MUTATION,
  GENERATE_PDF_OF_ALL_CHILDREN_MUTATION,

  VERIFY_CHILD_MUTATION,
  ADD_ROLE_AND_DOB_MUTATION,
  CREATE_ACCOUNTS_MUTATION,

  EDIT_BUDGETED_TRANSACTION,
  DELETE_BUDGETED_TRANSACTION,
};

export default exported;
