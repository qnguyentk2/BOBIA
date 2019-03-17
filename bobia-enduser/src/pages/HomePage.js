import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Subscribe } from 'unstated';
import { TYPE_OF_BOOK_BLOCK } from 'constants/index';
import MenuBar from 'components/MenuBar';
import BookList from 'components/Book/BookList';
import BlogList from 'components/Blog/BlogList';
import { camelToUnderScoreUpper } from 'utils';
import { GlobalContext } from 'components/common/Context';
import { BookListHelper } from 'helpers/index';

export default class HomePage extends PureComponent {
  state = {
    limit: 8,
    defaultTab: 'mostViewBooks',
    activeTabClass: ''
  };

  _renderClassActive = type =>
    classNames({
      active: type === (this.state.activeTabClass || this.state.defaultTab)
    });

  _toggleTab = type => e => {
    e.preventDefault();
    this.setState({
      activeTabClass: type
    });
  };

  componentDidMount() {
    this.props.changeAsideContent(<MenuBar />);
  }

  render() {
    const typeList = ['mostViewBooks', 'latestUpdatedBooks', 'latestBooks'];
    const currentTab = this.state.activeTabClass || this.state.defaultTab;
    const { dir, orderBy } = BookListHelper.getDirAndOrderByType({
      typeBookList: currentTab
    });

    return (
      <Subscribe to={[GlobalContext]}>
        {context => (
          <>
            {context.renderMeta()}
            <div className="tab">
              {typeList.map(type => {
                return (
                  <span className="tab-item" key={`tab_${type}`}>
                    <span
                      key={type}
                      className={this._renderClassActive(type)}
                      onClick={this._toggleTab(type)}
                    >
                      {TYPE_OF_BOOK_BLOCK[camelToUnderScoreUpper(type)].title}
                    </span>
                  </span>
                );
              })}
            </div>
            <BookList
              key={`bookList_${currentTab}`}
              dataType={currentTab}
              typeList={
                TYPE_OF_BOOK_BLOCK[camelToUnderScoreUpper(currentTab)].title
              }
              dir={dir}
              orderBy={orderBy}
              limit={this.state.limit}
              className={this._renderClassActive(currentTab)}
              isSlider={false}
              hoverTransform
            />
            <BlogList limit={this.state.limit} />
          </>
        )}
      </Subscribe>
    );
  }
}
