import mongoose from 'mongoose';
import models from '../models';
import { internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import search from '../../utils/mongodb/search';
import util from '../../utils/util';

const likeCtr = {
  getAllLikes: async (args, req) => {
    const { filters, filtersType, options } = args;

    const likesFound = await models.Like.paginate(
      search(filters, { type: filtersType }),
      {
        ...options
      }
    );

    if (!likesFound) {
      throwError(new internalServerError());
    }

    return {
      success: true,
      likes: likesFound
    };
  },
  like: async (args, req) => {
    const { type, subjectId, subjectSlug } = args;

    const subjectObj = {};

    if (type === 'COMMENT') {
      subjectObj.id = subjectId;
    } else {
      subjectObj.slug = subjectSlug;
    }

    const subjectFound = await models[util.toTitleCase(type)].findOne(
      subjectObj
    );

    if (!subjectFound) {
      throwError(
        new internalServerError({
          message: 'Tìm đối tượng thất bại.'
        })
      );
    }

    const liked = await models.Like.create({
      user: req.session.user.id,
      type,
      subjectId: subjectFound.id
    });

    if (!liked) {
      throwError(
        new internalServerError({
          message: 'Like thất bại.'
        })
      );
    }

    const oldLikeCountFound = await models[util.toTitleCase(type)].findOne({
      id: subjectFound.id
    });

    if (!oldLikeCountFound) {
      throwError(
        new internalServerError({
          message: 'Lấy thông tin lượt thích thất bại.'
        })
      );
    }

    mongoose.connection.db
      .collection(`${type.toLowerCase()}s`)
      .updateOne(oldLikeCountFound, {
        $set: { likeCount: oldLikeCountFound.likeCount + 1 }
      });

    return {
      success: true,
      likeCount: oldLikeCountFound.likeCount + 1
    };
  },
  unlike: async (args, req) => {
    const { type, subjectId, subjectSlug } = args;

    const subjectObj = {};

    if (type === 'COMMENT') {
      subjectObj.id = subjectId;
    } else {
      subjectObj.slug = subjectSlug;
    }

    const subjectFound = await models[util.toTitleCase(type)].findOne(
      subjectObj
    );

    if (!subjectFound) {
      throwError(
        new internalServerError({
          message: 'Tìm đối tượng thất bại.'
        })
      );
    }

    const unliked = await models.Like.deleteOne({
      user: req.session.user.id,
      type,
      subjectId: subjectFound.id
    });

    if (!unliked) {
      throwError(
        new internalServerError({
          message: 'Unlike thất bại.'
        })
      );
    }

    const oldLikeCountFound = await models[util.toTitleCase(type)].findOne({
      id: subjectFound.id
    });

    if (!oldLikeCountFound) {
      throwError(
        new internalServerError({
          message: 'Lấy thông tin lượt thích thất bại.'
        })
      );
    }

    mongoose.connection.db
      .collection(`${type.toLowerCase()}s`)
      .updateOne(oldLikeCountFound, {
        $set: { likeCount: oldLikeCountFound.likeCount - 1 }
      });

    return {
      success: true,
      likeCount: oldLikeCountFound.likeCount - 1
    };
  },
  isCurrentUserLiked: async (type, subjectId, req) => {
    if (!req.session.user) {
      return false;
    }

    const isCurrentUserLiked = await models.Like.findOne({
      type,
      subjectId,
      user: req.session.user.id
    });

    if (!isCurrentUserLiked) {
      return false;
    }

    return true;
  }
};

export { likeCtr };
