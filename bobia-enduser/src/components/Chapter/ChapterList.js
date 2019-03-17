import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Common from 'components/common';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import { DATE_TIME_FORMAT } from 'constants/index';
import { UrlHelper } from 'helpers/index';
import { BOOK_AGE_REQUIRE_LOGIN } from 'constants/index';

const ChapterRatingLabel = ({ rating }) => {
  if (!BOOK_AGE_REQUIRE_LOGIN.includes(rating)) return null;
  return <span className="Chapter-List__label"> ({rating})</span>;
};

const ChapterListItem = ({ isLoggedIn, item, index, slugBook }) => {
  const {
    commonProps: { notify }
  } = Common;

  const href = UrlHelper.getUrlChapterDetail({
    slugBook,
    slugChapter: item.slug
  });
  let state;

  switch (item.state) {
    case 'DRAFT':
      state = ' (Bản nháp)';
      break;
    case 'PENDING':
      state = ' (Đang chờ duyệt)';
      break;
    case 'REFUSED':
      state = ' (Đã bị từ chối)';
      break;
    default:
      state = '';
      break;
  }

  return (
    <li className="ListOption__item">
      {!isLoggedIn && BOOK_AGE_REQUIRE_LOGIN.includes(item.rating) ? (
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => notify.warn('Vui lòng đăng nhập để xem chương này')}
          className="left-option"
        >
          <span className="Chapter-number">{`${index + 1} -`}</span>
          {item.title}
          <span className={`Chapter-state-${item.state.toLowerCase()}`}>
            {state}
          </span>
          <ChapterRatingLabel rating={item.rating} />
        </span>
      ) : (
        <Link to={href} className="left-option">
          <span className="Chapter-number">{`${index + 1} -`}</span>
          {item.title}
          <span className={`Chapter-state-${item.state.toLowerCase()}`}>
            {state}
          </span>
          <ChapterRatingLabel rating={item.rating} />
        </Link>
      )}
      <span className="right-option">
        {moment(item.updatedAt).format(
          DATE_TIME_FORMAT.DEFAULT_FORMAT_WITH_TIME
        )}
      </span>
    </li>
  );
};

function ChapterList(props) {
  const {
    commonComps: { CommonMessage }
  } = Common;

  const { isOwner, chapters, slugBook, limit } = props;

  let chapterFiltered = [];

  if (chapters && chapters.length) {
    chapterFiltered = isOwner
      ? chapters
      : chapters.filter(el => el.state === 'PUBLISHED');
    if (limit && limit > 0 && chapterFiltered.length > limit) {
      chapterFiltered.length = limit;
    }
  }

  if (!chapterFiltered.length) {
    return <CommonMessage type="info" messages={['Chưa có chương nào']} />;
  }

  return (
    <Subscribe to={[GlobalContext]}>
      {context => (
        <div className="Chapter-List">
          <ul className="ListOption">
            {chapterFiltered.map((item, index) => (
              <ChapterListItem
                key={`ListOption__item-${item.slug}`}
                isLoggedIn={context.state.isLoggedIn}
                isOwner={isOwner}
                item={item}
                index={index}
                slugBook={slugBook}
              />
            ))}
          </ul>
        </div>
      )}
    </Subscribe>
  );
}

export default memo(ChapterList);
