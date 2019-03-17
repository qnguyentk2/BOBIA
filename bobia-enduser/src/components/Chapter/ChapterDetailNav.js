import _ from 'lodash';
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
/* https://github.com/JedWatson/react-select */

export default class ChapterDetailNav extends PureComponent {
  state = {
    selectedOption: ''
  };

  // _handleChangeChapter = selectedOption => {
  //   this.setState({ selectedOption });
  // };
  _handleChangeChapter = e => {
    const {
      currentTarget: { value }
    } = e;
    const curItem = this.props.options.find(i => {
      return i.value === value;
    });
    window.location = curItem.link;
  };

  render() {
    const { selectedOption, options } = this.props;
    const index = _.findIndex(options, { value: selectedOption });
    let prevChapterLink = null;
    let nextChapterLink = null;
    if (index > 0 && index <= options.length) {
      const prevChapter = options[index - 1];
      prevChapterLink = prevChapter.link;
    }
    if (index < options.length - 1) {
      const nextChapter = options[index + 1];
      nextChapterLink = nextChapter.link;
    }
    return (
      <div className="ChapterDetail__nav">
        <Link
          to={prevChapterLink ? prevChapterLink : ''}
          className="ChapterDetail__nav__btn prev"
        >
          <i className="ico ico-chevron-left" />
        </Link>

        <select
          value={selectedOption}
          onChange={this._handleChangeChapter}
          className="Select"
        >
          {options.map(item => {
            return (
              <option key={item.value} link={item.link} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </select>

        {/*<Select*/}
        {/*name="options-chapter"*/}
        {/*value={selectedOption}*/}
        {/*onChange={this._handleChangeChapter}*/}
        {/*removeSelected={false}*/}
        {/*searchable={false}*/}
        {/*clearable={false}*/}
        {/*options={options}*/}
        {/*/>*/}
        <a href="/" className="ChapterDetail__nav__btn list">
          <i className="ico ico-list" />
        </a>
        <a
          href={nextChapterLink ? nextChapterLink : ''}
          className="ChapterDetail__nav__btn next"
        >
          <i className="ico ico-chevron-right" />
        </a>
      </div>
    );
  }
}
