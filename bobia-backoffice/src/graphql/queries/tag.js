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
    createTag: gql`
      mutation($tag: JSON!) {
        createTag(tag: $tag) {
          success
        }
      }
    `,
    updateTag: gql`
      mutation($tag: JSON!) {
        updateTag(tag: $tag) {
          success
        }
      }
    `,
    deleteTag: gql`
      mutation($tagId: Int!) {
        deleteTag(tagId: $tagId) {
          success
        }
      }
    `
  }
};
