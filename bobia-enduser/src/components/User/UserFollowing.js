import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import Common from 'components/common';
import UserBlock from 'components/User/UserBlock';

export default class UserFollowing extends PureComponent {
  state = {
    variables: {
      page: 1
    }
  };

  _handlePageChange = page => {
    this.setState({ variables: { page } });
  };
  render() {
    const {
      commonProps: {
        queries: { query }
      },
      commonComps: { CommonMessage, CommonLoading, CommonPagination, Page500 }
    } = Common;

    const { userSlug } = this.props;

    return (
      <Query
        query={query.getAllFollowings}
        variables={{ filters: { userSlug } }}
        fetchPolicy="network-only"
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <CommonLoading />;
          }

          if (error && error.networkError) {
            return <Page500 error={error.networkError} />;
          }

          if (
            data &&
            data.getAllFollowings &&
            data.getAllFollowings.success === true
          ) {
            const {
              docs,
              page,
              pages,
              limit
            } = data.getAllFollowings.followings;

            if (!docs.length) {
              return (
                <CommonMessage type="info" messages={['Chưa theo dõi ai']} />
              );
            }

            return (
              <>
                <div className="at-grid" data-column="3">
                  {docs.map((itemUserDetail, index) => (
                    <UserBlock
                      key={`user-following-${index}`}
                      itemUserDetail={itemUserDetail}
                    />
                  ))}
                </div>
                {pages > 1 && (
                  <CommonPagination
                    currentPage={page - 1}
                    totalPage={pages}
                    itemPerPage={limit}
                    onPageChange={pageNumber =>
                      this._handlePageChange(pageNumber.selected + 1)
                    }
                  />
                )}
              </>
            );
          }
        }}
      </Query>
    );
  }
}
