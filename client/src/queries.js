import { gql } from "@apollo/client";

//#region GET ALL QUERIES
const GET_ALL_TRANSACTIONS = gql`
  query getAllTransactions($userId: String!, $accountType: String!) {
    getAllTransactions(userId: $userId, accountType: $accountType) {
      _id
      amount
      date
      description
      receiverId
      senderId
      type
    }
  }
`;
//#endregion

//#region GET BY ID QUERIES
// const ARTIST_BY_ID = gql`
//   query Query($id: String!) {
//     getArtistById(_id: $id) {
//       _id
//       dateFormed
//       members
//       name
//       numOfAlbums
//       albums {
//         title
//         _id
//       }
//     }
//   }
// `;
//#endregion

//#region ADD MUTATIONS
// const ADD_ARTIST = gql`
//   mutation createArtist(
//     $name: String!
//     $dateFormed: Date!
//     $members: [String!]!
//   ) {
//     addArtist(name: $name, date_formed: $dateFormed, members: $members) {
//       _id
//       dateFormed
//       members
//       name
//     }
//   }
// `;
//#endregion

//#region EDIT MUTATIONS
// const EDIT_ARTIST = gql`
//   mutation EditArtist(
//     $id: String!
//     $name: String
//     $dateFormed: Date
//     $members: [String!]
//   ) {
//     editArtist(
//       _id: $id
//       name: $name
//       date_formed: $dateFormed
//       members: $members
//     ) {
//       _id
//       dateFormed
//       name
//       members
//     }
//   }
// `;
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

let exported = {
  // ADD ALL QUERIES/MUTATIONS BELOW:
  GET_ALL_TRANSACTIONS,
};

export default exported;
