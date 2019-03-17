import React from 'react';
import { Mutation } from 'react-apollo';
import Common from 'components/common';

class CheckLogout extends React.Component {
  componentDidMount() {
    this.props.CheckLogout().catch(() => {});
  }
  render() {
    const {
      client,
      commonComps: { CommonLoading, CommonRedirect, Page500 }
    } = Common;

    const { loading, error, data } = this.props;

    if (loading) {
      return <CommonLoading />;
    }

    if (!error && !data) {
      return <CommonLoading />;
    }

    if (error && error.networkError) {
      return <Page500 />;
    }

    if (error && error.graphQLErrors && error.graphQLErrors.length > 0) {
      if (error.graphQLErrors[0].data.errorCode === 401) {
        return <CommonRedirect redirectTo="/login" message="Chưa đăng nhập" />;
      }

      return <div>Có lỗi xảy ra, vui lòng thử lại</div>;
    }

    if (data && data.logout && data.logout.success === true) {
      localStorage.removeItem('token');
      client.resetStore();

      return this.props.children;
    }
    return <div>Có lỗi xảy ra, vui lòng thử lại</div>;
  }
}
class Logout extends React.Component {
  render() {
    const {
      client,
      commonProps: {
        queries: { mutation }
      },
      commonComps: { CommonLoading, CommonRedirect, Page500 }
    } = Common;

    return (
      <Mutation mutation={mutation.logout}>
        {(logout, { loading, error, data }) => (
          <CheckLogout
            client={client}
            CheckLogout={logout}
            loading={loading}
            error={error}
            data={data}
            Page500={Page500}
            CommonLoading={CommonLoading}
            CommonRedirect={CommonRedirect}
          >
            <CommonRedirect redirectTo="/" message="Đăng xuất thành công" />;
          </CheckLogout>
        )}
      </Mutation>
    );
  }
}

export default Logout;
