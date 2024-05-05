// export const typeDefs = `#graphql
//   type Query {
//     savingsAccounts: [SavingsAccount]
//     checkingAccounts: [CheckingAccount]
//     users: [User]
//     transactions: [Transaction]
//     getSavingsAccountById(_id: String!): SavingsAccount
//     getCheckingAccountById(_id: String!): CheckingAccount
//     getUserById(_id: String!): User
//     getTransactionById(_id: String!): Transaction
//     getTransactionByUserId(userId: String!) # for downloading a users' transactions
//   }

//   type User {
//     _id: String!
//     firstName: String!
//     lastName: String!
//     emailAddress: Email!
//     username: String!
//     dob: Date!
//     phoneNumber: PhoneNumber!
//     city: String!
//     state: String!
//     completedQuestionIds: [Int]
//   }

//   type CheckingAccount {
//     _id: String!
//     balance: Float!
//     Transactions: [Transaction]
//   }

//   type SavingsAccount {
//     _id: String!
//     currentBalance: Float!
//     previousBalance: Float!
//     Interest_rate: Float!
//     lastDateUpdated: Date!
//     Transactions: [Transaction]
//   }

//   type Transaction {
//     _id: String!
//     sender: AccountType!
//     receiver: AccountType!
//     amount: Float!
//     date: Date!
//     description: String
//     type: Type
//   }

//   union AccountType = SavingsAccount | CheckingAccount | ParentAccount

//   scalar Date
//   scalar Email

//   enum Type {
//     Transfer
//     Budgeted
//     Parent
//   }

//   enum Role {
//     Child
//     Parent
//   }

//   type Mutation {
//     addCheckingAccount(userId: String!): CheckingAccount
//     addSavingsAccount(userId: String!): SavingsAccount
//     createUser(_id: String!, firstName: String!, lastName: String!, username: String!, dob: Date!, Email: Email!, city: String!, state: String!, role: Role!): User
//     editUser(_id: String, firstName: String, lastName: String, username: String, dob: Date, Email: Email, city: String, state: String, role: Role): User
//     sendMoney(sender: AccountType!, reciever: AccountType!, amount: Float!): Transaction
//     updateSavingsBalanceForLogin(currentBalance: Float!, lastDateUpdated: Date!, currentDate: Date!): SavingsAccount
//   }
// `;

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
    dateofTransaction: Date!
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
    getUserInfo(ownerId: String!): User
    getAllUsers: [User]
    getChildren(parentUserId: String!): [User]

    # Account Queries
    getCheckingAccountInfo(userId: String, accountId: String): CheckingAccount
    getSavingsAccountInfo(userId: String, accountId: String): SavingsAccount

    # Transaction Queries
    getAllTransactions(userId: String!, accountType: String!): [Transactions]
  }

  type Mutation {
    # User Mutations
    verifyChild(userId: String!, verificationCode: String!): User

    # Account Mutations
    updateSavingsBalanceForLogin(accountId: String!): SavingsAccount

    # Transaction Mutations
    addBudgetedTransaction(ownerId: String!, amount: Float!, description: String!): Transactions
    addTransferTransaction(senderId: String!, receiverId: String!, amount: Float!, description: String!): Transactions
    addCheckingToSavingTransfer(ownerId: String!, amount: Float!, description: String!): Transactions
    addSavingToCheckingTransfer(ownerId: String!, amount: Float!, description: String!): Transactions
    editBudgetedTransaction(transactionId: String!, newAmount: Float, newDescription: String): Transactions
    downloadTransactions(userId: String!): String
    deleteBudgetedTransaction(ownerId: String!, transactionId: String!): DeleteTransactionResponse
  }
`;
