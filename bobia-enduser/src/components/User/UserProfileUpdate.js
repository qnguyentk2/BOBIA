import React, { memo } from 'react';
import { Mutation } from 'react-apollo';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import avatarDefaultUrl from 'assets/images/users/avatar-default.png';
import UserProfileForm from './UserProfileForm';
import Common from 'components/common';

function UserProfileUpdate({ user, onSubmitForm, onMergeNewState }) {
  const {
    commonProps: {
      queries: { mutation },
      notify,
      validate
    },
    commonComps: { CommonLoading, CommonMessage, Page500 }
  } = Common;

  return (
    <div className="user-profile">
      <Subscribe to={[GlobalContext]}>
        {context => (
          <Mutation
            mutation={mutation.updateProfile}
            onCompleted={data => {
              context.changeUserInfo(data.updateProfile.user, () =>
                notify.success('Cập nhật thông tin người dùng thành công!')
              );
            }}
          >
            {(updateProfile, { loading, error, data }) => {
              if (loading) {
                return <CommonLoading />;
              }
              if (error && error.networkError) {
                return <Page500 error={error.networkError} />;
              }
              if (
                data &&
                data.updateProfile &&
                data.updateProfile.success === true
              ) {
                return (
                  <div className="user-form">
                    <UserProfileForm
                      updateProfile={updateProfile}
                      validate={validate}
                      initialValues={onMergeNewState(data.updateProfile.user)}
                      onSubmitForm={onSubmitForm}
                    />
                  </div>
                );
              }
              let userInit = Object.assign({}, user);

              if (!userInit.profileUrl) {
                userInit.profileUrl = avatarDefaultUrl;
              }

              if (userInit.displayName) {
                userInit.newDisplayName = userInit.displayName;
              }
              return (
                <div className="user-form">
                  <UserProfileForm
                    updateProfile={updateProfile}
                    validate={validate}
                    initialValues={userInit}
                    onSubmitForm={onSubmitForm}
                  />
                  {error &&
                  error.graphQLErrors &&
                  error.graphQLErrors.length > 0 ? (
                    <CommonMessage
                      type="error"
                      messages={error.graphQLErrors.map(error => {
                        return error.message.includes('duplicate key error')
                          ? 'Email đã tồn tại!'
                          : error.message;
                      })}
                    />
                  ) : null}
                </div>
              );
            }}
          </Mutation>
        )}
      </Subscribe>
    </div>
  );
}

export default memo(UserProfileUpdate);
