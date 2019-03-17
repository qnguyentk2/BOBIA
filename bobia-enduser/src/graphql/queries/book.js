import gql from 'graphql-tag';

export default {
  query: {
    getAllBooks: gql`
      query getAllBooks($filters: JSON, $filtersType: String, $options: JSON) {
        getAllBooks(
          filters: $filters
          filtersType: $filtersType
          options: $options
        ) {
          success
          books {
            docs {
              title
              type
              status
              summary
              rating
              coverPage
              favoriteCount
              subcribeCount
              chapterCount
              viewCount
              likeCount
              commentCount
              slug
              partnership
              createdAt
              updatedAt
              categories {
                name
                slug
              }
              tags {
                name
              }
              createdUser {
                slug
                profileUrl
                displayName
              }
              latestChapter {
                title
                slug
              }
              totalChaptersCounts
            }
            total
            limit
            page
            pages
          }
        }
      }
    `,
    getBook: gql`
      query($book: JSON!) {
        getBook(book: $book) {
          success
          book {
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
            sameCategories {
              title
              coverPage
              rating
              viewCount
              likeCount
              commentCount
              slug
              status
              createdUser {
                displayName
                slug
              }
            }
            isCurrentUserLiked
            isCurrentUserFavorited
            isCurrentUserSubcribed
          }
          isOwner
        }
      }
    `
  },
  mutation: {
    createBook: gql`
      mutation($book: JSON!) {
        createBook(book: $book) {
          success
          book {
            coverPage
            slug
          }
        }
      }
    `,
    updateBook: gql`
      mutation($book: JSON!) {
        updateBook(book: $book) {
          success
          book {
            slug
            coverPage
            createdUser {
              slug
            }
          }
        }
      }
    `,
    updateBookPartnership: gql`
      mutation($slug: String!, $partnership: String!) {
        updateBookPartnership(slug: $slug, partnership: $partnership) {
          success
        }
      }
    `,
    deleteBook: gql`
      mutation($slug: String!) {
        deleteBook(slug: $slug) {
          success
        }
      }
    `
  }
};
