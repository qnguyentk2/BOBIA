import _ from 'lodash';
import models from '../models';
import { internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import search from '../../utils/mongodb/search';
import { isOwner } from './authCtr';
import Enum from '../models/enum';

const chapterCtr = {
  getAllChapters: async (args, req) => {
    const { filters, filtersType, options } = args;

    const chaptersFound = await models.Chapter.paginate(
      search(filters, { type: filtersType }),
      {
        ...options
      }
    );

    if (!chaptersFound) {
      throwError(new internalServerError());
    }

    return {
      success: true,
      chapters: chaptersFound
    };
  },
  getChapter: async (args, req) => {
    const chapterFound = await models.Chapter.findOne(args);

    if (!chapterFound) {
      throwError(
        new internalServerError({ message: 'Lấy thông tin chương thất bại' })
      );
    }

    const isChapterOwner = isOwner(chapterFound.createdUser, req);

    if (!isChapterOwner) {
      if (chapterFound.partnership === Enum.EnumPartnership.PRIVATE) {
        throwError(
          new internalServerError({
            message: 'Bạn không có quyền xem chương riêng tư của người khác'
          })
        );
      } else if (chapterFound.state !== Enum.EnumApproveStates.PUBLISHED) {
        throwError(
          new internalServerError({
            message:
              'Bạn không có quyền xem chương chưa được duyệt của người khác'
          })
        );
      }
    }

    return {
      success: true,
      chapter: chapterFound,
      isOwner: isChapterOwner
    };
  },
  createChapter: async (args, req) => {
    const { rating, title, content, state, slugBook } = args;

    if (!req.session.user) {
      throwError(new unauthenticatedError());
    }

    const chapterData = {
      rating: Enum.EnumRatings[rating],
      title,
      content,
      state: Enum.EnumApproveStates[state],
      createdUser: req.session.user.id
    };

    const bookFound = await models.Book.findOne({ slug: slugBook });

    if (!bookFound) {
      throwError(
        new internalServerError({
          message: 'Không tìm thấy tác phẩm cần tạo chương mới'
        })
      );
    }

    chapterData.bookId = bookFound.id;

    const chapterCreated = await models.Chapter.create({ ...chapterData });

    if (!chapterCreated) {
      throwError(
        new internalServerError({ message: 'Tạo chương mới thất bại.' })
      );
    }

    const bookUpdated = await models.Book.findOneAndUpdate(
      {
        slug: slugBook
      },
      { $inc: { chapterCount: 1 } },
      {
        new: true
      }
    );

    if (!bookUpdated) {
      throwError(
        new internalServerError({
          message: 'Cập nhật số lượng chương thất bại.'
        })
      );
    }

    return {
      success: true,
      chapter: chapterCreated
    };
  },
  updateChapter: async (args, req) => {
    const { slug, rating, title, content, state, slugBook } = args;

    if (!req.session.user) {
      throwError(new unauthenticatedError());
    }

    const chapterData = {
      rating: Enum.EnumRatings[rating],
      title,
      content,
      state: Enum.EnumApproveStates[state],
      lastModifiedUser: req.session.user.id
    };

    const bookFound = await models.Book.findOne({ slug: slugBook });

    if (!bookFound) {
      throwError(
        new internalServerError({
          message: 'Không tìm thấy tác phẩm cần tạo chương mới'
        })
      );
    }
    chapterData.bookId = bookFound.id;

    const chapterUpdated = await models.Chapter.findOneAndUpdate(
      {
        slug
      },
      { ...chapterData },
      {
        new: true
      }
    );

    if (!chapterUpdated) {
      throwError(
        new internalServerError({ message: 'Chỉnh sửa chương thất bại.' })
      );
    }

    return {
      success: true,
      chapter: chapterUpdated
    };
  },
  updateChapterPartnership: async (args, req) => {
    const { slug, partnership } = args;

    if (!req.session.user) {
      throwError(new unauthenticatedError());
    }

    const chapterUpdated = await models.Chapter.findOneAndUpdate(
      { slug },
      {
        partnership: Enum.EnumPartnership[partnership],
        lastModifiedUser: req.session.user.id
      },
      {
        new: true
      }
    );

    if (!chapterUpdated) {
      throwError(new internalServerError());
    }

    return {
      success: true
    };
  },
  deleteChapter: async (args, req) => {
    const { slug } = args;

    if (!req.session.user) {
      throwError(new unauthenticatedError());
    }

    const chapterDeleted = await models.Chapter.findOneAndUpdate(
      { slug },
      {
        isDel: true,
        lastModifiedUser: req.session.user.id
      },
      {
        new: true
      }
    );

    if (!chapterDeleted) {
      throwError(new internalServerError({ message: 'Xoá chương thất bại.' }));
    }

    const bookUpdated = await models.Book.findOneAndUpdate(
      {
        id: chapterDeleted.bookId
      },
      { $inc: { chapterCount: -1 } },
      {
        new: true
      }
    );

    if (!bookUpdated) {
      throwError(
        new internalServerError({
          message: 'Cập nhật số lượng chương thất bại.'
        })
      );
    }

    return {
      success: true
    };
  },
  approveChapter: async args => {
    const { id } = args;

    const chapterApproved = await models.Chapter.findOneAndUpdate(
      { id },
      { state: Enum.EnumApproveStates.PUBLISHED, publishedDate: new Date() },
      {
        new: true
      }
    );

    if (!chapterApproved) {
      throwError(
        new internalServerError({ message: 'Thông qua chương thất bại.' })
      );
    }

    return {
      success: true
    };
  },
  refuseChapter: async (args, req) => {
    const { id, refusedReason } = args;

    const chapterRefused = await models.Chapter.findOneAndUpdate(
      {
        id
      },
      {
        state: Enum.EnumApproveStates.REFUSED,
        refusedReason
      },
      {
        new: true
      }
    );

    if (!chapterRefused) {
      throwError(
        new internalServerError({
          message: 'Không thông qua chương thất bại.'
        })
      );
    }

    return {
      success: true
    };
  }
};

export { chapterCtr };
