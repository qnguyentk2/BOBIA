import gql from 'graphql-tag';

export default {
  query: {
    allPosts: gql`
      query allPosts($first: Int!, $skip: Int!) {
        allPosts(orderBy: dateAndTime_DESC, first: $first, skip: $skip) {
          id
          slug
          title
          dateAndTime
          coverImage {
            handle
          }
        }
        _allPostsMeta {
          count
        }
      }
    `,
    singlePost: gql`
      query singlePost($slug: String!) {
        post: Post(slug: $slug) {
          id
          slug
          title
          coverImage {
            handle
          }
          content
          dateAndTime
        }
      }
    `
  },
  mutation: {}
};
