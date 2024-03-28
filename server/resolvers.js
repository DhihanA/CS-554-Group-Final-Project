import {GraphQLError} from 'graphql';

//! Import actual collections below
// import {
//   artists as artistsCollection,
//   albums as albumsCollection,
//   recordCompanies as recordCompaniesCollection,
//   songs as songsCollection,
//   songs
// } from './config/mongoCollections.js';

import helpers from './helpers.js';
import {ObjectId} from 'mongodb';
import redis from 'redis';

const client = redis.createClient();
client.connect().then(() => {});

/* parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee
		
*/

//! TODO
export const resolvers = {
  Query: {
    // artists: async () => {
    //   const cacheCheck = await client.get('artists');
    //   if (cacheCheck) return JSON.parse(cacheCheck);
    //   const artists = await artistsCollection();
    //   const allArtists = await artists.find({}).toArray();
    //   if (!allArtists) {
    //     throw new GraphQLError(`Internal Server Error`, {
    //       extensions: {code: 'INTERNAL_SERVER_ERROR'}
    //     });
    //   }
    //   await client.set('artists', JSON.stringify(allArtists));
    //   await client.expire('artists', 3600);
    //   return allArtists;
    // },
  },
  Users: {
    // artist: async (parentValue) => {
    //   const artists = await artistsCollection();
    //   const artist = await artists.findOne({_id: new ObjectId(parentValue.artistId)});
    //   return artist;
    // },
  },
  CheckingAccount: {
    // albums: async (parentValue) => {
    //   const albums = await albumsCollection();
    //   const artistAlbums = await albums.find({artistId: new ObjectId(parentValue._id)}).toArray();
    //   return artistAlbums;
    // },
  },
  SavingsAccount: {
    // albums: async (parentValue) => {
    //   const albums = await albumsCollection();
    //   const companyAlbums = await albums.find({recordCompanyId: new ObjectId(parentValue._id)}).toArray();
    //   return companyAlbums;
    // },
  },
  Transactions: {
    // albumId: async (parentValue) => {
    //   const albums = await albumsCollection();
    //   const album = await albums.findOne({_id: new ObjectId(parentValue.albumId)});
    //   return album;
    // }
  },
  Mutation: {
    // addArtist: async (_, args) => {
    //   /* Error check name, date, members */
    //   try {
    //     args.name = helpers.checkArg(args.name, 'Name');
    //   } catch (e) {
    //     throw new GraphQLError(e,
    //       {
    //         extensions: {code: 'BAD_USER_INPUT'}
    //       }
    //     );
    //   }
    //   try {
    //     args.date_formed = helpers.checkDate(args.date_formed);
    //   } catch (e) {
    //     throw new GraphQLError(e,
    //       {
    //         extensions: {code: 'BAD_USER_INPUT'}
    //       }
    //     );
    //   }
    //   if (args.members.length === 0) {
    //     throw new GraphQLError(
    //       `Members should be a non-empty array`,
    //       {
    //         extensions: {code: 'BAD_USER_INPUT'}
    //       }
    //     );
    //   }
    //   for (let i = 0; i < args.members.length; i++) {
    //     try {
    //       args.members[i] = helpers.checkArg(args.members[i], 'Member');
    //       helpers.checkForOnlyLetters(args.members[i], 'Member');
    //     } catch (e) {
    //       throw new GraphQLError(e,
    //         {
    //           extensions: {code: 'BAD_USER_INPUT'}
    //         }
    //       );
    //     }
    //   }
      
    //   /* Add artist to db + cache + return */
    //   const artists = await artistsCollection();
    //   const newArtist = {
    //     _id: new ObjectId(),
    //     name: args.name,
    //     dateFormed: args.date_formed,
    //     members: args.members,
    //     albums: []
    //   }
    //   let insertedArtist = await artists.insertOne(newArtist);
    //   if (!insertedArtist.acknowledged || !insertedArtist.insertedId) {
    //     throw new GraphQLError(`Could not Add Artist`, {
    //       extensions: {code: 'INTERNAL_SERVER_ERROR'}
    //     });
    //   }
    //   await client.json.set(`artist_${newArtist._id.toString()}`, '$', newArtist);
    //   return newArtist;
    // },
  }
};