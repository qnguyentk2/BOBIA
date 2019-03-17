import React, { memo, PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import ButtonFollowUser from 'components/User/ButtonFollowUser';
import { UrlHelper } from 'helpers/index';
import Common from 'components/common';
import CommentContainer from 'components/Social/Comment/CommentContainer';
import BookTitle from './BookTitle';
import CategoryList from 'components/Category/CategoryList';
import TagList from 'components/Tag/TagList';
import BookSameCategory from './BookSameCategory';
import ChapterListInBookDetail from '../Chapter/ChapterListInBookDetail';
import ShareLike from 'components/Social/ShareLike';
import { getServerDirectUrl } from 'utils';
import avatarDefaultUrl from 'assets/images/users/avatar-default.png';
import bookCoverDefaultUrl from 'assets/images/image-not-found.png';

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

export default class BookDetail extends PureComponent {
  _timer = null;

  _updateCountView = () => {
    const {
      client,
      commonProps: {
        queries: { mutation }
      },
      notify
    } = Common;
    const { book } = this.props;

    client
      .mutate({
        mutation: mutation.increaseView,
        variables: { view: { type: 'BOOK', subjectSlug: book.book.slug } }
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
      book: { book, isOwner }
    } = this.props;

    const {
      slug,
      createdUser,
      sameCategories,
      rating,
      summary,
      coverPage,
      viewCount,
      likeCount,
      commentCount,
      isCurrentUserLiked,
      isCurrentUserFavorited,
      isCurrentUserSubcribed
    } = book;

    const {
      commonComps: { CommonBlockSeeMore, LazyImage }
    } = Common;

    return (
      <div className="main Book-Detail">
        <div className="container">
          <div className="row">
            <div className="col-sm-3">
              <LazyImage
                className={'Book__image'}
                src={getServerDirectUrl(coverPage)}
                alt="Ảnh bìa"
                defaultImage={bookCoverDefaultUrl}
              />
              <BlockAuthor {...book} {...createdUser} />
            </div>
            <div className="col-sm-9">
              <div className="Block Block-Book">
                <div className="Book__intro">
                  <div className="Book__info">
                    <BookTitle data={book} isOwner={isOwner} />
                    <div className="Book__labels">
                      <span className="Book__label label-age ">{rating}</span>
                    </div>
                    <CategoryList data={book} />
                    <TagList data={book} />
                    <ShareLike
                      className="Book-Detail-share-like"
                      isOwner={isOwner}
                      subjectSlug={slug}
                      type="BOOK"
                      viewCount={viewCount}
                      likeCount={likeCount}
                      commentCount={commentCount}
                      isCurrentUserLiked={isCurrentUserLiked}
                      isCurrentUserFavorited={isCurrentUserFavorited}
                      isCurrentUserSubcribed={isCurrentUserSubcribed}
                    />
                  </div>
                </div>
              </div>
              <div className="Block Block-Content">
                <CommonBlockSeeMore content={summary} limit={100} />
              </div>
              <ChapterListInBookDetail slugBook={slug} isOwner={isOwner} />
            </div>
          </div>

          <BookSameCategory items={sameCategories} />
          <CommentContainer
            subjectSlug={slug}
            type="BOOK"
            commentCount={commentCount}
          />
        </div>
      </div>
    );
  }
}
