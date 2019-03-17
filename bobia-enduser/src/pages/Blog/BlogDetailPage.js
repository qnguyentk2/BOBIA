import React, { memo } from 'react';
import { Query } from 'react-apollo';
import Common from 'components/common';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import BlogDetail from 'components/Blog/BlogDetail';
import { PARTNERSHIP } from 'constants/index';
import { UrlHelper } from 'helpers/index';
import { isJSON, getServerDirectUrl } from 'utils';
import blogCoverDefaultUrl from 'assets/images/image-not-found.png';

function BlogDetailPage({
  match: {
    params: { slugBlog }
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
        const getBlogFilters = { slug: slugBlog };

        if (!context.state.isLoggedIn) {
          getBlogFilters.partnership = PARTNERSHIP.PUBLIC;
          getBlogFilters.isDel = false;
        }

        return (
          <Query
            query={query.getBlog}
            variables={{ blog: getBlogFilters }}
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

              if (data && data.getBlog && data.getBlog.success === true) {
                const blogData = data.getBlog.blog;

                return (
                  <>
                    {context.renderMeta({
                      title: `BOBIA - ${blogData.title}`,
                      url: UrlHelper.getUrlBlogDetail({
                        slugBlog: blogData.slug
                      }),
                      description: isJSON(blogData.content)
                        ? JSON.parse(blogData.content)
                            .blocks.map(el => el.text)
                            .join('\n')
                        : blogData.content,
                      image: blogData.coverPage
                        ? getServerDirectUrl(blogData.coverPage)
                        : blogCoverDefaultUrl
                    })}
                    <BlogDetail blog={data.getBlog} />;
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

export default memo(BlogDetailPage);
