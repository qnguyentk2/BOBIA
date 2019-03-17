import React, { memo } from 'react';
import { Query, Mutation } from 'react-apollo';
import ChapterForm from 'components/Chapter/ChapterForm';
import Common from 'components/common';

function ChapterUpdate(props) {
  const {
    commonProps: {
      queries: { query, mutation },
      notify
    },
    commonComps: { CommonLoading, CommonMessage, Page500 }
  } = Common;

  return (
    <Query
      query={query.getChapter}
      variables={{ chapter: { slug: props.match.params.slugChapter } }}
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

        if (data && data.getChapter && data.getChapter.success === true) {
          const chapter = data.getChapter.chapter;

          if (data.getChapter.isOwner) {
            return (
              <div className="write-chapter">
                <div className="form-write">
                  <Mutation
                    mutation={mutation.updateChapter}
                    onCompleted={data => {
                      data &&
                        data.updateChapter &&
                        data.updateChapter.success === true &&
                        notify.success('Cập nhật chương thành công!');
                    }}
                  >
                    {(_handleUpdateChapter, { loading, error, data }) => {
                      if (loading) {
                        return <CommonLoading />;
                      }
                      if (error && error.networkError) {
                        return <Page500 error={error.networkError} />;
                      }
                      if (
                        data &&
                        data.updateChapter &&
                        data.updateChapter.success === true
                      ) {
                        return (
                          <ChapterForm
                            onAction={_handleUpdateChapter}
                            initialValues={props.onMergeNewState(
                              data.updateChapter.chapter
                            )}
                            {...props}
                            formType="UPDATE"
                          />
                        );
                      }
                      let chapterInit = Object.assign({}, chapter);

                      if (chapterInit.rating) {
                        chapterInit.newRating = chapterInit.rating;
                      }

                      chapterInit.slugBook = props.match.params.slugBook;

                      return (
                        <div className="form-write">
                          <ChapterForm
                            onAction={_handleUpdateChapter}
                            initialValues={chapterInit}
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
                                  ? 'Chương này đã tồn tại!'
                                  : error.message;
                              })}
                            />
                          ) : null}
                        </div>
                      );
                    }}
                  </Mutation>
                </div>
              </div>
            );
          }

          return (
            <CommonMessage
              type="warning"
              messages={[`Bạn không được quyền cập nhật chương của người khác`]}
            />
          );
        }
      }}
    </Query>
  );
}

export default memo(ChapterUpdate);
