import { followCtr } from '../../mongodb/controllers';
import { pipeResolvers } from 'graphql-resolvers';
import { checkAuthen, checkAuthor } from './auth';

const resolverFunction = {
  Query: {
    getAllFollows: async (parents, args, { req }) =>
      followCtr.getAllFollows(args, req),
    getAllFollowings: async (parents, args, { req }) =>
      followCtr.getAllFollowings(args, req),
    getAllFollowers: async (parents, args, { req }) =>
      followCtr.getAllFollowers(args, req)
  },
  Mutation: {
    follow: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) => followCtr.follow(args.follow, req)
    ),
    unfollow: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) => followCtr.unfollow(args.unfollow, req)
    )
  }
};

export default resolverFunction;
