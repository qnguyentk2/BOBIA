import mongoose from 'mongoose';
import models from '../models';
import { internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import search from '../../utils/mongodb/search';
import util from '../../utils/util';

export const commentCtr = {
  getAllComments: async (args, req) => {
    const { filters, filtersType, options } = args;
    const commentsFound = await models.Comment.paginate(
      search(filters, { type: filtersType }),
      {
        ...options
      }
    );

    if (!commentsFound) {
      throwError(
        new internalServerError({
          message: 'Lấy comment thất bại.'
        })
      );
    }

    return {
      success: true,
      comments: commentsFound
    };
  },
  countReply: async ({ id, type }) => {
    return await models.Comment.countDocuments({
      type,
      parentId: id
    });
  },
  createComment: async (args, req) => {
    const { parentId = 0, content, subjectId, subjectSlug, type } = args;

    const subjectObj = {};

    if (subjectId) {
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

    const commentCreated = await models.Comment.create({
      parentId,
      content,
      subjectId: subjectFound.id,
      type,
      user: req.session.user.id
    });

    if (!commentCreated) {
      throwError(
        new internalServerError({
          message: 'Comment thất bại.'
        })
      );
    }

    const oldCommentCountFound = await models[util.toTitleCase(type)].findOne({
      id: subjectFound.id
    });

    if (!oldCommentCountFound) {
      throwError(
        new internalServerError({
          message: 'Lấy thông tin lượt thích thất bại.'
        })
      );
    }

    mongoose.connection.db
      .collection(`${type.toLowerCase()}s`)
      .updateOne(oldCommentCountFound, {
        $set: { commentCount: oldCommentCountFound.commentCount + 1 }
      });

    return {
      success: true,
      comment: commentCreated,
      commentCount: oldCommentCountFound.commentCount + 1
    };
  }
};
