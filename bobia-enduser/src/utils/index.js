import { convertFromRaw, EditorState } from 'draft-js';
import moment from 'moment';

export const camelToSpaceTitle = camelCase =>
  camelCase
    .replace(/([A-Z])/g, match => ` ${match}`)
    .replace(/^./, match => match.toUpperCase());

export const camelToUnderScoreUpper = camelCase =>
  camelCase.replace(/([A-Z])/g, match => `_${match}`).toUpperCase();

export const padZero = (str, len) => {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
};

export const isJSON = item => {
  item = typeof item !== 'string' ? JSON.stringify(item) : item;

  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }

  if (typeof item === 'object' && item !== null) {
    return true;
  }

  return false;
};

export const truncateWords = (sentence = '', limit = 0, tail = '...') => {
  const words = sentence.split(' ');

  if (limit === 0 || limit >= words.length) {
    return sentence;
  }

  const truncated = words.slice(0, limit);
  return `${truncated.join(' ')}${tail}`;
};

export const parseEditorContent = (content, limit, tail) => {
  let outputSentence;

  if (isJSON(content)) {
    outputSentence = truncateWords(
      EditorState.createWithContent(convertFromRaw(JSON.parse(content)))
        .getCurrentContent()
        .getPlainText(),
      limit,
      tail
    );
  } else if (typeof content === 'string') {
    outputSentence = truncateWords(content, limit, tail);
  }

  return outputSentence;
};

export const commarize = (val, min = 1e3) => {
  // Alter numbers larger than 1k
  if (val >= min) {
    const units = ['N', 'Tr', 'T', 'NT'];

    const order = Math.floor(Math.log(val) / Math.log(1000));

    const unitname = units[order - 1];
    const num = Math.floor(val / 1000 ** order);

    // output number remainder + unitname
    return num + unitname;
  }

  // return formatted original number
  return val.toLocaleString();
};

export const isDateNewerThan = (date, num, type) =>
  moment(date).isSameOrAfter(moment().subtract(num, type));

export const dateFromNow = date => moment(date).fromNow();

export const splitArray = (arr, size) => {
  const results = [];

  while (arr.length) {
    results.push(arr.splice(0, size));
  }

  return results;
};

export const isNumber = n => !isNaN(parseFloat(n)) && isFinite(n);

export const getServerDirectUrl = url => {
  if (typeof url !== 'string' || url.includes('data:image')) {
    return url;
  }

  if (!url || (url && url.includes('http'))) {
    return url;
  }

  if (
    process.env.NODE_ENV === 'development' &&
    process.env.REACT_APP_SERVER_MODE === 'local'
  ) {
    return `${window.location.protocol}//${window.location.hostname}:${
      process.env.REACT_APP_LOCAL_SERVER_PORT
    }/${url}`;
  } else {
    return `https://${process.env.REACT_APP_SERVER_PATH}/${url}`;
  }
};
