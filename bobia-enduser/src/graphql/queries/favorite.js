import gql from 'graphql-tag';

export default {
  query: {
    getAllFavorites: gql`
      query getAllFavorites(
        $filters: JSON
        $filtersType: String
        $options: JSON
      ) {
        getAllFavorites(
          limit: $limit
          page: $page
          orderBy: $orderBy
          dir: $dir
          filters: $filters
          filtersType: $filtersType
          options: $options
        ) {
          success
          favorites {
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
    getAllFavoriteSubjects: gql`
      query getAllFavoriteSubjects(
        $filters: JSON
        $filtersType: String
        $option: JSON
      ) {
        getAllFavoriteSubjects(
          filters: $filters
          filtersType: $filtersType
          options: $option
        ) {
          success
          subjects {
            docs {
              ... on Book {
                title
                type
                status
                summary
                rating
                coverPage
                viewCount
                likeCount
                commentCount
                slug
                partnership
                createdAt
                categories {
                  id
                  name
                  slug
                }
                tags {
                  id
                  name
                }
                createdUser {
                  slug
                  profileUrl
                  displayName
                  isCurrentUserFollowed
                }
                latestChapter {
                  title
                  slug
                }
              }
            }
            total
            limit
            page
            pages
          }
          isOwner
        }
      }
    `
  },
  mutation: {
    favorite: gql`
      mutation($favorite: JSON!) {
        favorite(favorite: $favorite) {
          success
        }
      }
    `,
    unfavorite: gql`
      mutation($unfavorite: JSON!) {
        unfavorite(unfavorite: $unfavorite) {
          success
        }
      }
    `,
    subcribe: gql`
      mutation($subcribe: JSON!) {
        subcribe(subcribe: $subcribe) {
          success
        }
      }
    `,
    unsubcribe: gql`
      mutation($unsubcribe: JSON!) {
        unsubcribe(unsubcribe: $unsubcribe) {
          success
        }
      }
    `
  }
};
