import { createError } from 'apollo-errors';
import { error_401, error_403, error_500 } from '../constant/index';

export const unauthenticatedError = createError('unauthenticatedError', {
  message: error_401.message,
  data: {
    errorCode: error_401.code
  },
  options: {
    showPath: true,
    showLocations: true
  }
});

export const unauthorizedError = createError('unauthorizedError', {
  message: error_403.message,
  data: {
    errorCode: error_403.code
  },
  options: {
    showPath: true,
    showLocations: true
  }
});

export const internalServerError = createError('internalServerError', {
  message: error_500.message,
  data: {
    errorCode: error_500.code
  },
  options: {
    showPath: true,
    showLocations: true
  }
});
