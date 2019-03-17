import React, { memo } from 'react';
import ReactPaginate from 'react-paginate';

function CommonPagination({
  currentPage,
  totalPage,
  itemPerPage,
  onPageChange,
  className,
  forcePage
}) {
  return (
    <div className={`Pagination ${className}`}>
      <ReactPaginate
        initialPage={currentPage}
        disableInitialCallback={true}
        pageClassName="Pagination__item"
        activeClassName="active"
        previousLabel={<span className="prev">Prev</span>}
        previousClassName="Pagination__item prev"
        nextLabel={<span className="next">Next &rarr;</span>}
        nextClassName="Pagination__item next"
        breakLabel={<span>...</span>}
        breakClassName="Pagination__item break"
        pageCount={totalPage}
        pageRangeDisplayed={itemPerPage}
        marginPagesDisplayed={2}
        forcePage={forcePage}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default memo(CommonPagination);
