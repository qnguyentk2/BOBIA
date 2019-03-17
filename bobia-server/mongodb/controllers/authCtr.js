import _ from 'lodash';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import models from '../models';
import rules from '../../utils/validation/rules';
import {
  unauthenticatedError,
  unauthorizedError,
  internalServerError
} from '../../utils/errors';
import { throwError } from '../../utils/logger';
import config from '../../utils/config.dev';

const { isEmail, isObjectEmpty } = rules;
export function isOwner(userId, req) {
  let oldIdUser = '';

  if (req && req.session && req.session.user && req.session.user.id) {
    oldIdUser = req.session.user.id;
  }

  return userId === oldIdUser;
}
const getApiPermissionByUser = async roleId => {
  let listArray = [];
  let rolePermissions = await models.RolePermission.findOne({
    roleId: roleId
  });
  if (rolePermissions && rolePermissions.api) {
    listArray = rolePermissions.api;
  }
  return listArray;
};
const authCtr = {
  getTokens: ({ id }, SECRET) => {
    const token = jwt.sign({ iat: Date.now(), userId: id }, SECRET, {
      expiresIn: '7d'
    });
    return token;
  },
  checkToken: async (token, req) => {
    const { userId } = jwt.decode(token);
    const userFound = await models.User.findOne({ id: userId });
    const authen = await models.Auth.findOne({
      userId: userId,
      token,
      device: req.device.type
    });

    const bannerFound = await models.Banner.findOne({
      isActive: true
    });

    if (userFound && authen) {
      req.session.user = userFound;
      const newAuth = await authCtr.addAuthTable(token, req, authen.type);

      if (!newAuth) {
        throwError(new unauthenticatedError());
      }

      return {
        success: true,
        banner: bannerFound,
        user: _.omit(userFound, 'password')
      };
    } else {
      return {
        success: false,
        banner: bannerFound
      };
    }
  },
  isAllowed: async (args, req) => {
    const sessionApiIdList = req.session.user.apis;
    return sessionApiIdList
      ? args.apiList.map(apiName => {
          const apiFound = models.Api.find({ name: apiName });
          return {
            apiName: apiName,
            isAllow: sessionApiIdList.includes(apiFound ? apiFound.id : '-1')
          };
        })
      : [];
  },
  checkPortal: async (portal, req) => {
    const currentSession = req.session;

    if (currentSession && currentSession.user) {
      if (portal && portal === 'OFFICE') {
        const roleFound = await models.Role.findOne({
          id: currentSession.user.roleId
        });

        if (!roleFound) {
          return {
            success: false
          };
        }

        if (!config.BACK_OFFICE_ROLE.includes(roleFound.name)) {
          return {
            success: false
          };
        }

        return {
          success: true
        };
      }

      return {
        success: true
      };
    }

    return {
      success: true
    };
  },
  checkAuthen: async ({ token, portal }, req) => {
    const currentSession = req.session;
    const bannerFound = await models.Banner.findOne({
      isActive: true
    });

    const portalChecked = await authCtr.checkPortal(portal, req);

    if (!portalChecked.success) {
      throwError(
        new unauthorizedError({
          message: 'Bạn không có quyền truy cập trang này.'
        })
      );
    }

    if (currentSession && currentSession.user) {
      return {
        success: true,
        banner: bannerFound,
        user: _.omit(currentSession.user, 'password')
      };
    } else if (token) {
      return await authCtr.checkToken(token, req);
    } else {
      return {
        success: false,
        banner: bannerFound
      };
    }
  },
  checkAuthor: async (args, req, apiName) => {
    let sessionApiIdList = [];

    if (req && req.session && req.session.user && req.session.user.roleId) {
      sessionApiIdList = await getApiPermissionByUser(req.session.user.roleId);
    }

    const apiFound = await models.Api.findOne({ name: apiName });
    if (!apiFound || !sessionApiIdList.includes(apiFound.id)) {
      throwError(
        new unauthorizedError({
          message: 'Bạn không có quyền sử dụng tính năng này.'
        })
      );
    }
  },
  socialLogin: async (args, SECRET, req) => {
    let user;
    let isNew = false;
    let socialKey = '';
    let authKey = '';
    const { socialUser, portal } = args;
    const profile = socialUser._profile;
    switch (socialUser._provider) {
      case 'google':
        socialKey = 'googleId';
        authKey = 'Google';
        break;
      case 'facebook': {
        socialKey = 'facebookId';
        authKey = 'FaceBook';
        break;
      }
    }

    user = await models.User.findOne({
      [`${socialKey}`]: profile.id
    });

    if (!user) {
      isNew = true;
      const dataUser = {
        firstname: profile.firstName,
        lastname: profile.lastName,
        displayName: `${profile.lastName} ${profile.firstName}`,
        [`${socialKey}`]: profile.id,
        profileUrl: profile.profilePicURL,
        tempSlug: `${profile.lastName} ${profile.firstName}`
      };

      const userRole = await models.Role.findOne({ name: 'USER' });

      dataUser.roleId = userRole.id;

      user = await models.User.create(dataUser);
    }

    const token = authCtr.getTokens(user, SECRET);
    req.session.user = user;

    const portalChecked = await authCtr.checkPortal(portal, req);

    if (!portalChecked.success) {
      throwError(
        new unauthorizedError({
          message: 'Bạn không có quyền truy cập trang này.'
        })
      );
    }

    const newAuth = await authCtr.addAuthTable(token, req, authKey);

    if (!newAuth) {
      throwError(new unauthenticatedError());
    }

    const bannerFound = await models.Banner.findOne({
      isActive: true
    });

    return {
      success: true,
      token,
      banner: bannerFound,
      user: _.omit(user, 'password'),
      isNew
    };
  },
  linkAccount: async (args, req) => {
    let socialKey;
    switch (args.provider) {
      case 'google':
        socialKey = 'googleId';
        break;
      case 'facebook': {
        socialKey = 'facebookId';
        break;
      }
    }
    let user = await models.user.findOne({ [`${socialKey}`]: args.id });
    if (user) {
      throwError(
        new internalServerError({
          message: 'Tài khoản đã tồn tại.'
        })
      );
    }

    if (req.session.user) {
      user = await models.user.findOne({ id: req.session.user.id }, function(
        err,
        doc
      ) {
        if (args.provider === 'google') doc.googleId = args.id;
        if (args.provider === 'facebook') doc.facebookId = args.id;
        doc.save();
      });
    } else {
      throwError(
        new internalServerError({
          message: 'Không tìm thấy tài khoản cần đồng bộ.'
        })
      );
    }
    return {
      success: true
    };
  },
  login: async (args, SECRET, req, isRegister = false) => {
    const {
      usernameOrEmail,
      username,
      email,
      password,
      remember_me,
      portal
    } = args;
    let userFound;
    let condition = {};

    if (isRegister) {
      if (isObjectEmpty(condition) && username) {
        condition.username = username;
      }

      if (isObjectEmpty(condition) && email) {
        condition.email = email;
      }
    } else {
      isEmail(usernameOrEmail)
        ? (condition.email = usernameOrEmail)
        : (condition.username = usernameOrEmail);
    }

    if (isObjectEmpty(condition)) {
      throwError(
        new internalServerError({
          message: 'Chưa điền thông tin đăng nhập.'
        })
      );
    }

    if (usernameOrEmail && usernameOrEmail.length < 5) {
      throwError(
        new internalServerError({
          message: 'Tên đăng nhập hoặc email tối thiểu 5 ký tự.'
        })
      );
    }

    if (password && password.length < 8) {
      throwError(
        new internalServerError({
          message: 'Mật khẩu tối thiểu 8 ký tự.'
        })
      );
    }

    userFound = await models.User.findOne(condition);

    if (!userFound) {
      throwError(
        new internalServerError({
          message: 'Tài khoản không tồn tại.'
        })
      );
    }

    let isPasswordMatched;

    if (!userFound.password) {
      throwError(
        new internalServerError({
          message: 'Sai mật khẩu'
        })
      );
    }

    if (isRegister) {
      isPasswordMatched = password === userFound.password;
    } else {
      isPasswordMatched = bcrypt.compareSync(password, userFound.password);
    }

    if (!isPasswordMatched) {
      throwError(
        new internalServerError({
          message: 'Sai mật khẩu'
        })
      );
    }

    let token = '';
    req.session.user = userFound;

    const portalChecked = await authCtr.checkPortal(portal, req);

    if (!portalChecked.success) {
      throwError(
        new unauthorizedError({
          message: 'Bạn không có quyền truy cập trang này.'
        })
      );
    }

    if (remember_me === true) {
      token = authCtr.getTokens(userFound, SECRET);
      const newAuth = await authCtr.addAuthTable(token, req);

      if (!newAuth) {
        throwError(new internalServerError());
      }
    }

    const bannerFound = await models.Banner.findOne({
      isActive: true
    });

    return {
      success: true,
      token,
      banner: bannerFound,
      user: _.omit(userFound, 'password')
    };
  },
  register: async (args, SECRET, req) => {
    const {
      username,
      firstname,
      lastname,
      nickname,
      email,
      displayName,
      password,
      phoneNumber,
      address,
      birthDate,
      identifyNumber,
      gender
    } = args.user;

    if (username && username.length < 5) {
      throwError(
        new internalServerError({
          message: 'Tên đăng nhập tối thiểu 5 ký tự.'
        })
      );
    }

    if (password && password.length < 8) {
      throwError(
        new internalServerError({
          message: 'Mật khẩu tối thiểu 8 ký tự.'
        })
      );
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    let dataUser = {
      username,
      firstname,
      lastname,
      nickname,
      displayName,
      password: hashPassword,
      phoneNumber,
      address,
      birthDate,
      identifyNumber,
      gender,
      tempSlug: username
    };

    if (email) {
      dataUser.email = email;
    }

    const userRole = await models.Role.findOne({ name: 'USER' });

    dataUser.roleId = userRole.id;

    const userCreated = await models.User.create(dataUser);

    if (!userCreated) {
      throwError(new internalServerError());
    }

    const login = await authCtr.login(userCreated, SECRET, req, true);

    if (!login.success) {
      throwError(new internalServerError());
    }

    return {
      success: true,
      token: login.token,
      banner: login.banner,
      user: login.user
    };
  },
  logout: async req => {
    if (req.session && req.session.user) {
      models.Auth.findOneAndRemove({
        userId: req.session.user.id
      });

      req.session.destroy();

      return {
        success: true
      };
    } else {
      throwError(new unauthenticatedError());
    }
  },
  addAuthTable: async (token, req, type = 'BOBIA') => {
    let ip =
      (req.headers['x-forwarded-for'] || '').split(',').shift() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const { exp } = jwt.decode(token);
    let data = {
      token: token,
      type: type,
      expiredDate: exp,
      ipAddress: ip,
      device: req.device.type,
      userId: req.session.user.id,
      sessionId: req.session.sessionId
    };

    const authFound = await models.Auth.findOne({
      userId: req.session.user.id,
      token,
      device: req.device.type
    });

    if (!authFound) {
      const authCreated = await models.Auth.create(data);

      if (!authCreated) {
        throwError(
          new internalServerError({
            message: 'Tạo mới xác thực thất bại.'
          })
        );
      }
      return authCreated;
    } else {
      const authUpdated = await models.Auth.findOneAndUpdate(
        { userId: req.session.user.id, token, device: req.device.type },
        data,
        { new: true }
      );

      if (!authUpdated) {
        throwError(
          new internalServerError({
            message: 'Cập nhật xác thực thất bại.'
          })
        );
      }
      return authUpdated;
    }
  }
};

export { authCtr };
