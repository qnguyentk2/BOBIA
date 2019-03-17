import React, { PureComponent } from 'react';
import Common from 'components/common';
import SupermanPic from 'assets/images/superman.png';
import 'assets/styles/Page500.scss';

export default class Page500 extends PureComponent {
  state = {
    isOffline: this.props.error.message === 'Failed to fetch'
  };

  componentDidMount() {
    if (this.state.isOffline) {
      const html = document.getElementsByTagName('html');
      html[0].style.overflow = 'hidden';
      const root = document.getElementsByTagName('body');
      root[0].classList.add('wrapper-black');
      setInterval(function() {
        const arrayColor = [
          '#FF6600',
          '#FF0000',
          '#880000',
          '#FF9933',
          '#FF3300',
          '#FF3366'
        ];
        const body = document.getElementsByClassName('wrapper-500');
        let right = Math.floor(Math.random() * 500);

        const top = Math.floor(Math.random() * window.screen.height);
        const star = document.createElement('div');
        star.classList.add('star');
        body[0].appendChild(star);

        const runStar = () => {
          if (right >= window.screen.width) star.remove();
          right += 3;
          star.style.right = right + 'px';
        };

        setInterval(runStar, 10);
        star.style.top = top + 'px';
        star.style.background = arrayColor[Math.floor(Math.random() * 6)];

        setTimeout(function() {
          star.remove();
        }, 10000);
      }, 50);
    }
  }

  componentWillUnmount() {
    if (this.state.isOffline) {
      const html = document.getElementsByTagName('html');
      html[0].removeAttribute('style');
      const root = document.getElementsByTagName('body');
      root[0].classList.remove('wrapper-black');
    }
  }

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    const {
      commonComps: { ErrorBoundary, LazyImage }
    } = Common;

    if (this.state.isOffline) {
      return (
        <div className="wrapper-500" ref={el => (this.wrapper = el)}>
          <div className="supper-man">
            <LazyImage src={SupermanPic} alt="500-pic" />
          </div>
          <div className="title">500!</div>
          <p>Ui chà, có lỗi xảy ra!</p>
          <span className="go-back" onClick={this.goBack}>
            Quay lại
          </span>
        </div>
      );
    }

    return <ErrorBoundary>{this.props.error.message}</ErrorBoundary>;
  }
}
