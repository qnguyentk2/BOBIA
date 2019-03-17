import React, { memo } from 'react';
import { commarize } from 'utils';

function BookCounts({
  data: { viewCount, likeCount, commentCount, totalChaptersCounts }
}) {
  return (
    <div className="Book__rating">
      <ul>
        <li>
          <i className="ico ico-eye" />
          {commarize(viewCount + totalChaptersCounts.views)}
        </li>
        <li>
          <i className="ico ico-like" />
          {commarize(likeCount + totalChaptersCounts.likes)}
        </li>
        <li>
          <i className="ico ico-chat" />
          {commarize(commentCount + totalChaptersCounts.comments)}
        </li>
      </ul>
    </div>
  );
}

export default memo(BookCounts);
