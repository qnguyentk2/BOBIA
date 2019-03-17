import { viewCtr } from '../../mongodb/controllers';
import { pipeResolvers } from 'graphql-resolvers';
import { checkAuthen, checkAuthor } from './auth';

const resolverFunction = {
  Query: {
    getAllViews: async (parents, args, { req }) =>
      viewCtr.getAllViews(args, req)
  },
  Mutation: {
    increaseView: async (parents, args, { req }) =>
      viewCtr.increaseView(args.view, req)
  }
};

export default resolverFunction;
