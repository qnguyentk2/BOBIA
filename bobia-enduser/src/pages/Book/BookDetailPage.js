import React, { memo } from 'react';
import { Query } from 'react-apollo';
import Common from 'components/common';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import BookDetail from 'components/Book/BookDetail';
import { PARTNERSHIP } from 'constants/index';
import { UrlHelper } from 'helpers/index';
import { isJSON, getServerDirectUrl } from 'utils';
import bookCoverDefaultUrl from 'assets/images/image-not-found.png';

function BookDetailPage({
  match: {
    params: { slugBook }
  }
}) {
  const {
    commonProps: {
      queries: { query }
    },
    commonComps: { CommonLoading, CommonMessage, Page500 }
  } = Common;

  return (
    <Subscribe to={[GlobalContext]}>
      {context => {
        const getBookFilters = { slug: slugBook };

        if (!context.state.isLoggedIn) {
          getBookFilters.partnership = PARTNERSHIP.PUBLIC;
          getBookFilters.chapterCount = { $gt: 0 };
          getBookFilters.isDel = false;
        }

        return (
          <Query
            query={query.getBook}
            variables={{ book: getBookFilters }}
            fetchPolicy="network-only"
          >
            {({ loading, error, data }) => {
              if (loading) {
                return <CommonLoading full />;
              }

              if (error && error.networkError) {
                return <Page500 error={error.networkError} />;
              }

              if (
                error &&
                error.graphQLErrors &&
                error.graphQLErrors.length > 0
              ) {
                return (
                  <CommonMessage
                    type="error"
                    messages={error.graphQLErrors.map(error => error.message)}
                  />
                );
              }

              if (data && data.getBook && data.getBook.success === true) {
                const bookData = data.getBook.book;

                return (
                  <>
                    {context.renderMeta({
                      title: `BOBIA - ${bookData.title}`,
                      url: UrlHelper.getUrlBookDetail({
                        slugBook: bookData.slug
                      }),
                      description: isJSON(bookData.summary)
                        ? JSON.parse(bookData.summary)
                            .blocks.map(el => el.text)
                            .join('\n')
                        : bookData.summary,
                      image: bookData.coverPage
                        ? getServerDirectUrl(bookData.coverPage)
                        : bookCoverDefaultUrl
                    })}
                    <BookDetail book={data.getBook} />;
                  </>
                );
              }
            }}
          </Query>
        );
      }}
    </Subscribe>
  );
}

export default memo(BookDetailPage);
