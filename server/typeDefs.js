//! TODO

export const typeDefs = `#graphql
  type Query {
    # artists: [Artist]
    # albums: [Album]
    # recordCompanies: [RecordCompany]
    # getArtistById(_id: String!): Artist
    # getAlbumById(_id: String!): Album
    # getCompanyById(_id: String!): RecordCompany
    # getSongsByArtistId(artistId: String!): [Song] # changed this to [Song] for extra credit
    # albumsByGenre(genre: MusicGenre!): [Album]
    # companyByFoundedYear(min: Int!, max: Int!) : [RecordCompany]
    # searchArtistByArtistName(searchTerm: String!): [Artist]
    # getSongById(_id: String!): Song
    # getSongsByAlbumId(_id: String!): [Song]
    # searchSongByTitle (searchTitleTerm: String!): [Song]
  }

  type Users {
    _id: String!
    # title: String!
    # releaseDate: Date!
    # genre: MusicGenre!
    # artist: Artist!
    # recordCompany: RecordCompany!
    # songs: [Song!]!
  }

  type CheckingAccount {
    # _id: String!
    # name: String!
    # dateFormed: Date!
    # members: [String!]!
    # albums: [Album!]!
    # numOfAlbums: Int
  }

  type SavingsAccount {
    # _id: String!
    # name: String!
    # foundedYear: Int!
    # country: String
    # albums: [Album!]!
    # numOfAlbums: Int
  }

  type Transactions {
    # _id: String! 
    # title: String! 
    # duration: String! 
    # albumId: Album!
  }

# Not sure if we are doing enums/scalars but I'll leave this here
  # enum MusicGenre {
  #   POP
  #   ROCK
  #   HIP_HOP
  #   COUNTRY
  #   JAZZ
  #   CLASSICAL
  #   ELECTRONIC
  #   R_AND_B
  #   INDIE
  #   ALTERNATIVE
  # }

  # scalar Date

  type Mutation {
    # addArtist(
    #   name: String!
    #   date_formed: Date!
    #   members: [String!]!): Artist
    # editArtist(
    #   _id: String!
    #   name: String
    #   date_formed: Date
    #   members: [String!]): Artist
  }
`;
