import {
  userCtr,
  chapterCtr,
  commentCtr,
  bookCtr,
  likeCtr,
  followCtr
} from '../../mongodb/controllers';
import { pipeResolvers } from 'graphql-resolvers';
import { checkAuthen, checkAuthor } from './auth';

const resolverFunctions = {
  Chapter: {
    async createdUser(parents) {
      const data = await userCtr.getUser({ id: parents.createdUser });
      return data.user;
    },
    book: async parents => {
      const result = await bookCtr.getBook({ id: parents.bookId });
      return result.book;
    },
    isCurrentUserLiked(parents, args, { req }) {
      return likeCtr.isCurrentUserLiked('CHAPTER', parents.id, req);
    }
  },
  Query: {
    getAllChapters: async (parents, args, { req }) =>
      chapterCtr.getAllChapters(args, req),
    getChapter: async (parents, args, { req }) =>
      chapterCtr.getChapter(args.chapter, req)
  },
  Mutation: {
    createChapter: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) =>
        chapterCtr.createChapter(args.chapter, req)
    ),
    updateChapter: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) =>
        chapterCtr.updateChapter(args.chapter, req)
    ),
    updateChapterPartnership: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parent, args, { req }) =>
        chapterCtr.updateChapterPartnership(args, req)
    ),
    deleteChapter: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parent, args, { req }) => chapterCtr.deleteChapter(args, req)
    ),
    approveChapter: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parent, args) => chapterCtr.approveChapter(args)
    ),
    refuseChapter: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) =>
        chapterCtr.refuseChapter(args.chapter, req)
    )
  }
};

export default resolverFunctions;
