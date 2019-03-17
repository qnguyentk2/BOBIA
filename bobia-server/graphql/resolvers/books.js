import {
  bookCtr,
  categoryCtr,
  userCtr,
  chapterCtr,
  tagCtr,
  likeCtr,
  favoriteCtr
} from '../../mongodb/controllers';
import { pipeResolvers } from 'graphql-resolvers';
import { checkAuthen, checkAuthor } from './auth';
import Enum from '../../mongodb/models/enum';

const resolveFunctions = {
  Book: {
    async createdUser(parents) {
      const data = await userCtr.getUser({ id: parents.createdUser });
      return data.user;
    },
    async categories(parents) {
      const categoriesFound = await categoryCtr.getAllCategories({
        filters: {
          id: { $in: parents.categories }
        }
      });

      return categoriesFound.categories.docs;
    },
    async latestChapter(parents) {
      const chaptersFound = await chapterCtr.getAllChapters({
        filters: {
          bookId: parents.id,
          partnership: Enum.EnumPartnership.PUBLIC,
          state: Enum.EnumApproveStates.PUBLISHED,
          isDel: false
        },
        filtersType: 'AND',
        options: { limit: 1, orderBy: 'createdAt', dir: 'desc' }
      });

      const docs = chaptersFound.chapters.docs;

      return docs.length ? docs[0] : null;
    },
    sameCategories(parents, { limit = 4 }) {
      return bookCtr.getBookByCategories({
        categoryIds: parents.categories,
        currentId: parents.id,
        limit
      });
    },
    tags(parents) {
      return tagCtr.findByTagIds(parents.tags);
    },
    isCurrentUserLiked(parents, args, { req }) {
      return likeCtr.isCurrentUserLiked('BOOK', parents.id, req);
    },
    isCurrentUserFavorited(parents, args, { req }) {
      return favoriteCtr.isCurrentUserFavorited('BOOK', parents.id, req);
    },
    isCurrentUserSubcribed(parents, args, { req }) {
      return favoriteCtr.isCurrentUserSubcribed('BOOK', parents.id, req);
    },
    async totalChaptersCounts(parents) {
      const chaptersFound = await chapterCtr.getAllChapters({
        filters: {
          bookId: parents.id,
          partnership: Enum.EnumPartnership.PUBLIC,
          state: Enum.EnumApproveStates.PUBLISHED,
          isDel: false
        },
        filtersType: 'AND',
        options: { limit: 0, orderBy: 'createdAt', dir: 'desc' }
      });

      if (!chaptersFound) {
        return {
          views: 0,
          likes: 0,
          comments: 0
        };
      }

      return {
        views: chaptersFound.chapters.docs.reduce(
          (accumulator, currentValue) => accumulator + currentValue.viewCount,
          0
        ),
        likes: chaptersFound.chapters.docs.reduce(
          (accumulator, currentValue) => accumulator + currentValue.likeCount,
          0
        ),
        comments: chaptersFound.chapters.docs.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.commentCount,
          0
        )
      };
    }
  },
  Query: {
    getAllBooks: async (parents, args, { req }) =>
      bookCtr.getAllBooks(args, req),
    getBook: async (parents, args, { req }) => bookCtr.getBook(args.book, req)
  },
  Mutation: {
    createBook: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) => bookCtr.createBook(args.book, req)
    ),
    updateBook: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) => bookCtr.updateBook(args.book, req)
    ),
    updateBookPartnership: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parent, args, { req }) => bookCtr.updateBookPartnership(args, req)
    ),
    deleteBook: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parent, args, { req }) => bookCtr.deleteBook(args, req)
    )
  }
};

export default resolveFunctions;
