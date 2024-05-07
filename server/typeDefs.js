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

  enum Role {
    child
    parent
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
    getAllTransactions(userId: String!, checkingAccountId: String!, savingsAccountId: String!): [Transactions]
  }

  type Mutation {
    # User Mutations
    createAccountsAndUpdateUserInClerk(userId: String!): User
    verifyChild(userId: String!, verificationCode: String!): User
    addRoleAndDOB(userId: String!, dob: Date!, role: Role!): String
    updateMetadataQuestionIds(userId: String!, completedQuesIdsString: String!): User

    # Account Mutations
    updateSavingsBalanceForLogin(accountId: String!): SavingsAccount
    addMoneyFromQuestions(userId: String!, correctQuestions: Float!): CheckingAccount

    # Transaction Mutations
    addBudgetedTransaction(ownerId: String!, amount: Float!, description: String!): Transactions
    addTransferTransaction(senderOwnerId: String!, receiverOwnerId: String!, amount: Float!, description: String!): Transactions
    addCheckingToSavingTransfer(ownerId: String!, amount: Float!, description: String!): Transactions
    addSavingToCheckingTransfer(ownerId: String!, amount: Float!, description: String!): Transactions
    editBudgetedTransaction(userId: String!, transactionId: String!, newAmount: Float, newDescription: String): Transactions
    deleteBudgetedTransaction(ownerId: String!, transactionId: String!): DeleteTransactionResponse
    downloadTransactions(transactions: String!, userId: String!): String
    downloadTransactionsOfAllChildren(transactionsArray: String!, userId: String!): String
  }
`;
