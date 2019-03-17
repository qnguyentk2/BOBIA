import bcrypt from 'bcryptjs';
import models from '../models';
import { uploadCtr } from '../../mongodb/controllers';
import { internalServerError } from '../../utils/errors';
import util from '../../utils/util';
import { throwError } from '../../utils/logger';
import search from '../../utils/mongodb/search';
import { isOwner } from './authCtr';

const userCtr = {
  getAllUsers: async args => {
    const { filters, filtersType, options } = args;

    const usersFound = await models.User.paginate(
      search(filters, { type: filtersType }),
      {
        ...options
      }
    );

    if (!usersFound) {
      throwError(new internalServerError());
    }

    return {
      success: true,
      users: usersFound
    };
  },
  getUser: async (args, req) => {
    const userFound = await models.User.findOne(args);

    if (!userFound) {
      throwError(new internalServerError());
    }

    userFound.password = userFound.password ? true : false;

    return {
      success: true,
      user: userFound,
      isOwner: isOwner(userFound.id, req)
    };
  },
  updateProfile: async (args, req) => {
    const {
      username,
      displayName,
      nickname,
      firstname,
      lastname,
      email,
      phoneNumber,
      address,
      birthDate,
      identifyNumber,
      gender,
      oldPassword,
      newPassword,
      confirm_newPassword,
      profileUrl
    } = args;
    let hashPassword;
    const id = req.session.user.id;

    let dataUser = {
      displayName,
      nickname,
      firstname,
      lastname,
      phoneNumber,
      address,
      birthDate,
      identifyNumber,
      gender
    };

    if (oldPassword) {
      if (oldPassword.length < 8) {
        throwError(
          new internalServerError({
            message: 'Mật khẩu cũ tối thiểu 8 ký tự.'
          })
        );
      }

      if (!bcrypt.compareSync(oldPassword, req.session.user.password)) {
        throwError(
          new internalServerError({
            message: 'Sai mật khẩu cũ.'
          })
        );
      } else if (newPassword === oldPassword) {
        throwError(
          new internalServerError({
            message: 'Mật khẩu cũ không được trùng mật khẩu mới.'
          })
        );
      } else if (confirm_newPassword !== newPassword) {
        throwError(
          new internalServerError({
            message: 'Mật khẩu nhập lại không trùng khớp.'
          })
        );
      } else {
        if (newPassword && confirm_newPassword) {
          hashPassword = bcrypt.hashSync(newPassword, 10);
        } else {
          hashPassword = req.session.user.password;
        }
      }
    } else {
      if (newPassword) {
        if (newPassword.length < 8) {
          throwError(
            new internalServerError({
              message: 'Mật khẩu mới tối thiểu 8 ký tự.'
            })
          );
        }

        if (newPassword === oldPassword) {
          throwError(
            new internalServerError({
              message: 'Mật khẩu cũ không được trùng mật khẩu mới.'
            })
          );
        } else if (confirm_newPassword !== newPassword) {
          throwError(
            new internalServerError({
              message: 'Mật khẩu nhập lại không trùng khớp.'
            })
          );
        } else {
          hashPassword = bcrypt.hashSync(newPassword, 10);
        }
      } else {
        hashPassword = req.session.user.password;
      }
    }

    if (username) {
      if (username.length < 5) {
        throwError(
          new internalServerError({
            message: 'Tên đăng nhập tối thiểu 5 ký tự.'
          })
        );
      }

      const userFound = await models.User.findOne({ username });

      if (userFound && id !== userFound.id) {
        throwError(
          new internalServerError({
            message: 'Tên đăng nhập đã tồn tại.'
          })
        );
      }
      dataUser.username = username;
    }

    if (email) {
      const emailFound = await models.User.findOne({ email });

      if (emailFound && id !== emailFound.id) {
        throwError(
          new internalServerError({
            message: 'Email đã tồn tại.'
          })
        );
      }
      dataUser.email = email;
    }

    if (hashPassword) {
      dataUser.password = hashPassword;
    }

    let userUpdated;
    userUpdated = await models.User.findOneAndUpdate({ id }, dataUser, {
      new: true
    });

    if (!userUpdated) {
      throwError(new internalServerError());
    }

    if (typeof profileUrl !== 'string') {
      const uploadedAvatar = await uploadCtr.singleFileUpload(
        'user',
        profileUrl,
        req
      );

      if (!uploadedAvatar) {
        throwError(new internalServerError());
      }

      userUpdated = await models.User.findOneAndUpdate(
        { id: req.session.user.id },
        {
          profileUrl: uploadedAvatar.path
        },
        { new: true }
      );

      if (!userUpdated) {
        throwError(new internalServerError());
      }
    }

    req.session.user = userUpdated;

    return {
      success: true,
      user: userUpdated
    };
  },
  createUser: async user => {
    const {
      username,
      displayName,
      nickname,
      firstname,
      lastname,
      email,
      phoneNumber,
      address,
      birthDate,
      identifyNumber,
      gender,
      roleId
    } = user;

    const userFound = await models.User.findOne({ username });

    if (userFound) {
      throwError(
        new internalServerError({
          message: 'Tên đăng nhập đã tồn tại.'
        })
      );
    }

    const emailFound = await models.User.findOne({ email });

    if (emailFound) {
      throwError(
        new internalServerError({
          message: 'Email đã tồn tại.'
        })
      );
    }

    const tempPassword = util.generateRandomPassword();
    const hashPassword = bcrypt.hashSync(tempPassword, 10);

    let dataUser = {
      username,
      displayName,
      nickname,
      firstname,
      lastname,
      email,
      phoneNumber,
      address,
      birthDate,
      identifyNumber,
      gender,
      roleId,
      tempSlug: username,
      password: hashPassword
    };

    const userCreated = await models.User.create(dataUser);

    if (!userCreated) {
      throwError(
        new internalServerError({
          message: 'Tạo mới người dùng thất bại'
        })
      );
    }

    return {
      success: true
    };
  },
  updateUser: async user => {
    const {
      id,
      username,
      displayName,
      nickname,
      firstname,
      lastname,
      email,
      phoneNumber,
      address,
      birthDate,
      identifyNumber,
      gender,
      roleId
    } = user;

    let dataUser = {
      username,
      displayName,
      nickname,
      firstname,
      lastname,
      email,
      phoneNumber,
      address,
      birthDate,
      identifyNumber,
      gender,
      roleId,
      tempSlug: username
    };

    const userFound = await models.User.findOne({ username });

    if (userFound && id !== userFound.id) {
      throwError(
        new internalServerError({
          message: 'Tên đăng nhập đã tồn tại.'
        })
      );
    }

    dataUser.username = username;

    const emailFound = await models.User.findOne({ email });

    if (emailFound && id !== emailFound.id) {
      throwError(
        new internalServerError({
          message: 'Email đã tồn tại.'
        })
      );
    }

    dataUser.email = email;

    const userUpdated = await models.User.findOneAndUpdate({ id }, dataUser, {
      new: true
    });

    if (!userUpdated) {
      throwError(
        new internalServerError({
          message: 'Cập nhật người dùng thất bại'
        })
      );
    }

    return {
      success: true
    };
  },
  deleteUser: async userSlug => {
    const userDeleted = await models.User.findOneAndUpdate(
      { slug: userSlug },
      { isDel: true },
      { new: true }
    );

    if (!userDeleted) {
      throwError(
        new internalServerError({
          message: 'Xoá người dùng thất bại'
        })
      );
    }

    return {
      success: true
    };
  },
  resetPassword: async userSlug => {
    const tempPassword = util.generateRandomPassword();
    const hashedPassword = bcrypt.hashSync(tempPassword, 10);

    const userReseted = await models.User.findOneAndUpdate(
      { slug: userSlug },
      { password: hashedPassword },
      { new: true }
    );

    if (!userReseted) {
      throwError(
        new internalServerError({
          message: 'Đặt lại mật khẩu người dùng thất bại'
        })
      );
    }

    return {
      success: true
    };
  },
  getViewCount: async userId => {
    const booksFound = await models.Book.find({ createdUser: userId });

    const totalBookViewCount = util.sumArrayObject(booksFound, 'viewCount');

    const chaptersFound = await models.Chapter.find({ createdUser: userId });

    const totalChapterViewCount = util.sumArrayObject(
      chaptersFound,
      'viewCount'
    );

    return totalBookViewCount + totalChapterViewCount;
  },
  getLikeCount: async userId => {
    const booksFound = await models.Book.find({ createdUser: userId });

    const totalBookLikeCount = util.sumArrayObject(booksFound, 'likeCount');

    const chaptersFound = await models.Chapter.find({ createdUser: userId });

    const totalChapterLikeCount = util.sumArrayObject(
      chaptersFound,
      'likeCount'
    );

    const commentsBookFound = await models.Comment.find({
      type: 'BOOK',
      subjectId: { $in: booksFound.map(book => book.id) }
    });

    const commentsBookLikeCount = util.sumArrayObject(
      commentsBookFound,
      'likeCount'
    );

    const commentsChapterFound = await models.Comment.find({
      type: 'CHAPTER',
      subjectId: { $in: chaptersFound.map(chapter => chapter.id) }
    });

    const commentsChapterLikeCount = util.sumArrayObject(
      commentsChapterFound,
      'likeCount'
    );

    return (
      totalBookLikeCount +
      totalChapterLikeCount +
      commentsBookLikeCount +
      commentsChapterLikeCount
    );
  }
};

export { userCtr };
