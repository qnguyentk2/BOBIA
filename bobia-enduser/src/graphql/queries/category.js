import gql from 'graphql-tag';

export default {
  query: {
    getAllCategories: gql`
      query getAllCategories(
        $filters: JSON
        $filtersType: String
        $options: JSON
      ) {
        getAllCategories(
          filters: $filters
          filtersType: $filtersType
          options: $options
        ) {
          success
          categories {
            docs {
              id
              name
              slug
              isDel
            }
            total
            limit
            page
            pages
          }
        }
      }
    `,
    getCategory: gql`
      query($category: JSON!) {
        getCategory(category: $category) {
          success
          category {
            name
          }
        }
      }
    `
  }
};
