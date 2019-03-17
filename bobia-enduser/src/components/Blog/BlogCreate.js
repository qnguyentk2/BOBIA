import React, { memo } from 'react';
import { Mutation } from 'react-apollo';
import blogDefaultUrl from 'assets/images/users/avatar-default.png';
import BlogForm from 'components/Blog/BlogForm';
import Common from 'components/common';

function BlogCreate(props) {
  const {
    commonProps: {
      queries: { mutation },
      notify
    },
    commonComps: { CommonLoading, CommonMessage, Page500 }
  } = Common;

  return (
    <div className="write-book">
      <Mutation
        mutation={mutation.createBlog}
        onCompleted={data => {
          if (data && data.createBlog && data.createBlog.success === true) {
            notify.success('Tạo bài viết mới thành công!');
          }
        }}
      >
        {(_handleCreateBlog, { loading, error, data }) => {
          if (loading) {
            return <CommonLoading />;
          }
          if (error && error.networkError) {
            return <Page500 error={error.networkError} />;
          }
          if (data && data.createBlog && data.createBlog.success === true) {
            return (
              <div className="form-write">
                <BlogForm
                  onAction={_handleCreateBlog}
                  initialValues={props.onMergeNewState(data.createBlog.blog)}
                  {...props}
                />
              </div>
            );
          }

          let blogInit = props.blog
            ? Object.assign({}, props.blog)
            : { ...props.initialValues };

          if (!blogInit.coverPage) {
            blogInit.coverPage = blogDefaultUrl;
          }

          return (
            <div className="form-write">
              <BlogForm
                onAction={_handleCreateBlog}
                initialValues={blogInit}
                {...props}
              />
              {error &&
              error.graphQLErrors &&
              error.graphQLErrors.length > 0 ? (
                <CommonMessage
                  type="error"
                  messages={error.graphQLErrors.map(error => {
                    return error.message.includes('duplicate key error')
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

export default memo(BlogCreate);
