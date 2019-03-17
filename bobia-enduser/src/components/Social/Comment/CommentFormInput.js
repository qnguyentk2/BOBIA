import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Common from 'components/common';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import avaDefault from 'assets/images/users/avatar-default.png';
import { getServerDirectUrl } from 'utils';

export default class CommentFormInput extends PureComponent {
  constructor(props) {
    super(props);
    this.refCommentTextarea = React.createRef();
    this.wrapperCommentRef = React.createRef();
  }

  state = {
    isShowCommentBox: false,
    value: null
  };

  componentDidMount() {
    document.addEventListener('mousedown', this._handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this._handleClickOutside);
  }

  _handleHideCommentBox = () => {
    this.refCommentTextarea.current.value = '';
    this.setState({ isShowCommentBox: false });
  };

  _handleClickOutside = e => {
    if (
      this.wrapperCommentRef &&
      !this.wrapperCommentRef.current.contains(e.target)
    ) {
      this._handleHideCommentBox();
    }
  };

  _handleClickWrapper = isLoggedIn => e => {
    const {
      commonProps: { notify }
    } = Common;

    if (!isLoggedIn) {
      notify.warn('Vui lòng đăng nhập để bình luận');
      return;
    }

    if (!this.state.isShowCommentBox) {
      this.refCommentTextarea.current.focus();
      this.setState({ isShowCommentBox: true });
    }
  };

  _handleCommentSubmit = isLoggedIn => e => {
    const {
      client,
      commonProps: { queries, notify }
    } = Common;

    if (!isLoggedIn) {
      notify.warn('Vui lòng đăng nhập để bình luận');
      return;
    }

    const value = this.refCommentTextarea.current.value;

    if (!value || value.trim() === '') {
      notify.warn('Vui lòng nhập nội dung');
      return;
    }

    const { subjectSlug, type } = this.props;

    client
      .mutate({
        mutation: queries.mutation.createComment,
        variables: {
          comment: { content: value, subjectSlug, type }
        },
        update: (
          store,
          {
            data: {
              createComment: { comment }
            }
          }
        ) => {
          const currentQuery = {
            query: queries.query.getAllComments,
            variables: {
              filters: { type, parentId: 0 },
              filtersType: 'AND',
              options: {
                populate: type.toLowerCase(),
                populateMatch: {
                  slug: subjectSlug
                },
                orderBy: 'createdAt',
                dir: 'desc'
              }
            }
          };
          const updatedData = store.readQuery(currentQuery);
          updatedData.getAllComments.comments.docs.unshift(comment);
          store.writeQuery({
            query: currentQuery,
            updatedData
          });
        }
      })
      .then(() => {
        this.setState(
          { isShowCommentBox: false },
          () => (this.refCommentTextarea.current.value = '')
        );
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
    const {
      commonComps: { LazyImage }
    } = Common;

    const commentFormClass = classNames({
      'comment-form': true,
      'full-box': true
    });

    const textareaClass = classNames({
      'comment-form__input-box__txt-area': true,
      focus: this.state.isShowCommentBox
    });

    return (
      <Subscribe to={[GlobalContext]}>
        {context => (
          <div
            ref={this.wrapperCommentRef}
            className={commentFormClass}
            onClick={this._handleClickWrapper(context.state.isLoggedIn)}
          >
            <div className="comment-form__input-box">
              <div className="comment-form__input-box__imgWrapper">
                <LazyImage
                  className="img"
                  src={getServerDirectUrl(
                    context.state.user ? context.state.user.profileUrl : ''
                  )}
                  defaultImage={avaDefault}
                  alt="user-avatar"
                />
              </div>
              <textarea
                ref={this.refCommentTextarea}
                className={textareaClass}
                placeholder="Nhập bình luận..."
                disabled={!context.state.isLoggedIn}
              />
            </div>
            {this.state.isShowCommentBox && (
              <div className="comment-form__button-line">
                <button
                  className="btn btn-cancel pointer"
                  onClick={this._handleHideCommentBox}
                >
                  <span className="txt txt-cancel">Huỷ</span>
                </button>
                <button
                  onClick={this._handleCommentSubmit(context.state.isLoggedIn)}
                  className="btn btn-post pointer"
                >
                  <span className="txt txt-post">Đăng</span>
                </button>
              </div>
            )}
          </div>
        )}
      </Subscribe>
    );
  }
}
