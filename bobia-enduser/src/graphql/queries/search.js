import gql from 'graphql-tag';

export default {
  query: {
    search: gql`
      query search($queries: JSON) {
        search(queries: $queries) {
          success
          result {
            type
            data
          }
        }
      }
    `
  },
  mutation: {}
};
