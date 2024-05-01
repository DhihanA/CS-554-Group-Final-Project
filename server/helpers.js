import { ObjectId } from "mongodb";

const helpers = {
  checkArg: (arg, argName) => {
    if (!arg) throw `${argName} must be provided.`;
    arg = arg.trim();
    if (arg.length <= 0) throw `${argName} must be non-empty.`;
    return arg;
  },
  checkForOnlyLetters: (arg, argName) => {
    if (!arg) throw `${argName} must be provided.`;
    arg = arg.trim();
    if (arg.length <= 0) throw `${argName} must be non-empty.`;
    const lettersAndSpaces = /^[A-Za-z\s]+$/;
    if (!lettersAndSpaces.test(arg))
      throw `${argName} must contain only letters.`;
  },
  checkId: (id) => {
    if (!id) throw `id must be provided.`;
    id = id.trim();
    if (!ObjectId.isValid(id)) throw `id is not a valid ObjectId.`;
    if (id.length <= 0) throw `ID must be non-empty.`;
    return id;
  },
  checkDate: (date) => {
    if (!date) throw `Date must be provided.`;
    date = date.trim();
    if (date.length <= 0) throw `Date must be non-empty.`;
    const reg = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!reg.test(date)) throw `Date must be in a valid format.`;

    let [month, day, year] = date.split("/");
    year = parseInt(year);
    day = parseInt(day);
    if (month.length === 1) month = "0" + month;
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const dayMap = {
      "01": 31,
      "02": isLeapYear ? 29 : 28,
      "03": 31,
      "04": 30,
      "05": 31,
      "06": 30,
      "07": 31,
      "08": 31,
      "09": 30,
      10: 31,
      11: 30,
      12: 31,
    };

    if (day < 1 || day > dayMap[month]) throw `Date must be valid.`;
    if (new Date(date) > new Date()) throw `Date must be in the past.`;
    return date;
  },
  checkDuration: (duration) => {
    if (!duration) throw `Duration must be provided.`;
    duration = duration.trim();
    if (duration.length <= 0) throw `Duration must be non-empty.`;
    const reg = /^([0-5]?[0-9]):([0-5][0-9])$/;
    if (!reg.test(duration)) throw `Duration must be in a valid format.`;
    return duration;
  },
};

export default helpers;
