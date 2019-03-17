import _ from 'lodash';
import models from '../models';
import { internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import search from '../../utils/mongodb/search';
import { userCtr } from '../controllers';
import pubsub from '../../graphql/common/subscriptions';

const notificationCtr = {
  getAllNotifications: async (args, req) => {
    const { filters, filtersType, options } = args;

    const notificationsFound = await models.Notification.paginate(
      search(filters, { type: filtersType }),
      {
        ...options
      }
    );

    if (!notificationsFound) {
      throwError(
        new internalServerError({ message: 'Lấy danh sách thông báo thất bại' })
      );
    }

    return {
      success: true,
      notifications: notificationsFound
    };
  },
  createNotifications: async (receivers, data) => {
    const notificationList = receivers.map(userId => {
      const clonedData = _.cloneDeep(data);
      clonedData.receiver = userId;

      return clonedData;
    });

    const notification = await models.Notification.create(notificationList);

    if (!notification) {
      throwError(
        new internalServerError({
          message: 'Tạo thông báo thất bại.'
        })
      );
    }

    notificationList.forEach(notification =>
      pubsub.publish('newNotification', { newNotification: notification })
    );

    return {
      success: true
    };
  },
  newNotification: async (payload, variables) => {
    const userFound = await userCtr.getUser({
      id: payload.newNotification.receiver
    });

    if (!userFound) {
      throwError(
        new internalServerError({
          message: 'Tìm người dùng thất bại.'
        })
      );
    }

    return userFound.user.slug === variables.receiver;
  },
  updateNotification: async notification => {
    const { id, seen } = notification;

    const notificationUpdated = await models.Notification.findOneAndUpdate(
      { id },
      { seen },
      {
        new: true
      }
    );

    if (!notificationUpdated) {
      throwError(
        new internalServerError({
          message: 'Cập nhật thông báo thất bại'
        })
      );
    }

    return {
      success: true
    };
  }
};

export { notificationCtr };
