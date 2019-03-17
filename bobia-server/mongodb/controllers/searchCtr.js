import models from '../models';
import { internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import search from '../../utils/mongodb/search';
import util from '../../utils/util';

const searchCtr = {
  search: async (args, req) => {
    const { queries } = args;
    const result = {};

    if (Object.keys(queries).length === 0) {
      result.type = 'all';
    } else {
      switch (queries.type) {
        case 'all':
        case '*':
          result.type = 'all';
          break;
        case 'book':
          result.type = 'book';
          break;
        default:
          result.type = 'invalid';
          break;
      }
    }

    switch (result.type) {
      case 'all':
        result.data = await searchCtr.searchAll(args.queries, req);
        break;
      case 'invalid':
        throwError(new internalServerError());
        break;
      default:
        result.data = await searchCtr[
          `search${util.toTitleCase(result.type)}s`
        ](args.queries, req);
        break;
    }

    return {
      success: true,
      result
    };
  },
  searchByType: async (type, args) => {
    const resultsFound = await models[type].paginate(args.filters, args);

    if (!resultsFound) {
      throwError(new internalServerError());
    }

    return resultsFound;
  },
  searchAll: async (args, req) => {
    const currentArgs = { ...args };

    if (!args.filters) {
      currentArgs.searchPhrase = currentArgs.keyword;
    }

    const booksFound = await searchCtr.searchByType('Book', currentArgs);

    if (!args.filters) {
      currentArgs.searchPhrase = currentArgs.keyword;
    }

    const authorsFound = await searchCtr.searchByType('User', currentArgs);

    return {
      books: { ...booksFound },
      authors: { ...authorsFound }
    };
  },
  searchBooks: async (args, req) => {
    const currentArgs = { ...args };
    let booksFound;
    let populateMatch;

    if (!currentArgs.keyword) {
      booksFound = await searchCtr.searchByType('Book', currentArgs);
    } else {
      let bookKind;

      switch (currentArgs.kind) {
        case 'title':
          bookKind = 'title';
          break;
        case 'author':
          bookKind = 'author';
          break;
        case 'tag':
          bookKind = 'tag';
          break;
        case 'category':
          bookKind = 'category';
          if (currentArgs.slug) {
            populateMatch = {
              slug: currentArgs.slug
            };
          }
          break;
        case 'all':
        case '*':
        default:
          bookKind = 'all';
          break;
      }

      const mapTypeToKind = {
        all: {
          type: 'Book'
        },
        title: {
          type: 'Book',
          field: 'title'
        },
        author: {
          type: 'User',
          foreignField: 'displayName',
          field: 'createdUser'
        },
        tag: {
          type: 'Tag',
          foreignField: 'name',
          field: 'tags',
          exact: true
        },
        category: {
          type: 'Category',
          foreignField: 'id',
          field: 'categories',
          populateMatch
        }
      };

      if (bookKind === 'all') {
        currentArgs.searchPhrase = currentArgs.keyword;

        booksFound = await searchCtr.searchByType('Book', currentArgs);
      } else if (bookKind === 'title') {
        currentArgs.filters = search({
          [mapTypeToKind[bookKind].field]: currentArgs.keyword
        });

        booksFound = await searchCtr.searchByType(
          mapTypeToKind[bookKind].type,
          currentArgs
        );
      } else {
        // let fromOtherCollection;

        // currentArgs.filters = search({
        //   [mapTypeToKind[bookKind].foreignField]: currentArgs.keyword
        // });

        // fromOtherCollection = await searchCtr.searchByType(
        //   mapTypeToKind[bookKind].type,
        //   currentArgs
        // );

        // booksFound = await models.Book.paginate({
        //   [mapTypeToKind[bookKind].field]: {
        //     $in: fromOtherCollection.docs.map(el => el.id)
        //   }
        // });
        currentArgs.populate = bookKind;
        if (mapTypeToKind[bookKind].exact) {
          currentArgs.populateSearchExact = true;
        }
        if (mapTypeToKind[bookKind].populateMatch) {
          currentArgs.populateMatch = mapTypeToKind[bookKind].populateMatch;
        }
        currentArgs.populateSearchPhrase = currentArgs.keyword;
        // {
        //   path: bookKind,
        //   match: {
        //     $text: {
        //       $search: currentArgs.keyword
        //     },
        //     key: value
        //   }
        // };

        booksFound = await models['Book'].paginate({}, currentArgs);
        // booksFound = await models['Book'].find().populate({
        //   path: bookKind,
        //   // match: {
        //   //   $text: {
        //   //     $search: currentArgs.keyword
        //   //   }
        //   // }
        //   match: { [mapTypeToKind[bookKind].foreignField]: currentArgs.keyword }
        // });
        // booksFound = booksFound.filter(obj => obj[`${bookKind}`].length > 0);
      }
    }

    if (booksFound.length === 0) {
      throwError(new internalServerError());
    }

    return {
      books: booksFound
    };
  }
};

export { searchCtr };
