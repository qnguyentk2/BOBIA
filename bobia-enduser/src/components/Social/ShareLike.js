import React, { PureComponent } from 'react';
import Common from 'components/common';
import classnames from 'classnames';
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import { commarize } from 'utils';

export default class ShareLike extends PureComponent {
  state = {
    isDropdownOpen: false,
    isLiked: this.props.isCurrentUserLiked,
    isFavorited: this.props.isCurrentUserFavorited,
    isSubcribed: this.props.isCurrentUserSubcribed,
    likeCount: this.props.likeCount
  };

  _toggleDropdown = () => {
    this.setState(prevState => ({
      isDropdownOpen: !prevState.isDropdownOpen
    }));
  };

  _handleClickShare = e => {
    e.preventDefault();
    window.open(
      'http://www.facebook.com/share.php?u=' + window.location.href,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600'
    );
    return false;
  };

  _handleClickLike = isLoggedIn => e => {
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
    const { type, subjectSlug } = this.props;

    if (this.state.isLiked) {
      client
        .mutate({
          mutation: mutation.unlike,
          variables: {
            unlike: { type, subjectSlug }
          }
        })
        .then(result => {
          const { data } = result;

          if (data && data.unlike && data.unlike.success === true) {
            this.setState({
              likeCount: data.unlike.likeCount,
              isLiked: false
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
          mutation: mutation.like,
          variables: {
            like: {
              type,
              subjectSlug
            }
          }
        })
        .then(result => {
          const { data } = result;

          if (data && data.like && data.like.success === true) {
            this.setState({ likeCount: data.like.likeCount, isLiked: true });
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

  _handleClickFavorite = isLoggedIn => e => {
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
    const { type, subjectSlug } = this.props;

    if (this.state.isFavorited) {
      client
        .mutate({
          mutation: mutation.unfavorite,
          variables: {
            unfavorite: { type, subjectSlug }
          }
        })
        .then(result => {
          const { data } = result;

          if (data && data.unfavorite && data.unfavorite.success === true) {
            this.setState({
              isFavorited: false,
              isSubcribed: false
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
          mutation: mutation.favorite,
          variables: {
            favorite: {
              type,
              subjectSlug
            }
          }
        })
        .then(result => {
          const { data } = result;

          if (data && data.favorite && data.favorite.success === true) {
            this.setState({ isFavorited: true, isSubcribed: true });
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

  _handleClickSubcribe = isLoggedIn => e => {
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
    const { type, subjectSlug } = this.props;

    if (this.state.isSubcribed) {
      client
        .mutate({
          mutation: mutation.unsubcribe,
          variables: {
            unsubcribe: { type, subjectSlug }
          }
        })
        .then(result => {
          const { data } = result;

          if (data && data.unsubcribe && data.unsubcribe.success === true) {
            this.setState({
              isSubcribed: false
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
          mutation: mutation.subcribe,
          variables: {
            subcribe: {
              type,
              subjectSlug
            }
          }
        })
        .then(result => {
          const { data } = result;

          if (data && data.subcribe && data.subcribe.success === true) {
            this.setState({ isSubcribed: true });
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

  _handleScrollToComment() {
    var elm = document.getElementById('comment');
    elm.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  }

  render() {
    const { type, isOwner, className } = this.props;

    const likeClass = classnames({
      active: this.state.isLiked
    });

    const favoriteClass = classnames('btn btn-primary pointer', {
      active: this.state.isFavorited
    });

    return (
      <Subscribe to={[GlobalContext]}>
        {context => (
          <div className={`${type.toLowerCase()} ${className}`}>
            <div className="additional-info__item">
              <i className="ico ico-eye" />
              <span className="text">{commarize(this.props.viewCount)}</span>
            </div>
            <div className="additional-info__item focus pointer">
              <span
                onClick={this._handleClickLike(context.state.isLoggedIn)}
                className={likeClass}
              >
                <i className={`ico ico-like ${likeClass}`} />
                <span className="text">{commarize(this.state.likeCount)}</span>
              </span>
            </div>
            <div className="additional-info__item pointer">
              <span onClick={this._handleScrollToComment}>
                <i className="ico ico-chat" />
                <span className="text">
                  {commarize(this.props.commentCount)}
                </span>
              </span>
            </div>
            {type === 'BOOK' && (
              <div className="additional-info__item right">
                {!isOwner &&
                  context.state.isLoggedIn &&
                  !this.state.isFavorited && (
                    <span
                      className={favoriteClass}
                      onClick={this._handleClickFavorite(
                        context.state.isLoggedIn
                      )}
                    >
                      <i className="far fa-star" /> Thêm vào yêu thích
                    </span>
                  )}
                {!isOwner &&
                  context.state.isLoggedIn &&
                  this.state.isFavorited === true && (
                    <Dropdown
                      className="dropdown-subcribe"
                      isOpen={this.state.isDropdownOpen}
                      toggle={this._toggleDropdown}
                    >
                      <DropdownToggle className={favoriteClass} caret>
                        <i className="far fa-star" /> Đã yêu thích
                      </DropdownToggle>
                      <DropdownMenu>
                        {this.state.isSubcribed === true ? (
                          <>
                            <DropdownItem disabled>
                              <i className="fas fa-check" /> Đã theo dõi truyện
                            </DropdownItem>
                            <DropdownItem
                              onClick={this._handleClickSubcribe(
                                context.state.isLoggedIn
                              )}
                            >
                              <i className="fas fa-bell-slash" /> Bỏ theo dõi
                              truyện
                            </DropdownItem>
                            <DropdownItem
                              onClick={this._handleClickFavorite(
                                context.state.isLoggedIn
                              )}
                            >
                              <i className="fas fa-times" /> Bỏ yêu thích truyện
                            </DropdownItem>
                          </>
                        ) : (
                          <>
                            <DropdownItem disabled>
                              <i className="fas fa-check" /> Chưa theo dõi
                              truyện
                            </DropdownItem>
                            <DropdownItem
                              onClick={this._handleClickSubcribe(
                                context.state.isLoggedIn
                              )}
                            >
                              <i className="fas fa-bell" /> Theo dõi truyện
                            </DropdownItem>
                            <DropdownItem
                              onClick={this._handleClickFavorite(
                                context.state.isLoggedIn
                              )}
                            >
                              <i className="fas fa-times" /> Bỏ yêu thích truyện
                            </DropdownItem>
                          </>
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  )}
                <Button
                  className="btn btn-primary"
                  onClick={this._handleClickShare}
                >
                  <span className="btn-text">
                    <i className="fas fa-share-alt-square" /> Chia sẻ truyện
                  </span>
                </Button>
              </div>
            )}
            {type === 'CHAPTER' && (
              <div className="additional-info__item pointer">
                <span className="pointer" onClick={this._handleClickShare}>
                  <i className="ico ico-share" />
                </span>
              </div>
            )}
          </div>
        )}
      </Subscribe>
    );
  }
}
