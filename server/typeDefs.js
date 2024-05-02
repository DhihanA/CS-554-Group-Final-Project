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
    _id: String!
    clerkId: String!
    parentId: String # undefined for Parent
    verificationCode: String # undefined for children
    firstName: String!
    lastName: String!
    emailAddresses: [String]!
    username: String!
    dob: Date!
    completedQuestionIds: [Int] # undefined for Parent
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
    getUserInfo(userId: String!): User
    getChildren(parentUserId: String!): [User] #new

    # Account Queries
    getCheckingAccountInfo(userId: String!): CheckingAccount
    getSavingsAccountInfo(userId: String!): SavingsAccount

    # Transaction Queries
    getAllTransactions(userId: String!, accountType: String!): [Transaction]
  }

  type Mutation {
    # User Mutations
    createOrUpdateUserInLocalDB(clerkUserId: String!): User
    createUserInLocalDB(clerkUserId: String!): User
    updateUserInLocalDB(clerkUserId: String!): User
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
