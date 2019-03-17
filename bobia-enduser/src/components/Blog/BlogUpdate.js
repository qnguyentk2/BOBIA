import React, { memo } from 'react';
import { Query, Mutation } from 'react-apollo';
import blogDefaultUrl from 'assets/images/users/avatar-default.png';
import BlogForm from 'components/Blog/BlogForm';
import Common from 'components/common';

function BlogUpdate(props) {
  const {
    commonProps: {
      queries: { query, mutation },
      notify
    },
    commonComps: { CommonLoading, CommonMessage, Page500 }
  } = Common;

  return (
    <Query
      query={query.getBlog}
      variables={{ blog: { slug: props.match.params.slugBlog } }}
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

        if (data && data.getBlog && data.getBlog.success === true) {
          const blog = data.getBlog.blog;

          if (data.getBlog.isOwner) {
            return (
              <div className="write-book">
                <Mutation
                  mutation={mutation.updateBlog}
                  onCompleted={data => {
                    if (
                      data &&
                      data.updateBlog &&
                      data.updateBlog.success === true
                    ) {
                      notify.success('Cập nhật thông tin bài viết thành công!');
                    }
                  }}
                >
                  {(_handleUpdateBlog, { loading, error, data }) => {
                    if (loading) {
                      return <CommonLoading />;
                    }
                    if (error && error.networkError) {
                      return <Page500 error={error.networkError} />;
                    }
                    if (
                      data &&
                      data.updateBlog &&
                      data.updateBlog.success === true
                    ) {
                      return (
                        <div className="form-write">
                          <BlogForm
                            onAction={_handleUpdateBlog}
                            initialValues={props.onMergeNewState(
                              data.updateBlog.blog
                            )}
                            {...props}
                            formType="UPDATE"
                          />
                        </div>
                      );
                    }

                    let blogInit = Object.assign({}, blog);

                    if (!blogInit.coverPage) {
                      blogInit.coverPage = blogDefaultUrl;
                    }

                    if (blogInit.topics) {
                      blogInit.newTopics = blogInit.topics.map(el => ({
                        label: el.name,
                        value: el.id
                      }));
                    }

                    if (blogInit.tags) {
                      blogInit.newTags = blogInit.tags.map(el => ({
                        label: el.name,
                        value: el.id
                      }));
                    }

                    return (
                      <div className="form-write">
                        <BlogForm
                          onAction={_handleUpdateBlog}
                          initialValues={blogInit}
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
                                ? 'Bài viết này đã tồn tại!'
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
                `Bạn không được quyền cập nhật bài viết của người khác`
              ]}
            />
          );
        }
      }}
    </Query>
  );
}

export default memo(BlogUpdate);
