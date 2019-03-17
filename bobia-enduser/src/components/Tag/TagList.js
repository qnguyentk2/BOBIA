import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { UrlHelper } from 'helpers/index';

function TagList({ data: { tags }, size = 3 }) {
  return (
    <div className="Book__tags">
      {tags
        .map(el => el.name)
        .slice(0, size)
        .map((tag, index) => (
          <Link
            className="tag"
            key={index}
            to={UrlHelper.getUrlBookTag({ tagName: tag })}
          >
            {tag}
          </Link>
        ))}
    </div>
  );
}

export default memo(TagList);
