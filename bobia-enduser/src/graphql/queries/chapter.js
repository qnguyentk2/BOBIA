import gql from 'graphql-tag';

export default {
  query: {
    getAllChapters: gql`
      query getAllChapters(
        $filters: JSON
        $filtersType: String
        $options: JSON
      ) {
        getAllChapters(
          filters: $filters
          filtersType: $filtersType
          options: $options
        ) {
          success
          chapters {
            docs {
              id
              slug
              title
              partnership
              rating
              state
              createdAt
              updatedAt
              viewCount
              likeCount
              commentCount
            }
            total
            limit
            page
            pages
          }
        }
      }
    `,
    getChapter: gql`
      query($chapter: JSON!) {
        getChapter(chapter: $chapter) {
          success
          chapter {
            id
            slug
            state
            rating
            title
            content
            viewCount
            likeCount
            commentCount
            book {
              id
              title
              slug
              createdUser {
                id
                slug
                favoriteQuote
                displayName
                profileUrl
              }
            }
            createdUser {
              id
              slug
              favoriteQuote
              displayName
              profileUrl
              isCurrentUserFollowed
            }
            createdAt
            updatedAt
            isCurrentUserLiked
          }
          isOwner
        }
      }
    `
  },
  mutation: {
    createChapter: gql`
      mutation($chapter: JSON!) {
        createChapter(chapter: $chapter) {
          success
        }
      }
    `,
    updateChapter: gql`
      mutation($chapter: JSON!) {
        updateChapter(chapter: $chapter) {
          success
        }
      }
    `,
    updateChapterPartnership: gql`
      mutation($slug: String!, $partnership: String!) {
        updateChapterPartnership(slug: $slug, partnership: $partnership) {
          success
        }
      }
    `,
    deleteChapter: gql`
      mutation($slug: String!) {
        deleteChapter(slug: $slug) {
          success
        }
      }
    `
  }
};
