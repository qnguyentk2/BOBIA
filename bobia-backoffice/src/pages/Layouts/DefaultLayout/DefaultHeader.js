import React, { Component } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';

import {
  AppAsideToggler,
  AppNavbarBrand,
  AppSidebarToggler
} from '@coreui/react';
import DefaultHeaderDropdown from './DefaultHeaderDropdown';
import BobiaLogo from 'assets/images/logo.png';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import Common from 'components/common';

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
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
    // eslint-disable-next-line
    const { history } = this.props;
    const { commonComps } = Common;

    return (
      <Subscribe to={[GlobalContext]}>
        {context => {
          return (
            <>
              <AppSidebarToggler className="d-lg-none" display="md" mobile />
              <AppNavbarBrand
                full={{
                  src: BobiaLogo,
                  width: 89,
                  height: 25,
                  alt: 'CoreUI Logo'
                }}
                minimized={{
                  src: BobiaLogo,
                  width: 30,
                  height: 30,
                  alt: 'CoreUI Logo'
                }}
              />
              <AppSidebarToggler className="d-md-down-none" display="lg" />
              {/* <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink href="/">Dashboard</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#/users">Users</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#">Settings</NavLink>
          </NavItem>
        </Nav> */}
              <Nav className="ml-auto" navbar>
                <DefaultHeaderDropdown notif />
                <DefaultHeaderDropdown tasks />
                <DefaultHeaderDropdown mssgs />
                <NavItem className="d-md-down-none">
                  <NavLink href="#">
                    <i className="icon-location-pin" />
                  </NavLink>
                </NavItem>
                {context.state.isLoggedIn ? (
                  <DefaultHeaderDropdown
                    accnt
                    user={context.state.user}
                    profileUrl={context.state.user.profileUrl}
                    commonComps={commonComps}
                    history={history}
                    onLogOut={async () => {
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
                  />
                ) : (
                  <NavItem className="d-md-down-none">
                    <NavLink href="/login">
                      <i className="fa fa-user" /> Đăng nhập
                    </NavLink>
                  </NavItem>
                )}
              </Nav>
              <AppAsideToggler className="d-md-down-none" />
              {/* <AppAsideToggler className="d-lg-none" mobile /> */}
            </>
          );
        }}
      </Subscribe>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
