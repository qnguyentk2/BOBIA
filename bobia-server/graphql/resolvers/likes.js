import { likeCtr } from '../../mongodb/controllers';
import { pipeResolvers } from 'graphql-resolvers';
import { checkAuthen, checkAuthor } from './auth';

const resolverFunction = {
  Query: {
    getAllLikes: async (parents, args, { req }) =>
      likeCtr.getAllLikes(args, req)
  },
  Mutation: {
    like: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) => likeCtr.like(args.like, req)
    ),
    unlike: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) => likeCtr.unlike(args.unlike, req)
    )
  }
};

export default resolverFunction;
