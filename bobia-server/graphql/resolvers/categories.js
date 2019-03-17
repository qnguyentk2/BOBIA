import { categoryCtr } from '../../mongodb/controllers';
import { pipeResolvers } from 'graphql-resolvers';
import { checkAuthen, checkAuthor } from './auth';

const resolveFunctions = {
  Query: {
    getAllCategories: (parent, args, { models }) => {
      return categoryCtr.getAllCategories(args);
    },
    getCategory: async (parents, args, { req }) =>
      categoryCtr.getCategory(args.category, req)
  },
  Mutation: {
    createCategory: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args) => categoryCtr.createCategory(args.category)
    ),
    updateCategory: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args) => categoryCtr.updateCategory(args.category)
    ),
    deleteCategory: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args) => categoryCtr.deleteCategory(args.categoryId)
    )
  }
};

export default resolveFunctions;
