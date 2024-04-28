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

  type Query {
    getAllTransactions(userId: String!, accountType: String!): [Transaction]
    getUserInfo(userId: String!): User
    getCheckingAccountInfo(userId: String!): CheckingAccount
    getSavingsAccountInfo(userId: String!): SavingsAccount
  }

  type User {
    _id: String!
    parentId: String!
    verificationCode: String
    firstName: String!
    lastName: String!
    emailAddress: String!
    username: String!
    dob: Date!
    completedQuestionIds: [Int] # undefined for Parent
    checkingAccounts: [CheckingAccount]
    savingsAccounts: [SavingsAccount]
    transactions: [Transaction]
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
    date: Date!
    description: String
    type: TransferType
  }

  enum TransferType {
    Transfer
    Budgeted
    InnerTransfer
  }

  type Mutation {
    createUser(firstName: String!, lastName: String!, emailAddress: String!, username: String!, dob: Date!, parentId: ID, verificationCode: String): User
    editUser(_id: String!, firstName: String, lastName: String, emailAddress: String, phoneNumber: String, username: String): User
    updateSavingsBalanceForLogin(accountId: String!): SavingsAccount
    addBudgetedTransaction(ownerId: String!, amount: Float!, description: String!, type: TransferType!): Transaction
    addTransferTransaction(senderId: String!, receiverId: String!, amount: Float!, description: String!, type: TransferType): Transaction
    addInnerTransferTransaction(ownerId: String!, amount: Float!, description: String!, type: TransferType): Transaction
    editBudgetedTransaction(transactionId: String!, newName: String, newAmount: Float, newDescription: String): Transaction
    sendMoney(senderUserId: String!, receiverUserId: String!, amount: Float!): Boolean
    downloadTransactions(userId: String!): String
  }
`;
