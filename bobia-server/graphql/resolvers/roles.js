import { authCtr, roleCtr, rolePermissionCtr } from '../../mongodb/controllers';
import { pipeResolvers } from 'graphql-resolvers';
import { checkAuthen, checkAuthor } from './auth';

const resolveFunctions = {
  Query: {
    getAllRoles: async (parents, args, { req }) =>
      roleCtr.getAllRoles(args, req),
    getPermissionByRole: async (parent, args) =>
      rolePermissionCtr.getPermissionByRole(args.roleId)
  },
  Mutation: {
    createRole: pipeResolvers(checkAuthen, checkAuthor, async (parents, args) =>
      roleCtr.createRole(args.role)
    ),
    updateRole: pipeResolvers(checkAuthen, checkAuthor, async (parents, args) =>
      roleCtr.updateRole(args.role)
    ),
    deleteRole: pipeResolvers(checkAuthen, checkAuthor, async (parents, args) =>
      roleCtr.deleteRole(args.roleId)
    ),
    updatePermissionForRole: pipeResolvers(
      checkAuthen,
      checkAuthor,
      (parent, args) => {
        return rolePermissionCtr.updatePermissionForRole(
          args.roleId,
          args.listAPI
        );
      }
    )
  }
};

export default resolveFunctions;
