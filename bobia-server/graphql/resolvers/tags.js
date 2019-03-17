import { tagCtr } from '../../mongodb/controllers';
import { pipeResolvers } from 'graphql-resolvers';
import { checkAuthen, checkAuthor } from './auth';

const resolverFunction = {
  Query: {
    getAllTags: async (parents, args, { req }) => tagCtr.getAllTags(args, req)
  },
  Mutation: {
    createTag: pipeResolvers(checkAuthen, checkAuthor, async (parents, args) =>
      tagCtr.createTag(args.tag)
    ),
    updateTag: pipeResolvers(checkAuthen, checkAuthor, async (parents, args) =>
      tagCtr.updateTag(args.tag)
    ),
    deleteTag: pipeResolvers(checkAuthen, checkAuthor, async (parents, args) =>
      tagCtr.deleteTag(args.tagId)
    )
  }
};

export default resolverFunction;
