import models from '../models';
import { internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import search from '../../utils/mongodb/search';

const topicCtr = {
  getAllTopics: async args => {
    const { filters, filtersType, options } = args;

    const topicsFound = await models.Topic.paginate(
      search(filters, { type: filtersType }),
      {
        ...options
      }
    );

    if (!topicsFound) {
      throwError(new internalServerError());
    }

    return {
      success: true,
      topics: topicsFound
    };
  },
  getTopic: async (args, req) => {
    const topicFound = await models.Topic.findOne(args);

    if (!topicFound) {
      throwError(new internalServerError('Lấy thông tin thể loại thất bại'));
    }

    return {
      success: true,
      topic: topicFound
    };
  },
  createTopic: async topic => {
    const { name } = topic;

    const topicFound = await models.Topic.findOne({ name });

    if (topicFound) {
      throwError(
        new internalServerError({
          message: 'Thể loại đã tồn tại.'
        })
      );
    }

    const topicCreated = await models.Topic.create({
      ...topic
    });

    if (!topicCreated) {
      throwError(
        new internalServerError({
          message: 'Tạo mới thể loại thất bại'
        })
      );
    }

    return {
      success: true
    };
  },
  updateTopic: async topic => {
    const { id, name, description } = topic;

    const topicUpdated = await models.Topic.findOneAndUpdate(
      { id },
      { name, description },
      {
        new: true
      }
    );

    if (!topicUpdated) {
      throwError(
        new internalServerError({
          message: 'Cập nhật thể loại thất bại'
        })
      );
    }

    return {
      success: true
    };
  },
  deleteTopic: async topicId => {
    const topicDeleted = await models.Topic.findOneAndUpdate(
      { id: topicId },
      { isDel: true },
      { new: true }
    );

    if (!topicDeleted) {
      throwError(
        new internalServerError({
          message: 'Xoá thể loại thất bại'
        })
      );
    }

    return {
      success: true
    };
  }
};

export { topicCtr };
