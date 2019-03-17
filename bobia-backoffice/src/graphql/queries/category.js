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
    createCategory: gql`
      mutation($category: JSON!) {
        createCategory(category: $category) {
          success
        }
      }
    `,
    updateCategory: gql`
      mutation($category: JSON!) {
        updateCategory(category: $category) {
          success
        }
      }
    `,
    deleteCategory: gql`
      mutation($categoryId: Int!) {
        deleteCategory(categoryId: $categoryId) {
          success
        }
      }
    `
  }
};
