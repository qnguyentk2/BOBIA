import util from '../util';
/* 
query: condition to search in the main Modal
options{
  populate: name of virtuals(relationship set up in Modal)  | default: null (don't use populate)
  populateSearchExact: use with populateSearchPhrase, true: setting full text search to search with the exact same phrase 
                                                      (search all field that have text index and includes same searchPhrase)
                                                null/false: normal full text search (case insensitive)
  populateSearchPhrase: input text to full text search in the sub Modal (populate)
  populateMatch: same as query but for sub Modal (populate) | default: {}
  searchExact: use with searchPhrase, true: setting full text search to search with the exact same phrase 
                                      (search all field that have text index and includes same searchPhrase)
                                null/false: normal full text search (case insensitive)
  searchPhrase: input text to full text search in main Modal (can be used at the same time with query)
  limit: number of records each page | default: 10
  page: the wanted record page
  dir: order by asc or desc
  orderBy: field use to sort | default: createddAt
}
*/
async function paginate(query = {}, options) {
  const limit = options.limit || options.limit === 0 ? options.limit : 10;
  const page = options.page || 1;
  const skip = (page - 1) * limit;
  const dir = options.dir || 'asc';
  const populate = options.populate;
  const orderBy = options.orderBy || 'createdAt';
  const populateMatch = options.populateMatch || {};
  let sort;
  let projection = null;

  if (options.searchPhrase) {
    query = {
      $text: {
        $search: options.searchExact
          ? util.phaseSearchString(options.searchPhrase)
          : options.searchPhrase
      },
      ...query
    };
    sort = { score: { $meta: 'textScore' } };
    projection = { score: { $meta: 'textScore' } };
  } else {
    sort = { [orderBy]: dir };
  }

  let docs;
  let countDocuments = 0;

  if (populate) {
    if (options.populateSearchPhrase) {
      docs = await this.find(query, projection).populate({
        path: populate,
        match: {
          $text: {
            $search: options.populateSearchExact
              ? util.phaseSearchString(options.populateSearchPhrase)
              : options.populateSearchPhrase
          },
          ...populateMatch
        }
      });
    } else {
      docs = await this.find(query, projection).populate({
        path: populate,
        match: {
          ...populateMatch
        }
      });
    }

    let ids = docs
      .filter(obj => obj[`${populate}`].length > 0)
      .map(obj => obj['_id']);

    docs = await this.find({ _id: { $in: ids } })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    countDocuments = await this.countDocuments({ _id: { $in: ids } }).exec();
  } else {
    docs = await this.find(query, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    countDocuments = await this.countDocuments(query).exec();
  }

  return {
    docs,
    total: countDocuments,
    limit,
    page,
    pages: Math.ceil(countDocuments / (limit === 0 ? 1 : limit)) || 1
  };
}

module.exports = function(schema) {
  schema.statics.paginate = paginate;
};

module.exports.paginate = paginate;
