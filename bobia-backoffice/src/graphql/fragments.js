import gql from 'graphql-tag';

export default {
  user: gql`
    fragment AuthUserFragment on User {
      slug
      displayName
      profileUrl
      role
    }
  `,
  banner: gql`
    fragment AuthBannerFragment on Banner {
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
      createdAt
      updatedAt
      isDel
    }
  `
};
