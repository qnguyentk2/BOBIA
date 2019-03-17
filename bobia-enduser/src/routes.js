import React, { memo, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Common from 'components/common';
import checkAuthen from 'components/Auth/CheckAuthen';
import DefaultLayout from 'pages/Layouts/DefaultLayout/DefaultLayout';
import BlankLayout from 'pages/Layouts/BlankLayout/BlankLayout';

const AppRoute = memo(({ component: Component, layout: Layout, ...rest }) => (
  <Route
    {...rest}
    render={routeProps => (
      <Layout
        isShowBanner={rest.isShowBanner || false}
        isShowAside={rest.isShowAside || false}
        isFixedAside={rest.isFixedAside || false}
        typeBookList={rest.typeBookList || undefined}
        {...routeProps}
      >
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
          {/* Page : Home Page */}
          <AppRoute
            exact
            path="/"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/HomePage'))}
            isShowBanner={true}
            isShowAside={true}
            isFixedAside={true}
          />
          {/* Page : About Page */}
          <AppRoute
            exact
            path="/about"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Static/AboutPage'))}
          />
          {/* Page: Book create */}
          <AppRoute
            exact
            path="/createBook"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Book/BookCreatePage'))}
          />
          {/* Page : Book Detail Page */}
          <AppRoute
            exact
            path="/sach/:slugBook"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Book/BookDetailPage'))}
          />
          {/* Page: Book update */}
          <AppRoute
            exact
            path="/sach/:slugBook/cap-nhat"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Book/BookUpdatePage'))}
          />
          {/* Page: Book list */}
          <AppRoute
            exact
            path="/listBook/:id/:slug"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Book/BookListPage'))}
          />
          <AppRoute
            exact
            path="/the-loai/:slugCate"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Book/BookByCategory'))}
          />
          <AppRoute
            exact
            path="/tag/:tagName"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Book/BookByTag'))}
          />
          <AppRoute
            exact
            path="/truyen-xem-nhieu-nhat"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Book/BookListPage'))}
            typeBookList={'mostViewBooks'}
          />
          <AppRoute
            exact
            path="/truyen-moi-cap-nhat"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Book/BookListPage'))}
            typeBookList={'latestUpdatedBooks'}
          />
          <AppRoute
            exact
            path="/truyen-moi"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Book/BookListPage'))}
            typeBookList={'latestBooks'}
          />
          {/* Page: Chapter create */}
          <AppRoute
            exact
            path="/sach/:slugBook/createChapter"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Chapter/ChapterCreatePage'))}
          />
          {/* Page: Chapter Detail page */}
          <AppRoute
            exact
            path="/sach/:slugBook/:slugChapter"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Chapter/ChapterDetailPage'))}
          />
          {/* Page: Chapter update */}
          <AppRoute
            exact
            path="/sach/:slugBook/:slugChapter/cap-nhat"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Chapter/ChapterUpdatePage'))}
          />
          {/* Page: Blog create */}
          <AppRoute
            exact
            path="/createBlog"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Blog/BlogCreatePage'))}
          />
          {/* Page : Blog Detail Page */}
          <AppRoute
            exact
            path="/blog/:slugBlog"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Blog/BlogDetailPage'))}
          />
          {/* Page: Blog update */}
          <AppRoute
            exact
            path="/blog/:slugBlog/cap-nhat"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Blog/BlogUpdatePage'))}
          />
          {/* Page: User Profile Update Page */}
          <AppRoute
            exact
            path="/nguoi-dung/:slugUser/cap-nhat"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/User/UserProfileUpdatePage'))}
          />
          {/* Page: User Profile Page */}
          <AppRoute
            exact
            path="/nguoi-dung/:slugUser"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/User/UserProfilePage'))}
          />
          {/* Page: Search */}
          <AppRoute
            exact
            path="/search"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('components/Search/Search'))}
          />
          {/* Page: Dev */}
          <AppRoute
            exact
            path="/dev"
            layout={checkAuthen(DefaultLayout)}
            component={lazy(() => import('pages/Static/JustForDevPage'))}
          />
          {/* Page: 404 */}
          <AppRoute
            layout={BlankLayout}
            component={lazy(() => import('pages/Static/Page404'))}
          />
        </Switch>
      </Router>
    </Suspense>
  );
}

export default memo(routes);
