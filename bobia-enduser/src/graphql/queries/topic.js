import gql from 'graphql-tag';

export default {
  query: {
    getAllTopics: gql`
      query getAllTopics($filters: JSON, $filtersType: String, $options: JSON) {
        getAllTopics(
          filters: $filters
          filtersType: $filtersType
          options: $options
        ) {
          success
          topics {
            docs {
              id
              name
              slug
            }
            total
            limit
            page
            pages
          }
        }
      }
    `,
    getTopic: gql`
      query($topic: JSON!) {
        getTopic(topic: $topic) {
          success
          topic {
            name
          }
        }
      }
    `
  }
};
