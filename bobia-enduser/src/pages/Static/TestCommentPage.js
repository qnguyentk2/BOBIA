import React, { Component } from 'react';
import classNames from 'classnames';
import Common from 'components/common';
import avaDefault from 'assets/images/users/avatar-default.png';

class CommentLayout extends Component {
  state = {
    isShowCommentBox: false,
    isShowReplyCommentBox: false
  };

  _onCloseCommentBox = () => {
    this.setState({
      isShowCommentBox: false
    });
  };

  _onOpentCommentBox = () => {
    this.setState({
      isShowCommentBox: true
    });
  };

  _onOpenReplyCommentBox = () => {
    this.setState({
      isShowReplyCommentBox: true
    });
  };

  _onCloseReplyCommentBox = () => {
    this.setState({
      isShowReplyCommentBox: false
    });
  };

  _renderReplyBox = () => {
    const {
      commonComps: { LazyImage }
    } = Common;

    return (
      <div className="comment-text__item__content-reply-box">
        <div className="comment-form reply-box-form">
          <div className="comment-form__input-box">
            <div className="comment-form__input-box__imgWrapper">
              <LazyImage className="img" src={avaDefault} alt="user-avatar" />
            </div>
            <textarea
              className="comment-form__input-box__txt-area"
              placeholder="input your comment ..."
            />
          </div>
          <div className="comment-form__button-line">
            <button
              className="btn btn-cancel"
              onClick={() => this._onCloseReplyCommentBox()}
            >
              <span className="txt txt-cancel">Huỷ</span>
            </button>
            <button className="btn btn-post">
              <span className="txt txt-post">Đăng</span>
            </button>
          </div>
        </div>
        {/* {this._renderCommentText()} */}
      </div>
    );
  };

  _renderFullBoxComment = () => {
    return (
      <div className="comment-form__button-line">
        <button
          className="btn btn-cancel"
          onClick={this._onCloseCommentBox.bind(this)}
        >
          <span className="txt txt-cancel">Huỷ</span>
        </button>
        <button className="btn btn-post">
          <span className="txt txt-post">Đăng</span>
        </button>
      </div>
    );
  };

  _renderSeeMore = () => {
    return (
      <div className="comment-text__item__content-load-more">
        <span>Xem (3) phản hồi</span>
        <i className="ico ico-chevron-down see-more" />
      </div>
    );
  };

  _renderAction = () => {
    return (
      <div className="comment-text__item__content-action">
        <i className="ico ico-like">
          <span className="action-text">150</span>
        </i>
        <button onClick={this._onOpenReplyCommentBox} className="btn-reply">
          <span className="txt-reply">Trả lời</span>
        </button>
      </div>
    );
  };

  _renderCommentTextItem = () => {
    const {
      commonComps: { LazyImage }
    } = Common;

    return (
      <div className="comment-text__item">
        <div className="comment-text__item__imgWrapper">
          <LazyImage className="img" src={avaDefault} alt="user avatar" />
        </div>
        <div className="comment-text__item__content">
          <div className="comment-text__item__content-sort-info">
            <span className="user-name">Co be ngay ngo</span>
            <span className="public-date">28/10/2018</span>
          </div>
          <span className="comment-text__item__content-text">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi.
          </span>
        </div>
      </div>
    );
  };

  _renderReplyCommentText = () => {
    return (
      <div className="comment-text reply-comment">
        {this._renderCommentTextItem()}
        {this._renderAction()}
        {this.state.isShowReplyCommentBox && this._renderReplyBox()}
      </div>
    );
  };

  _renderCommentText = () => {
    return (
      <div className="comment-text">
        {this._renderCommentTextItem()}
        {this._renderAction()}
        {this.state.isShowReplyCommentBox && this._renderReplyBox()}
      </div>
    );
  };

  render() {
    const {
      commonComps: { LazyImage }
    } = Common;

    const commentFormClass = classNames({
      'comment-form': true,
      'full-box': true
    });

    const textareaClass = classNames({
      'comment-form__input-box__txt-area': true,
      'big-height': this.state.isShowCommentBox
    });

    return (
      <div className="container">
        <div className="comment-container">
          <div className={commentFormClass}>
            <div className="comment-form__input-box">
              <div className="comment-form__input-box__imgWrapper">
                <LazyImage className="img" src={avaDefault} alt="user-avatar" />
              </div>
              <textarea
                className={textareaClass}
                placeholder="input your comment ..."
                onFocus={() => this._onOpentCommentBox()}
              />
            </div>
            {this.state.isShowCommentBox && this._renderFullBoxComment()}
          </div>
          {this._renderCommentText()}
          {this._renderReplyCommentText()}
          {this._renderSeeMore()}
          {this._renderCommentText()}
          {this._renderSeeMore()}
        </div>
      </div>
    );
  }
}

export default CommentLayout;
