export default {
  isEmpty(value) {
    return value === undefined || value === null || value === '';
  },
  isUsername(value) {
    const USERNAME_REGEXP = /^\w+$/; // eslint-disable-line no-useless-escape
    return USERNAME_REGEXP.test(value);
  },
  isEmail(value) {
    const EMAIL_REGEXP = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; // eslint-disable-line no-useless-escape
    return EMAIL_REGEXP.test(value);
  },
  isPassword(value) {
    const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]+$/; // eslint-disable-line no-useless-escape
    return PASSWORD_REGEXP.test(value);
  },
  minLength(value, min) {
    return !(value.length < min);
  },
  maxLength(value, max) {
    return !(value.length > max);
  },
  isInt(value) {
    return Number.isInteger(Number(value));
  },
  isOneOf(value, enumeration) {
    return enumeration.includes(value);
  },
  isMatch(value, field) {
    return value === field;
  },
  hasNoSpace(value) {
    const HAS_NO_SPACE = /^\S*$/;
    return HAS_NO_SPACE.test(value);
  },
  hasLowerChar(value) {
    const HAS_LOWER_CHAR = /^(?=.*[a-z])/;
    return HAS_LOWER_CHAR.test(value);
  },
  hasUpperChar(value) {
    const HAS_UPPER_CHAR = /^(?=.*[A-Z])/;
    return HAS_UPPER_CHAR.test(value);
  },
  hasNumber(value) {
    const HAS_NUMBER = /^(?=.*[0-9])/;
    return HAS_NUMBER.test(value);
  },
  hasSpecialChar(value) {
    const HAS_SPECIAL_CHAR = /^(?=.*[!@#\$%\^&\*])/; // eslint-disable-line no-useless-escape
    return HAS_SPECIAL_CHAR.test(value);
  },
  isObjectEmpty(obj) {
    return Object.getOwnPropertyNames(obj).length === 0;
  }
};
