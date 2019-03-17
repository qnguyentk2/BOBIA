import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import Common from 'components/common';

export default class LikeComment extends PureComponent {
  state = {
    liked: this.props.isCurrentUserLiked,
    likeCount: this.props.likeCount
  };

  _handleClickLike = (isLoggedIn, toggleAuthenModal) => e => {
    e.preventDefault();

    const {
      commonProps: {
        notify,
        queries: { mutation }
      },
      client
    } = Common;

    if (!isLoggedIn) {
      notify.warn('Vui lòng đăng nhập để like');
      return;
    }
    const { type, subjectId } = this.props;

    if (this.state.liked) {
      client
        .mutate({
          mutation: mutation.unlike,
          variables: {
            unlike: { type, subjectId }
          }
        })
        .then(result => {
          const { data } = result;

          if (data && data.unlike && data.unlike.success === true) {
            this.setState({
              likeCount: data.unlike.likeCount,
              liked: false
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
              subjectId
            }
          }
        })
        .then(result => {
          const { data } = result;

          if (data && data.like && data.like.success === true) {
            this.setState({ likeCount: data.like.likeCount, liked: true });
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

  render() {
    const { likeCount, liked } = this.state;
    const classIconLike = classNames({ 'ico ico-like': true, active: liked });
    return (
      <Subscribe to={[GlobalContext]}>
        {context => (
          <i
            style={{ cursor: 'pointer' }}
            onClick={this._handleClickLike(
              context.state.isLoggedIn,
              context.toggleAuthenModal
            )}
            className={classIconLike}
          >
            <span className="action-text">{likeCount}</span>
          </i>
        )}
      </Subscribe>
    );
  }
}
