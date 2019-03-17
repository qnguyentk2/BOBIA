import React, { PureComponent } from 'react';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import BookCreate from 'components/Book/BookCreate';
import { getServerDirectUrl } from 'utils';
import { RATING_OPTIONS, BOOK_STATUS_OPTION } from 'constants/index';

export default class BookCreatePage extends PureComponent {
  state = {
    initialValues: {
      categories: '',
      newCategories: '',
      rating: 'G',
      newRating: RATING_OPTIONS[0],
      tags: '',
      newTags: '',
      title: '',
      summary: '',
      coverPage: '',
      status: 'ONGOING',
      newStatus: BOOK_STATUS_OPTION[0],
      type: false
    }
  };

  _handleSaveNewValue = (values, callback) => {
    this.setState({ initialValues: values }, callback);
  };

  _handleMergeNewState = book => {
    let newState = Object.assign({}, this.state.initialValues);
    if (book) {
      if (book.coverPage) {
        newState.coverPage = getServerDirectUrl(book.coverPage);
      }
    }
    return newState;
  };

  render() {
    return (
      <Subscribe to={[GlobalContext]}>
        {context => {
          if (!context.state.isLoggedIn) {
            return context.renderNeedLogin();
          }

          return (
            <BookCreate
              onSaveNewValue={this._handleSaveNewValue}
              onMergeNewState={this._handleMergeNewState}
              initialValues={this.state.initialValues}
              userSlug={context.state.user.slug}
              {...this.props}
            />
          );
        }}
      </Subscribe>
    );
  }
}
