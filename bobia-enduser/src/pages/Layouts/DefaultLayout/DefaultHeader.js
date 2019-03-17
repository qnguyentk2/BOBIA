import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import Common from 'components/common';
import AuthenModal from 'components/Auth/AuthenModal';
import QuickSearch from 'components/Search/QuickSearch';
import NotificationPanel from 'components/common/notification/NotificationPanel';
import Banner from 'pages/Layouts/DefaultLayout/Banner';
import { getServerDirectUrl } from 'utils';
import { UrlHelper } from 'helpers/index';
import BobiaLogo from 'assets/images/logo.png';
import avatarDefaultUrl from 'assets/images/users/avatar-default.png';

export default class DefaultHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowSearchTool: false,
      isWriteDropdownOpen: false,
      isDropdownOpen: false
    };
  }

  _toggleWriteDropdown = () => {
    this.setState(prevState => ({
      isWriteDropdownOpen: !prevState.isWriteDropdownOpen
    }));
  };

  _toggleProfileDropdown = () => {
    this.setState(prevState => ({
      isDropdownOpen: !prevState.isDropdownOpen
    }));
  };

  _handleLogout = context => {
    const {
      client,
      commonProps: {
        queries: { mutation },
        notify
      }
    } = Common;

    client
      .mutate({
        mutation: mutation.logout
      })
      .then(({ data }) => {
        if (data && data.logout && data.logout.success === true) {
          context.changeLoggedInState({ isLoggedIn: false }, () => {
            if (window.localStorage) {
              window.localStorage.removeItem('token');
            }
            client.resetStore();
            notify.success('Đăng xuất thành công!');
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
    const {
      commonComps: { LazyImage }
    } = Common;
    const { isShrink, isShowBanner, isShowAside } = this.props;

    const classNameHeaderWrapper = classNames('header', {
      shrink: isShrink
    });

    const classNameHambugerIcon = classNames('fa', {
      'fa-times': isShowAside,
      'fa-bars': !isShowAside
    });

    return (
      <Subscribe to={[GlobalContext]}>
        {context => (
          <header className={classNameHeaderWrapper}>
            <nav className="navigation">
              <h1 className="logo">
                <LazyImage
                  src={BobiaLogo}
                  href="/"
                  alt="Bobia logo"
                  className="logo__img"
                />
              </h1>
              <ul className="feature">
                <li className="feature__item">
                  <QuickSearch />
                </li>
                <li className="feature__item">
                  {context.state.isLoggedIn ? (
                    <Dropdown
                      isOpen={this.state.isWriteDropdownOpen}
                      toggle={this._toggleWriteDropdown}
                    >
                      <DropdownToggle className="btn-ico user-ico" caret>
                        <i className="ico ico-pencil" />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <Link to={UrlHelper.getUrlBookCreate()}>
                          <DropdownItem className="user-infor__link">
                            <i className="fa fa-book" /> Tác phẩm
                          </DropdownItem>
                        </Link>
                        {['ADMIN', 'OFFICER'].includes(
                          context.state.user.role
                        ) && (
                          <Link to={UrlHelper.getUrlBlogCreate()}>
                            <DropdownItem className="user-infor__link">
                              <i className="fa fa-newspaper" /> Bài viết
                            </DropdownItem>
                          </Link>
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  ) : (
                    <span
                      className="btn-ico"
                      onClick={context.toggleAuthenModal('login')}
                    >
                      <i className="ico ico-pencil" />
                    </span>
                  )}
                </li>
                {context.state.isLoggedIn ? (
                  <>
                    <li className="feature__item">
                      <Dropdown
                        isOpen={this.state.isDropdownOpen}
                        toggle={this._toggleProfileDropdown}
                      >
                        <DropdownToggle className="btn-ico user-ico">
                          <span className="user-ico__name">
                            {context.state.user.displayName}
                          </span>
                          <span className="user-ico__avatar">
                            <LazyImage
                              src={getServerDirectUrl(
                                context.state.user.profileUrl
                              )}
                              defaultImage={avatarDefaultUrl}
                              className="user-ico__avatar__img"
                              alt="user-avatar"
                            />
                          </span>
                        </DropdownToggle>
                        <DropdownMenu right>
                          <Link
                            to={UrlHelper.getUrlUserDetail({
                              slugUser: context.state.user.slug
                            })}
                          >
                            <DropdownItem className="user-infor__link">
                              <i className="fa fa-address-card" /> Quản lý tài
                              khoản
                            </DropdownItem>
                          </Link>
                          <Link
                            to={UrlHelper.getUrlUserUpdate({
                              slugUser: context.state.user.slug
                            })}
                          >
                            <DropdownItem className="user-infor__link">
                              <i className="fa fa-user" /> Cập nhật thông tin cá
                              nhân
                            </DropdownItem>
                          </Link>
                          <span
                            onClick={async () => {
                              const confirmResult = await Common.commonComps.CommonConfirm(
                                {
                                  message: 'Bạn chắc chắn muốn đăng xuất?',
                                  confirmText: 'Thoát',
                                  confirmColor: 'primary',
                                  cancelText: 'Không',
                                  cancelColor: 'danger'
                                }
                              );
                              confirmResult && this._handleLogout(context);
                            }}
                          >
                            <DropdownItem className="user-infor__link">
                              <i className="fa fa-sign-out-alt" /> Đăng xuất
                            </DropdownItem>
                          </span>
                        </DropdownMenu>
                      </Dropdown>
                    </li>
                    <li className="feature__item">
                      <NotificationPanel
                        currentUser={context.state.user}
                        {...this.props}
                      />
                    </li>
                  </>
                ) : (
                  <li className="feature__item">
                    <span
                      className="btn btn-transparent register-btn"
                      onClick={context.toggleAuthenModal('register')}
                    >
                      Đăng ký /
                    </span>
                    <span
                      className="btn btn-transparent btn-ico login-btn"
                      onClick={context.toggleAuthenModal()}
                    >
                      <i className="ico ico-user login-btn__ico" />
                      <span className="login-btn__text">&nbsp;Đăng nhập</span>
                    </span>
                  </li>
                )}
                {context.state.asideContent && (
                  <li className="feature__item hamburger">
                    <span className="btn-ico" onClick={this.props.toggleMenu}>
                      <i className={classNameHambugerIcon} />
                    </span>
                  </li>
                )}
              </ul>
            </nav>
            <AuthenModal
              authenModal={context.state.authenModal}
              authenFlip={context.state.authenFlip}
              toggleAuthenModal={context.toggleAuthenModal}
            />
            {isShowBanner && <Banner bannerData={context.state.banner} />}
          </header>
        )}
      </Subscribe>
    );
  }
}
