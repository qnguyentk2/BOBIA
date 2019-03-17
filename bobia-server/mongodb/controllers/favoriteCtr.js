import _ from 'lodash';
import models from '../models';
import { internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import search from '../../utils/mongodb/search';
import { isOwner } from './authCtr';
import util from '../../utils/util';

const favoriteCtr = {
  getAllFavorites: async (args, req) => {
    const { filters, filtersType, options } = args;

    const favoritesFound = await models.Favorite.paginate(
      search(filters, { type: filtersType }),
      {
        ...options
      }
    );

    if (!favoritesFound) {
      throwError(new internalServerError());
    }

    return {
      success: true,
      favorites: favoritesFound
    };
  },
  getAllFavoriteSubjects: async (args, req) => {
    const { filters, options } = args;

    const userFound = await models.User.findOne({ slug: filters.userSlug });

    if (!userFound) {
      throwError(
        new internalServerError({
          message: 'Tìm người dùng yêu thích thất bại.'
        })
      );
    }

    const findFilterArr = [{ user: userFound.id }, { type: filters.type }];

    if (filters.subjectId) {
      findFilterArr.push({ subjectId: filters.subjectId });
    }

    if (filters.isSubcribe) {
      findFilterArr.push({ isSubcribe: filters.isSubcribe });
    }

    const favoritesFound = await models.Favorite.find({
      $and: findFilterArr
    });

    if (!favoritesFound) {
      throwError(
        new internalServerError({
          message: 'Tìm yêu thích thất bại.'
        })
      );
    }

    const subjectsIds = favoritesFound.map(el => el.subjectId);

    const subjectsFound = await models[util.toTitleCase(filters.type)].paginate(
      search({ id: { $in: subjectsIds } }),
      {
        ...options
      }
    );

    if (!subjectsFound) {
      throwError(
        new internalServerError({
          message: 'Tìm danh sách yêu thích thất bại.'
        })
      );
    }

    return {
      success: true,
      subjects: subjectsFound,
      isOwner: isOwner(userFound.id, req)
    };
  },
  favorite: async (args, req) => {
    const { type, subjectSlug } = args;

    const subjectFound = await models[util.toTitleCase(type)].findOne({
      slug: subjectSlug
    });

    if (!subjectFound) {
      throwError(
        new internalServerError({
          message: 'Tìm đối tượng thất bại.'
        })
      );
    }

    const favorited = await models.Favorite.create({
      user: req.session.user.id,
      type,
      subjectId: subjectFound.id
    });

    if (!favorited) {
      throwError(
        new internalServerError({
          message: 'Yêu thích thất bại.'
        })
      );
    }

    const countUpdated = await models[util.toTitleCase(type)].findOneAndUpdate(
      { id: subjectFound.id },
      { $inc: { favoriteCount: 1, subcribeCount: 1 } },
      {
        new: true
      }
    );

    if (!countUpdated) {
      throwError(
        new internalServerError({
          message: 'Cập nhật số lượng yêu thích và theo dõi thất bại.'
        })
      );
    }

    return {
      success: true,
      favoriteCount: countUpdated.favoriteCount,
      subcribeCount: countUpdated.subcribeCount
    };
  },
  unfavorite: async (args, req) => {
    const { type, subjectSlug } = args;

    const subjectFound = await models[util.toTitleCase(type)].findOne({
      slug: subjectSlug
    });

    if (!subjectFound) {
      throwError(
        new internalServerError({
          message: 'Tìm đối tượng thất bại.'
        })
      );
    }

    const favoriteFound = await models.Favorite.findOne({
      user: req.session.user.id,
      type,
      subjectId: subjectFound.id
    });

    if (!favoriteFound) {
      throwError(
        new internalServerError({
          message: 'Tìm yêu thích thất bại.'
        })
      );
    }

    const unfavorited = await models.Favorite.deleteOne({
      user: req.session.user.id,
      type,
      subjectId: subjectFound.id
    });

    if (!unfavorited) {
      throwError(
        new internalServerError({
          message: 'Bỏ yêu thích thất bại.'
        })
      );
    }

    const decreaseCountObj = {
      favoriteCount: -1
    };

    if (favoriteFound.isSubcribe === true) {
      decreaseCountObj.subcribeCount = -1;
    }

    const countUpdated = await models[util.toTitleCase(type)].findOneAndUpdate(
      { id: subjectFound.id },
      { $inc: { ...decreaseCountObj } },
      {
        new: true
      }
    );

    if (!countUpdated) {
      throwError(
        new internalServerError({
          message: 'Cập nhật số lượng yêu thích và theo dõi thất bại.'
        })
      );
    }

    return {
      success: true,
      favoriteCount: countUpdated.favoriteCount,
      subcribeCount: countUpdated.subcribeCount
    };
  },
  subcribe: async (args, req) => {
    const { type, subjectSlug } = args;

    const subjectFound = await models[util.toTitleCase(type)].findOne({
      slug: subjectSlug
    });

    if (!subjectFound) {
      throwError(
        new internalServerError({
          message: 'Tìm đối tượng thất bại.'
        })
      );
    }

    const subcribeUpdated = await models.Favorite.findOneAndUpdate(
      { user: req.session.user.id, type, subjectId: subjectFound.id },
      { isSubcribe: true },
      {
        new: true
      }
    );

    if (!subcribeUpdated) {
      throwError(
        new internalServerError({
          message: 'Theo dõi thất bại.'
        })
      );
    }

    const subcribeCountUpdated = await models[
      util.toTitleCase(type)
    ].findOneAndUpdate(
      { id: subjectFound.id },
      { $inc: { subcribeCount: 1 } },
      {
        new: true
      }
    );

    if (!subcribeCountUpdated) {
      throwError(
        new internalServerError({
          message: 'Cập nhật số lượng theo dõi thất bại.'
        })
      );
    }

    return {
      success: true,
      subcribeCount: subcribeCountUpdated.subcribeCount
    };
  },
  unsubcribe: async (args, req) => {
    const { type, subjectSlug } = args;

    const subjectFound = await models[util.toTitleCase(type)].findOne({
      slug: subjectSlug
    });

    if (!subjectFound) {
      throwError(
        new internalServerError({
          message: 'Tìm đối tượng thất bại.'
        })
      );
    }

    const unsubcribeUpdated = await models.Favorite.findOneAndUpdate(
      { user: req.session.user.id, type, subjectId: subjectFound.id },
      { isSubcribe: false },
      {
        new: true
      }
    );

    if (!unsubcribeUpdated) {
      throwError(
        new internalServerError({
          message: 'Bỏ theo dõi thất bại.'
        })
      );
    }

    const subcribeCountUpdated = await models[
      util.toTitleCase(type)
    ].findOneAndUpdate(
      { id: subjectFound.id },
      { $inc: { subcribeCount: -1 } },
      {
        new: true
      }
    );

    if (!subcribeCountUpdated) {
      throwError(
        new internalServerError({
          message: 'Cập nhật số lượng theo dõi thất bại.'
        })
      );
    }

    return {
      success: true,
      subcribeCount: subcribeCountUpdated.subcribeCount
    };
  },
  isCurrentUserFavorited: async (type, subjectId, req) => {
    if (!req.session.user) {
      return false;
    }

    const isCurrentUserFavorited = await models.Favorite.findOne({
      type,
      subjectId,
      user: req.session.user.id
    });

    if (!isCurrentUserFavorited) {
      return false;
    }

    return true;
  },
  isCurrentUserSubcribed: async (type, subjectId, req) => {
    if (!req.session.user) {
      return false;
    }

    const isCurrentUserSubcribed = await models.Favorite.findOne({
      type,
      subjectId,
      user: req.session.user.id,
      isSubcribe: true
    });

    if (!isCurrentUserSubcribed) {
      return false;
    }

    return true;
  }
};

export { favoriteCtr };
