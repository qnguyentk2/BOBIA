import path from 'path';

const config = {};

config.LOGFILEDIR = path.join(__dirname, '../logs');
config.LOGFILENAME = 'app-%DATE%.log';

config.IS_DEV = process.env.NODE_ENV === 'development';
config.CORS_WHITELIST = process.env.CORS_WHITELIST || [
  'http://localhost:7000',
  'https://localhost:7000',
  'http://localhost:7002',
  'https://localhost:7002',
  'https://bbtest.company'
];
config.HOST_NAME = process.env.HOST_NAME || 'localhost';
config.DNS = process.env.DNS || 'bbtest.company';
config.GRAPHQL_PORT = process.env.SERVER_PORT || 7001;
config.DB_NAME = 'bobia';

config.USE_LOCAL_DB = () => {
  config.UPLOAD_PATH = 'http://localhost:7001';
  config.DNS = config.HOST_NAME;
  config.MONGO_URI = `mongodb://${config.DNS}:27017/${config.DB_NAME}`;
};

config.USE_ONLINE_DB = () => {
  config.UPLOAD_PATH =
    process.env.UPLOAD_PATH || 'https://server.bbtest.company';
  config.DNS = process.env.DNS || 'bbtest.company';
  config.MONGO_URI =
    process.env.MONGO_URI ||
    `mongodb://visata-admin:visata-password@${config.DNS}:27017/${
      config.DB_NAME
    }`;
};

config.MONGO_SESSIONS_URI =
  process.env.MONGO_SESSIONS_URI ||
  `mongodb://visata-admin:visata-password@bbtest.company:27017/${
    config.DB_NAME
  }`;
config.GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || '/graphql';
config.MODEL_ENDPOINT = process.env.MODEL_ENDPOINT || '/model';
config.WS_PORT = process.env.WS_PORT || 7003;

config.SECRET = '81388c957d9ead7d72a1e5b54ddf1860';
config.SECRET2 = 'secretare16chars';
config.SUPERADMIN_PASSWORD = 'B0bia@2018';
config.OFFICER_PASSWORD = 'B0biaOff1cer@2018';
config.BACK_OFFICE_ROLE = ['ADMIN', 'OFFICER'];

config.SESSION = {
  SECRET: 'visata-session',
  MAX_AGE: 15 * 1000 * 60 * 60
};

config.EMAIL = {
  pool: true,
  host: 'smtp.mailer.inet.vn',
  port: 465,
  secure: true, // use TLS
  auth: {
    user: 'noreply@bobia.vn',
    pass: 'V1sata@2018'
  }
};

export default config;
