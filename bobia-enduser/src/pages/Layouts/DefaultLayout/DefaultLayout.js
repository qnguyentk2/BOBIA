import React, { PureComponent } from 'react';
import classNames from 'classnames';
import ScrollToTop from 'react-scroll-up';
import { ToastContainer } from 'react-toastify';
import MobileDetect from 'mobile-detect';
import DefaultHeader from './DefaultHeader';
import DefaultFooter from './DefaultFooter';
import DefaultAside from './DefaultAside';
import Common from 'components/common';
import ToTopImage from 'assets/images/icons/up_arrow_round.png';

const mobileDetect = new MobileDetect(window.navigator.userAgent);
const isMobile = !!mobileDetect.mobile();

class DefaultLayout extends PureComponent {
  state = {
    bannerHeight: 0,
    isStickyAside: false,
    navigationHeight: 0,
    isShrinkNavigation: false,
    asideContent: null,
    isShowAside: isMobile ? false : this.props.isShowAside
  };

  _triggerStickyBanner = () => {
    const banner = document.getElementsByClassName('banner');
    const bannerHeight = banner.length ? banner[0].clientHeight : 0;
    const navigation = document.getElementsByClassName('navigation');
    const navigationHeight = navigation[0].clientHeight;

    this.setState({
      bannerHeight,
      isStickyAside: window.pageYOffset >= bannerHeight,
      navigationHeight,
      isShrinkNavigation: window.pageYOffset >= navigationHeight
    });
  };

  _toggleMenu = () => {
    this.setState({
      isShowAside: !this.state.isShowAside
    });
  };

  _changeAsideContent = asideContent => {
    this.setState({
      asideContent
    });
  };

  componentDidMount() {
    const interval = setInterval(() => {
      const navigation = document.getElementsByClassName('navigation');
      if (navigation.length && navigation[0].clientHeight > 0) {
        clearInterval(interval);
        this._triggerStickyBanner();
        window.addEventListener('scroll', this._triggerStickyBanner);
      }
    }, 500);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._triggerStickyBanner);
  }

  render() {
    const {
      commonComps: { LazyImage }
    } = Common;
    const { children } = this.props;
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(
        child,
        Object.assign(
          {
            changeAsideContent: this._changeAsideContent
          },
          this.props
        )
      )
    );

    const classNameLayoutWrapper = classNames('wrapper', {
      sticky: this.state.isStickyAside,
      'aside-fixed': this.props.isFixedAside,
      'one-col': !this.props.isShowAside
    });

    const classNameContentWrapper = classNames('col-12', {
      'col-md-9 block-left show-aside': this.state.isShowAside
    });

    const classNameAsideWrapper = classNames('col-12 col-md-3 block-right', {
      open: this.state.isShowAside
    });

    return (
      <div
        className={classNameLayoutWrapper}
        style={{ paddingTop: `${this.state.navigationHeight}px` }}
      >
        <DefaultHeader
          {...this.props}
          ref={header => (this.header = header)}
          isShrink={this.state.isShrinkNavigation}
          isShowBanner={this.props.isShowBanner}
          toggleMenu={this._toggleMenu}
          isShowAside={this.state.isShowAside}
        />
        {/* <ul
          className="christmas"
          style={{ top: `${this.state.navigationHeight}px` }}
        >
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
        </ul> */}
        <main className="main">
          <section className="row wrapper-block">
            <div className={classNameContentWrapper}>{childrenWithProps}</div>
            <aside
              className={classNameAsideWrapper}
              style={{ top: `${this.state.navigationHeight}px` }}
            >
              <DefaultAside children={this.state.asideContent} />
            </aside>
          </section>
        </main>
        <DefaultFooter />
        <div className="scrollTop">
          <ScrollToTop
            showUnder={this.state.bannerHeight || this.state.navigationHeight}
          >
            <LazyImage src={ToTopImage} alt="Go top" />
          </ScrollToTop>
        </div>
        <ToastContainer
          newestOnTop
          closeOnClick
          autoClose={2000}
          style={{
            top: this.state.navigationHeight
          }}
        />
      </div>
    );
  }
}

export default DefaultLayout;
