import React, { memo } from 'react';
import { parseEditorContent } from 'utils';

function BookSummary({ data: { summary }, limitWords }) {
  return (
    <div className="Book__description">
      <div className="Book__summary">
        {parseEditorContent(summary, limitWords)}
      </div>
    </div>
  );
}

export default memo(BookSummary);
