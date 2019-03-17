import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import Book from './Book';
import BookSlider from './BookSlider';
import { UrlHelper } from 'helpers/index';
import Common from 'components/common';
import { PARTNERSHIP } from 'constants/index';

function BookList({
  dataType,
  typeList,
  orderBy,
  dir,
  limit,
  className,
  isSlider,
  hoverTransform
}) {
  const {
    commonProps: {
      queries: { query }
    },
    commonComps: { CommonLoading, CommonMessage, Page500 }
  } = Common;

  return (
    <Query
      query={query.getAllBooks}
      variables={{
        filters: {
          partnership: PARTNERSHIP.PUBLIC,
          chapterCount: { $gt: 0 },
          isDel: false
        },
        filtersType: 'AND',
        options: { limit, orderBy, dir }
      }}
      fetchPolicy="network-only"
    >
      {({ loading, error, data }) => {
        if (loading) {
          return <CommonLoading />;
        }

        if (error && error.networkError) {
          return <Page500 error={error.networkError} />;
        }

        if (data && data.getAllBooks && data.getAllBooks.success === true) {
          const docs = data.getAllBooks.books.docs.filter(
            book => book.latestChapter
          );

          if (!docs.length) {
            return (
              <CommonMessage type="info" messages={['Chưa có tác phẩm nào']} />
            );
          }

          if (isSlider) {
            return (
              <BookSlider
                bookDetails={data.getAllBooks}
                typeList={typeList}
                className={className}
              />
            );
          } else {
            const url = UrlHelper.getBookListByType({ type: dataType });

            return (
              <div className="wrapper">
                <div className={`Block BooksBlock ${className}`}>
                  <div className="Block-header">
                    <Link to={url} className="Block-header__text view-more">
                      Xem tất cả
                    </Link>
                  </div>
                  <div className="row">
                    {docs &&
                      docs.map((itemBookDetail, index) => {
                        return (
                          <Book
                            key={`book-${index.toString()}`}
                            index={index}
                            bookDetailData={itemBookDetail}
                            hoverTransform={hoverTransform}
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          }
        }
      }}
    </Query>
  );
}

export default memo(BookList);
