import mongoose from 'mongoose';
import models from '../models';
import { internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import search from '../../utils/mongodb/search';
import util from '../../utils/util';

const viewCtr = {
  getAllViews: async (args, req) => {
    const { filters, filtersType, options } = args;

    const viewsFound = await models.View.paginate(
      search(filters, { type: filtersType }),
      {
        ...options
      }
    );

    if (!viewsFound) {
      throwError(new internalServerError());
    }

    return {
      success: true,
      viewss: viewsFound
    };
  },
  increaseView: async (args, req) => {
    const { type, subjectSlug } = args;
    const subjectFound = await models[util.toTitleCase(type)].findOne({
      slug: subjectSlug
    });

    if (!subjectFound) {
      throwError(
        new internalServerError({
          message: `Không tìm thấy ${util.toTitleCase(type)}.`
        })
      );
    }

    let viewIncreased;
    const viewFound = await models.View.findOne({
      $and: [
        { user: req.session.user ? req.session.user.id : 0 },
        { type },
        { subjectId: subjectFound.id }
      ]
    });

    if (!viewFound) {
      viewIncreased = await models.View.create({
        user: req.session.user ? req.session.user.id : 0,
        viewCount: 1,
        type,
        subjectId: subjectFound.id
      });
    } else {
      viewIncreased = await models.View.updateOne(viewFound, {
        $inc: { viewCount: 1 }
      });
    }

    if (!viewIncreased) {
      throwError(
        new internalServerError({
          message: 'Cập nhật lượt xem thất bại.'
        })
      );
    }

    const oldViewCountFound = await models[util.toTitleCase(type)].findOne({
      id: subjectFound.id
    });

    if (!oldViewCountFound) {
      throwError(
        new internalServerError({
          message: 'Lấy thông tin lượt xem thất bại.'
        })
      );
    }

    mongoose.connection.db
      .collection(`${type.toLowerCase()}s`)
      .updateOne(oldViewCountFound, {
        $set: { viewCount: oldViewCountFound.viewCount + 1 }
      });

    return {
      success: true,
      viewCount: oldViewCountFound.viewCount + 1
    };
  }
};

export { viewCtr };
