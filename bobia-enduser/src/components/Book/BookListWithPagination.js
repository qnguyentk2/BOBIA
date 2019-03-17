import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import Common from 'components/common';
import BookFull from './BookFull';
import MenuBar from 'components/MenuBar';

export default class BookListWithPagination extends PureComponent {
  state = {
    variables: {
      page: 1
    }
  };

  _handlePageChange = page => {
    this.setState({ variables: { page } });
  };

  componentDidMount() {
    this.props.changeAsideContent(<MenuBar />);
  }

  render() {
    const {
      commonProps: {
        queries: { query }
      },
      commonComps: { CommonLoading, CommonPagination, Page500 }
    } = Common;
    const { className, queryType, filters, filtersType, options } = this.props;

    return (
      <Query
        query={query[queryType]}
        variables={{
          filters,
          filtersType,
          options: {
            page: this.state.variables.page,
            ...options
          }
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
          if (data && data[queryType] && data[queryType].success === true) {
            const bookData = data[queryType].books;

            return (
              <div className="wrapper">
                <div className={`Block BooksBlock ${className} padding-top-0`}>
                  <div className="container">
                    <div className="Block-header margin-bottom-25">
                      <h2 className="Block-header__list-book">
                        {this.props.title}
                      </h2>
                    </div>
                    <div>
                      {bookData.docs.map((itemBookDetail, index) => {
                        return (
                          <BookFull
                            key={`book-${index.toString()}`}
                            index={index}
                            bookDetailData={itemBookDetail}
                          />
                        );
                      })}
                    </div>
                    {bookData.pages > 1 && (
                      <CommonPagination
                        currentPage={bookData.page - 1}
                        totalPage={bookData.pages}
                        itemPerPage={bookData.limit}
                        onPageChange={pageNumber =>
                          this._handlePageChange(pageNumber.selected + 1)
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          }
        }}
      </Query>
    );
  }
}
