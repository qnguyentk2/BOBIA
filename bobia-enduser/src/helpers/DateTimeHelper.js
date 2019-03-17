import Moment from 'moment';
const DateTimeHelper = {
  formatFromTimestamp: (timestamp, format = 'DD.MM.YYYY') => {
    if (isNaN(timestamp)) return null;
    return Moment(timestamp).format(format);
  }
};

export { DateTimeHelper };
