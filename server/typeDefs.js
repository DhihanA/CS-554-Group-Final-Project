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
    getTransactionByUserId(userId: String!) # for downloading a users' transactions
  }

  type User {
    _id: String!
    firstName: String!
    lastName: String! 
    emailAddress: Email!
    username: String! 
    dob: Date!
    phoneNumber: PhoneNumber!
    city: String!
    state: String!
    completedQuestionIds: [Int]
  }

  type CheckingAccount {
    _id: String!
    balance: Float!
    Transactions: [Transaction]
  }

  type SavingsAccount {
    _id: String!
    currentBalance: Float!
    previousBalance: Float!
    Interest_rate: Float!
    lastDateUpdated: Date!
    Transactions: [Transaction]
  }

  type Transaction {
    _id: String!
    sender: AccountType!
    receiver: AccountType!
    amount: Float!
    date: Date!
    description: String
    type: Type
  }

  union AccountType = SavingsAccount | CheckingAccount | ParentAccount

  scalar Date
  scalar Email

  enum Type {
    Transfer
    Budgeted
    Parent
  }

  enum Role {
    Child
    Parent
  }

  type Mutation {
    addCheckingAccount(userId: String!): CheckingAccount
    addSavingsAccount(userId: String!): SavingsAccount
    createUser(_id: String!, firstName: String!, lastName: String!, username: String!, dob: Date!, Email: Email!, city: String!, state: String!, role: Role!): User
    editUser(_id: String, firstName: String, lastName: String, username: String, dob: Date, Email: Email, city: String, state: String, role: Role): User
    sendMoney(sender: AccountType!, reciever: AccountType!, amount: Float!): 
    updateSavingsBalanceForLogin(currentBalance: Float!, lastDateUpdated: Date!, currentDate: Date!)
  }
`;