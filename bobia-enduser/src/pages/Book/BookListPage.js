import React, { PureComponent } from 'react';
import { Subscribe } from 'unstated';
import MenuBar from 'components/MenuBar';
import { GlobalContext } from 'components/common/Context';
import { BookListHelper } from 'helpers/index';
import BookListWithPagination from 'components/Book/BookListWithPagination';
import { PARTNERSHIP } from 'constants/index';

export default class BookListPage extends PureComponent {
  componentDidMount() {
    this.props.changeAsideContent(<MenuBar />);
  }

  render() {
    const { typeBookList } = this.props;
    const { dir, orderBy } = BookListHelper.getDirAndOrderByType({
      typeBookList
    });
    const title = BookListHelper.getTitleByType({ typeBookList });

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
            options={{ orderBy, dir }}
            title={title}
            changeAsideContent={context.changeAsideContent}
          />
        )}
      </Subscribe>
    );
  }
}
