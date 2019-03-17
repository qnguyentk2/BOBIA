import {
  blogCtr,
  topicCtr,
  userCtr,
  tagCtr,
  likeCtr
} from '../../mongodb/controllers';
import { pipeResolvers } from 'graphql-resolvers';
import { checkAuthen, checkAuthor } from './auth';

const resolveFunctions = {
  Blog: {
    async createdUser(parents) {
      const data = await userCtr.getUser({ id: parents.createdUser });
      return data.user;
    },
    async topics(parents) {
      const topicsFound = await topicCtr.getAllTopics({
        filters: {
          id: { $in: parents.topics }
        }
      });

      return topicsFound.topics.docs;
    },
    sameTopics(parents, { limit = 4 }) {
      return blogCtr.getBlogByTopics({
        topicIds: parents.topics,
        currentId: parents.id,
        limit
      });
    },
    tags(parents) {
      return tagCtr.findByTagIds(parents.tags);
    },
    isCurrentUserLiked(parents, args, { req }) {
      return likeCtr.isCurrentUserLiked('BOOK', parents.id, req);
    }
  },
  Query: {
    getAllBlogs: async (parents, args, { req }) =>
      blogCtr.getAllBlogs(args, req),
    getBlog: async (parents, args, { req }) => blogCtr.getBlog(args.blog, req)
  },
  Mutation: {
    createBlog: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) => blogCtr.createBlog(args.blog, req)
    ),
    updateBlog: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) => blogCtr.updateBlog(args.blog, req)
    ),
    updateBlogPartnership: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parent, args, { req }) => blogCtr.updateBlogPartnership(args, req)
    ),
    deleteBlog: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parent, args, { req }) => blogCtr.deleteBlog(args, req)
    )
  }
};

export default resolveFunctions;
