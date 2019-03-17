import gql from 'graphql-tag';

export default {
  query: {
    getAllApis: gql`
      query getAllApis($filters: JSON, $filtersType: String, $options: JSON) {
        getAllApis(
          filters: $filters
          filtersType: $filtersType
          options: $options
        ) {
          success
          apis {
            docs {
              id
              name
              description
              isDel
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
    createApi: gql`
      mutation($api: JSON!) {
        createApi(api: $api) {
          success
        }
      }
    `,
    updateApi: gql`
      mutation($api: JSON!) {
        updateApi(api: $api) {
          success
        }
      }
    `,
    deleteApi: gql`
      mutation($apiId: Int!) {
        deleteApi(apiId: $apiId) {
          success
        }
      }
    `
  }
};
