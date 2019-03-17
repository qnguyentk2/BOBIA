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
import { UrlHelper } from 'helpers/index';
import { getServerDirectUrl } from 'utils';

import { BOOK_STATUS } from 'constants/index';

function BookFull({ bookDetailData, index }) {
  const {
    commonComps: { LazyImage }
  } = Common;

  const _renderAuthor = itemBookDetail => {
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

  const _renderBookStatus = ({ status }) => {
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

  return (
    bookDetailData && (
      <div key={'bookDetail_' + bookDetailData.slug + '_' + index}>
        <article className="Book Book-full">
          <div className="row Book__intro">
            <div className="col-md-9 Book__info">
              <BookTitle data={bookDetailData} />
              <div className="Book__labels">
                <span className="Book__label label-age ">
                  {bookDetailData.rating}
                </span>
              </div>
              <CategoryList data={bookDetailData} />
              <BookSummary data={bookDetailData} limitWords={50} />
              <div className="row">
                <div className="col-md-5 padding-lr-20 border-right">
                  <BookReadingAction
                    type={bookDetailData.type}
                    chapterCount={bookDetailData.chapterCount}
                    slug={bookDetailData.slug}
                    latestChapter={bookDetailData.latestChapter}
                    rating={bookDetailData.rating}
                  />
                  {_renderBookStatus(bookDetailData)}
                  <BookCounts data={bookDetailData} />
                </div>
                <div className="col-md-5 padding-lr-20">
                  {_renderAuthor(bookDetailData)}
                </div>
              </div>
              <TagList data={bookDetailData} />
            </div>
            <LazyImage
              href={UrlHelper.getUrlBookDetail({
                slugBook: bookDetailData.slug
              })}
              hrefclassName="col-md-3"
              src={getServerDirectUrl(bookDetailData.coverPage)}
              defaultImage={bookCoverDefaultUrl}
              className="Book__image"
              alt="Ảnh bìa"
            />
          </div>
        </article>
      </div>
    )
  );
}

export default memo(BookFull);
