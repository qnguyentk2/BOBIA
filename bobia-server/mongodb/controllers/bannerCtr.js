import models from '../models';
import { internalServerError } from '../../utils/errors';
import { throwError } from '../../utils/logger';
import search from '../../utils/mongodb/search';
import { uploadCtr } from '../controllers';

const bannerCtr = {
  getAllBanners: async args => {
    const { filters, filtersType, options } = args;

    const bannersFound = await models.Banner.paginate(
      search(filters, { type: filtersType }),
      {
        ...options
      }
    );

    if (!bannersFound) {
      throwError(new internalServerError());
    }

    return {
      success: true,
      banners: bannersFound
    };
  },
  createBanner: async (banner, req) => {
    const { name, bannerUrl } = banner;

    const bannerFound = await models.Banner.findOne({ name });

    if (bannerFound) {
      throwError(
        new internalServerError({
          message: 'Banner đã tồn tại.'
        })
      );
    }

    let bannerCreated;

    bannerCreated = await models.Banner.create({
      ...banner
    });

    if (!bannerCreated) {
      throwError(
        new internalServerError({
          message: 'Tạo mới Banner thất bại'
        })
      );
    }

    if (typeof bannerUrl !== 'string') {
      const uploadedBannerPic = await uploadCtr.singleFileUpload(
        'banner',
        bannerUrl,
        req
      );

      if (!uploadedBannerPic) {
        throwError(new internalServerError());
      }

      bannerCreated = await models.Banner.findOneAndUpdate(
        { id: bannerCreated.id },
        {
          bannerUrl: uploadedBannerPic.path
        },
        { new: true }
      );

      if (!bannerCreated) {
        throwError(new internalServerError());
      }
    }

    return {
      success: true,
      banner: bannerCreated
    };
  },
  updateBanner: async (banner, req) => {
    const {
      id,
      name,
      title,
      titleColor,
      content,
      contentColor,
      cta,
      ctaLink,
      ctaColor,
      bannerUrl
    } = banner;

    let bannerUpdated;

    bannerUpdated = await models.Banner.findOneAndUpdate(
      { id },
      {
        name,
        title,
        titleColor,
        content,
        contentColor,
        cta,
        ctaLink,
        ctaColor
      },
      {
        new: true
      }
    );

    if (!bannerUpdated) {
      throwError(
        new internalServerError({
          message: 'Cập nhật banner thất bại'
        })
      );
    }

    if (typeof bannerUrl !== 'string') {
      const uploadedBannerPic = await uploadCtr.singleFileUpload(
        'banner',
        bannerUrl,
        req
      );

      if (!uploadedBannerPic) {
        throwError(new internalServerError());
      }

      bannerUpdated = await models.Banner.findOneAndUpdate(
        { id: bannerUpdated.id },
        {
          bannerUrl: uploadedBannerPic.path
        },
        { new: true }
      );

      if (!bannerUpdated) {
        throwError(new internalServerError());
      }
    }

    return {
      success: true,
      banner: bannerUpdated
    };
  },
  deleteBanner: async bannerId => {
    const bannerDeleted = await models.Banner.findOneAndUpdate(
      { id: bannerId },
      { isDel: true },
      { new: true }
    );

    if (!bannerDeleted) {
      throwError(
        new internalServerError({
          message: 'Xoá banner thất bại'
        })
      );
    }

    return {
      success: true
    };
  },
  updateBannerActive: async args => {
    const { id, isActive } = args;

    const bannerUpdated = await models.Banner.findOneAndUpdate(
      { id },
      { isActive },
      {
        new: true
      }
    );

    if (!bannerUpdated) {
      throwError(new internalServerError());
    }

    return {
      success: true
    };
  }
};

export { bannerCtr };
