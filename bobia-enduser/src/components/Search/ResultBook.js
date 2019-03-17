import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import { parseEditorContent, getServerDirectUrl } from 'utils';
import Common from 'components/common';

function ResultBook({ data, keyword }) {
  const {
    commonComps: { LazyImage }
  } = Common;

  return (
    <div className="search-book">
      <div className="row">
        {data.books.map(book => (
          <div className="col-md-6 search-book__block">
            <div className="search-book__block__img">
              <Link
                to={`/sach/${book.slug}`}
                key={`book-${book.slug}`}
                className="search-book__block__link"
              >
                <LazyImage
                  src={getServerDirectUrl(book.coverPage)}
                  alt="Book cover"
                />
              </Link>
            </div>
            <div className="search-book__block__content">
              <h3 className="title">
                {keyword ? (
                  <Highlighter
                    highlightClassName="YourHighlightClass"
                    searchWords={keyword.trim().split(' ')}
                    autoEscape={true}
                    textToHighlight={book.title}
                  />
                ) : (
                  book.title
                )}
              </h3>
              <p className="summary">
                {' '}
                {parseEditorContent(book.summary, 100)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ResultBook);
