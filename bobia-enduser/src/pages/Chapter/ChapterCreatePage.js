import React, { PureComponent } from 'react';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import ChapterCreate from 'components/Chapter/ChapterCreate';
import { RATING_OPTIONS } from 'constants/index';

export default class ChapterCreatePage extends PureComponent {
  state = {
    initialValues: {
      slugBook: this.props.match.params.slugBook,
      rating: 'G',
      newRating: RATING_OPTIONS[0],
      title: '',
      content: ''
    }
  };

  _handleSaveNewValue = (values, callback) => {
    this.setState({ initialValues: values }, callback);
  };

  _handleMergeNewState = chapter => {
    let newState = Object.assign({}, this.state.initialValues);
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
            <ChapterCreate
              onSaveNewValue={this._handleSaveNewValue}
              onMergeNewState={this._handleMergeNewState}
              initialValues={this.state.initialValues}
              {...this.props}
            />
          );
        }}
      </Subscribe>
    );
  }
}
