// import pubsub from '../common/subscriptions';
import { authCtr } from '../../mongodb/controllers';
import { unauthenticatedError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import GraphQLJSON from 'graphql-type-json';

export const checkAuthen = async (parents, args, { req }) => {
  let res = await authCtr.checkAuthen(args, req);

  if (res.success === true) {
    return res;
  } else {
    throwError(new unauthenticatedError());
  }
};
export const checkAuthor = async (parents, args, { req }, info) =>
  authCtr.checkAuthor(args, req, info.path.key);

export default {
  JSON: GraphQLJSON,
  Query: {
    checkAuthen: async (parents, args, { req }) =>
      authCtr.checkAuthen(args, req),
    isAllowed: async (parents, args, { req }) => authCtr.isAllowed(args, req)
  },
  Mutation: {
    register: async (parent, args, { SECRET, req }) =>
      authCtr.register(args, SECRET, req),
    login: async (parent, args, { SECRET, req }) =>
      authCtr.login(args, SECRET, req),
    socialLogin: async (parent, args, { SECRET, req }) =>
      authCtr.socialLogin(args, SECRET, req),
    logout: async (parent, args, { req }) => authCtr.logout(req),
    linkAccount: async (parents, args, { req }) =>
      authCtr.linkAccount(args, req)
  }
};
