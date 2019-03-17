import gql from 'graphql-tag';

export default {
  query: {
    getAllChapters: gql`
      query getAllChapters(
        $filters: JSON
        $filtersType: String
        $options: JSON
      ) {
        getAllChapters(
          filters: $filters
          filtersType: $filtersType
          options: $options
        ) {
          success
          chapters {
            docs {
              id
              title
              state
              refusedReason
              book {
                id
                title
              }
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
    approveChapter: gql`
      mutation($id: Int!) {
        approveChapter(id: $id) {
          success
        }
      }
    `,
    refuseChapter: gql`
      mutation($chapter: JSON!) {
        refuseChapter(chapter: $chapter) {
          success
        }
      }
    `
  }
};
