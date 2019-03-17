import gql from 'graphql-tag';

export default {
  query: {
    getAllFollows: gql`
      query getAllFollows(
        $filters: JSON
        $filtersType: String
        $options: JSON
      ) {
        getAllFollows(
          filters: $filters
          filtersType: $filtersType
          options: $options
        ) {
          success
          follows {
            docs {
              subjectId
              type
              user
            }
            total
            limit
            page
            pages
          }
        }
      }
    `,
    getAllFollowings: gql`
      query getAllFollowings(
        $filters: JSON
        $filtersType: String
        $option: JSON
      ) {
        getAllFollowings(
          filters: $filters
          filtersType: $filtersType
          options: $option
        ) {
          success
          followings {
            docs {
              displayName
              slug
              profileUrl
            }
            total
            limit
            page
            pages
          }
        }
      }
    `,
    getAllFollowers: gql`
      query getAllFollowers(
        $filters: JSON
        $filtersType: String
        $option: JSON
      ) {
        getAllFollowers(
          filters: $filters
          filtersType: $filtersType
          options: $option
        ) {
          success
          followers {
            docs {
              displayName
              slug
              profileUrl
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
    follow: gql`
      mutation($follow: JSON!) {
        follow(follow: $follow) {
          success
          followerCount
          followingCount
        }
      }
    `,
    unfollow: gql`
      mutation($unfollow: JSON!) {
        unfollow(unfollow: $unfollow) {
          success
          followerCount
          followingCount
        }
      }
    `
  }
};
