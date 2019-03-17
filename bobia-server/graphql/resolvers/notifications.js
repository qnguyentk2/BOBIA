import { withFilter } from 'graphql-subscriptions';
import { userCtr, notificationCtr } from '../../mongodb/controllers';
import { pipeResolvers } from 'graphql-resolvers';
import { checkAuthen, checkAuthor } from './auth';
import pubsub from '../common/subscriptions';

const resolverFunction = {
  Notification: {
    async sender(parents) {
      const data = await userCtr.getUser({ id: parents.sender });
      return data.user;
    },
    async receiver(parents) {
      const data = await userCtr.getUser({ id: parents.receiver });
      return data.user;
    }
  },
  Query: {
    getAllNotifications: async (parents, args, { req }) =>
      notificationCtr.getAllNotifications(args, req)
  },
  Mutation: {
    updateNotification: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args) =>
        notificationCtr.updateNotification(args.notification)
    )
  },
  Subscription: {
    newNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('newNotification'),
        (payload, variables) =>
          notificationCtr.newNotification(payload, variables)
      )
    }
  }
};

export default resolverFunction;
