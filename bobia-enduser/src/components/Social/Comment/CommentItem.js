import _ from 'lodash';
import { Link } from 'react-router-dom';
import Moment from 'moment';
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Query } from 'react-apollo';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import Common from 'components/common';
import LikeComment from 'components/Social/Comment/LikeComment';
import avaDefault from 'assets/images/users/avatar-default.png';
import { UrlHelper } from 'helpers/index';
import { PARTNERSHIP } from 'constants/index';
import { getServerDirectUrl } from 'utils';

class CommentText extends PureComponent {
  constructor(props) {
    super(props);
    this.refReplyTextarea = React.createRef();

    this.state = {
      isShowReplyBox: false
    };
  }

  _handleToggleReplyBox = isLoggedIn => e => {
    const {
      commonProps: { notify }
    } = Common;

    if (!isLoggedIn) {
      notify.warn('Vui lòng đăng nhập để bình luận');
      return;
    }

    this.setState(state => ({ isShowReplyBox: !state.isShowReplyBox }));
  };

  _handleReplySubmit = isLoggedIn => e => {
    const {
      client,
      commonProps: { queries, notify }
    } = Common;

    if (!isLoggedIn) {
      notify.warn('Vui lòng đăng nhập để bình luận');
      return;
    }

    const value = this.refReplyTextarea.current.value;

    if (!value || value.trim() === '') {
      notify.warn('Vui lòng nhập nội dung');
      return;
    }

    const {
      submitType,
      id,
      parentId,
      subjectId,
      type,
      isShowReply,
      onAddTemporaryReply
    } = this.props;

    client
      .mutate({
        mutation: queries.mutation.createComment,
        variables: {
          comment: {
            content: value,
            subjectId,
            type,
            parentId: submitType === 'COMMENT' ? id : parentId
          }
        },
        update: (
          store,
          {
            data: {
              createComment: { comment }
            }
          }
        ) => {
          if (isShowReply === true) {
            const getAllCommentsfilters = {
              type,
              parentId: submitType === 'COMMENT' ? id : parentId
            };

            if (!isLoggedIn) {
              getAllCommentsfilters.partnership = PARTNERSHIP.PUBLIC;
            }

            const currentQuery = {
              query: queries.query.getAllComments,
              variables: {
                filters: getAllCommentsfilters,
                filtersType: 'AND',
                options: { orderBy: 'createdAt', dir: 'desc' }
              }
            };

            const updatedData = store.readQuery(currentQuery);
            updatedData.getAllComments.comments.docs.push(comment);
            store.writeQuery({
              query: currentQuery,
              updatedData
            });
          } else {
            onAddTemporaryReply(comment);
          }
        }
      })
      .then(() => {
        this.refReplyTextarea.current.value = '';
        this.setState({ isShowReplyBox: false });
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

    const {
      content,
      likeCount,
      createdAt,
      createdUser,
      isCurrentUserLiked,
      id
    } = this.props;
    const { slug, displayName, profileUrl } = createdUser;

    const textareaClass = classNames({
      'comment-form__input-box__txt-area': true,
      focus: this.state.isShowReplyBox
    });

    return (
      <Subscribe to={[GlobalContext]}>
        {context => (
          <div className="comment-text">
            <div className="comment-text__item">
              <div className="comment-text__item__imgWrapper">
                <LazyImage
                  className="img imgCommentItem"
                  src={getServerDirectUrl(profileUrl)}
                  defaultImage={avaDefault}
                  alt="user avatar"
                />
              </div>
              <div className="comment-text__item__content">
                <div className="comment-text__item__content-sort-info">
                  <Link
                    className="user-name"
                    to={UrlHelper.getUrlUserDetail({ slugUser: slug })}
                  >
                    {displayName}
                  </Link>
                  <span className="public-date">
                    {Moment(createdAt).fromNow()}
                  </span>
                </div>
                <span className="comment-text__item__content-text">
                  {content}
                </span>
              </div>
            </div>
            <div className="comment-text__item__content-action">
              <LikeComment
                subjectId={parseInt(id)}
                type="COMMENT"
                likeCount={likeCount}
                isCurrentUserLiked={isCurrentUserLiked}
              />
              <button
                onClick={this._handleToggleReplyBox(context.state.isLoggedIn)}
                className="btn-reply pointer"
              >
                <span className="txt-reply">Trả lời</span>
              </button>
            </div>
            {this.state.isShowReplyBox && (
              <div className="comment-text__item__content-reply-box">
                <div className="comment-form reply-box-form">
                  <div className="comment-form__input-box">
                    <div className="comment-form__input-box__imgWrapper">
                      <LazyImage
                        className="img"
                        src={getServerDirectUrl(context.state.user.profileUrl)}
                        defaultImage={avaDefault}
                        alt="user-avatar"
                      />
                    </div>
                    <textarea
                      ref={this.refReplyTextarea}
                      className={textareaClass}
                      placeholder="Nhập bình luận..."
                    />
                  </div>
                  <div className="comment-form__button-line">
                    <button
                      onClick={this._handleToggleReplyBox(
                        context.state.isLoggedIn
                      )}
                      className="btn btn-cancel pointer"
                    >
                      <span className="txt txt-cancel">Huỷ</span>
                    </button>
                    <button
                      onClick={this._handleReplySubmit(
                        context.state.isLoggedIn
                      )}
                      className="btn btn-post pointer"
                    >
                      <span className="txt txt-post">Trả lời</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Subscribe>
    );
  }
}

export default class CommentItem extends PureComponent {
  state = {
    isShowReply: false,
    temporaryReplies: []
  };

  _renderViewReply = () => {
    this.setState({ isShowReply: true, temporaryReplies: [] });
  };

  _loadMoreReply = (fetchMore, type, parentId, page) => e => {
    e.preventDefault();

    fetchMore({
      variables: {
        filters: { type, parentId },
        filtersType: 'AND',
        options: { orderBy: 'createdAt', dir: 'desc', page: page + 1 }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        const mergedResult = fetchMoreResult;
        mergedResult.getAllComments.comments.docs = _.unionBy(
          prev.getAllComments.comments.docs,
          mergedResult.getAllComments.comments.docs,
          'id'
        );

        return mergedResult;
      }
    });
  };

  _handleAddTemporaryReply = reply => {
    this.setState({
      temporaryReplies: [
        ...this.state.temporaryReplies,
        <CommentText
          key={`comment_text_${reply.id}`}
          submitType="REPLY"
          isShowReply={this.state.isShowReply}
          onAddTemporaryReply={this._handleAddTemporaryReply}
          {...reply}
        />
      ]
    });
  };

  render() {
    const {
      commonProps: {
        queries: { query }
      },
      commonComps: { CommonLoading, Page500 }
    } = Common;
    const { id, type, replyCount } = this.props;

    return (
      <Subscribe to={[GlobalContext]}>
        {context => {
          const getAllCommentsfilters = { type, parentId: id };

          if (!context.state.isLoggedIn) {
            getAllCommentsfilters.partnership = PARTNERSHIP.PUBLIC;
          }

          return (
            <React.Fragment>
              <CommentText
                submitType="COMMENT"
                isShowReply={this.state.isShowReply}
                onAddTemporaryReply={this._handleAddTemporaryReply}
                {...this.props}
              />
              {this.state.isShowReply === true && (
                <div className="comment-text reply-comment">
                  <Query
                    query={query.getAllComments}
                    variables={{
                      filters: getAllCommentsfilters,
                      filtersType: 'AND',
                      options: { orderBy: 'createdAt', dir: 'desc' }
                    }}
                  >
                    {({ loading, error, data, fetchMore }) => {
                      if (loading) {
                        return <CommonLoading />;
                      }
                      if (error && error.networkError) {
                        return <Page500 error={error.networkError} />;
                      }
                      if (
                        data &&
                        data.getAllComments &&
                        data.getAllComments.success === true
                      ) {
                        const {
                          docs,
                          page,
                          pages,
                          limit,
                          total
                        } = data.getAllComments.comments;

                        return (
                          <>
                            {docs.map(childComment => (
                              <CommentText
                                key={`comment_text_${childComment.id}`}
                                submitType="REPLY"
                                isShowReply={this.state.isShowReply}
                                onAddTemporaryReply={
                                  this._handleAddTemporaryReply
                                }
                                {...childComment}
                              />
                            ))}
                            {page !== pages && (
                              <div className="comment-text__item__content-load-more">
                                <span
                                  style={{ cursor: 'pointer' }}
                                  onClick={this._loadMoreReply(
                                    fetchMore,
                                    type,
                                    id,
                                    page
                                  )}
                                >
                                  <span>
                                    Xem thêm (
                                    {page === pages - 1
                                      ? total - limit * page
                                      : limit}
                                    ) phản hồi
                                  </span>
                                  <i className="ico ico-chevron-down see-more" />
                                </span>
                              </div>
                            )}
                          </>
                        );
                      }
                    }}
                  </Query>
                </div>
              )}
              {replyCount > 0 && this.state.isShowReply === false && (
                <div className="comment-text__item__content-load-more">
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={this._renderViewReply}
                  >
                    <span>
                      Xem ({replyCount + this.state.temporaryReplies.length})
                      phản hồi
                    </span>
                    <i className="ico ico-chevron-down see-more" />
                  </span>
                </div>
              )}
              {this.state.temporaryReplies.length > 0 && (
                <div className="comment-text reply-comment">
                  {[...this.state.temporaryReplies]}
                </div>
              )}
            </React.Fragment>
          );
        }}
      </Subscribe>
    );
  }
}
