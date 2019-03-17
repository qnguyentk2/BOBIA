import React, { PureComponent } from 'react';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import Common from 'components/common';
import BlogCreate from 'components/Blog/BlogCreate';
import { getServerDirectUrl } from 'utils';

export default class BlogCreatePage extends PureComponent {
  state = {
    initialValues: {
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
    const {
      commonComps: { CommonMessage }
    } = Common;

    return (
      <Subscribe to={[GlobalContext]}>
        {context => {
          if (!context.state.isLoggedIn) {
            return context.renderNeedLogin();
          }

          if (!['ADMIN', 'OFFICER'].includes(context.state.user.role)) {
            return (
              <CommonMessage
                type="warning"
                messages={[`Bạn không được quyền truy cập trang này`]}
              />
            );
          }

          return (
            <BlogCreate
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
