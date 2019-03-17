import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import imageNotFoundPic from 'assets/images/image-not-found.png';

const IMAGE_FADE_IN_CLASS = `lazy-image--fade-in`;

export default class LazyImage extends PureComponent {
  state = {
    imageLoadFinishedClass: ''
  };

  _handleLoaded = () => {
    this.setState({ imageLoadFinishedClass: IMAGE_FADE_IN_CLASS });
  };

  _handleError = e => {
    e.target.src = this.props.defaultImage || imageNotFoundPic;
  };

  render() {
    const {
      href,
      hrefclassName,
      className,
      style,
      src,
      defaultImage,
      alt,
      onClick
    } = this.props;

    const containerClass = classNames('lazy-image__container', {
      [hrefclassName]: !!hrefclassName,
      'lazy-image__container--loading': !this.state.imageLoadFinishedClass
    });

    const lazyClass = classNames('lazy-image', {
      [className]: !!className,
      [this.state.imageLoadFinishedClass]: true
    });

    if (href) {
      return (
        <Link className={containerClass} to={href}>
          <img
            className={lazyClass}
            style={style}
            src={src || defaultImage || imageNotFoundPic}
            alt={alt || 'default-lazy-image'}
            onLoad={this._handleLoaded}
            onError={this._handleError}
            onClick={onClick}
          />
        </Link>
      );
    }

    return (
      <div className={containerClass}>
        <img
          className={lazyClass}
          style={style}
          src={src || defaultImage || imageNotFoundPic}
          alt={alt || 'default-lazy-image'}
          onLoad={this._handleLoaded}
          onError={this._handleError}
          onClick={onClick}
        />
      </div>
    );
  }
}
