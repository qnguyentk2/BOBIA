import gql from 'graphql-tag';

export default {
  query: {
    getAllTags: gql`
      query getAllTags($filters: JSON, $filtersType: String, $options: JSON) {
        getAllTags(
          filters: $filters
          filtersType: $filtersType
          options: $options
        ) {
          success
          tags {
            docs {
              id
              name
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
  mutation: {}
};
