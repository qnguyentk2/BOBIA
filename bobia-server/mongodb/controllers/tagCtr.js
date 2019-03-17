import models from '../models';
import { internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import search from '../../utils/mongodb/search';

const tagCtr = {
  findByTagIds: async tagIds => {
    return await models.Tag.find({ id: { $in: tagIds } });
  },
  getAllTags: async args => {
    const { filters, filtersType, options } = args;

    const tagsFound = await models.Tag.paginate(
      search(filters, { type: filtersType }),
      {
        ...options
      }
    );

    if (!tagsFound) {
      throwError(new internalServerError());
    }

    return {
      success: true,
      tags: tagsFound
    };
  },
  createTag: async tag => {
    const { name } = tag;

    const tagFound = await models.Tag.findOne({ name });

    if (tagFound) {
      throwError(
        new internalServerError({
          message: 'Tag đã tồn tại.'
        })
      );
    }

    const tagCreated = await models.Tag.create({
      ...tag
    });

    if (!tagCreated) {
      throwError(
        new internalServerError({
          message: 'Tạo mới tag thất bại'
        })
      );
    }

    return {
      success: true
    };
  },
  updateTag: async tag => {
    const { id, name, description } = tag;

    const tagUpdated = await models.Tag.findOneAndUpdate(
      { id },
      { name, description },
      {
        new: true
      }
    );

    if (!tagUpdated) {
      throwError(
        new internalServerError({
          message: 'Cập nhật tag thất bại'
        })
      );
    }

    return {
      success: true
    };
  },
  deleteTag: async tagId => {
    const tagDeleted = await models.Tag.findOneAndUpdate(
      { id: tagId },
      { isDel: true },
      { new: true }
    );

    if (!tagDeleted) {
      throwError(
        new internalServerError({
          message: 'Xoá tag thất bại'
        })
      );
    }

    return {
      success: true
    };
  }
};

export { tagCtr };
