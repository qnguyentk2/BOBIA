import gql from 'graphql-tag';

export default {
  query: {
    getAllBanners: gql`
      query getAllBanners(
        $filters: JSON
        $filtersType: String
        $options: JSON
      ) {
        getAllBanners(
          filters: $filters
          filtersType: $filtersType
          options: $options
        ) {
          success
          banners {
            docs {
              id
              name
              title
              titleColor
              content
              contentColor
              cta
              ctaLink
              ctaColor
              bannerUrl
              isActive
              isDel
            }
            total
            limit
            page
            pages
          }
        }
      }
    `
  },
  mutation: {
    createBanner: gql`
      mutation($banner: JSON!) {
        createBanner(banner: $banner) {
          success
        }
      }
    `,
    updateBanner: gql`
      mutation($banner: JSON!) {
        updateBanner(banner: $banner) {
          success
        }
      }
    `,
    deleteBanner: gql`
      mutation($bannerId: Int!) {
        deleteBanner(bannerId: $bannerId) {
          success
        }
      }
    `,
    updateBannerActive: gql`
      mutation($id: Int!, $isActive: Boolean!) {
        updateBannerActive(id: $id, isActive: $isActive) {
          success
        }
      }
    `
  }
};
