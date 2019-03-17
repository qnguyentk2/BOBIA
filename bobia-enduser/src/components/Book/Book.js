import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Common from 'components/common';
import BookCounts from './BookCounts';
import CategoryList from 'components/Category/CategoryList';
import BookSummary from './BookSummary';
import TagList from '../Tag/TagList';
import BookTitle from './BookTitle';
import BookReadingAction from './BookReadingAction';
import DateTimeBlock from 'components/common/DateTimeBlock';
import avatarDefaultUrl from 'assets/images/users/avatar-default.png';
import bookCoverDefaultUrl from 'assets/images/image-not-found.png';
import { BOOK_STATUS } from 'constants/index';
import { UrlHelper } from 'helpers/index';
import { getServerDirectUrl } from 'utils';
import classNames from 'classnames';

function Book({ bookDetailData, index, col, listType, hoverTransform }) {
  const {
    commonComps: { LazyImage }
  } = Common;

  const renderAuthor = itemBookDetail => {
    const { createdUser, createdAt } = itemBookDetail;

    return (
      <div className="Book__info__bottom">
        {createdUser && (
          <div className="Author">
            <div className="Author__left">
              <span title="Tác giả" className="Author__img">
                <LazyImage
                  src={getServerDirectUrl(createdUser.profileUrl)}
                  defaultImage={avatarDefaultUrl}
                  alt={createdUser.displayName}
                  className="image"
                  href={UrlHelper.getUrlUserDetail({
                    slugUser: createdUser.slug
                  })}
                />
              </span>
            </div>
            <div className="Author__right text-left">
              <Link
                to={UrlHelper.getUrlUserDetail({ slugUser: createdUser.slug })}
                className="Author__display-name"
              >
                {createdUser.displayName}
              </Link>
              <DateTimeBlock date={createdAt} className="Author__updated" />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBookStatus = ({ status }) => {
    if (status === BOOK_STATUS.COMPLETED) {
      return (
        <span className={`Book__label status-item ${status.toLowerCase()}`}>
          Đã hoàn thành
        </span>
      );
    } else if (status === BOOK_STATUS.DROPPED) {
      return (
        <span className={`Book__label status-item ${status.toLowerCase()}`}>
          Tạm ngưng
        </span>
      );
    }

    return (
      <span className={`Book__label status-item ${status.toLowerCase()}`}>
        Đang tiến hành
      </span>
    );
  };

  const articleClass = classNames({
    Book: true,
    'favorite-book__item': listType === 'favorite-book'
  });

  return (
    bookDetailData && (
      <div
        className={col ? `${col} favorite-book` : 'col-md-6'}
        key={'bookDetail_' + bookDetailData.slug + '_' + index}
      >
        <article className={articleClass}>
          <BookTitle data={bookDetailData} />
          <div className="Book__labels">
            <span className="Book__label label-age ">
              {bookDetailData.rating}
            </span>
          </div>
          <CategoryList data={bookDetailData} />
          <div className="row Book__intro">
            {/* className="col-sm-8 Book__info" */}
            <div
              className={listType === 'favorite-book' ? 'col-sm-9' : 'col-sm-8'}
            >
              <BookSummary data={bookDetailData} limitWords={22} />
              <BookReadingAction
                type={bookDetailData.type}
                chapterCount={bookDetailData.chapterCount}
                slug={bookDetailData.slug}
                latestChapter={bookDetailData.latestChapter}
                rating={bookDetailData.rating}
              />
              {renderBookStatus(bookDetailData)}
              <BookCounts data={bookDetailData} />
              <TagList data={bookDetailData} />
              {renderAuthor(bookDetailData)}
            </div>
            <LazyImage
              href={UrlHelper.getUrlBookDetail({
                slugBook: bookDetailData.slug
              })}
              hrefclassName={
                listType === 'favorite-book' ? 'col-sm-2' : 'col-sm-4'
              }
              // hrefclassName="col-sm-4"
              src={getServerDirectUrl(bookDetailData.coverPage)}
              defaultImage={bookCoverDefaultUrl}
              className={`Book__image ${
                hoverTransform ? 'hover-transform' : ''
              }`}
              alt="Ảnh bìa"
            />
          </div>
        </article>
      </div>
    )
  );
}

export default memo(Book);
