import gql from 'graphql-tag';

export default {
  query: {
    getAllBlogs: gql`
      query getAllBlogs($filters: JSON, $filtersType: String, $options: JSON) {
        getAllBlogs(
          filters: $filters
          filtersType: $filtersType
          options: $options
        ) {
          success
          blogs {
            docs {
              title
              content
              coverPage
              viewCount
              likeCount
              commentCount
              slug
              partnership
              createdAt
              updatedAt
              topics {
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
            }
            total
            limit
            page
            pages
          }
        }
      }
    `,
    getBlog: gql`
      query($blog: JSON!) {
        getBlog(blog: $blog) {
          success
          blog {
            title
            content
            coverPage
            viewCount
            likeCount
            commentCount
            slug
            partnership
            topics {
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
            sameTopics {
              title
              coverPage
              viewCount
              likeCount
              commentCount
              slug
              createdUser {
                displayName
              }
            }
            isCurrentUserLiked
          }
          isOwner
        }
      }
    `
  },
  mutation: {
    createBlog: gql`
      mutation($blog: JSON!) {
        createBlog(blog: $blog) {
          success
          blog {
            coverPage
            slug
          }
        }
      }
    `,
    updateBlog: gql`
      mutation($blog: JSON!) {
        updateBlog(blog: $blog) {
          success
          blog {
            slug
            coverPage
            createdUser {
              slug
            }
          }
        }
      }
    `,
    updateBlogPartnership: gql`
      mutation($slug: String!, $partnership: String!) {
        updateBlogPartnership(slug: $slug, partnership: $partnership) {
          success
        }
      }
    `,
    deleteBlog: gql`
      mutation($slug: String!) {
        deleteBlog(slug: $slug) {
          success
        }
      }
    `
  }
};
