import React, { memo } from 'react';
import { Query } from 'react-apollo';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import Common from 'components/common';
import ChapterDetail from 'components/Chapter/ChapterDetail';
import {
  PARTNERSHIP,
  APPROVE_STATES,
  BOOK_AGE_REQUIRE_LOGIN
} from 'constants/index';

function ChapterDetailPage(props) {
  const {
    match: {
      params: { slugBook, slugChapter }
    }
  } = props;
  const {
    commonProps: {
      queries: { query }
    },
    commonComps: { CommonLoading, CommonMessage, Page500 }
  } = Common;

  return (
    <Subscribe to={[GlobalContext]}>
      {context => {
        const getChapterfilters = { slug: slugChapter, isDel: false };

        if (!context.state.isLoggedIn) {
          getChapterfilters.partnership = PARTNERSHIP.PUBLIC;
          getChapterfilters.state = APPROVE_STATES.PUBLISHED;
        }

        return (
          <Query
            query={query.getChapter}
            variables={{ chapter: getChapterfilters }}
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

              if (data && data.getChapter && data.getChapter.success === true) {
                const chapter = data.getChapter.chapter;

                if (
                  !context.state.isLoggedIn &&
                  BOOK_AGE_REQUIRE_LOGIN.includes(chapter.rating)
                ) {
                  return context.renderNeedLogin();
                } else {
                  return (
                    <ChapterDetail
                      slugBook={slugBook}
                      isOwner={data.getChapter.isOwner}
                      chapter={chapter}
                      context={context}
                      {...props}
                    />
                  );
                }
              }
            }}
          </Query>
        );
      }}
    </Subscribe>
  );
}

export default memo(ChapterDetailPage);
