import _ from 'lodash';
import models from '../models';
import { unauthenticatedError, internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import search from '../../utils/mongodb/search';
import { isOwner } from './authCtr';
import util from '../../utils/util';
import { uploadCtr, notificationCtr, followCtr } from '../controllers';
import Enum from '../models/enum';

const bookCtr = {
  getAllBooks: async (args, req) => {
    const { filters, filtersType, options } = args;

    const booksFound = await models.Book.paginate(
      search(filters, { type: filtersType }),
      {
        ...options
      }
    );

    if (!booksFound) {
      throwError(new internalServerError());
    }

    return {
      success: true,
      books: booksFound
    };
  },
  getBookByCategories: async ({
    categoryIds = [],
    limit = 4,
    currentId = null
  }) => {
    const query = {
      id: { $ne: currentId },
      isDel: false,
      partnership: Enum.EnumPartnership.PUBLIC,
      categories: { $in: categoryIds }
    };
    const count = await models.Book.countDocuments(query);
    let random = Math.floor(Math.random() * count - limit);
    random = random > 0 ? random : 0;

    return await models.Book.find(query)
      .skip(random)
      .limit(limit);
  },
  getBook: async (args, req) => {
    const bookFound = await models.Book.findOne(args);

    if (!bookFound) {
      throwError(
        new internalServerError({ message: 'Lấy thông tin tác phẩm thất bại' })
      );
    }

    const isBookOwner = isOwner(bookFound.createdUser, req);

    if (
      bookFound.partnership === Enum.EnumPartnership.PRIVATE &&
      !isBookOwner
    ) {
      throwError(
        new internalServerError({
          message: 'Bạn không có quyền xem tác phẩm riêng tư của người khác'
        })
      );
    }

    return {
      success: true,
      book: bookFound,
      isOwner: isBookOwner
    };
  },
  createBook: async (args, req) => {
    const {
      categories,
      rating,
      tags,
      title,
      summary,
      coverPage,
      status,
      type
    } = args;

    if (!req.session.user) {
      throwError(new unauthenticatedError());
    }

    const bookData = {
      categories,
      rating: Enum.EnumRatings[rating],
      title,
      summary,
      status: Enum.EnumBookStatus[status],
      type: Enum.EnumBookTypes[type],
      createdUser: req.session.user.id
    };

    let createdTag;
    let tagids = [];
    let allTags = await models.Tag.find();

    allTags.map(ele => {
      ele.name = util.normalize(ele.name);
    });

    for (let tag of tags) {
      const tagFound = allTags.filter(ele => ele.name === util.normalize(tag));

      if (tagFound && tagFound.length > 0) {
        if (!tagids.includes(tagFound[0].id)) {
          tagids.push(tagFound[0].id);
        }
      } else {
        createdTag = await models.Tag.create({ name: tag });

        if (!createdTag) {
          throwError(
            new internalServerError({ message: 'Tạo mới tag thất bại' })
          );
        }

        tagids.push(createdTag.id);
      }
    }

    bookData.tags = tagids;

    let bookCreated;

    bookCreated = await models.Book.create({ ...bookData });

    if (!bookCreated) {
      throwError(
        new internalServerError({ message: 'Tạo tác phẩm mới thất bại.' })
      );
    }

    if (typeof coverPage !== 'string') {
      const uploadedCoverPic = await uploadCtr.singleFileUpload(
        'book',
        coverPage,
        req
      );

      if (!uploadedCoverPic) {
        throwError(new internalServerError());
      }

      bookCreated = await models.Book.findOneAndUpdate(
        { id: bookCreated.id },
        {
          coverPage: uploadedCoverPic.path
        },
        { new: true }
      );

      if (!bookCreated) {
        throwError(new internalServerError());
      }
    }

    const followersFound = await followCtr.getAllFollowers({
      filters: { userSlug: req.session.user.slug },
      options: { limit: 0 }
    });

    if (followersFound.followers.docs.length > 0) {
      const receivers = followersFound.followers.docs.map(user => user.id);

      await notificationCtr.createNotifications(receivers, {
        type: 'BOOK',
        action: 'CREATE',
        sender: req.session.user.id,
        title: 'Tác phẩm mới',
        content: JSON.stringify(bookCreated)
      });
    }

    return {
      success: true,
      book: bookCreated
    };
  },
  updateBook: async (args, req) => {
    const {
      slug,
      categories,
      rating,
      tags,
      title,
      summary,
      coverPage,
      status,
      type
    } = args;

    if (!req.session.user) {
      throwError(new unauthenticatedError());
    }

    const bookData = {
      categories,
      rating: Enum.EnumRatings[rating],
      title,
      summary,
      status: Enum.EnumBookStatus[status],
      type: Enum.EnumBookTypes[type],
      lastModifiedUser: req.session.user.id
    };

    let createdTag;
    let tagids = [];
    let allTags = await models.Tag.find();

    allTags.map(ele => {
      ele.name = util.normalize(ele.name);
    });

    for (let tag of tags) {
      const tagFound = allTags.filter(ele => ele.name === util.normalize(tag));

      if (tagFound && tagFound.length > 0) {
        if (!tagids.includes(tagFound[0].id)) {
          tagids.push(tagFound[0].id);
        }
      } else {
        createdTag = await models.Tag.create({ name: tag });

        if (!createdTag) {
          throwError(
            new internalServerError({ message: 'Tạo mới tag thất bại' })
          );
        }

        tagids.push(createdTag.id);
      }
    }

    bookData.tags = tagids;

    let bookUpdated;

    bookUpdated = await models.Book.findOneAndUpdate(
      {
        slug
      },
      { ...bookData },
      {
        new: true
      }
    );

    if (!bookUpdated) {
      throwError(
        new internalServerError({ message: 'Chỉnh sửa tác phẩm thất bại.' })
      );
    }

    if (typeof coverPage !== 'string') {
      const uploadedCoverPic = await uploadCtr.singleFileUpload(
        'book',
        coverPage,
        req
      );

      if (!uploadedCoverPic) {
        throwError(new internalServerError());
      }

      bookUpdated = await models.Book.findOneAndUpdate(
        { id: bookUpdated.id },
        {
          coverPage: uploadedCoverPic.path
        },
        { new: true }
      );

      if (!bookUpdated) {
        throwError(new internalServerError());
      }
    }

    return {
      success: true,
      book: bookUpdated
    };
  },
  updateBookPartnership: async (args, req) => {
    const { slug, partnership } = args;

    if (!req.session.user) {
      throwError(new unauthenticatedError());
    }

    const bookUpdated = await models.Book.findOneAndUpdate(
      { slug },
      {
        partnership: Enum.EnumPartnership[partnership],
        lastModifiedUser: req.session.user.id
      },
      {
        new: true
      }
    );

    if (!bookUpdated) {
      throwError(new internalServerError());
    }

    return {
      success: true
    };
  },
  deleteBook: async (args, req) => {
    const { slug } = args;

    if (!req.session.user) {
      throwError(new unauthenticatedError());
    }

    const bookDeleted = await models.Book.findOneAndUpdate(
      { slug },
      {
        isDel: true,
        lastModifiedUser: req.session.user.id
      },
      {
        new: true
      }
    );

    if (!bookDeleted) {
      throwError(
        new internalServerError({ message: 'Xoá tác phẩm thất bại.' })
      );
    }

    return {
      success: true
    };
  }
};

export { bookCtr };
