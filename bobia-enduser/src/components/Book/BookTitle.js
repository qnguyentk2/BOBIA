import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { UrlHelper } from 'helpers/index';

function BookTitle({ data, isOwner }) {
  const hrefBookDetail = UrlHelper.getUrlBookDetail({
    slugBook: data.slug
  });

  const hrefBookUpdate = UrlHelper.getUrlBookUpdate({
    slugBook: data.slug
  });

  if (!isOwner) {
    return (
      <Link to={hrefBookDetail} className="Book__title">
        {data.title}
      </Link>
    );
  }

  return (
    <span className="Book__title">
      {data.title}{' '}
      {isOwner && (
        <Link to={hrefBookUpdate} className="btn btn-primary">
          <i className="fa fa-edit" />
          Cập nhật
        </Link>
      )}
    </span>
  );
}

export default memo(BookTitle);
