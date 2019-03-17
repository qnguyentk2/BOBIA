import crypto from 'crypto';
import config from './config.dev';
import generatePassword from 'password-generator';

export default {
  normalize: function(alias) {
    var str = alias;
    if (str) {
      str = str.toLowerCase();
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
      str = str.replace(/đ/g, 'd');
      str = str.replace(
        /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
        ''
      );
      str = str.replace(/ + /g, ' ');
      str = str.trim();
    } else {
      str = '';
    }
    return str;
  },
  encrypt: function(text) {
    try {
      var cipher = crypto.createCipheriv(
        'aes-256-cbc',
        new Buffer(config.SECRET),
        new Buffer(config.SECRET2)
      );
      var crypted = cipher.update(text, 'utf8', 'hex');
      crypted += cipher.final('hex');
      return crypted;
    } catch (err) {
      throw err;
    }
  },
  decrypt: function(text) {
    try {
      var decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        new Buffer(config.SECRET),
        new Buffer(config.SECRET2)
      );
      var dec = decipher.update(text, 'hex', 'utf8');
      dec += decipher.final('utf8');
      return dec;
    } catch (err) {
      throw err;
    }
  },
  generateRandomPassword: function() {
    const minLength = 6;
    const maxLength = 25;
    const uppercaseMinCount = 1;
    const lowercaseMinCount = 1;
    const numberMinCount = 1;
    const specialMinCount = 1;
    const UPPERCASE_RE = /([A-Z])/g;
    const LOWERCASE_RE = /([a-z])/g;
    const NUMBER_RE = /([\d])/g;
    const SPECIAL_CHAR_RE = /([\?\-])/g;
    // const NON_REPEATING_CHAR_RE = /([\w\d\?\-])\1{2,}/g;

    const isStrongEnough = password => {
      const uc = password.match(UPPERCASE_RE);
      const lc = password.match(LOWERCASE_RE);
      const n = password.match(NUMBER_RE);
      const sc = password.match(SPECIAL_CHAR_RE);
      // const nr = password.match(NON_REPEATING_CHAR_RE);
      return (
        password.length >= minLength &&
        // !nr &&
        uc &&
        uc.length >= uppercaseMinCount &&
        lc &&
        lc.length >= lowercaseMinCount &&
        n &&
        n.length >= numberMinCount &&
        sc &&
        sc.length >= specialMinCount
      );
    };

    let password = '';
    const randomLength =
      Math.floor(Math.random() * (maxLength - minLength)) + minLength;
    while (!isStrongEnough(password)) {
      password = generatePassword(randomLength, false, /[\w\d\?\-]/);
    }
    return password;
  },
  toTitleCase: input =>
    input
      .toLowerCase()
      .split(' ')
      .map(word => word.replace(word[0], word[0].toUpperCase()))
      .join(' '),
  asyncForEach: async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  },
  phaseSearchString: function phaseSearchString(inputStr = '') {
    if (inputStr) {
      return '"' + inputStr + '"';
    }
    return inputStr;
  },
  sumArrayObject: (arr, sumField) => {
    return arr
      .map(item => item[sumField])
      .reduce((prev, next) => prev + next, 0);
  }
};
