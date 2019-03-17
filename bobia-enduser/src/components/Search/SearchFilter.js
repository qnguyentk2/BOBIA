import React, { memo } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

function SearchFilter(props) {
  const _triggerSearch = tab => {
    props.history.push(`/search?type=${tab}`);
  };

  return (
    <>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: props.type === 'all' })}
            onClick={() => {
              _triggerSearch('all');
            }}
          >
            Tất cả
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({
              active: props.type === 'book'
            })}
            onClick={() => {
              _triggerSearch('book');
            }}
          >
            Sách
          </NavLink>
        </NavItem>
      </Nav>
      {props.children}
    </>
  );
}

export default memo(SearchFilter);
