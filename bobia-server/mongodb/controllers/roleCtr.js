import models from '../models';
import { internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import search from '../../utils/mongodb/search';

const roleCtr = {
  getAllRoles: async args => {
    const { filters, filtersType, options } = args;

    const rolesFound = await models.Role.paginate(
      search(filters, { type: filtersType }),
      {
        ...options
      }
    );

    if (!rolesFound) {
      throwError(
        new internalServerError({
          message: 'Tìm danh sách vai trò thất bại.'
        })
      );
    }

    return {
      success: true,
      roles: rolesFound
    };
  },
  getRole: async (args, req) => {
    const roleFound = await models.Role.findOne(args);

    if (!roleFound) {
      throwError(
        new internalServerError({
          message: 'Tìm vai trò thất bại.'
        })
      );
    }

    return {
      success: true,
      role: roleFound
    };
  },
  createRole: async role => {
    const { name } = role;

    const roleFound = await models.Role.findOne({ name });

    if (roleFound) {
      throwError(
        new internalServerError({
          message: 'Vai trò đã tồn tại.'
        })
      );
    }

    const roleCreated = await models.Role.create({
      ...role
    });

    if (!roleCreated) {
      throwError(
        new internalServerError({
          message: 'Tạo mới vai trò thất bại'
        })
      );
    }

    return {
      success: true
    };
  },
  updateRole: async role => {
    const { id, name, description } = role;

    const roleUpdated = await models.Role.findOneAndUpdate(
      { id },
      { name, description },
      {
        new: true
      }
    );

    if (!roleUpdated) {
      throwError(
        new internalServerError({
          message: 'Cập nhật vai trò thất bại'
        })
      );
    }

    return {
      success: true
    };
  },
  deleteRole: async roleId => {
    const roleDeleted = await models.Role.findOneAndUpdate(
      { id: roleId },
      { isDel: true },
      { new: true }
    );

    if (!roleDeleted) {
      throwError(
        new internalServerError({
          message: 'Xoá vai trò thất bại'
        })
      );
    }

    return {
      success: true
    };
  }
};

export { roleCtr };
