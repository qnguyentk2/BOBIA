import models from '../models';
import { internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import search from '../../utils/mongodb/search';

const categoryCtr = {
  getAllCategories: async args => {
    const { filters, filtersType, options } = args;

    const categoriesFound = await models.Category.paginate(
      search(filters, { type: filtersType }),
      {
        ...options
      }
    );

    if (!categoriesFound) {
      throwError(new internalServerError());
    }

    return {
      success: true,
      categories: categoriesFound
    };
  },
  getCategory: async (args, req) => {
    const categoryFound = await models.Category.findOne(args);

    if (!categoryFound) {
      throwError(new internalServerError('Lấy thông tin thể loại thất bại'));
    }

    return {
      success: true,
      category: categoryFound
    };
  },
  createCategory: async category => {
    const { name } = category;

    const categoryFound = await models.Category.findOne({ name });

    if (categoryFound) {
      throwError(
        new internalServerError({
          message: 'Thể loại đã tồn tại.'
        })
      );
    }

    const categoryCreated = await models.Category.create({
      ...category
    });

    if (!categoryCreated) {
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
  updateCategory: async category => {
    const { id, name, description, isDel } = category;

    const categoryUpdated = await models.Category.findOneAndUpdate(
      { id },
      { name, description, isDel },
      {
        new: true
      }
    );

    if (!categoryUpdated) {
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
  deleteCategory: async categoryId => {
    const categoryDeleted = await models.Category.findOneAndUpdate(
      { id: categoryId },
      { isDel: true },
      { new: true }
    );

    if (!categoryDeleted) {
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

export { categoryCtr };
