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
    owner: User!
    balance: Float!
  }

  type SavingsAccount {
    _id: String!
    owner: User!
    currentBalance: Float!
    previousBalance: Float!
    interestRate: Float!
    lastDateUpdated: Date!
  }

  type Transactions {
    _id: String!
    sender: AccountType!
    receiver: AccountType!
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

  union AccountType = SavingsAccount | CheckingAccount


  type Query {
    # User Queries
    getChildren(parentUserId: String!): [User]
    getAllChildren: [User]

    # Account Queries
    getCheckingAccountInfo(userId: String!): CheckingAccount
    getSavingsAccountInfo(userId: String!): SavingsAccount
    getAccountByAccountId(accountId: String!): AccountType

    # Transaction Queries
    getAllTransactions(userId: String!, accountType: String!): [Transactions]
  }

  type Mutation {
    # User Mutations
    createAccountsAndUpdateUserInClerk(userId: String!): User
    verifyChild(userId: String!, verificationCode: String!): User

    # Account Mutations
    updateSavingsBalanceForLogin(accountId: String!): SavingsAccount

    # Transaction Mutations
    addBudgetedTransaction(ownerId: String!, amount: Float!, description: String!): Transactions
    addTransferTransaction(senderId: String!, receiverId: String!, amount: Float!, description: String!): Transactions
    addCheckingToSavingTransfer(ownerId: String!, amount: Float!, description: String!): Transactions
    addSavingToCheckingTransfer(ownerId: String!, amount: Float!, description: String!): Transactions
    editBudgetedTransaction(transactionId: String!, newAmount: Float, newDescription: String): Transactions
    deleteBudgetedTransaction(ownerId: String!, transactionId: String!): DeleteTransactionResponse
    downloadTransactions(transactions: String!, userId: String!): String
  }
`;
