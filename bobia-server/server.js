import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import session from 'express-session';
import mongoose from 'mongoose';
import device from 'express-device';
import { formatError } from 'apollo-errors';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import Confirm from 'prompt-confirm';
import notifier from 'node-notifier';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import createSeedData from './mongodb/models/seed';
import schema from './graphql/common/schema';
import log from './utils/logger';
import config from './utils/config.dev';

const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: config.MONGO_SESSIONS_URI,
  collection: 'sessions'
});

store.on('error', function(error) {
  log.error(error);
  notifier.notify({
    title: 'Error',
    message: 'Mongoose error!'
  });
});

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(compression());
app.use(express.static('uploads'));
app.use(device.capture());

const sessionOptions = {
  secret: config.SESSION.SECRET,
  resave: false,
  saveUninitialized: false
};

if (!config.IS_DEV) {
  sessionOptions.store = store;
}

app.use(session(sessionOptions));

if (config.IS_DEV) {
  app.use(
    config.MODEL_ENDPOINT,
    voyagerMiddleware({ endpointUrl: config.GRAPHQL_ENDPOINT })
  );
}

const server = new ApolloServer({
  formatError,
  schema,
  context: async ({ req, h }) => {
    return {
      SECRET: config.SECRET,
      req
    };
  }
});

const corsOptionsDelegate = {
  origin(origin, callback) {
    if (config.CORS_WHITELIST.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
};

server.applyMiddleware({
  app,
  path: config.GRAPHQL_ENDPOINT,
  cors: corsOptionsDelegate
});

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

mongoose.set('useFindAndModify', false);
// mongoose.set('debug', true);

if (config.HOST_NAME === 'localhost') {
  new Confirm(`You're running on local, use online database?`)
    .run()
    .then(function(answer) {
      if (answer) {
        config.USE_ONLINE_DB();
        runServer();
      } else {
        config.USE_LOCAL_DB();
        runServer();
      }
    });
} else {
  config.USE_ONLINE_DB();
  runServer();
}

function runServer() {
  mongoose
    .connect(config.MONGO_URI, { useNewUrlParser: true, autoIndex: false })
    .then(async () => {
      await createSeedData();
      log.info(`MongoDb is now running on ${config.MONGO_URI}`);
      httpServer.listen(config.GRAPHQL_PORT, () => {
        log.info(
          `Running GRAPHQL server on http://localhost:${
            config.GRAPHQL_PORT
          }/graphql`
        );
        notifier.notify({
          title: 'Notify',
          message: 'Server started!'
        });
        if (config.IS_DEV) {
          new Confirm('Show Environment Info?').run().then(function(answer) {
            if (answer) {
              log.info('-------Environment-------');
              log.info(`LOGFILEDIR: ${config.LOGFILEDIR}`);
              log.info(`LOGFILENAME: ${config.LOGFILENAME}`);
              log.info(`IS_DEV: ${config.IS_DEV}`);
              log.info(`CORS_WHITELIST: ${config.CORS_WHITELIST.join(', ')}`);
              log.info(`HOST_NAME: ${config.HOST_NAME}`);
              log.info(`DNS: ${config.DNS}`);
              log.info(`UPLOAD_PATH: ${config.UPLOAD_PATH}`);
              log.info(`GRAPHQL_PORT: ${config.GRAPHQL_PORT}`);
              log.info(`GRAPHQL_ENDPOINT: ${config.GRAPHQL_ENDPOINT}`);
              log.info(`MODEL_ENDPOINT: ${config.MODEL_ENDPOINT}`);
              log.info(`WS_PORT: ${config.WS_PORT}`);
              log.info(`SECRET: ${config.SECRET}`);
              log.info(`SECRET2: ${config.SECRET2}`);
              log.info(`SESSION: ${JSON.stringify(config.SESSION)}`);
            }
          });
        }
      });
    });

  mongoose.connection.on('error', err => {
    log.error(err);
    notifier.notify({
      title: 'Error',
      message: 'Mongoose error!'
    });
  });
}
