import React, { memo } from 'react';

function CommonLoading({ full }) {
  if (full) {
    return (
      <div className="loading-wrapper full">
        <div className="loading-container">
          <div className="loading-text">Đang xử lý</div>
          <div className="loading-content" />
        </div>
      </div>
    );
  }

  return (
    <div className="loading-wrapper">
      <div className="loading-circle1 loading-child" />
      <div className="loading-circle2 loading-child" />
      <div className="loading-circle3 loading-child" />
      <div className="loading-circle4 loading-child" />
      <div className="loading-circle5 loading-child" />
      <div className="loading-circle6 loading-child" />
      <div className="loading-circle7 loading-child" />
      <div className="loading-circle8 loading-child" />
      <div className="loading-circle9 loading-child" />
      <div className="loading-circle10 loading-child" />
      <div className="loading-circle11 loading-child" />
      <div className="loading-circle12 loading-child" />
    </div>
  );
}

export default memo(CommonLoading);
