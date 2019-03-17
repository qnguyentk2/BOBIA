import React, { memo } from 'react';
import { Query } from 'react-apollo';
import BlogSlider from './BlogSlider';
import Common from 'components/common';
import { PARTNERSHIP } from 'constants/index';

function BlogList({ orderBy, dir, limit, className }) {
  const {
    commonProps: {
      queries: { query }
    },
    commonComps: { CommonLoading, CommonMessage, Page500 }
  } = Common;

  return (
    <Query
      query={query.getAllBlogs}
      variables={{
        filters: {
          partnership: PARTNERSHIP.PUBLIC,
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

        if (data && data.getAllBlogs && data.getAllBlogs.success === true) {
          const docs = data.getAllBlogs.blogs.docs;

          if (!docs.length) {
            return (
              <CommonMessage type="info" messages={['Chưa có bài viết nào']} />
            );
          }

          return (
            <BlogSlider blogDetails={data.getAllBlogs} className={className} />
          );
        }
      }}
    </Query>
  );
}

export default memo(BlogList);
