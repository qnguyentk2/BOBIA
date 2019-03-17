import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import Common from 'components/common';
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
          this.props.ontoggleNotificationDropDown(() => {
            this.props.refetchNotifications();
            this.props.history.push(
              UrlHelper.getUrlBookDetail({ slugBook: contentParsed.slug })
            );
          });
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
    const { sender, content, type } = this.props.notificationdata;
    const contentParsed = JSON.parse(content);
    return (
      <span
        className="notification-item"
        onClick={this._handleGoToNotification}
      >
        <b>{sender.displayName}</b> đã có{' '}
        {type === 'BOOK' ? 'tác phẩm' : 'bài viết'} mới{' '}
        <b>{contentParsed.title}</b>{' '}
      </span>
    );
  }
}

class NotificationList extends PureComponent {
  componentDidMount() {
    this.props.subscribeToNewNotification();
  }

  componentDidUpdate(prevProps) {
    const {
      commonProps: { notify }
    } = Common;

    if (
      this.props.notificationList.length > prevProps.notificationList.length
    ) {
      notify.info('Có thông báo mới!');
    }
  }

  render() {
    const {
      commonComps: { BellIcon }
    } = Common;
    const { notificationList } = this.props;

    return (
      <Dropdown
        isOpen={this.props.dropdownOpen}
        toggle={this.props.ontoggleNotificationDropDown}
      >
        <DropdownToggle className="btn-ico user-ico">
          <BellIcon
            width="25"
            active={notificationList.length > 0}
            animate={notificationList.length > 0}
            color="#74377f"
          />
        </DropdownToggle>
        <DropdownMenu right>
          {notificationList.length > 0 ? (
            notificationList.map((notification, index) => (
              <NotificationItem
                key={index.toString()}
                notificationdata={notification}
                {...this.props}
              />
            ))
          ) : (
            <p>Không có thông báo mới</p>
          )}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default class NotificationPanel extends PureComponent {
  state = {
    dropdownOpen: false
  };

  _handleToggleNotificationDropDown = callback => {
    this.setState(
      {
        dropdownOpen: !this.state.dropdownOpen
      },
      typeof callback === 'function' ? callback() : () => {}
    );
  };

  render() {
    const {
      commonProps: {
        queries: { query, subscription }
      },
      commonComps: { CommonLoading, Page500 }
    } = Common;
    const { currentUser } = this.props;

    return (
      <Query
        query={query.getAllNotifications}
        variables={{
          filters: { seen: false },
          filtersType: 'AND',
          options: {
            populate: 'user',
            populateMatch: {
              slug: currentUser.slug
            },
            limit: 0,
            sortBy: 'createdAt',
            dir: 'desc'
          }
        }}
      >
        {({ loading, error, data, refetch, subscribeToMore }) => {
          if (loading) {
            return <CommonLoading full />;
          }

          if (error && error.networkError) {
            return <Page500 error={error.networkError} />;
          }

          if (
            data &&
            data.getAllNotifications &&
            data.getAllNotifications.success === true
          ) {
            return (
              <NotificationList
                dropdownOpen={this.state.dropdownOpen}
                ontoggleNotificationDropDown={
                  this._handleToggleNotificationDropDown
                }
                notificationList={data.getAllNotifications.notifications.docs}
                subscribeToNewNotification={() =>
                  subscribeToMore({
                    document: subscription.newNotification,
                    variables: { receiver: currentUser.slug },
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) {
                        return prev;
                      }

                      const newNotification =
                        subscriptionData.data.newNotification;
                      const newNotificationData = Object.assign({}, prev);

                      newNotificationData.getAllNotifications.notifications.docs = [
                        newNotification,
                        ...prev.getAllNotifications.notifications.docs
                      ];

                      return newNotificationData;
                    }
                  })
                }
                refetchNotifications={refetch}
                {...this.props}
              />
            );
          }
        }}
      </Query>
    );
  }
}
