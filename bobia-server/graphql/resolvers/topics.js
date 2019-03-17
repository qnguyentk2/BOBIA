import { topicCtr } from '../../mongodb/controllers';
import { pipeResolvers } from 'graphql-resolvers';
import { checkAuthen, checkAuthor } from './auth';

const resolveFunctions = {
  Query: {
    getAllTopics: (parent, args, { models }) => {
      return topicCtr.getAllTopics(args);
    },
    getTopic: async (parents, args, { req }) =>
      topicCtr.getTopic(args.topic, req)
  },
  Mutation: {
    createTopic: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args) => topicCtr.createTopic(args.topic)
    ),
    updateTopic: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args) => topicCtr.updateTopic(args.topic)
    ),
    deleteTopic: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args) => topicCtr.deleteTopic(args.topicId)
    )
  }
};

export default resolveFunctions;
