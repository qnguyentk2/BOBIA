import { searchCtr } from '../../mongodb/controllers';
import { pipeResolvers } from 'graphql-resolvers';
import { checkAuthen, checkAuthor } from './auth';

const resolverFunction = {
  Query: {
    search: async (parents, args, { req }) => searchCtr.search(args, req)
  }
};

export default resolverFunction;
