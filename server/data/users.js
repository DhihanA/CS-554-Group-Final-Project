import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import bcrypt from 'bcrypt';
const saltRounds = 12;

const createUser = async (
    firstName, //error checked
    lastName, //error checked
    emailAddress, //error checked
    username, //error checked
    dob, //error checked
    password, //error checked
    phoneNumber,
    city, //error checked
    state, //error checked
  ) => {
    const userCollection = await users();

    if ((!firstName) || (!lastName) || (!emailAddress) || (!username)  || (!dob) || (!password) || (!city) || (!state)) {
      throw new Error ('All fields need to have valid values');
    }
  
    if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof emailAddress !== 'string' || typeof password !== 'string') {
      throw new Error ('parameters must be of string type');
    }

    firstName = firstName.trim();
    lastName = lastName.trim();
    emailAddress = emailAddress.toLowerCase().trim();
  
    //Check firstName
    if ((!(firstName.replace(/\s/g, '').length)) || (firstName.length < 2) || (firstName.length > 25)) {
      throw new Error ('firstName field is invalid');
    }
    let findNum = firstName.match(/[^a-zA-Z]+/g);
    if (findNum !== null) {
      throw new Error ('firstName contains a number or special character'); 
    }
  
    //Check lastName
    if ((!(lastName.replace(/\s/g, '').length)) || (lastName.length < 2) || (lastName.length > 25)) {
      throw new Error ('lastName field is invalid');
    }
    findNum = lastName.match(/[^a-zA-Z]+/g);
    if (findNum !== null) {
      throw new Error ('lastName contains a number or special character');
    }
  
    //Check email
    if (!emailAddress.includes('@')) {
      throw new Error ('Email must include @');
    }
    if (emailAddress.includes(' ')) {
      throw new Error ('Email cannot include spaces');
    }
    if ((!emailAddress.endsWith('.com')) && (!emailAddress.endsWith('.edu')) && (!emailAddress.endsWith('.org')) && (!emailAddress.endsWith('.net')) && (!emailAddress.endsWith('.int')) && (!emailAddress.endsWith('.gov')) && (!emailAddress.endsWith('.mil'))) {
      throw new Error ('Domain ending for the email address is invalid');
    }
    if (emailAddress[0] === '@') {
      throw new Error ('invalid email');
    }
    let index = emailAddress.indexOf('@');
    if (emailAddress[index+1] === '.') {
      throw new Error ('Email must include domain name');
    }
    //See if email already exists in DB
    const existingUser = await userCollection.findOne({emailAddress: emailAddress});
    if (existingUser) {
      throw new Error ('Email address is already associated with a user');
    }
  
    //Check password
    if ((!(password.replace(/\s/g, '').length)) || (password.length < 8)) {
      throw new Error ('invalid password');
    }
    
    let upper = /[A-Z]/;
    let nums = /\d/;
    let specials = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    let letters = /[A-Za-z]/;

    if (!upper.test(password) || !nums.test(password) || !specials.test(password)) {
      throw new Error ('Password must contain at least one uppercase letter, at least one number, and at least one special character.');
    }
    
    if (password.includes(' ')) { throw new Error ('Password cannot include spaces.'); }


    const hash = await bcrypt.hash(password, saltRounds);

    //Check username
    if ((typeof username !== "string") || (!(firstName.replace(/\s/g, '').length) || username.trim().length < 6)) {
        throw new Error ('Username field must be a valid username of at least size 6');
    }

    username = username.trim();
    if (!letters.test(username) || username.indexOf(' ') >= 0) { throw new Error ('Username must include at least one letter and cannot include spaces.'); }
    
    
    const sameUsername = await userCollection.findOne({username: /username/i});
    if (sameUsername) {
      throw new Error ('Username is already associated with a user');
    }

    if (typeof dob !== 'string') { throw new Error ('Date of birth must be a string'); }

    let splitDate = dob.split('-');
    if (splitDate.length !== 3) { throw new Error ('Date of birth is in invalid format'); }
    

    /* Parse arguments first */
    let yearDate = parseInt(splitDate[0]);
    let monthDate = parseInt(splitDate[1]);
    let dayDate = parseInt(splitDate[2]);

    /* Check ages */
    if (yearDate < 1923 || yearDate > 2006) {
      throw new Error ('Age must be between 18 and 100.')
    }

    /* Then check months */
    if (monthDate < 1 || monthDate > 12) { throw new Error ('Invalid month'); }
    let monthArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    /* ...don't forget leap years! */
    if (monthDate === 2 && yearDate % 4 === 0) {
      monthArr[monthDate - 1] = 29;
    }

    /* Check the days */
    if (dayDate < 1 || dayDate > monthArr[monthDate - 1]) { throw new Error ('Invalid day'); }

    const currDate = new Date();
    let currDay = currDate.getDate();
    let currMonth = currDate.getMonth() + 1;

    /* Edge cases */

    if (yearDate === 1922) {
      if ((monthDate === currMonth && dayDate <= currDay) || (monthDate < currMonth)) {
        throw new Error ('Age must be between 18 and 100.');
      }
    }
    if (yearDate === 2005) {
      if ((monthDate === currMonth && dayDate > currDay) || (monthDate > currMonth)) {
        throw new Error ('Age must be between 18 and 100.');
      }
    }

    const m = String(monthDate).padStart(2, '0');
    const d = String(dayDate).padStart(2, '0');
    const y = String(yearDate);

    dob = `${m}/${d}/${y}`;
  
    //Check city
    if ((typeof city !== "string") || (!(city.replace(/\s/g, '').length)) || (city.trim().length < 2)) {
        throw new Error ('City field is invalid');
    }

    city = city.trim();

    if (nums.test(city) || specials.test(city)) { throw new Error ('City cannot contain numbers or special characters'); }

    const stateArray = ['AL','AK','AZ','AR','CA','CO','CT', 'DC', 'DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA', 'PR', 'RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
    //Check state
    if ((typeof state !== "string") || (!(state.replace(/\s/g, '').length)) || (state.trim().length != 2)) {
        throw new Error ('State must be in format of two characters');
    }

    state = state.trim().toUpperCase();

    findNum = state.match(/[^a-zA-Z]+/g);
    if (findNum !== null) {
        throw new Error ('state contains a number or special character');
    }

    if (!stateArray.includes(state)) { throw new Error ('Not a valid state'); }

    //isAdmin
    if (yearDate > 2006) {
        const admin = false;
    } else {
        const admin = true;
    }
  
    //end of error checking

    //Create doc
    const currentDate = new Date();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const year = currentDate.getFullYear();
    const doc = `${month}/${day}/${year}`;
  
    let newUser = {
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      dob: dob,
      doc: doc,
      username: username,
      password: hash, 
      phone: phoneNumber,
      city: city,
      isAdmin: admin
    };
    
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw new Error ('Could not add user');
    }
  
    return await getUserById(insertInfo.insertedId.toString());
  };

export {createUser};