import gql from 'graphql-tag';
import fragments from 'graphql/fragments';

export default {
  query: {
    checkAuthen: gql`
      query($token: String) {
        checkAuthen(token: $token) {
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
    register: gql`
      mutation($user: JSON!) {
        register(user: $user) {
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
    login: gql`
      mutation(
        $usernameOrEmail: String!
        $password: String!
        $remember_me: Boolean!
      ) {
        login(
          usernameOrEmail: $usernameOrEmail
          password: $password
          remember_me: $remember_me
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
    socialLogin: gql`
      mutation($socialUser: JSON!) {
        socialLogin(socialUser: $socialUser) {
          success
          token
          user {
            ...AuthUserFragment
          }
          banner {
            ...AuthBannerFragment
          }
          isNew
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
