import React, { PureComponent } from 'react';
import classnames from 'classnames';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import Common from 'components/common';

export default class ButtonFollowUser extends PureComponent {
  state = {
    isDropdownOpen: false,
    isFollowed: this.props.isCurrentUserFollowed,
    followCount: this.props.followCount
  };

  _toggleDropdown = () => {
    this.setState(prevState => ({
      isDropdownOpen: !prevState.isDropdownOpen
    }));
  };

  _handleClickFollow = isLoggedIn => e => {
    e.preventDefault();

    const {
      commonProps: {
        notify,
        queries: { mutation }
      },
      client
    } = Common;

    if (!isLoggedIn) {
      notify.warn('Xin vui lòng đăng nhập');
      return;
    }
    const { followingUser } = this.props;

    if (this.state.isFollowed) {
      client
        .mutate({
          mutation: mutation.unfollow,
          variables: {
            unfollow: { followingUser }
          }
        })
        .then(result => {
          const { data } = result;

          if (data && data.unfollow && data.unfollow.success === true) {
            this.setState({
              followCount: data.unfollow.followCount,
              isFollowed: false
            });
          }
        })
        .catch(error => {
          if (error.networkError) {
            notify.error('Lỗi kết nối, xin vui lòng thử lại!');
          } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            notify.error(error.graphQLErrors[0].message);
          }
        });
    } else {
      client
        .mutate({
          mutation: mutation.follow,
          variables: {
            follow: {
              followingUser
            }
          }
        })
        .then(result => {
          const { data } = result;

          if (data && data.follow && data.follow.success === true) {
            this.setState({
              followCount: data.follow.followCount,
              isFollowed: true
            });
          }
        })
        .catch(error => {
          if (error.networkError) {
            notify.error('Lỗi kết nối, xin vui lòng thử lại!');
          } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            notify.error(error.graphQLErrors[0].message);
          }
        });
    }
  };

  render() {
    const followClass = classnames('btn btn-primary pointer', {
      active: this.state.isFollowed
    });

    return (
      <Subscribe to={[GlobalContext]}>
        {context =>
          this.state.isFollowed === true ? (
            <Dropdown
              className="dropdown-subcribe"
              isOpen={this.state.isDropdownOpen}
              toggle={this._toggleDropdown}
            >
              <DropdownToggle className={followClass} caret>
                <i className="fas fa-bell" /> Đã theo dõi tác giả
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={this._handleClickFollow(context.state.isLoggedIn)}
                >
                  <i className="fas fa-bell-slash" /> Bỏ theo dõi tác giả
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <span
              className={followClass}
              onClick={this._handleClickFollow(context.state.isLoggedIn)}
            >
              <i className="fas fa-bell" /> Theo dõi tác giả
            </span>
          )
        }
      </Subscribe>
    );
  }
}
