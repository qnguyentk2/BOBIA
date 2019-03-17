import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { UrlHelper } from 'helpers/index';

function TopicList({ data: { topics }, size }) {
  return (
    <div className="Book__types">
      {topics.length > 0 &&
        topics.slice(0, size).map((item, index, arr) => {
          const url = UrlHelper.getUrlBlogListTopic({
            topicSlug: item.slug
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

export default memo(TopicList);
