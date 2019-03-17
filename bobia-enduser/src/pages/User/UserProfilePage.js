import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Common from 'components/common';
import { Subscribe } from 'unstated';
import { TabContent, TabPane, Nav, NavItem, NavLink, Badge } from 'reactstrap';
import { GlobalContext } from 'components/common/Context';
import UserProfileInfo from 'components/User/UserProfileInfo';
import BookManagement from 'components/Book/BookManagement';
import BlogManagement from 'components/Blog/BlogManagement';
import BookSubscription from 'components/Book/BookSubscription';
import UserFollowing from 'components/User/UserFollowing';
import UserFollower from 'components/User/UserFollower';
import UserNotificationHistory from 'components/User/UserNotificationHistory';
import { getServerDirectUrl } from 'utils';
import { UrlHelper } from 'helpers/index';
import ButtonFollowUser from 'components/User/ButtonFollowUser';
import avatarDefault from 'assets/images/users/avatar-default.png';

export default class UserProfilePage extends PureComponent {
  state = {
    activeTabClass: 'my-info',
    activeTabIcom: <i className="fa fa-user" />,
    activeTabTitle: 'Thông tin cá nhân'
  };

  _toggleTab = tab => e => {
    e.preventDefault();

    if (this.state.activeTabClass !== tab.query) {
      this.setState({
        activeTabClass: tab.query,
        activeTabIcon: tab.icon,
        activeTabTitle: tab.title
      });
    }
  };

  render() {
    const {
      commonProps: {
        queries: { query }
      },
      commonComps: { CommonLoading, Page500, LazyImage }
    } = Common;
    const { match } = this.props;

    return (
      <Subscribe to={[GlobalContext]}>
        {context => {
          const getUserFilters = { slug: match.params.slugUser };

          if (!context.state.isLoggedIn) {
            getUserFilters.isDel = false;
          }

          return (
            <Query
              query={query.getUser}
              variables={{ user: getUserFilters }}
              fetchPolicy="network-only"
            >
              {({ loading, error, data }) => {
                if (loading) {
                  return <CommonLoading full />;
                }

                if (error && error.networkError) {
                  return <Page500 error={error.networkError} />;
                }

                if (data && data.getUser && data.getUser.success === true) {
                  const { isOwner, user } = data.getUser;

                  const tabList = [
                    {
                      query: 'my-info',
                      icon: <i className="fa fa-user" />,
                      title: 'Thông tin cá nhân',
                      component: (
                        <UserProfileInfo isOwner={isOwner} user={user} />
                      )
                    },
                    {
                      query: 'my-book',
                      icon: <i className="fa fa-book" />,
                      title: isOwner
                        ? 'Tác phẩm của tôi'
                        : 'Danh sách tác phẩm',
                      component: (
                        <BookManagement isOwner={isOwner} user={user} />
                      )
                    },
                    {
                      query: 'my-blog',
                      icon: <i className="fa fa-newspaper" />,
                      title: isOwner
                        ? 'Bài viết của tôi'
                        : 'Danh sách bài viết',
                      component: (
                        <BlogManagement isOwner={isOwner} user={user} />
                      )
                    },
                    {
                      query: 'my-favorite-book',
                      icon: <i className="fa fa-star" />,
                      title: 'Tác phẩm yêu thích',
                      component: (
                        <BookSubscription userSlug={match.params.slugUser} />
                      )
                    },
                    {
                      query: 'followings',
                      icon: <i className="ico ico-following" />,
                      title: 'Đang theo dõi',
                      badge: <Badge>{user.followingCount}</Badge>,
                      component: (
                        <UserFollowing userSlug={match.params.slugUser} />
                      )
                    },
                    {
                      query: 'followers',
                      icon: <i className="ico ico-follower" />,
                      title: 'Được theo dõi',
                      badge: <Badge>{user.followerCount}</Badge>,
                      component: (
                        <UserFollower userSlug={match.params.slugUser} />
                      )
                    }
                  ];

                  if (isOwner) {
                    tabList.push({
                      query: 'notifications',
                      icon: <i className="fa fa-bell" />,
                      title: 'Lịch sử thông báo',
                      component: (
                        <UserNotificationHistory
                          userSlug={match.params.slugUser}
                          {...this.props}
                        />
                      )
                    });
                  }

                  return (
                    <div className="container container-1200">
                      <div className="row user-management">
                        <div className="col-md-3">
                          <div className="user-info">
                            <div className="user-detail">
                              <LazyImage
                                className="user-detail__avatar"
                                src={getServerDirectUrl(user.profileUrl)}
                                defaultImage={avatarDefault}
                                alt="User avatar"
                              />
                              <div className="user-block">
                                <span className="user-detail__name">
                                  {user.displayName}
                                </span>
                                {isOwner && (
                                  <Link
                                    to={UrlHelper.getUrlUserUpdate({
                                      slugUser: user.slug
                                    })}
                                    className="user-detail__link"
                                  >
                                    Cập nhật thông tin
                                  </Link>
                                )}
                                <Subscribe to={[GlobalContext]}>
                                  {context =>
                                    context.state.isLoggedIn &&
                                    context.state.user.slug !== user.slug && (
                                      <div className="author-info__follow-btn">
                                        <ButtonFollowUser
                                          isCurrentUserFollowed={
                                            user.isCurrentUserFollowed
                                          }
                                          followingUser={user.slug}
                                          classButton="author-info__follow-btn"
                                        />
                                      </div>
                                    )
                                  }
                                </Subscribe>
                              </div>
                            </div>
                            <div className="user-rating">
                              <ul className="rating-list">
                                <li className="rating-item">
                                  <span className="ico-label">
                                    <i className="ico ico-eye rating-item__ico" />
                                  </span>
                                  <span className="rating-item__number">
                                    {user.viewCount}
                                  </span>
                                </li>
                                <li className="rating-item">
                                  <span className="ico-label">
                                    <i className="ico ico-like rating-item__ico" />
                                  </span>
                                  <span className="rating-item__number">
                                    {user.likeCount}
                                  </span>
                                </li>
                              </ul>
                            </div>
                            <Nav className="user-tabs" tabs vertical>
                              {tabList.map(type => {
                                return (
                                  <NavItem key={`tab_nav_${type.query}`}>
                                    <NavLink
                                      className={classNames({
                                        active:
                                          this.state.activeTabClass ===
                                          type.query
                                      })}
                                      onClick={this._toggleTab(type)}
                                    >
                                      {type.icon}
                                      {type.title}
                                      {type.badge}
                                    </NavLink>
                                  </NavItem>
                                );
                              })}
                            </Nav>
                          </div>
                        </div>
                        <div className="col-md-9">
                          <div className="user-head">
                            <h2 className="user-head__title">
                              {this.state.activeTabIcon}{' '}
                              {this.state.activeTabTitle}
                            </h2>
                            <TabContent
                              className="user-tabs-content"
                              activeTab={this.state.activeTabClass}
                            >
                              {tabList.map(type => {
                                return (
                                  <TabPane
                                    tabId={type.query}
                                    key={`tab_content_${type.query}`}
                                  >
                                    {this.state.activeTabClass === type.query &&
                                      type.component}
                                  </TabPane>
                                );
                              })}
                            </TabContent>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              }}
            </Query>
          );
        }}
      </Subscribe>
    );
  }
}
