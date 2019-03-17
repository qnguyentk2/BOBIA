import React, { PureComponent } from 'react';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import BookUpdate from 'components/Book/BookUpdate';
import { getServerDirectUrl } from 'utils';

export default class BookUpdatePage extends PureComponent {
  state = {
    initialValues: {
      slug: '',
      categories: '',
      newCategories: '',
      rating: '',
      newRating: '',
      tags: '',
      newTags: '',
      title: '',
      summary: '',
      coverPage: '',
      status: '',
      newStatus: '',
      type: ''
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
            <BookUpdate
              match={this.props.match}
              onSaveNewValue={this._handleSaveNewValue}
              onMergeNewState={this._handleMergeNewState}
              {...this.props}
            />
          );
        }}
      </Subscribe>
    );
  }
}
