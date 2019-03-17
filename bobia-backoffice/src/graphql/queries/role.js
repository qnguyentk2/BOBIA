import gql from 'graphql-tag';

export default {
  query: {
    getAllRoles: gql`
      query getAllRoles($filters: JSON, $filtersType: String, $options: JSON) {
        getAllRoles(
          filters: $filters
          filtersType: $filtersType
          options: $options
        ) {
          success
          roles {
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
    `,
    getPermissionByRole: gql`
      query getPermissionByRole($roleId: Int) {
        getPermissionByRole(roleId: $roleId) {
          success
          listAPI {
            id
            name
          }
        }
      }
    `
  },
  mutation: {
    updatePermissionForRole: gql`
      mutation($roleId: Int!, $listAPI: [String]!) {
        updatePermissionForRole(roleId: $roleId, listAPI: $listAPI) {
          success
        }
      }
    `,
    createRole: gql`
      mutation($role: JSON!) {
        createRole(role: $role) {
          success
        }
      }
    `,
    updateRole: gql`
      mutation($role: JSON!) {
        updateRole(role: $role) {
          success
          isOwner
        }
      }
    `,
    deleteRole: gql`
      mutation($roleId: Int!) {
        deleteRole(roleId: $roleId) {
          success
        }
      }
    `
  }
};
