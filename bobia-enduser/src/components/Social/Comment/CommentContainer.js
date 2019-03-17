import React, { memo } from 'react';
import { Query } from 'react-apollo';
import InfiniteScroll from 'react-infinite-scroller';
import Common from 'components/common';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import CommentFormInput from 'components/Social/Comment/CommentFormInput';
import CommentItem from './CommentItem';
import { PARTNERSHIP } from 'constants/index';

function CommentContainer({ subjectSlug, type }) {
  const _loadMoreComment = (fetchMore, page) => {
    fetchMore({
      variables: {
        filters: { type, parentId: 0, subjectSlug },
        filtersType: 'AND',
        options: {
          populate: type.toLowerCase(),
          populateMatch: {
            slug: subjectSlug
          },
          orderBy: 'createdAt',
          dir: 'desc',
          page
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        const mergedResult = fetchMoreResult;
        mergedResult.getAllComments.comments.docs = [
          ...prev.getAllComments.comments.docs,
          ...mergedResult.getAllComments.comments.docs
        ];

        return mergedResult;
      }
    });
  };

  const {
    commonProps: {
      queries: { query }
    },
    commonComps: { CommonLoading, Page500 }
  } = Common;

  return (
    <Subscribe to={[GlobalContext]}>
      {context => {
        const getAllCommentsfilters = { type, parentId: 0 };

        if (!context.state.isLoggedIn) {
          getAllCommentsfilters.partnership = PARTNERSHIP.PUBLIC;
        }

        return (
          <div className="comment-container" id="comment">
            <CommentFormInput subjectSlug={subjectSlug} type={type} />
            <Query
              query={query.getAllComments}
              variables={{
                filters: getAllCommentsfilters,
                filtersType: 'AND',
                options: {
                  populate: type.toLowerCase(),
                  populateMatch: {
                    slug: subjectSlug
                  },
                  orderBy: 'createdAt',
                  dir: 'desc'
                }
              }}
            >
              {({ loading, error, data, fetchMore }) => {
                if (loading) {
                  return <CommonLoading />;
                }
                if (error && error.networkError) {
                  return <Page500 error={error.networkError} />;
                }
                if (
                  data &&
                  data.getAllComments &&
                  data.getAllComments.success === true
                ) {
                  const { docs, page, pages } = data.getAllComments.comments;

                  return (
                    <InfiniteScroll
                      pageStart={1}
                      loadMore={page => _loadMoreComment(fetchMore, page)}
                      hasMore={page !== pages}
                      loader={<CommonLoading />}
                    >
                      {docs.map(comment => {
                        return (
                          <CommentItem
                            {...comment}
                            key={`comment_item_${comment.id}`}
                          />
                        );
                      })}
                    </InfiniteScroll>
                  );
                }
              }}
            </Query>
          </div>
        );
      }}
    </Subscribe>
  );
}

export default memo(CommentContainer);
