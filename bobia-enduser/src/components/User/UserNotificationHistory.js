import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import Common from 'components/common';
import DateTimeBlock from 'components/common/DateTimeBlock';
import { UrlHelper } from 'helpers/index';

class NotificationItem extends PureComponent {
  _handleGoToNotification = () => {
    const { id, content } = this.props.notificationdata;
    const contentParsed = JSON.parse(content);
    const {
      commonProps: {
        queries: { mutation },
        notify
      },
      client
    } = Common;

    client
      .mutate({
        mutation: mutation.updateNotification,
        variables: {
          notification: { id, seen: true }
        }
      })
      .then(({ data }) => {
        if (
          data &&
          data.updateNotification &&
          data.updateNotification.success === true
        ) {
          this.props.history.push(
            UrlHelper.getUrlBookDetail({ slugBook: contentParsed.slug })
          );
        }
      })
      .catch(error => {
        if (error.networkError) {
          notify.error('Lỗi kết nối, xin vui lòng thử lại!');
        } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          if (error.graphQLErrors[0].data.errorCode === 401) {
            notify.error('Chưa đăng nhập, xin vui lòng đăng nhập!');
          }
          notify.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
      });
  };
  render() {
    const {
      sender,
      content,
      type,
      seen,
      createdAt
    } = this.props.notificationdata;
    const contentParsed = JSON.parse(content);
    return (
      <div className="row">
        <div
          className="notification-item col-7"
          onClick={this._handleGoToNotification}
        >
          <b>{sender.displayName}</b> đã có{' '}
          {type === 'BOOK' ? 'tác phẩm' : 'bài viết'} mới{' '}
          <b>{contentParsed.title}</b>{' '}
        </div>
        <DateTimeBlock date={createdAt} className="col-3" />
        <div className="col-2">{seen && 'Đã xem'}</div>
      </div>
    );
  }
}

export default class UserNotificationHistory extends PureComponent {
  state = {
    variables: {
      page: 1
    }
  };

  _handlePageChange = page => {
    this.setState({ variables: { page } });
  };
  render() {
    const {
      commonProps: {
        queries: { query }
      },
      commonComps: { CommonMessage, CommonLoading, CommonPagination, Page500 }
    } = Common;

    const { userSlug } = this.props;

    return (
      <Query
        query={query.getAllNotifications}
        variables={{
          filters: { isDel: false },
          filtersType: 'AND',
          options: {
            populate: 'user',
            populateMatch: {
              slug: userSlug
            },
            limit: 0,
            sortBy: 'createdAt',
            dir: 'desc'
          }
        }}
        fetchPolicy="network-only"
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <CommonLoading />;
          }

          if (error && error.networkError) {
            return <Page500 error={error.networkError} />;
          }

          if (
            data &&
            data.getAllNotifications &&
            data.getAllNotifications.success === true
          ) {
            const {
              docs,
              page,
              pages,
              limit
            } = data.getAllNotifications.notifications;

            if (!docs.length) {
              return (
                <CommonMessage
                  type="info"
                  messages={['Chưa có thông báo nào']}
                />
              );
            }

            return (
              <>
                {docs.map((notification, index) => (
                  <NotificationItem
                    key={index.toString()}
                    notificationdata={notification}
                    {...this.props}
                  />
                ))}
                {pages > 1 && (
                  <CommonPagination
                    currentPage={page - 1}
                    totalPage={pages}
                    itemPerPage={limit}
                    onPageChange={pageNumber =>
                      this._handlePageChange(pageNumber.selected + 1)
                    }
                  />
                )}
              </>
            );
          }
        }}
      </Query>
    );
  }
}
