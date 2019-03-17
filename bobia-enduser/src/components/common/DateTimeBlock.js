import React, { memo } from 'react';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import { DATE_TIME_FORMAT } from 'constants/index';
import { dateFromNow } from 'utils';

function DateTimeBlock({ date, className }) {
  return (
    <>
      <span
        className={className}
        data-tip={moment(date).format(
          DATE_TIME_FORMAT.DEFAULT_FORMAT_WITH_TIME
        )}
      >
        {dateFromNow(date)}
      </span>
      <ReactTooltip />
    </>
  );
}

export default memo(DateTimeBlock);
