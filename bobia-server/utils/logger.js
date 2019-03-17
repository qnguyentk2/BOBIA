import * as rotate from 'winston-daily-rotate-file'; // eslint-disable-line no-unused-vars
import * as fs from 'fs';
import { createLogger, format, transports, addColors } from 'winston';
import config from './config.dev';

const { combine, printf, timestamp } = format;

const dir = config.LOGFILEDIR;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const customColorLevel = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
    custom: 7
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'grey',
    info: 'green',
    verbose: 'cyan',
    silly: 'magenta',
    custom: 'yellow'
  }
};

addColors(customColorLevel.colors);

const log = createLogger({
  levels: customColorLevel.levels,
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    printf(info => {
      const { timestamp, level, message } = info;
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.DailyRotateFile({
      filename: config.LOGFILENAME,
      dirname: config.LOGFILEDIR,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '30d'
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  log.add(
    new transports.Console({
      handleExceptions: true
    })
  );
}

export function throwResponse(type, message) {
  log[type](message);
  throw message;
}

export function throwError(message) {
  throwResponse('error', message);
}

export default log;
