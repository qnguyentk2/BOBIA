import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import UserProfileUpdate from 'components/User/UserProfileUpdate';
import Common from 'components/common';

export default class UserProfileUpdatePage extends PureComponent {
  state = {
    initialValues: {
      username: '',
      lastname: '',
      displayName: '',
      newDisplayName: '',
      nickname: '',
      firstname: '',
      email: '',
      oldPassword: '',
      phoneNumber: '',
      newPassword: '',
      address: '',
      confirm_newPassword: '',
      birthDate: '',
      identifyNumber: '',
      gender: '',
      profileUrl: ''
    }
  };

  _handleMergeNewState = user => {
    let newState = Object.assign({}, this.state.initialValues);
    if (user) {
      if (user.displayName) {
        newState.displayName = user.displayName;
      }
      if (user.profileUrl) {
        newState.profileUrl = user.profileUrl;
      }
    }
    return newState;
  };

  _handleSubmitForm = (values, updateProfile) => {
    if (typeof values.newDisplayName === 'object') {
      values.displayName = values.newDisplayName.value;
    }
    updateProfile({
      variables: { user: values }
    });
    this.setState({
      initialValues: {
        ...values,
        oldPassword: '',
        newPassword: '',
        confirm_newPassword: ''
      }
    });
  };

  render() {
    const { match } = this.props;
    const {
      commonProps: {
        queries: { query }
      },
      commonComps: { CommonLoading, CommonMessage, Page500 }
    } = Common;

    return (
      <Subscribe to={[GlobalContext]}>
        {context => {
          if (!context.state.isLoggedIn) {
            return context.renderNeedLogin();
          }

          return (
            <Query
              query={query.getUser}
              variables={{ user: { slug: match.params.slugUser } }}
            >
              {({ loading, error, data }) => {
                if (loading) {
                  return <CommonLoading full />;
                }
                if (error && error.networkError) {
                  return <Page500 error={error.networkError} />;
                }
                if (data && data.getUser && data.getUser.success === true) {
                  const user = data.getUser.user;

                  if (data.getUser.isOwner) {
                    return (
                      <UserProfileUpdate
                        user={user}
                        onSubmitForm={this._handleSubmitForm}
                        onMergeNewState={this._handleMergeNewState}
                      />
                    );
                  }

                  return (
                    <CommonMessage
                      type="warning"
                      messages={[
                        `Bạn không được quyền cập nhật thông tin của người khác`
                      ]}
                    />
                  );
                }

                return (
                  <CommonMessage
                    type="error"
                    messages={[`Người dùng không tồn tại`]}
                  />
                );
              }}
            </Query>
          );
        }}
      </Subscribe>
    );
  }
}
