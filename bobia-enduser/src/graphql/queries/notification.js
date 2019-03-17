import gql from 'graphql-tag';

export default {
  query: {
    getAllNotifications: gql`
      query getAllNotifications(
        $filters: JSON
        $filtersType: String
        $options: JSON
      ) {
        getAllNotifications(
          filters: $filters
          filtersType: $filtersType
          options: $options
        ) {
          success
          notifications {
            docs {
              id
              type
              action
              sender {
                displayName
              }
              receiver {
                displayName
              }
              title
              content
              seen
              isDel
              createdAt
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
    updateNotification: gql`
      mutation($notification: JSON!) {
        updateNotification(notification: $notification) {
          success
        }
      }
    `
  },
  subscription: {
    newNotification: gql`
      subscription newNotification($receiver: String!) {
        newNotification(receiver: $receiver) {
          type
          action
          sender {
            displayName
          }
          receiver {
            displayName
          }
          title
          content
          seen
          isDel
          createdAt
        }
      }
    `
  }
};
