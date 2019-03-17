import React, { PureComponent, memo } from 'react';
import { Link } from 'react-router-dom';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import ButtonFollowUser from 'components/User/ButtonFollowUser';
import I18n from 'i18next';
import { DropdownList, RichEditor } from 'components/common/Fields';
import Common from 'components/common';
import { UrlHelper } from 'helpers/index';
import CommentContainer from 'components/Social/Comment/CommentContainer';
import ShareLike from 'components/Social/ShareLike';
import { PARTNERSHIP, APPROVE_STATES } from 'constants/index';
import { getServerDirectUrl } from 'utils';
import avatarDefaultUrl from 'assets/images/users/avatar-default.png';

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

const ChapterNavigator = memo(
  ({
    position,
    prevChapterLink,
    nextChapterLink,
    chapterData,
    onLoadOptions,
    onChange
  }) => {
    return (
      <div className="content-footer">
        {position === 'TOP' && (
          <div className="additional-info">
            <BlockAuthor {...chapterData.createdUser} />
            <ShareLike
              subjectSlug={chapterData.slug}
              type="CHAPTER"
              viewCount={chapterData.viewCount}
              likeCount={chapterData.likeCount}
              commentCount={chapterData.commentCount}
              isCurrentUserLiked={chapterData.isCurrentUserLiked}
            />
          </div>
        )}
        {prevChapterLink && (
          <Link to={prevChapterLink} className="content-footer__btn">
            &#8592;
          </Link>
        )}
        <DropdownList
          className="content-header__chapter-list"
          async={true}
          isSearchable={false}
          value={{ label: chapterData.title, value: chapterData.slug }}
          loadOptions={onLoadOptions}
          onChange={onChange}
        />
        {nextChapterLink && (
          <Link to={nextChapterLink} className="content-footer__btn">
            &#8594;
          </Link>
        )}
      </div>
    );
  }
);

export default class ChapterDetail extends PureComponent {
  state = {
    chapterList: [],
    isScrolling: false
  };

  onMouseMove = event => {
    if (this.state.isScrolling) {
      const _scroller = document.getElementsByTagName('html')[0];
      _scroller.scrollLeft -=
        -this.lastClientX + (this.lastClientX = event.clientX);
      _scroller.scrollTop -=
        -this.lastClientY + (this.lastClientY = event.clientY);
    }
  };

  onMouseUp = () => {
    if (this.state.isScrolling) {
      this.setState({
        isScrolling: false
      });
    }
  };

  onMouseDown = event => {
    if (!this.state.isScrolling) {
      this.setState({
        isScrolling: true
      });
      this.lastClientX = event.clientX;
      this.lastClientY = event.clientY;
    }
  };

  _timer = null;

