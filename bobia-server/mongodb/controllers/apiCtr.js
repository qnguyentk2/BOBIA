import models from '../models';
import { internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import search from '../../utils/mongodb/search';

const apiCtr = {
  getAllApis: async (args, req) => {
    const { filters, filtersType, options } = args;

    const apisFound = await models.Api.paginate(
      search(filters, { type: filtersType }),
      {
        ...options
      }
    );

    if (!apisFound) {
      throwError(new internalServerError());
    }

    return {
      success: true,
      apis: apisFound
    };
  },
  createApi: async api => {
    const { name } = api;

    const apiFound = await models.Api.findOne({ name });

    if (apiFound) {
      throwError(
        new internalServerError({
          message: 'API đã tồn tại.'
        })
      );
    }

    const apiCreated = await models.Api.create({
      ...api
    });

    if (!apiCreated) {
      throwError(
        new internalServerError({
          message: 'Tạo mới API thất bại'
        })
      );
    }

    return {
      success: true
    };
  },
  updateApi: async api => {
    const { id, name, description } = api;

    const apiUpdated = await models.Api.findOneAndUpdate(
      { id },
      { name, description },
      {
        new: true
      }
    );

    if (!apiUpdated) {
      throwError(
        new internalServerError({
          message: 'Cập nhật API thất bại'
        })
      );
    }

    return {
      success: true
    };
  },
  deleteApi: async apiId => {
    const apiDeleted = await models.Api.findOneAndUpdate(
      { id: apiId },
      { isDel: true },
      { new: true }
    );

    if (!apiDeleted) {
      throwError(
        new internalServerError({
          message: 'Xoá API thất bại'
        })
      );
    }

    return {
      success: true
    };
  }
};

export { apiCtr };
