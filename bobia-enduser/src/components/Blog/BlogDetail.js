import React, { memo, PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import ButtonFollowUser from 'components/User/ButtonFollowUser';
import { UrlHelper } from 'helpers/index';
import { RichEditor } from 'components/common/Fields';
import Common from 'components/common';
import CommentContainer from 'components/Social/Comment/CommentContainer';
import TopicList from 'components/Topic/TopicList';
import TagList from 'components/Tag/TagList';
import BlogSameTopic from './BlogSameTopic';
import ShareLike from 'components/Social/ShareLike';
import { getServerDirectUrl } from 'utils';
import avatarDefaultUrl from 'assets/images/users/avatar-default.png';
import blogCoverDefaultUrl from 'assets/images/image-not-found.png';

const BlockAuthor = memo(props => {
  const {
    commonComps: { LazyImage }
  } = Common;

  const { displayName, profileUrl, slug, isCurrentUserFollowed } = props;

  return (
    <div className="Block Block-Author">
      <div className="Block-Author__content">
        <Link
          to={UrlHelper.getUrlUserDetail({ slugUser: slug })}
          className="Block-Author__content__link"
        >
          <LazyImage
            className="Block-Author__image"
            src={getServerDirectUrl(profileUrl)}
            defaultImage={avatarDefaultUrl}
            alt="profile-pic"
          />
          <span className="Block-Author__name">{displayName}</span>
        </Link>
        <Subscribe to={[GlobalContext]}>
          {context =>
            context.state.isLoggedIn &&
            context.state.user.slug !== slug && (
              <div className="author-info__follow-btn">
                <ButtonFollowUser
                  isCurrentUserFollowed={isCurrentUserFollowed}
                  followingUser={slug}
                  classButton="author-info__follow-btn"
                />
              </div>
            )
          }
        </Subscribe>
      </div>
    </div>
  );
});

export default class BlogDetail extends PureComponent {
  _timer = null;

  _updateCountView = () => {
    const {
      client,
      commonProps: {
        queries: { mutation }
      },
      notify
    } = Common;
    const { blog } = this.props;

    client
      .mutate({
        mutation: mutation.increaseView,
        variables: { view: { type: 'BLOG', subjectSlug: blog.blog.slug } }
      })
      .catch(error => {
        if (error.networkError) {
          notify.error('Lỗi kết nối, xin vui lòng thử lại!');
        } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          notify.error(error.graphQLErrors[0].message);
        }
      });
  };

  componentDidMount() {
    this._timer = setTimeout(this._updateCountView, 1000);
  }

  componentWillUnmount() {
    if (this._timer) {
      clearTimeout(this._timer);
    }
  }

  render() {
    const {
      blog: { blog, isOwner }
    } = this.props;

    const {
      slug,
      createdUser,
      sameTopics,
      content,
      coverPage,
      viewCount,
      likeCount,
      commentCount,
      isCurrentUserLiked
    } = blog;

    const {
      commonComps: { LazyImage }
    } = Common;

    return (
      <div className="main Book-Detail">
        <div className="container">
          <div className="row">
            <div className="col-sm-3">
              <LazyImage
                className={'Blog__image'}
                src={getServerDirectUrl(coverPage)}
                alt="Ảnh bìa"
                defaultImage={blogCoverDefaultUrl}
              />
              <BlockAuthor {...blog} {...createdUser} />
            </div>
            <div className="col-sm-9">
              <div className="Block Block-Blog">
                <div className="Blog__intro">
                  <div className="Blog__info">
                    <Link
                      className="Book__title"
                      to={UrlHelper.getUrlBlogDetail({
                        slugBlog: blog.slug
                      })}
                    />
                    <TopicList data={blog} />
                    <TagList data={blog} />
                    <ShareLike
                      isOwner={isOwner}
                      subjectSlug={slug}
                      type="BLOG"
                      viewCount={viewCount}
                      likeCount={likeCount}
                      commentCount={commentCount}
                      isCurrentUserLiked={isCurrentUserLiked}
                    />
                  </div>
                </div>
              </div>
              <div className="Block Block-Content">
                <RichEditor value={content} readOnly />
              </div>
            </div>
          </div>

          <BlogSameTopic items={sameTopics} />
          <CommentContainer
            subjectSlug={slug}
            type="BLOG"
            commentCount={commentCount}
          />
        </div>
      </div>
    );
  }
}
