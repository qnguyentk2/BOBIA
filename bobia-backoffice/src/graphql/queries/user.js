import gql from 'graphql-tag';

export default {
  query: {
    getUser: gql`
      query($slug: String!) {
        getUser(slug: $slug) {
          success
          user {
            username
            password
            displayName
            nickname
            firstname
            lastname
            email
            phoneNumber
            address
            birthDate
            identifyNumber
            gender
            profileUrl
          }
          isOwner
        }
      }
    `,
    getAllUsers: gql`
      query getAllUsers($filters: JSON, $filtersType: String, $options: JSON) {
        getAllUsers(
          filters: $filters
          filtersType: $filtersType
          options: $options
        ) {
          success
          users {
            docs {
              id
              email
              phoneNumber
              address
              username
              firstname
              lastname
              nickname
              displayName
              identifyNumber
              gender
              birthDate
              blocked
              slug
              roleId
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
    updateProfile: gql`
      mutation($user: JSON!) {
        updateProfile(user: $user) {
          success
          user {
            profileUrl
          }
          isOwner
        }
      }
    `,
    createUser: gql`
      mutation($user: JSON!) {
        createUser(user: $user) {
          success
        }
      }
    `,
    updateUser: gql`
      mutation($user: JSON!) {
        updateUser(user: $user) {
          success
        }
      }
    `,
    deleteUser: gql`
      mutation($userId: Int!) {
        deleteUser(userId: $userId) {
          success
        }
      }
    `,
    resetPassword: gql`
      mutation($userId: Int!) {
        resetPassword(userId: $userId) {
          success
        }
      }
    `
  }
};
