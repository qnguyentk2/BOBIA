import { userCtr, roleCtr, followCtr } from '../../mongodb/controllers';
import { pipeResolvers } from 'graphql-resolvers';
import { checkAuthen, checkAuthor } from './auth';

export default {
  User: {
    viewCount(parents, args, { req }) {
      return userCtr.getViewCount(parents.id);
    },
    likeCount(parents, args, { req }) {
      return userCtr.getLikeCount(parents.id);
    },
    isCurrentUserFollowed(parents, args, { req }) {
      return followCtr.isCurrentUserFollowed(parents.id, req);
    },
    async role(parents, args, { req }) {
      const roleFound = await roleCtr.getRole({ id: parents.roleId });
      return roleFound.role.name;
    }
  },
  Query: {
    getAllUsers: async (parents, args, { req }) =>
      userCtr.getAllUsers(args, req),
    getUser: async (parents, args, { req }) => userCtr.getUser(args.user, req)
  },
  Mutation: {
    updateProfile: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args, { req }) => userCtr.updateProfile(args.user, req)
    ),
    createUser: pipeResolvers(checkAuthen, async (parents, args) =>
      userCtr.createUser(args.user)
    ),
    updateUser: pipeResolvers(checkAuthen, checkAuthor, async (parents, args) =>
      userCtr.updateUser(args.user)
    ),
    deleteUser: pipeResolvers(checkAuthen, checkAuthor, async (parents, args) =>
      userCtr.deleteUser(args.userSlug)
    ),
    resetPassword: pipeResolvers(
      checkAuthen,
      checkAuthor,
      async (parents, args) => userCtr.deleteUser(args.userSlug)
    )
  }
};
