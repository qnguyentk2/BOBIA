import models from '../models';
import { internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';

const rolePermissionCtr = {
  getPermissionByRole: async roleId => {
    const permissionFound = await models.RolePermission.findOne({ roleId });
    let listAPI = [];

    if (permissionFound && permissionFound.api) {
      const listAPIFound = await models.Api.find({
        id: { $in: permissionFound.api }
      });

      if (!listAPIFound) {
        throwError(
          new internalServerError({ message: 'Lấy danh sách API thất bại' })
        );
      }

      listAPI = listAPIFound;
    }

    return {
      success: true,
      listAPI
    };
  },

  updatePermissionForRole: async (roleId, listAPI) => {
    const rolePermissionFound = await models.RolePermission.findOne({ roleId });

    let rolePermissionResult;

    if (rolePermissionFound) {
      rolePermissionResult = await models.RolePermission.findOneAndUpdate(
        { roleId },
        {
          roleId: roleId,
          api: listAPI.map(api => parseInt(api))
        },
        {
          new: true
        }
      );
    } else {
      rolePermissionResult = await models.RolePermission.create({
        roleId: roleId,
        api: listAPI.map(api => parseInt(api))
      });
    }

    if (!rolePermissionResult) {
      throwError(
        new internalServerError({ message: 'Cập nhật quyền thất bại' })
      );
    }

    return {
      success: true
    };
  }
};

export { rolePermissionCtr };
