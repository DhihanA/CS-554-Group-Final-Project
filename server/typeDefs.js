export const typeDefs = `#graphql
  scalar Date

  type User {
    id: String!
    firstName: String!
    lastName: String!
    imageUrl: String!
  }

  type CheckingAccount {
    _id: String!
    ownerId: String!
    balance: Float!
  }

  type SavingsAccount {
    _id: String!
    ownerId: String!
    currentBalance: Float!
    previousBalance: Float!
    interestRate: Float!
    lastDateUpdated: Date!
  }

  type Transaction {
    _id: String!
    senderId: String!
    receiverId: String!
    amount: Float!
    description: String
    dateOfTransaction: Date!
    type: TransferType
  }

  enum TransferType {
    Transfer
    Budgeted
    CheckingToSavingTransfer
    SavingToCheckingTransfer
  }

  type DeleteTransactionResponse {
    success: Boolean!
    message: String!
  }


  type Query {
    # User Queries
    getUserInfo(ownerId: String!): User
    getAllUsers: [User]
    getChildren(parentUserId: String!): [User]
    getUserByAccountId(accountId: String!): [User]

    # Account Queries
    getCheckingAccountInfo(userId: String!): CheckingAccount
    getSavingsAccountInfo(userId: String!): SavingsAccount

    # Transaction Queries
    getAllTransactions(userId: String!, accountType: String!): [Transaction]
  }

  type Mutation {
    # User Mutations
    verifyChild(userId: String!, verificationCode: String!): User

    # Account Mutations
    updateSavingsBalanceForLogin(accountId: String!): SavingsAccount

    # Transaction Mutations
    addBudgetedTransaction(ownerId: String!, amount: Float!, description: String!): Transaction
    addTransferTransaction(senderId: String!, receiverId: String!, amount: Float!, description: String!): Transaction
    addCheckingToSavingTransfer(ownerId: String!, amount: Float!, description: String!): Transaction
    addSavingToCheckingTransfer(ownerId: String!, amount: Float!, description: String!): Transaction
    editBudgetedTransaction(transactionId: String!, newAmount: Float, newDescription: String): Transaction
    downloadTransactions(userId: String!): String
    deleteBudgetedTransaction(ownerId: String!, transactionId: String!): DeleteTransactionResponse
  }
`;
