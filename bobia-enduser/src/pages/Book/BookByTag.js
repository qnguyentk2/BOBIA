import React, { PureComponent } from 'react';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import MenuBar from 'components/MenuBar';
import BookListWithPagination from 'components/Book/BookListWithPagination';
import { PARTNERSHIP } from 'constants/index';

export default class BookByCategory extends PureComponent {
  componentDidMount() {
    this.props.changeAsideContent(<MenuBar />);
  }

  render() {
    const {
      match: {
        params: { tagName }
      }
    } = this.props;

    return (
      <Subscribe to={[GlobalContext]}>
        {context => (
          <BookListWithPagination
            key={`bookList`}
            queryType="getAllBooks"
            className={'active'}
            filters={{
              partnership: PARTNERSHIP.PUBLIC,
              isDel: false
            }}
            filtersType="AND"
            options={{
              populate: 'tag',
              populateMatch: {
                name: tagName
              }
            }}
            title={`#${tagName}`}
            changeAsideContent={context.changeAsideContent}
          />
        )}
      </Subscribe>
    );
  }
}
