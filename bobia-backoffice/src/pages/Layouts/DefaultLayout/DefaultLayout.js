import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav
} from '@coreui/react';
// sidebar nav config
import navigation from './_nav';
// routes config
import DefaultAside from './DefaultAside';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';

class DefaultLayout extends Component {
  refreshHeader = newData => {
    this.header.refreshHeader(newData);
  };

  render() {
    const { children } = this.props;

    const simpleProps = {
      history: this.props.history,
      location: this.props.location,
      match: this.props.match
    };

    return (
      <div className="app">
        <AppHeader fixed>
          <DefaultHeader
            {...this.props}
            ref={header => (this.header = header)}
          />
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <AppSidebarNav navConfig={navigation} {...simpleProps} />
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            {/* <AppBreadcrumb appRoutes={navigation} /> */}
            <Container fluid>{children}</Container>
          </main>
          <AppAside fixed hidden>
            <DefaultAside />
          </AppAside>
        </div>
        <AppFooter>
          <DefaultFooter />
        </AppFooter>
        <ToastContainer newestOnTop closeOnClick />
      </div>
    );
  }
}

export default DefaultLayout;
