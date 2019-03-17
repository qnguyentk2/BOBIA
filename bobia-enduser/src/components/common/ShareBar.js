import React, { memo } from 'react';

function ShareBar({ className, numberLike }) {
  const onClickShare = e => {
    e.preventDefault();
    const { currentTarget } = e;
    window.open(
      currentTarget.href,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600'
    );
    return false;
  };

  const currentUrl = window.location.href;

  return (
    <div className={`ShareBar ${className}`}>
      <ul>
        <li className="ShareBar__item favorite">
          <span className="number-like">{numberLike}</span>
          <a href="/" title="Favorite">
            <i className="ico ico-heart" />
          </a>
        </li>
        <li className="ShareBar__item twitter">
          <a
            onClick={onClickShare}
            href={`http://twitter.com/intent/tweet?status=${currentUrl}`}
            title="Twitter"
          >
            <i className="ico ico-twitter" />
          </a>
        </li>
        <li className="ShareBar__item facebook">
          <a
            onClick={onClickShare}
            href={`http://www.facebook.com/share.php?u=${currentUrl}`}
            title="Facebook"
          >
            <i className="ico ico-facebook" />
          </a>
        </li>
        <li className="ShareBar__item bookmark">
          <a href="/" title="Bookmark">
            <i className="ico ico-bookmark" />
          </a>
        </li>
      </ul>
    </div>
  );
}

export default memo(ShareBar);
