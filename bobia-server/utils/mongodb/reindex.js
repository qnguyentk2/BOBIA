import log from '../logger';

const pluginSpec = 'bobia_reIndex';
const pluginSpec_enabled = pluginSpec + '_enabled';

const thisPlugin = {};

const promise = callback =>
  new Promise(function(resolve, reject) {
    resolve(callback);
  });

thisPlugin.reIndex = function(callback) {
  if (!this.schema[pluginSpec_enabled]) {
    return this[pluginSpec].reIndexHooked.apply(this, arguments);
  }

  const indexes = this.schema.indexes();

  const privateMethods = {};

  privateMethods.start = () => {
    this.collection.indexes(privateMethods.gotIndexes);
  };

  let existing;

  privateMethods.gotIndexes = function(err, result) {
    void err;

    if (!result) {
      result = [];
    }

    existing = {};

    for (let i in result) {
      existing[result[i].name] = result[i];
    }

    delete existing._id_;
    privateMethods.iterCreate(0);
  };

  privateMethods.iterCreate = (i, recreated) => {
    if (i >= indexes.length) {
      return privateMethods.created();
    }

    const index = indexes[i];

    this.collection.createIndex(index[0], index[1], (err, indexName) => {
      if (err) {
        if (err.code === 85) {
          indexName = (err.err || err.message).match(/:\s(\S+)\s/); //TODO: find better way

          if (!indexName) {
            return privateMethods.finish(err);
          }

          indexName = indexName[1];
        } else {
          log.error(
            '[Error] Mongoose: Collection `' +
              this.collection.name +
              '` ' +
              (err.code === 11000 ? 'contains duplicates ' : '') +
              '(error E' +
              err.code +
              ')' +
              '. Index ' +
              JSON.stringify(index[0]) +
              ' was not created.'
          );
          return privateMethods.finish(err);
        }
      }

      delete existing[indexName];

      if (err) {
        if (recreated) {
          return privateMethods.finish(err);
        }

        privateMethods.reIndex(indexName, i);
      } else {
        privateMethods.iterCreate(i + 1);
      }
    });
  };

  privateMethods.reIndex = (indexName, i) => {
    this.collection.dropIndex(indexName, { background: true }, function(
      err,
      dropped
    ) {
      privateMethods.iterCreate(i, true);
    });
  };

  let toDrop;

  privateMethods.created = function() {
    toDrop = Object.keys(existing);
    privateMethods.iterDrop(0);
  };

  privateMethods.iterDrop = i => {
    if (i >= toDrop.length) {
      return privateMethods.finish();
    }

    const indexName = toDrop[i];

    this.collection.dropIndex(indexName, { background: true }, function(
      err,
      dropped
    ) {
      privateMethods.iterDrop(i + 1);
    });
  };

  privateMethods.finish = err => {
    this.emit('index', err);
    promise(err);
  };

  privateMethods.start();

  return promise(callback);
};

// makes given mongoose object affected by this plugin
function patchMongoose(mongoose) {
  // patch only once
  if (mongoose[pluginSpec]) {
    return false;
  }

  const mongoModel = mongoose.Model;

  // mark mongoose as patched
  mongoose[pluginSpec] = mongoModel[pluginSpec] = {
    mongoose: mongoose,
    reIndexHooked: mongoModel.reIndex
  };

  // hook the reIndex
  mongoModel.ensureIndexes = thisPlugin.reIndex;

  return true;
}

module.exports = function(schema, opts) {
  schema[pluginSpec_enabled] = true;
  patchMongoose(opts.mongoose);
};
