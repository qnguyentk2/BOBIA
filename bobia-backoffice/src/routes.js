import React, { memo, lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import Common from 'components/common';
import checkAuthen from 'components/Auth/CheckAuthen';
import DefaultLayout from 'pages/Layouts/DefaultLayout/DefaultLayout';
import BlankLayout from 'pages/Layouts/BlankLayout/BlankLayout';

const AppRoute = memo(({ component: Component, layout: Layout, ...rest }) => (
  <Route
    {...rest}
    render={routeProps => (
      <Layout {...routeProps}>
        <Component />
      </Layout>
    )}
  />
));

function routes() {
  return (
    <Suspense fallback={<Common.commonComps.CommonLoading full />}>
      <Router>
        <Switch>
          <AppRoute
            exact
            path="/404"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Static/Page404'))}
          />
          <AppRoute
            exact
            path="/500"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Static/Page500'))}
          />
          <AppRoute
            exact
            path="/login"
            layout={checkAuthen(BlankLayout)}
            component={lazy(() => import('components/Auth/Login'))}
          />
          <AppRoute
            exact
            path="/logout"
            layout={BlankLayout}
            component={lazy(() => import('components/Auth/Logout'))}
          />
          <AppRoute
            exact
            path="/home"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/HomePage'))}
          />
          <AppRoute
            exact
            path="/user/:slug"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('components/User/Profile'))}
          />
          <AppRoute
            exact
            path="/users/management"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('components/User/Management'))}
          />
          <AppRoute
            exact
            path="/roles/management"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('components/Role/Management'))}
          />
          <AppRoute
            exact
            path="/tags/management"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('components/Tag/Management'))}
          />
          <AppRoute
            exact
            path="/banners/management"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('components/Banner/Management'))}
          />
          <AppRoute
            exact
            path="/apis/management"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('components/Api/Management'))}
          />
          <AppRoute
            exact
            path="/categories/management"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('components/Category/Management'))}
          />
          <AppRoute
            exact
            path="/auth/management"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('components/Auth/Management'))}
          />
          <AppRoute
            exact
            path="/review/chapter"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('components/Review/ReviewChapter'))}
          />
          <Redirect from="/" to="/home" />
        </Switch>
      </Router>
    </Suspense>
  );
}

export default memo(routes);
