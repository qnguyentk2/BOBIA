import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import Common from 'components/common';
import Book from './Book';

export default class BookSubscription extends PureComponent {
  state = {
    variables: {
      page: 1
    },
    limit: 10
  };

  _handlePageChange = page => {
    this.setState({ variables: { page } });
  };
  render() {
    const {
      commonProps: {
        queries: { query }
      },
      commonComps: { CommonMessage, CommonLoading, CommonPagination, Page500 }
    } = Common;

    const { userSlug } = this.props;

    return (
      <Query
        query={query.getAllFavoriteSubjects}
        variables={{ filters: { type: 'BOOK', userSlug }, filtersType: 'AND' }}
        fetchPolicy="network-only"
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <CommonLoading />;
          }

          if (error && error.networkError) {
            return <Page500 error={error.networkError} />;
          }

          if (
            data &&
            data.getAllFavoriteSubjects &&
            data.getAllFavoriteSubjects.success === true
          ) {
            const {
              docs,
              page,
              pages,
              limit
            } = data.getAllFavoriteSubjects.subjects;

            if (!docs.length) {
              return (
                <CommonMessage
                  type="info"
                  messages={['Chưa yêu thích tác phẩm nào']}
                />
              );
            }

            return (
              docs &&
              docs.map((itemBookDetail, index) => {
                return (
                  <React.Fragment key={`book-${index.toString()}`}>
                    <Book
                      index={index}
                      bookDetailData={itemBookDetail}
                      col="col-md-12"
                      listType="favorite-book"
                    />
                    {pages > 1 && (
                      <CommonPagination
                        currentPage={page - 1}
                        totalPage={pages}
                        itemPerPage={limit}
                        onPageChange={pageNumber =>
                          this._handlePageChange(pageNumber.selected + 1)
                        }
                      />
                    )}
                  </React.Fragment>
                );
              })
            );
          }
        }}
      </Query>
    );
  }
}
