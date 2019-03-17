import React, { memo } from 'react';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import { DATE_TIME_FORMAT } from 'constants/index';
import { dateFromNow } from 'utils';

function PublishDate({ date }) {
  const convertedDate = date || new Date();

  return (
    <>
      <span
        className="Author__updated"
        data-tip={moment(convertedDate).format(
          DATE_TIME_FORMAT.DEFAULT_FORMAT_WITH_TIME
        )}
      >
        {dateFromNow(convertedDate)}
      </span>
      <ReactTooltip />
    </>
  );
}

export default memo(PublishDate);
