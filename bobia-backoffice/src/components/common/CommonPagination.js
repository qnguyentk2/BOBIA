import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
class CommonPagination extends Component {
  render() {
    const { currentPage, totalPage, itemPerPage, onPageChange } = this.props;
    return (
      <div className="Pagination">
        <ReactPaginate
          initialPage={currentPage}
          disableInitialCallback={true}
          pageClassName="Pagination__item"
          activeClassName="active"
          previousLabel={<i className="ico ico-chevron-left" />}
          previousClassName="Pagination__item prev"
          nextLabel={<i className="ico ico-chevron-right" />}
          nextClassName="Pagination__item next"
          breakLabel={<span href="">...</span>}
          breakClassName="Pagination__item break"
          pageCount={totalPage}
          pageRangeDisplayed={itemPerPage}
          marginPagesDisplayed={2}
          onPageChange={onPageChange}
        />
      </div>
    );
  }
}

export default CommonPagination;
