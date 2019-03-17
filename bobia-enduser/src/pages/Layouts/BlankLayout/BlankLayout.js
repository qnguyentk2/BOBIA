import React, { memo } from 'react';

function BlankLayout(props) {
  return React.Children.map(props.children, child =>
    React.cloneElement(child, props)
  );
}

export default memo(BlankLayout);
