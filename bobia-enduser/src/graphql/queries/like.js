import gql from 'graphql-tag';

export default {
  query: {
    getAllLikes: gql`
      query getAllLikes($filters: JSON, $filtersType: String, $options: JSON) {
        getAllLikes(
          filters: $filters
          filtersType: $filtersType
          options: $options
        ) {
          success
          likes {
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
    `
  },
  mutation: {
    like: gql`
      mutation($like: JSON!) {
        like(like: $like) {
          success
          likeCount
        }
      }
    `,
    unlike: gql`
      mutation($unlike: JSON!) {
        unlike(unlike: $unlike) {
          success
          likeCount
        }
      }
    `
  }
};
