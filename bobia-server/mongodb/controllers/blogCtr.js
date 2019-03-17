import _ from 'lodash';
import models from '../models';
import { unauthenticatedError, internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import search from '../../utils/mongodb/search';
import { isOwner } from './authCtr';
import util from '../../utils/util';
import { uploadCtr, notificationCtr, followCtr } from '.';
import Enum from '../models/enum';

const blogCtr = {
  getAllBlogs: async (args, req) => {
    const { filters, filtersType, options } = args;

    const blogsFound = await models.Blog.paginate(
      search(filters, { type: filtersType }),
      {
        ...options
      }
    );

    if (!blogsFound) {
      throwError(new internalServerError());
    }

    return {
      success: true,
      blogs: blogsFound
    };
  },
  getBlogByTopics: async ({ topicIds = [], limit = 4, currentId = null }) => {
    const query = {
      id: { $ne: currentId },
      isDel: false,
      partnership: Enum.EnumPartnership.PUBLIC,
      topics: { $in: topicIds }
    };
    const count = await models.Blog.countDocuments(query);
    let random = Math.floor(Math.random() * count - limit);
    random = random > 0 ? random : 0;

    return await models.Blog.find(query)
      .skip(random)
      .limit(limit);
  },
  getBlog: async (args, req) => {
    const blogFound = await models.Blog.findOne(args);

    if (!blogFound) {
      throwError(
        new internalServerError({ message: 'Lấy thông tin bài viết thất bại' })
      );
    }

    const isBlogOwner = isOwner(blogFound.createdUser, req);

    if (
      blogFound.partnership === Enum.EnumPartnership.PRIVATE &&
      !isBlogOwner
    ) {
      throwError(
        new internalServerError({
          message: 'Bạn không có quyền xem bài viết riêng tư của người khác'
        })
      );
    }

    return {
      success: true,
      blog: blogFound,
      isOwner: isBlogOwner
    };
  },
  createBlog: async (args, req) => {
    const { topics, tags, title, content, coverPage } = args;

    if (!req.session.user) {
      throwError(new unauthenticatedError());
    }

    const blogData = {
      topics,
      title,
      content,
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

    blogData.tags = tagids;

    let blogCreated;

    blogCreated = await models.Blog.create({ ...blogData });

    if (!blogCreated) {
      throwError(
        new internalServerError({ message: 'Tạo bài viết mới thất bại.' })
      );
    }

    if (typeof coverPage !== 'string') {
      const uploadedCoverPic = await uploadCtr.singleFileUpload(
        'blog',
        coverPage,
        req
      );

      if (!uploadedCoverPic) {
        throwError(new internalServerError());
      }

      blogCreated = await models.Blog.findOneAndUpdate(
        { id: blogCreated.id },
        {
          coverPage: uploadedCoverPic.path
        },
        { new: true }
      );

      if (!blogCreated) {
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
        type: 'BLOG',
        action: 'CREATE',
        sender: req.session.user.id,
        title: 'Bài viết mới',
        content: JSON.stringify(blogCreated)
      });
    }

    return {
      success: true,
      blog: blogCreated
    };
  },
  updateBlog: async (args, req) => {
    const { slug, topics, tags, title, content, coverPage } = args;

    if (!req.session.user) {
      throwError(new unauthenticatedError());
    }

    const blogData = {
      topics,
      title,
      content,
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

    blogData.tags = tagids;

    let blogUpdated;

    blogUpdated = await models.Blog.findOneAndUpdate(
      {
        slug
      },
      { ...blogData },
      {
        new: true
      }
    );

    if (!blogUpdated) {
      throwError(
        new internalServerError({ message: 'Chỉnh sửa bài viết thất bại.' })
      );
    }

    if (typeof coverPage !== 'string') {
      const uploadedCoverPic = await uploadCtr.singleFileUpload(
        'blog',
        coverPage,
        req
      );

      if (!uploadedCoverPic) {
        throwError(new internalServerError());
      }

      blogUpdated = await models.Blog.findOneAndUpdate(
        { id: blogUpdated.id },
        {
          coverPage: uploadedCoverPic.path
        },
        { new: true }
      );

      if (!blogUpdated) {
        throwError(new internalServerError());
      }
    }

    return {
      success: true,
      blog: blogUpdated
    };
  },
  updateBlogPartnership: async (args, req) => {
    const { slug, partnership } = args;

    if (!req.session.user) {
      throwError(new unauthenticatedError());
    }

    const blogUpdated = await models.Blog.findOneAndUpdate(
      { slug },
      {
        partnership: Enum.EnumPartnership[partnership],
        lastModifiedUser: req.session.user.id
      },
      {
        new: true
      }
    );

    if (!blogUpdated) {
      throwError(new internalServerError());
    }

    return {
      success: true
    };
  },
  deleteBlog: async (args, req) => {
    const { slug } = args;

    if (!req.session.user) {
      throwError(new unauthenticatedError());
    }

    const blogDeleted = await models.Blog.findOneAndUpdate(
      { slug },
      {
        isDel: true,
        lastModifiedUser: req.session.user.id
      },
      {
        new: true
      }
    );

    if (!blogDeleted) {
      throwError(
        new internalServerError({ message: 'Xoá bài viết thất bại.' })
      );
    }

    return {
      success: true
    };
  }
};

export { blogCtr };
