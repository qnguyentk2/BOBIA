import React, { memo } from 'react';
import { Query } from 'react-apollo';
import queryString from 'query-string';
import SearchFilter from './SearchFilter';
import ResultAll from './ResultAll';
import ResultBook from './ResultBook';
import Common from 'components/common';

function Search(props) {
  const {
    commonProps: {
      queries: { query }
    },
    commonComps: { CommonLoading, Page500 }
  } = Common;
  const values = queryString.parse(props.location.search);

  return (
    <Query query={query.search} variables={{ queries: values }}>
      {({ loading, error, data }) => {
        if (loading) {
          return <CommonLoading />;
        }

        if (error && error.networkError) {
          return <Page500 />;
        }

        if (data && data.search && data.search.success === true) {
          let resultBlock;
          switch (data.search.result.type) {
            case 'book':
              resultBlock = (
                <SearchFilter type="book" {...props}>
                  <ResultBook
                    keyword={values.keyword}
                    data={data.search.result.data}
                  />
                </SearchFilter>
              );
              break;
            default:
              resultBlock = (
                <SearchFilter type="all" {...props}>
                  <ResultAll
                    keyword={values.keyword}
                    data={data.search.result.data}
                  />
                </SearchFilter>
              );
              break;
          }
          return resultBlock;
        }

        return <div>Không tìm thấy kết quả nào</div>;
      }}
    </Query>
  );
}

export default memo(Search);