  _handleLoadChapters = (inputValue, callback) => {
    const {
      commonProps: {
        queries: { query },
        notify
      },
      client
    } = Common;

    const {
      chapter: { book },
      context
    } = this.props;

    const getAllChaptersFilters = { isDel: false };

    if (!context.state.isLoggedIn) {
      getAllChaptersFilters.partnership = PARTNERSHIP.PUBLIC;
      getAllChaptersFilters.state = APPROVE_STATES.PUBLISHED;
    }

    client
      .query({
        query: query.getAllChapters,
        variables: {
          filters: getAllChaptersFilters,
          filtersType: 'AND',
          options: {
            populate: 'book',
            populateMatch: {
              slug: book.slug
            },
            limit: 0
          }
        }
      })
      .then(({ data }) => {
        if (
          data &&
          data.getAllChapters &&
          data.getAllChapters.success === true
        ) {
          this.setState(
            { chapterList: data.getAllChapters.chapters.docs },
            callback(
              data.getAllChapters.chapters.docs.map(el => ({
                label: el.title,
                value: el.slug
              }))
            )
          );
        }
      })
      .catch(error => {
        if (error.networkError) {
          notify.error('Lỗi kết nối, xin vui lòng thử lại!');
        } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          notify.error(error.graphQLErrors[0].message);
        }
      });
  };

  _handleChangeChapter = selected => {
    this.props.history.push(
      UrlHelper.getUrlChapterDetail({
        slugBook: this.props.slugBook,
        slugChapter: selected.value
      })
    );
  };

  _buildNameChapter = ({ displayOrder, title }) => {
    return (
      I18n.t('chapter.chapterNumber', { number: displayOrder + 1 }) +
      ': ' +
      title
    );
  };

  _updateCountView = () => {
    const {
      client,
      commonProps: {
        queries: { mutation }
      },
      notify
    } = Common;
    const { chapter } = this.props;

    client
      .mutate({
        mutation: mutation.increaseView,
        variables: { view: { type: 'CHAPTER', subjectSlug: chapter.slug } }
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
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousedown', this.onMouseDown);
  }

  componentWillUnmount() {
    if (this._timer) {
      clearTimeout(this._timer);
    }
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousedown', this.onMouseDown);
  }

  render() {
    const {
      commonComps: { DateTimeBlock }
    } = Common;
    const { isOwner, chapter, context } = this.props;
    const { book } = chapter;

    const currentChapterIndex = this.state.chapterList.findIndex(
      option => option.slug === chapter.slug
    );

    const prevChapterSlug =
      currentChapterIndex === -1 || currentChapterIndex === 0
        ? ''
        : this.state.chapterList[currentChapterIndex - 1].slug;

    const nextChapterSlug =
      currentChapterIndex === -1 ||
      currentChapterIndex === this.state.chapterList.length - 1
        ? ''
        : this.state.chapterList[currentChapterIndex + 1].slug;

    const hrefBookDetail = UrlHelper.getUrlBookDetail({
      slugBook: book.slug
    });

    const hrefChapterDetail = UrlHelper.getUrlChapterDetail({
      slugBook: book.slug,
      slugChapter: chapter.slug
    });

    const hrefChapterUpdate = UrlHelper.getUrlChapterUpdate({
      slugBook: book.slug,
      slugChapter: chapter.slug
    });

    return (
      <div className="ChapterDetail">
        <div className="container">
          {context.renderMeta({
            title: `BOBIA - ${chapter.title}`,
            url: hrefChapterDetail
          })}
          <div className="ChapterDetail__right-space" />
          <div className="ChapterDetail__main-content">
            <div className="ChapterDetail__main-content__content">
              <div className="content-header">
                <Link
                  className="content-header__title content-header__title-book"
                  to={hrefBookDetail}
                >
                  {book.title}
                </Link>
                <div className="content-header__title content-header__title-chapter">
                  {chapter.title}{' '}
                  {isOwner && (
                    <Link to={hrefChapterUpdate} className="btn btn-primary">
                      <i className="fa fa-edit" />
                      Cập nhật
                    </Link>
                  )}
                </div>
                <div className="content-header__title content-header__title-time">
                  <i className="fa fa-clock" /> -{' '}
                  <DateTimeBlock date={chapter.updatedAt} />
                </div>
                <ChapterNavigator
                  position="TOP"
                  prevChapterLink={
                    prevChapterSlug
                      ? UrlHelper.getUrlChapterDetail({
                          slugBook: book.slug,
                          slugChapter: prevChapterSlug
                        })
                      : prevChapterSlug
                  }
                  nextChapterLink={
                    nextChapterSlug
                      ? UrlHelper.getUrlChapterDetail({
                          slugBook: book.slug,
                          slugChapter: nextChapterSlug
                        })
                      : nextChapterSlug
                  }
                  chapterData={chapter}
                  onLoadOptions={this._handleLoadChapters}
                  onChange={this._handleChangeChapter}
                />
              </div>
              <div className="paragrap-df content-txt">
                <RichEditor value={chapter.content} readOnly />
              </div>
              <ChapterNavigator
                position="BOTTOM"
                prevChapterLink={
                  prevChapterSlug
                    ? UrlHelper.getUrlChapterDetail({
                        slugBook: book.slug,
                        slugChapter: prevChapterSlug
                      })
                    : prevChapterSlug
                }
                nextChapterLink={
                  nextChapterSlug
                    ? UrlHelper.getUrlChapterDetail({
                        slugBook: book.slug,
                        slugChapter: nextChapterSlug
                      })
                    : nextChapterSlug
                }
                chapterData={chapter}
                onLoadOptions={this._handleLoadChapters}
                onChange={this._handleChangeChapter}
              />
            </div>
            <CommentContainer
              subjectSlug={chapter.slug}
              type="CHAPTER"
              commentCount={chapter.commentCount}
            />
          </div>
        </div>
      </div>
    );
  }
}
