import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { UrlHelper } from 'helpers/index';

function CategoryList({ data: { categories }, size }) {
  return (
    <div className="Book__types">
      {categories.length > 0 &&
        categories.slice(0, size).map((item, index, arr) => {
          const url = UrlHelper.getUrlBookListCategory({
            categorySlug: item.slug
          });
          return (
            <Link to={url} className="Book__category" key={index.toString()}>
              {`${index === arr.length - 1 ? item.name : item.name + ', '}`}
            </Link>
          );
        })}
    </div>
  );
}

export default memo(CategoryList);
