import React, { PureComponent } from 'react';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import MenuBar from 'components/MenuBar';
import BookListWithPagination from 'components/Book/BookListWithPagination';
import { BOOK_CATEGORIES, PARTNERSHIP } from 'constants/index';

export default class BookByCategory extends PureComponent {
  componentDidMount() {
    this.props.changeAsideContent(<MenuBar />);
  }

  render() {
    const {
      match: {
        params: { slugCate }
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
              populate: 'category',
              populateMatch: {
                slug: slugCate
              }
            }}
            title={BOOK_CATEGORIES[slugCate]}
            changeAsideContent={context.changeAsideContent}
          />
        )}
      </Subscribe>
    );
  }
}
