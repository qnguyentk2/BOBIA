import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import classNames from 'classnames';
import { UrlHelper } from 'helpers/index';
import Common from 'components/common';
import { getServerDirectUrl } from 'utils';

export default class QuickSearch extends PureComponent {
  state = {
    isShowSearchTool: false,
    searchValue: '',
    suggestionItems: []
  };

  _toggleSearchTool = () => {
    this.setState(
      {
        isShowSearchTool: !this.state.isShowSearchTool
      },
      () => this.state.isShowSearchTool && this.SearchTool.focus()
    );
  };

  _handleChangeSearchInput = e => {
    const {
      target: { value }
    } = e;
    this.setState({ searchValue: value }, () => this._getSuggestion(value));
  };

  _getSuggestion = _.debounce(value => {
    const {
      client,
      commonProps: {
        queries: { query }
      }
    } = Common;

    if (_.trim(value) === '') {
      return this.setState({ suggestionItems: [] });
    }

    client
      .query({
        query: query.getAllBooks,
        variables: { filters: { title: value } }
      })
      .then(data => {
        const items = _.get(data, 'data.getAllBooks.books.docs');
        this.setState({ suggestionItems: items });
      });
  }, 200);

  _handleInputKeyPress = e => {
    e.key === 'Enter' &&
      this.props.history.push(
        `/search?type=all&keyword=${this.state.searchValue}`
      );
  };

  _renderItemSuggestion = (item, index) => {
    const {
      commonComps: { LazyImage }
    } = Common;
    const { title, coverPage } = item;
    const url = UrlHelper.getUrlBookDetail({ slugBook: item.slug });

    return (
      <li
        className="suggestion-list__item"
        key={`quick-search-result-${index}`}
      >
        <Link to={url} title={title} className="suggestion-list__item__link">
          <LazyImage
            src={getServerDirectUrl(coverPage)}
            alt="book-cover"
            className="suggestion-list__item__img"
          />
          <span className="suggestion-list__item__text">{title}</span>
        </Link>
      </li>
    );
  };

  render() {
    const classSearchTool = classNames('search', {
      open: this.state.isShowSearchTool
    });

    return (
      <div className={classSearchTool}>
        <div className="search-block">
          <Link
            className="btn btn-transparent search__btn search__btn--inside"
            to={`/search?type=all&keyword=${this.state.searchValue}`}
          >
            <i className="ico ico-magnifying-glass search__ico-search" />
          </Link>
          <input
            ref={element => {
              this.SearchTool = element;
            }}
            className="search__input"
            type="search"
            aria-label="Search"
            value={this.state.searchValue}
            onChange={this._handleChangeSearchInput}
            onKeyPress={this._handleInputKeyPress}
          />
          <span
            className="close search__close"
            onClick={this._toggleSearchTool}
          >
            ×
          </span>
        </div>
        <span
          className="btn btn-transparent search__btn"
          onClick={this._toggleSearchTool}
        >
          <i className="ico ico-magnifying-glass search__ico-search" />
        </span>

        <div
          className="suggestion"
          style={{
            display: this.state.isShowSearchTool ? 'block' : 'none'
          }}
        >
          <ul className="suggestion-list">
            {this.state.suggestionItems &&
              this.state.suggestionItems.map((item, index) => {
                return this._renderItemSuggestion(item, index);
              })}
          </ul>
        </div>
      </div>
    );
  }
}
