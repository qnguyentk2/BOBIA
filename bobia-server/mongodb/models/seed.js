import bcrypt from 'bcryptjs';
import * as listCtr from '../controllers';
import models from './index';
import { internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import config from '../../utils/config.dev';
import util from '../../utils/util';

async function createInitData(dataList, type, fieldName) {
  const existDataList = await models[type].find({
    name: { $in: dataList }
  });

  const newDataList = dataList.filter(
    dataItem =>
      !existDataList.some(
        existDataItem => existDataItem[fieldName] === dataItem
      )
  );

  if (!newDataList.length) {
    return {
      success: true,
      dataList
    };
  }

  const dataListCreated = await models[type].create(
    newDataList.map(dataItem => ({ [fieldName]: dataItem }))
  );

  if (!dataListCreated) {
    throwError(
      new internalServerError({
        message: 'Tạo thể loại thất bại'
      })
    );
  }

  return {
    success: true,
    dataList: newDataList
  };
}

async function createPermissions(permissions) {
  const existRoles = await models.Role.find({
    name: { $in: permissions.map(permission => permission.role) }
  });

  const allApis = await models.Api.find();

  const existPermissions = await models.RolePermission.find({
    roleId: { $in: existRoles.map(role => role.id) }
  });

  const newPermissions = existRoles
    .filter(
      role =>
        !existPermissions.some(permission => permission.roleId === role.id)
    )
    .map(role => ({
      roleId: role.id,
      api: allApis
        .filter(api =>
          permissions
            .find(permission => permission.role === role.name)
            .apis.some(roleApi => roleApi === api.name)
        )
        .map(api => api.id)
    }));

  if (!newPermissions.length) {
    await util.asyncForEach(existPermissions, async item => {
      const itemRoleName = existRoles.find(role => role.id === item.roleId)
        .name;
      const updatedPermission = await models.RolePermission.findOneAndUpdate(
        { id: item.id },
        {
          api: allApis
            .filter(api =>
              permissions
                .find(permission => permission.role === itemRoleName)
                .apis.some(roleApi => roleApi === api.name)
            )
            .map(api => api.id)
        },
        { new: true }
      );

      if (!updatedPermission) {
        throwError(
          new internalServerError({
            message: 'Cập nhật phân quyền thất bại'
          })
        );
      }
    });

    return {
      success: true
    };
  }

  const permissionsCreated = await models.RolePermission.create(newPermissions);

  if (!permissionsCreated) {
    throwError(
      new internalServerError({
        message: 'Phân quyền thất bại'
      })
    );
  }

  return {
    success: true
  };
}

async function createUsers(users) {
  const existUsers = await models.User.find({
    username: { $in: users.map(user => user.username) }
  });

  const existRoles = await models.Role.find({
    name: { $in: users.map(user => user.role) }
  });

  const newUsers = users
    .filter(
      user =>
        !existUsers.some(existUser => existUser.username === user.username)
    )
    .map(user => {
      return {
        username: user.username,
        roleId: existRoles.find(role => role.name === user.role).id,
        ...user.data
      };
    });

  if (!newUsers.length) {
    return {
      success: true,
      users
    };
  }

  const usersCreated = await models.User.create(newUsers);

  if (!usersCreated) {
    throwError(
      new internalServerError({
        message: 'Tạo người dùng thất bại'
      })
    );
  }

  return {
    success: true,
    users
  };
}

export default async function createSeedData() {
  const listApi = [];

  for (const key in listCtr) {
    if (listCtr.hasOwnProperty(key)) {
      listApi.push(...Object.keys(listCtr[key]));
    }
  }

  const apisCreated = await createInitData(listApi, 'Api', 'name');

  await createInitData(['ADMIN', 'OFFICER', 'USER'], 'Role', 'name');
  await createPermissions([
    {
      role: 'ADMIN',
      apis: apisCreated.dataList
    },
    {
      role: 'OFFICER',
      apis: apisCreated.dataList
    },
    {
      role: 'USER',
      apis: [
        'createBook',
        'updateBook',
        'updateBookPartnership',
        'deleteBook',
        'createChapter',
        'updateChapter',
        'updateChapterPartnership',
        'deleteChapter',
        'createComment',
        'like',
        'unlike',
        'favorite',
        'unfavorite',
        'subcribe',
        'unsubcribe',
        'follow',
        'unfollow',
        'updateProfile',
        'updateNotification'
      ]
    }
  ]);

  await createUsers([
    {
      username: 'superadmin',
      role: 'ADMIN',
      data: {
        email: 'administrator@bobia.vn',
        password: bcrypt.hashSync(config.SUPERADMIN_PASSWORD, 10),
        firstName: 'Admin',
        lastName: 'Super',
        displayName: 'Super Admin',
        tempSlug: 'Super Admin'
      }
    },
    {
      username: 'officer1',
      role: 'OFFICER',
      data: {
        email: 'officer1@bobia.vn',
        password: bcrypt.hashSync(config.OFFICER_PASSWORD, 10),
        firstName: '1',
        lastName: 'Officer',
        displayName: 'Officer 1',
        tempSlug: 'Officer 1'
      }
    }
  ]);

  await createInitData(
    [
      'Hành Động',
      'Phiêu Lưu',
      'Kinh Dị',
      'Hài Hước',
      'Bí ẩn',
      'Siêu Nhiên',
      'Trinh Thám',
      'LGBT+',
      'Thành Thị (Urban)',
      'Tình Cảm',
      'Viễn Tưởng (Fantasy)',
      'Khoa Học viễn tưởng (Sci-fi)',
      'Lịch Sử',
      'Phi Tiểu Thuyết (Non-fiction)',
      'Thơ',
      'Fanfiction',
      'Teenfiction',
      'Tâm lý Xã Hội',
      'Drama',
      'Cổ điển (classic)',
      'Lịch sử - Cổ Trang (Historical)',
      'Thiếu Nhi',
      'Parody',
      'Review',
      'Random (Ngẫu Nhiên)',
      'Hướng dẫn (Guide)',
      'Thần thoại (Mythology)',
      'Truyện Ngắn',
      'Truyện Dịch',
      'Tâm Linh'
    ],
    'Category',
    'name'
  );

  await createInitData(['Hướng dẫn'], 'Topic', 'name');
}
