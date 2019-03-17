import React, { memo } from 'react';
import ResultAllBlock from './ResultAllBlock';

function ResultAll({ data, keyword }) {
  return (
    <div className="search-all">
      {data.books.total > 0 && (
        <ResultAllBlock
          type="book"
          label="Sách"
          titleField="title"
          imageField="coverPage"
          link="/sach"
          keyword={keyword}
          data={data.books}
        />
      )}
      {data.authors.total > 0 && (
        <ResultAllBlock
          type="author"
          label="Tác giả"
          titleField="displayName"
          imageField="profileUrl"
          link="/user"
          keyword={keyword}
          data={data.authors}
        />
      )}
    </div>
  );
}

export default memo(ResultAll);
