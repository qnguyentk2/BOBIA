import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import I18next from 'i18next';
import { UrlHelper } from 'helpers/index';

function BookReadingAction({ type, chapterCount, slug, latestChapter }) {
  const href = latestChapter
    ? UrlHelper.getUrlChapterDetail({
        slugBook: slug,
        slugChapter: latestChapter.slug
      })
    : '/';

  return type === 'ONE_SHOT' ? (
    <div className="Book__just-read">
      <Link to={href} className="Book__just-read__btn">
        Đọc luôn
      </Link>
    </div>
  ) : (
    <div className="Book__just-read">
      <Link to={href} className="Book__just-read__btn">
        {I18next.t('book.newChapter', 'Chương Mới')}: {chapterCount}
      </Link>
    </div>
  );
}
export default memo(BookReadingAction);
