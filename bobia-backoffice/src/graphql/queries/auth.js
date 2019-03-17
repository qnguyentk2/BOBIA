import gql from 'graphql-tag';
import fragments from 'graphql/fragments';

export default {
  query: {
    checkAuthen: gql`
      query($token: String, $portal: String) {
        checkAuthen(token: $token, portal: $portal) {
          success
          user {
            ...AuthUserFragment
          }
          banner {
            ...AuthBannerFragment
          }
        }
      }
      ${fragments.user}
      ${fragments.banner}
    `,
    isAllowed: gql`
      query($apiList: [String]) {
        isAllowed(apiList: $apiList) {
          apiName
          isAllow
        }
      }
    `
  },
  mutation: {
    login: gql`
      mutation(
        $usernameOrEmail: String!
        $password: String!
        $remember_me: Boolean!
        $portal: String
      ) {
        login(
          usernameOrEmail: $usernameOrEmail
          password: $password
          remember_me: $remember_me
          portal: $portal
        ) {
          success
          token
          user {
            ...AuthUserFragment
          }
          banner {
            ...AuthBannerFragment
          }
        }
      }
      ${fragments.user}
      ${fragments.banner}
    `,
    logout: gql`
      mutation {
        logout {
          success
        }
      }
    `
  }
};
