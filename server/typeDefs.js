//! TODO

export const typeDefs = `#graphql
  type Query {
    savingsAccounts: [SavingsAccount]
    checkingAccounts: [CheckingAccount]
    users: [User]
    transactions: [Transaction]
    getSavingsAccountById(_id: String!): SavingsAccount
    getCheckingAccountById(_id: String!): CheckingAccount
    getUserById(_id: String!): User
    getTransactionById(_id: String!): Transaction
  }

  type User {
    _id: String!
    firstName: String!
    lastName: String! 
    emailAddress: Email!
    username: String! 
    dob: Date!
    hashed_password: String!
    phoneNumber: PhoneNumber!
    city: String!
    state: String!
    completedQuestionIds: [Int]
  }

  type CheckingAccount {
    _id: String!
    balance: Int!
    Transactions: [Transaction]
  }

  type SavingsAccount {
    _id: String!
    currentBalance: Int!
    previousBalance: Int!
    Interest_rate: Int!
    lastDateUpdated: Date!
    Transactions: [Transaction]
  }

  type Transaction {
    _id: String!
    sender: AccountType
    receiver: AccountType
    amount: Int!
    date: Date!
    description: String
    type: Type
  }

  union AccountType = SavingsAccount | CheckingAccount

  scalar Date
  scalar PhoneNumber
  scalar Email

  enum Type {
    Transfer
    Budgeted
  }

  type Mutation {

  }
`;
