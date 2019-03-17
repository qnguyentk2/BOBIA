import gql from 'graphql-tag';

export default {
  query: {
    uploads: gql`
      query uploads {
        uploads {
          id
          filename
          encoding
          mimetype
          path
        }
      }
    `
  },
  mutation: {}
};
