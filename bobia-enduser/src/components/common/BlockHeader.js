import React, { memo } from 'react';
import classNames from 'classnames';

function BlockHeader({ title, text, small, viewMore, highlight, className }) {
  const classnamesHeader = classNames('Block-header', {
    'Block-header--small': small,
    highlight: highlight
  });

  return (
    <div className={`${classnamesHeader} ${className}`}>
      <h1 className="Block-header__title">{title}</h1>
      {viewMore && (
        <a href="/" className="Block-header__text view-more">
          {text}
        </a>
      )}
      {!viewMore && <span className="Block-header__text">{text}</span>}
    </div>
  );
}

export default memo(BlockHeader);
