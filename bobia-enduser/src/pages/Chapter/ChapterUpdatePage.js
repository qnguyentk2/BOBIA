import React, { PureComponent } from 'react';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import ChapterUpdate from 'components/Chapter/ChapterUpdate';

export default class ChapterUpdatePage extends PureComponent {
  state = {
    initialValues: {
      slug: '',
      slugBook: this.props.match.params.slugBook,
      rating: '',
      newRating: '',
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
            <ChapterUpdate
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
