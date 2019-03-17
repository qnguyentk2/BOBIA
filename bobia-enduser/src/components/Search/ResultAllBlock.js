import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import _ from 'lodash';
import Highlighter from 'react-highlight-words';
import Common from 'components/common';

function ResultAllBlock(props) {
  const {
    commonComps: { LazyImage }
  } = Common;

  const renderProductBlock = (props, item, index) => {
    return (
      <Col
        lg="3"
        sm="6"
        xs="12"
        className="search-category__block"
        key={`search-col-${index.toString()}`}
      >
        <Link
          className="search-category__block__link"
          to={`${props.link}${item.slug}`}
        >
          <LazyImage
            className="search-category__block__img"
            src={item[props.imageField]}
            alt="Book cover"
          />
          <div className="overlay">
            <h2 className="search-category__block__title">
              {props.keyword ? (
                <Highlighter
                  highlightClassName="YourHighlightClass"
                  searchWords={props.keyword.trim().split(' ')}
                  autoEscape={true}
                  textToHighlight={item[props.titleField]}
                />
              ) : (
                item[props.titleField]
              )}
            </h2>
          </div>
        </Link>{' '}
      </Col>
    );
  };

  const renderRow = (block, index) => {
    return <Row key={`search-row-${index.toString()}`}>{block}</Row>;
  };

  const { type, label, keyword, data } = props;

  let blocks = [],
    rows = [];
  _.forEach(data.docs, (item, index) => {
    const itemBlock = renderProductBlock(props, item, index);

    if (itemBlock) {
      blocks.push(itemBlock);
    }

    if (blocks.length > 3) {
      const row = renderRow(blocks, Math.floor(index / 4));

      if (row) {
        rows.push(row);
      }
      blocks = [];
    }
  });

  return (
    <div className="search-category">
      <h2 className="search-category__title">
        {label} <span>{keyword}</span>
      </h2>
      {rows}{' '}
      <Link to={`/search?type=${type}`} className="search-category__view-more">
        >> Xem thêm {data.total} {label} <span>{keyword}</span>
      </Link>
    </div>
  );
}

export default memo(ResultAllBlock);
