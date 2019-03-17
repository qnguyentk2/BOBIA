import { apiCtr } from '../../mongodb/controllers';
import { pipeResolvers } from 'graphql-resolvers';
import { checkAuthen, checkAuthor } from './auth';

const resolverFunction = {
  Query: {
    getAllApis: async (parents, args, { req }) => apiCtr.getAllApis(args, req)
  },
  Mutation: {
    createApi: pipeResolvers(checkAuthen, checkAuthor, async (parents, args) =>
      apiCtr.createApi(args.api)
    ),
    updateApi: pipeResolvers(checkAuthen, checkAuthor, async (parents, args) =>
      apiCtr.updateApi(args.api)
    ),
    deleteApi: pipeResolvers(checkAuthen, checkAuthor, async (parents, args) =>
      apiCtr.deleteApi(args.apiId)
    )
  }
};

export default resolverFunction;
