import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import classNames from 'classnames';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import Common from 'components/common';
import ChapterList from 'components/Chapter/ChapterList';
import { PARTNERSHIP, APPROVE_STATES } from 'constants/index';

export default class ChapterListInBookDetail extends PureComponent {
  state = {
    variables: {
      limit: 0,
      page: 1,
      orderBy: 'createdAt',
      dir: 'desc'
    }
  };

  _handleOrderByList = dir => e => {
    e.preventDefault();

    this.setState({
      variables: {
        page: 1,
        limit: 0,
        orderBy: 'createdAt',
        dir
      }
    });
  };

  render() {
    const {
      commonProps: {
        queries: { query }
      },
      commonComps: { CommonLoading, Page500 }
    } = Common;

    const { slugBook, isOwner } = this.props;

    return (
      <Subscribe to={[GlobalContext]}>
        {context => {
          const getAllChaptersfilters = { isDel: false };

          if (!context.state.isLoggedIn || !isOwner) {
            getAllChaptersfilters.partnership = PARTNERSHIP.PUBLIC;
            getAllChaptersfilters.state = APPROVE_STATES.PUBLISHED;
          }

          return (
            <Query
              query={query.getAllChapters}
              variables={{
                filters: getAllChaptersfilters,
                filtersType: 'AND',
                options: {
                  populate: 'book',
                  populateMatch: {
                    slug: slugBook
                  },
                  ...this.state.variables
                }
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

                if (
                  data &&
                  data.getAllChapters &&
                  data.getAllChapters.success === true
                ) {
                  const { docs } = data.getAllChapters.chapters;

                  return (
                    <div className="Block">
                      <div className="Block-filter">
                        <h3 className="Chapter-title">Danh sách chương</h3>
                        <div className="filter">
                          Sắp xếp theo
                          <span
                            className={classNames({
                              'btn btn-primary-gray': true,
                              active: this.state.variables.dir === 'asc'
                            })}
                            onClick={this._handleOrderByList('asc')}
                          >
                            <span className="btn-text">Cũ đến mới</span>
                          </span>
                          <span
                            className={classNames({
                              'btn btn-primary-gray': true,
                              active: this.state.variables.dir === 'desc'
                            })}
                            onClick={this._handleOrderByList('desc')}
                          >
                            <span className="btn-text">Mới đến cũ</span>
                          </span>
                        </div>
                      </div>
                      <ChapterList
                        slugBook={slugBook}
                        chapters={docs}
                        isOwner={isOwner}
                      />
                    </div>
                  );
                }
              }}
            </Query>
          );
        }}
      </Subscribe>
    );
  }
}
