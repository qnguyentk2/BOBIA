import React, { PureComponent } from 'react';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import BlogUpdate from 'components/Blog/BlogUpdate';
import { getServerDirectUrl } from 'utils';

export default class BlogUpdatePage extends PureComponent {
  state = {
    initialValues: {
      slug: '',
      topics: '',
      newTopics: '',
      tags: '',
      newTags: '',
      title: '',
      content: '',
      coverPage: ''
    }
  };

  _handleSaveNewValue = (values, callback) => {
    this.setState({ initialValues: values }, callback);
  };

  _handleMergeNewState = blog => {
    let newState = Object.assign({}, this.state.initialValues);
    if (blog) {
      if (blog.coverPage) {
        newState.coverPage = getServerDirectUrl(blog.coverPage);
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
            <BlogUpdate
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
