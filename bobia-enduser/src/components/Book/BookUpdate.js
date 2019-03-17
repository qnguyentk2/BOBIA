import React, { memo } from 'react';
import { Query, Mutation } from 'react-apollo';
import bookDefaultUrl from 'assets/images/users/avatar-default.png';
import BookForm from 'components/Book/BookForm';
import Common from 'components/common';

function BookUpdate(props) {
  const {
    commonProps: {
      queries: { query, mutation },
      notify
    },
    commonComps: { CommonLoading, CommonMessage, Page500 }
  } = Common;

  return (
    <Query
      query={query.getBook}
      variables={{ book: { slug: props.match.params.slugBook } }}
    >
      {({ loading, error, data }) => {
        if (loading) {
          return <CommonLoading />;
        }

        if (error && error.networkError) {
          return <Page500 error={error.networkError} />;
        }

        if (error && error.graphQLErrors && error.graphQLErrors.length > 0) {
          return (
            <CommonMessage
              type="error"
              messages={error.graphQLErrors.map(error => error.message)}
            />
          );
        }

        if (data && data.getBook && data.getBook.success === true) {
          const book = data.getBook.book;

          if (data.getBook.isOwner) {
            return (
              <div className="write-book">
                <Mutation
                  mutation={mutation.updateBook}
                  onCompleted={data => {
                    if (
                      data &&
                      data.updateBook &&
                      data.updateBook.success === true
                    ) {
                      notify.success('Cập nhật thông tin tác phẩm thành công!');
                    }
                  }}
                >
                  {(_handleUpdateBook, { loading, error, data }) => {
                    if (loading) {
                      return <CommonLoading />;
                    }
                    if (error && error.networkError) {
                      return <Page500 error={error.networkError} />;
                    }
                    if (
                      data &&
                      data.updateBook &&
                      data.updateBook.success === true
                    ) {
                      return (
                        <div className="form-write">
                          <BookForm
                            onAction={_handleUpdateBook}
                            initialValues={props.onMergeNewState(
                              data.updateBook.book
                            )}
                            {...props}
                            formType="UPDATE"
                          />
                        </div>
                      );
                    }

                    let bookInit = Object.assign({}, book);

                    if (!bookInit.coverPage) {
                      bookInit.coverPage = bookDefaultUrl;
                    }

                    if (bookInit.categories) {
                      bookInit.newCategories = bookInit.categories.map(el => ({
                        label: el.name,
                        value: el.id
                      }));
                    }

                    if (bookInit.rating) {
                      bookInit.newRating = bookInit.rating;
                    }

                    if (bookInit.tags) {
                      bookInit.newTags = bookInit.tags.map(el => ({
                        label: el.name,
                        value: el.id
                      }));
                    }

                    if (bookInit.status) {
                      bookInit.newStatus = bookInit.status;
                    }

                    if (bookInit.type === 'ONE_SHOT') {
                      bookInit.type = true;
                    } else {
                      bookInit.type = false;
                    }

                    return (
                      <div className="form-write">
                        <BookForm
                          onAction={_handleUpdateBook}
                          initialValues={bookInit}
                          {...props}
                          formType="UPDATE"
                        />
                        {error &&
                        error.graphQLErrors &&
                        error.graphQLErrors.length > 0 ? (
                          <CommonMessage
                            type="error"
                            messages={error.graphQLErrors.map(error => {
                              return error.message.includes(
                                'duplicate key error'
                              )
                                ? 'Sách này đã tồn tại!'
                                : error.message;
                            })}
                          />
                        ) : null}
                      </div>
                    );
                  }}
                </Mutation>
              </div>
            );
          }
          return (
            <CommonMessage
              type="warning"
              messages={[
                `Bạn không được quyền cập nhật tác phẩm của người khác`
              ]}
            />
          );
        }
      }}
    </Query>
  );
}

export default memo(BookUpdate);
