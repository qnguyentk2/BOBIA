import { authorizationError } from '../../utils/errors';
import { authCtr } from '../../mongodb/controllers';
import { throwError } from '../../utils/logger';

export const checkAuthen = ({ req }) => authCtr.checkAuthen(req);

export default {
  isAuthenticated: (next, source, args, context) => {
    const { success } = checkAuthen(context);
    if (!success) {
      throwError(
        new authorizationError({
          message: `You are not authorized. Expected scopes: ${expectedScopes.join(
            ', '
          )}`
        })
      );
    }
    return next();
  },
  hasScope(next, source, args, context) {
    const expectedScopes = args.scopes;
    try {
      const scopes = ['read:user'];
      if (expectedScopes.some(scope => scopes.indexOf(scope) !== -1)) {
        return next();
      }
    } catch (err) {
      throwError(
        new authorizationError({
          message: `You are not authorized. Expected scopes: ${expectedScopes.join(
            ', '
          )}`
        })
      );
    }
  }
};
