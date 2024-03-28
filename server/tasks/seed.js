import {dbConnection, closeConnection} from '../config/mongoConnection.js';

//! Import collections like done below
// import {artists, albums, recordCompanies, songs} from '../config/mongoCollections.js';

import {ObjectId} from 'mongodb';

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();

  //! TODO: create seed data

  /* Create collections here: */
  // const artistsCollection = await artists();

  /* Create IDs of users/other entities here */
  // const artist1Id = new ObjectId();
  // const artist2Id = new ObjectId();
  // const artist3Id = new ObjectId();

  /* Call queries below */
  // await artistsCollection.insertMany([
  //   {
  //     _id: artist1Id,
  //     name: 'Patrick',
  //     dateFormed: '02/01/2024',
  //     members: ['Freddie Gibbs', 'Ye'],
  //     albums: [album1Id, album2Id]
  //   },
  //   {
  //     _id: artist2Id,
  //     name: 'Natasha',
  //     dateFormed: '10/07/2015',
  //     members: ['Lil Baby', 'Gunna'],
  //     albums: [album3Id]
  //   },
  //   {
  //     _id: artist3Id,
  //     name: 'Jesal',
  //     dateFormed: '05/20/2020',
  //     members: ['Dhihan', 'Ajit'],
  //     albums: [album4Id, album5Id]
  //   }
  // ]);


  console.log('Done seeding database');
  await closeConnection();
};

main().catch(console.log);
