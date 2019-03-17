import gql from 'graphql-tag';

export default {
  query: {
    getAllComments: gql`
      query getAllComments(
        $filters: JSON
        $filtersType: String
        $options: JSON
      ) {
        getAllComments(
          filters: $filters
          filtersType: $filtersType
          options: $options
        ) {
          success
          comments {
            docs {
              id
              parentId
              content
              subjectId
              type
              user
              partnership
              likeCount
              replyCount
              createdAt
              updatedAt
              createdUser {
                slug
                displayName
                profileUrl
              }
              isCurrentUserLiked
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
    createComment: gql`
      mutation($comment: JSON!) {
        createComment(comment: $comment) {
          success
          comment {
            id
            parentId
            content
            subjectId
            type
            user
            likeCount
            replyCount
            createdAt
            updatedAt
            createdUser {
              slug
              displayName
              profileUrl
            }
            isCurrentUserLiked
          }
          commentCount
        }
      }
    `
  }
};
