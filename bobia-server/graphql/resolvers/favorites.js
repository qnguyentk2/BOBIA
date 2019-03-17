import { favoriteCtr } from '../../mongodb/controllers';
import { pipeResolvers } from 'graphql-resolvers';
import { checkAuthen, checkAuthor } from './auth';
import util from '../../utils/util';

const resolverFunction = {
  FavoriteSubjectsDocs: {
    __resolveType(parents, context, info) {
      return util.toTitleCase(info.variableValues.filters.type);
    }
  },
  Query: {
    getAllFavorites: async (parents, args, { req }) =>
      favoriteCtr.getAllFavorites(args, req),
    getAllFavoriteSubjects: async (parents, args, { req }) =>
      favoriteCtr.getAllFavoriteSubjects(args, req)
  },
  Mutation: {
    favorite: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) => favoriteCtr.favorite(args.favorite, req)
    ),
    unfavorite: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) =>
        favoriteCtr.unfavorite(args.unfavorite, req)
    ),
    subcribe: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) => favoriteCtr.subcribe(args.subcribe, req)
    ),
    unsubcribe: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) =>
        favoriteCtr.unsubcribe(args.unsubcribe, req)
    )
  }
};

export default resolverFunction;
