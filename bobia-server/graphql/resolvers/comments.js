import _ from 'lodash';
import { userCtr, commentCtr, likeCtr } from '../../mongodb/controllers';
import { pipeResolvers } from 'graphql-resolvers';
import { checkAuthen, checkAuthor } from './auth';

const resolverFunctions = {
  Comment: {
    createdUser: async (parents, args, { req }) => {
      const userFound = await userCtr.getUser({ id: parents.user });
      return userFound.user;
    },
    isCurrentUserLiked: (parents, args, { req }) =>
      likeCtr.isCurrentUserLiked('COMMENT', parents.id, req),
    replyCount: (parents, args, { req }) => commentCtr.countReply(parents)
  },
  Query: {
    getAllComments: (parents, args, { req }) =>
      commentCtr.getAllComments(args, req)
  },
  Mutation: {
    createComment: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) =>
        commentCtr.createComment(args.comment, req)
    )
  }
};

export default resolverFunctions;
