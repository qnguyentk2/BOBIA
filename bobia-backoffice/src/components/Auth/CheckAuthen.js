import React, { memo } from 'react';
import { Query } from 'react-apollo';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import Common from 'components/common';

function checkAuthen(WrappedComponent) {
  return memo(props => {
    let isContextChanging = false;

    const {
      commonProps: {
        queries: { query }
      },
      commonComps: { CommonLoading, Page500 }
    } = Common;

    return (
      <Subscribe to={[GlobalContext]}>
        {context => (
          <Query
            query={query.checkAuthen}
            variables={{
              token: window.localStorage
                ? window.localStorage.getItem('token')
                : '',
              portal: 'OFFICE'
            }}
            fetchPolicy="no-cache"
          >
            {({ loading, error, data }) => {
              if (loading) {
                return <CommonLoading />;
              }

              if (error && error.networkError) {
                return <Page500 error={error.networkError} />;
              }

              if (data && data.checkAuthen) {
                if (isContextChanging === false) {
                  isContextChanging = true;

                  context.changeLoggedInState(
                    {
                      isLoggedIn: data.checkAuthen.success,
                      banner: data.checkAuthen.banner,
                      user: data.checkAuthen.user
                    },
                    () => (isContextChanging = false)
                  );
                }
              }

              return <WrappedComponent {...props} />;
            }}
          </Query>
        )}
      </Subscribe>
    );
  });
}

export default checkAuthen;
