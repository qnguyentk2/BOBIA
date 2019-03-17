import gql from 'graphql-tag';

export default {
  query: {
    getUser: gql`
      query($user: JSON!) {
        getUser(user: $user) {
          success
          user {
            slug
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
            viewCount
            likeCount
            followerCount
            followingCount
            isCurrentUserFollowed
          }
          isOwner
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
            displayName
            slug
          }
        }
      }
    `
  }
};
