import models from '../models';
import { internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import search from '../../utils/mongodb/search';
import util from '../../utils/util';

const followCtr = {
  getAllFollows: async (args, req) => {
    const { filters, filtersType, options } = args;

    const followsFound = await models.Follow.paginate(
      search(filters, { type: filtersType }),
      {
        ...options
      }
    );

    if (!followsFound) {
      throwError(new internalServerError());
    }

    return {
      success: true,
      follows: followsFound
    };
  },
  getAllFollowings: async (args, req) => {
    const { filters, options } = args;

    const userFound = await models.User.findOne({ slug: filters.userSlug });

    if (!userFound) {
      throwError(
        new internalServerError({
          message: 'Tìm người dùng thất bại.'
        })
      );
    }

    const followsFound = await models.Follow.find({
      user: userFound.id
    });

    if (!followsFound) {
      throwError(
        new internalServerError({
          message: 'Tìm theo dõi thất bại.'
        })
      );
    }

    const followsIds = followsFound.map(follow => follow.followingUser);

    const followingsFound = await models.User.paginate(
      search({ id: { $in: followsIds } }),
      {
        ...options
      }
    );

    if (!followingsFound) {
      throwError(
        new internalServerError({
          message: 'Tìm danh sách người dùng thất bại.'
        })
      );
    }

    return {
      success: true,
      followings: followingsFound
    };
  },
  getAllFollowers: async (args, req) => {
    const { filters, options } = args;

    const userFound = await models.User.findOne({ slug: filters.userSlug });

    if (!userFound) {
      throwError(
        new internalServerError({
          message: 'Tìm người dùng thất bại.'
        })
      );
    }

    const followsFound = await models.Follow.find({
      followingUser: { $in: userFound.id }
    });

    if (!followsFound) {
      throwError(
        new internalServerError({
          message: 'Tìm theo dõi thất bại.'
        })
      );
    }

    const followsIds = followsFound.map(follow => follow.user);

    const followersFound = await models.User.paginate(
      search({ id: { $in: followsIds } }),
      {
        ...options
      }
    );

    if (!followersFound) {
      throwError(
        new internalServerError({
          message: 'Tìm danh sách người dùng thất bại.'
        })
      );
    }

    return {
      success: true,
      followers: followersFound
    };
  },
  follow: async (args, req) => {
    const { followingUser } = args;

    const userFound = await models.User.findOne({ slug: followingUser });

    if (!userFound) {
      throwError(
        new internalServerError({
          message: 'Tìm người dùng thất bại.'
        })
      );
    }

    const followed = await models.Follow.create({
      user: req.session.user.id,
      followingUser: userFound.id
    });

    if (!followed) {
      throwError(
        new internalServerError({
          message: 'Follow thất bại.'
        })
      );
    }

    const followerCountUpdated = await models.User.findOneAndUpdate(
      { slug: followingUser },
      { $inc: { followerCount: 1 } },
      {
        new: true
      }
    );

    const followingCountUpdated = await models.User.findOneAndUpdate(
      { id: req.session.user.id },
      { $inc: { followingCount: 1 } },
      {
        new: true
      }
    );

    if (!followerCountUpdated || !followingCountUpdated) {
      throwError(
        new internalServerError({
          message: 'Cập nhật số lượng follow thất bại.'
        })
      );
    }

    return {
      success: true,
      followerCount: followerCountUpdated.followerCount,
      followingCount: followingCountUpdated.followingCount
    };
  },
  unfollow: async (args, req) => {
    const { followingUser } = args;

    const userFound = await models.User.findOne({ slug: followingUser });

    if (!userFound) {
      throwError(
        new internalServerError({
          message: 'Tìm người dùng thất bại.'
        })
      );
    }

    const unfollowed = await models.Follow.deleteOne({
      user: req.session.user.id,
      followingUser: userFound.id
    });

    if (!unfollowed) {
      throwError(
        new internalServerError({
          message: 'Unfollow thất bại.'
        })
      );
    }

    const followerCountUpdated = await models.User.findOneAndUpdate(
      { slug: followingUser },
      { $inc: { followerCount: -1 } },
      {
        new: true
      }
    );

    const followingCountUpdated = await models.User.findOneAndUpdate(
      { id: req.session.user.id },
      { $inc: { followingCount: -1 } },
      {
        new: true
      }
    );

    if (!followerCountUpdated || !followingCountUpdated) {
      throwError(
        new internalServerError({
          message: 'Cập nhật số lượng follow thất bại.'
        })
      );
    }

    return {
      success: true,
      followerCount: followerCountUpdated.followerCount,
      followingCount: followingCountUpdated.followingCount
    };
  },
  isCurrentUserFollowed: async (followingUser, req) => {
    if (!req.session.user) {
      return false;
    }

    const isCurrentUserFollowed = await models.Follow.findOne({
      followingUser,
      user: req.session.user.id
    });

    if (!isCurrentUserFollowed) {
      return false;
    }

    return true;
  }
};

export { followCtr };
