import gql from 'graphql-tag';

export default {
  query: {
    getAllViews: gql`
      query getAllViews(
        $limit: Int
        $page: Int
        $orderBy: String
        $dir: String
        $filters: JSON
      ) {
        getAllViews(
          limit: $limit
          page: $page
          orderBy: $orderBy
          dir: $dir
          filters: $filters
        ) {
          success
          views {
            docs {
              subjectId
              type
              user
              viewCount
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
    increaseView: gql`
      mutation($view: JSON!) {
        increaseView(view: $view) {
          success
          viewCount
        }
      }
    `
  }
};
