import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import Select from 'react-select';
import { Button } from 'reactstrap';
import Common from 'components/common';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import DateTimeBlock from 'components/common/DateTimeBlock';
import { UrlHelper } from 'helpers/index';
import { PARTNERSHIP, APPROVE_STATES } from 'constants/index';

const iconMore = require('assets/images/icon-more.png');

export default class BookManagement extends PureComponent {
  state = {
    variables: {
      limit: 10,
      page: 1,
      orderBy: 'updatedAt',
      dir: 'desc'
    },
    expandedActionListBook: '',
    expandedActionListChapter: '',
    expandedBookSlug: ''
  };

  _handlePageChange = (pageNumber, limit) => {
    if (this.state.variables.page === pageNumber) {
      return;
    }

    this.setState({
      variables: {
        page: pageNumber,
        limit: limit
      }
    });
  };

  _booksMapper = (bookData, index, isLoggedIn, refetch) => {
    const {
      commonProps: {
        queries: { query }
      },
      commonComps: {
        CommonLoading,
        CommonMessage,
        CommonConfirm,
        Page500,
        LazyImage
      }
    } = Common;

    const { isOwner } = this.props;

    const partnershipOptions = [
      {
        label: 'Công khai',
        value: PARTNERSHIP.PUBLIC,
        slug: bookData.slug
      },
      {
        label: 'Riêng tư',
        value: PARTNERSHIP.PRIVATE,
        slug: bookData.slug
      }
    ];
    const selectedOption = partnershipOptions.find(
      el => el.value === bookData.partnership
    );
    const selectedValue = selectedOption ? selectedOption.label : 'Chọn';

    const getAllChaptersFilters = { isDel: false };

    if (!isLoggedIn || !isOwner) {
      getAllChaptersFilters.partnership = PARTNERSHIP.PUBLIC;
      getAllChaptersFilters.state = APPROVE_STATES.PUBLISHED;
    }

    return (
      <React.Fragment key={`book-info__book-key-${bookData.slug}`}>
        <div className="book-item">
          <div className="book-info">
            <div className="book-info__order-number">
              {(this.state.variables.page - 1) * 10 + index + 1}
            </div>
            <div className="book-info__book-created">
              <span className="book-info__book-created__date">
                <DateTimeBlock
                  date={bookData.createdAt}
                  className="Author__updated"
                />
              </span>
              <Link
                to={UrlHelper.getUrlBookDetail({ slugBook: bookData.slug })}
                className="book-info__book-created__name"
              >
                {bookData.title}
              </Link>
            </div>
            <div className="book-info__personal">
              {isOwner && (
                <Select
                  name={this.props.name}
                  id={this.props.slug}
                  className={this.props.className}
                  styles={this.props.customStyles}
                  options={partnershipOptions}
                  onChange={this._updateBookPartnership}
                  onBlur={this.handleBlur}
                  placeholder={selectedValue}
                />
              )}
            </div>
            {/* <div className={`book-info__status ${'data.state.toLowerCase()'}`}>
              {'bookStates'}
            </div> */}
            <div className="book-info__chapter-number">
              {`${bookData.chapterCount} chương`}
            </div>
            <div className="book-info__action">
              <div className="book-info__action__block">
                {isOwner && (
                  <LazyImage
                    className="book-info__action__menu"
                    src={iconMore}
                    alt="action menu"
                    onClick={this._handleShowActionListBook(bookData.slug)}
                  />
                )}
              </div>
            </div>
            {this.state.expandedActionListBook &&
              this.state.expandedActionListBook === bookData.slug && (
                <div className="book-info__menu-action">
                  <ul>
                    <li>
                      <Link
                        to={UrlHelper.getUrlBookUpdate({
                          slugBook: bookData.slug
                        })}
                        className="book-info__action__block__btn"
                      >
                        <i className="ico ico-pen book-info__action__block__ico" />
                      </Link>
                    </li>
                    <li>
                      <Button
                        className="book-info__action__block__btn"
                        onClick={async () => {
                          const confirmResult = await CommonConfirm({
                            message: 'Bạn chắc chắn muốn xoá tác phẩm này?',
                            confirmText: 'Xoá',
                            confirmColor: 'primary',
                            cancelText: 'Không',
                            cancelColor: 'danger'
                          });
                          confirmResult &&
                            this._handleDeleteBook(bookData.slug, refetch);
                        }}
                      >
                        <i className="ico ico-trash book-info__action__block__ico" />
                      </Button>
                    </li>
                  </ul>
                </div>
              )}
          </div>
          <div className="book-rating">
            <div className="favorite-number">
              <i className="fas fa-star" /> {bookData.favoriteCount} người yêu
              thích
            </div>
            <div className="subcribe-number">
              <i className="fas fa-bell" /> {bookData.subcribeCount} người theo
              dõi
            </div>
            <ul className="rating-list">
              <li className="rating-item">
                <i className="ico ico-eye rating-item__ico" />
                <span className="rating-item__number">
                  {bookData.viewCount}
                </span>
              </li>
              <li className="rating-item">
                <i className="ico ico-like rating-item__ico" />
                <span className="rating-item__number">
                  {bookData.likeCount}
                </span>
              </li>
              <li className="rating-item">
                <i className="ico ico-chat rating-item__ico" />
                <span className="rating-item__number">
                  {bookData.commentCount}
                </span>
              </li>
            </ul>
            <span className="drop-down">
              <i
                className={`ico ${
                  this.state.expandedBookSlug === bookData.slug
                    ? 'ico-chevron-up'
                    : 'ico-chevron-down'
                } drop-down__icon`}
                onClick={this._handleShowChapter(bookData.slug)}
              />
            </span>
          </div>
        </div>
        {this.state.expandedBookSlug &&
          this.state.expandedBookSlug === bookData.slug && (
            <Query
              query={query.getAllChapters}
              variables={{
                filters: getAllChaptersFilters,
                filtersType: 'AND',
                options: {
                  populate: 'book',
                  populateMatch: {
                    slug: bookData.slug
                  },
                  limit: 0
                }
              }}
              fetchPolicy="network-only"
            >
              {({ loading, error, data, refetch }) => {
                if (loading) {
                  return <CommonLoading />;
                }

                if (error && error.networkError) {
                  return <Page500 error={error.networkError} />;
                }

                if (
                  data &&
                  data.getAllChapters &&
                  data.getAllChapters.success === true
                ) {
                  const { chapters } = data.getAllChapters;

                  if (!chapters.docs.length) {
                    return (
                      <CommonMessage
                        type="info"
                        messages={[
                          'Chưa có chương nào',
                          isOwner && (
                            <Link
                              to={UrlHelper.getUrlChapterCreate({
                                slugBook: bookData.slug
                              })}
                              className="btn btn-primary chapter-title__btn"
                            >
                              Viết chương mới
                            </Link>
                          )
                        ]}
                      />
                    );
                  }

                  return (
                    <div className="chapter-block">
                      <div className="chapter-title">
                        <h2 className="chapter-title__title">
                          Danh sách chương
                        </h2>
                        {isOwner && (
                          <Link
                            to={UrlHelper.getUrlChapterCreate({
                              slugBook: bookData.slug
                            })}
                            className="btn btn-primary chapter-title__btn"
                          >
                            Viết chương mới
                          </Link>
                        )}
                      </div>
                      <div className="chapter-list">
                        {chapters.docs.map((el, index) =>
                          this._chaptersMapper(bookData, el, index, refetch)
                        )}
                      </div>
                    </div>
                  );
                }
              }}
            </Query>
          )}
      </React.Fragment>
    );
  };

  _updateBookPartnership = el => {
    const {
      commonProps: {
        queries: { mutation },
        notify
      },
      client
    } = Common;

    client
      .mutate({
        mutation: mutation.updateBookPartnership,
        variables: {
          slug: el.slug,
          partnership: el.value
        }
      })
      .then(
        ({ data }) =>
          data &&
          data.updateBookPartnership &&
          data.updateBookPartnership.success === true &&
          notify.success('Cập nhật hiển thị tác phẩm thành công!')
      )
      .catch(error => {
        if (error.networkError) {
          notify.error('Lỗi kết nối, xin vui lòng thử lại!');
        } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          if (error.graphQLErrors[0].data.errorCode === 401) {
            notify.error('Chưa đăng nhập, xin vui lòng đăng nhập!');
          }
          notify.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
      });
  };

  _handleShowActionListBook = bookSlug => e => {
    e.preventDefault();

    if (!this.state.expandedActionListBook) {
      this.setState({
        expandedActionListBook: bookSlug
      });
    } else {
      if (this.state.expandedActionListBook !== bookSlug) {
        this.setState({
          expandedActionListBook: bookSlug
        });
      } else {
        this.setState({
          expandedActionListBook: ''
        });
      }
    }
  };

  _handleDeleteBook = (slug, refetchBook) => {
    const {
      commonProps: {
        queries: { mutation },
        notify
      },
      client
    } = Common;
    client
      .mutate({
        mutation: mutation.deleteBook,
        variables: {
          slug
        }
      })
      .then(({ data }) => {
        if (data && data.deleteBook && data.deleteBook.success === true) {
          notify.success('Xoá tác phẩm thành công!');
          refetchBook();
        }
      })
      .catch(error => {
        if (error.networkError) {
          notify.error('Lỗi kết nối, xin vui lòng thử lại!');
        } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          if (error.graphQLErrors[0].data.errorCode === 401) {
            notify.error('Chưa đăng nhập, xin vui lòng đăng nhập!');
          }
          notify.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
      });
  };

  _chaptersMapper = (bookData, chapterData, index, refetch) => {
    const {
      commonComps: { LazyImage, CommonConfirm }
    } = Common;

    const { isOwner } = this.props;

    const partnershipOptions = [
      {
        label: 'Công khai',
        value: PARTNERSHIP.PUBLIC,
        slug: chapterData.slug
      },
      {
        label: 'Riêng tư',
        value: PARTNERSHIP.PRIVATE,
        slug: chapterData.slug
      }
    ];

    let chapterStates = '';
    switch (chapterData.state) {
      case APPROVE_STATES.DRAFT:
        chapterStates = 'Bản nháp';
        break;
      case APPROVE_STATES.PENDING:
        chapterStates = 'Đang chờ duyệt';
        break;
      case APPROVE_STATES.REFUSED:
        chapterStates = (
          <>
            <span>Không thông qua</span>
            {/* <button
              className="btn btn-danger"
              onClick={async () =>
                await this.props.commonComps.CommonPopup({
                  title: 'Lý do tác phẩm không được thông qua',
                  message: (
                    <RichEditor
                      className="write-form__content__summary__editor"
                      value={data.refusedReason}
                      readOnly
                    />
                  ),
                  closeText: 'Thoát',
                  closeColor: 'primary'
                })
              }
            >
              <i className="fa fa-info" />
            </button> */}
          </>
        );
        break;
      case APPROVE_STATES.PUBLISHED:
        chapterStates = 'Đã xuất bản';
        break;
      default:
        chapterStates = 'Bản nháp';
        break;
    }

    const selectedOption = partnershipOptions.find(
      el => el.value === chapterData.partnership
    );
    const selectedValue = selectedOption ? selectedOption.label : 'Chọn';

    return (
      <div
        className="chapter-item"
        key={`book-${bookData.slug}-chapter-${chapterData.slug}`}
      >
        <div className="chapter-info">
          <div className="chapter-info__order-number">
            {(this.state.variables.page - 1) * 10 + index + 1}
          </div>
          <div className="chapter-info__book-created">
            <span className="chapter-info__book-created__date">
              <DateTimeBlock
                date={chapterData.createdAt}
                className="Author__updated"
              />
            </span>
            <Link
              to={UrlHelper.getUrlChapterDetail({
                slugBook: bookData.slug,
                slugChapter: chapterData.slug
              })}
              className="chapter-info__book-created__name"
            >
              {chapterData.title}
            </Link>
          </div>
          <div className="chapter-info__personal">
            {isOwner && (
              <Select
                name={this.props.name}
                id={this.props.slug}
                className={this.props.className}
                styles={this.props.customStyles}
                options={partnershipOptions}
                onChange={this._updateChapterPartnership}
                onBlur={this.handleBlur}
                placeholder={selectedValue}
              />
            )}
          </div>

          <div
            className={`chapter-info__status ${chapterData.state.toLowerCase()}`}
          >
            {chapterStates}
          </div>
          <div className="chapter-rating">
            <ul className="rating-list">
              <li className="rating-item">
                <i className="ico ico-like rating-item__ico" />
                <span className="rating-item__number">
                  {chapterData.likeCount}
                </span>
              </li>
              <li className="rating-item">
                <i className="ico ico-chat rating-item__ico" />
                <span className="rating-item__number">
                  {chapterData.commentCount}
                </span>
              </li>
            </ul>
          </div>
          <div className="chapter-info__action">
            <div className="chapter-info__action__block">
              {isOwner && (
                <LazyImage
                  className="book-info__action__menu"
                  src={iconMore}
                  alt="action menu"
                  onClick={this._handleShowActionListChapter(chapterData.slug)}
                />
              )}
              {this.state.expandedActionListChapter &&
                this.state.expandedActionListChapter === chapterData.slug && (
                  <div className="book-info__menu-action">
                    <ul>
                      <li>
                        <Button
                          href={UrlHelper.getUrlChapterUpdate({
                            slugBook: bookData.slug,
                            slugChapter: chapterData.slug
                          })}
                          className="book-info__action__block__btn"
                        >
                          <i className="ico ico-pen book-info__action__block__ico" />
                        </Button>
                      </li>
                      <li>
                        <Button
                          className="book-info__action__block__btn"
                          onClick={async () => {
                            const confirmResult = await CommonConfirm({
                              message: 'Bạn chắc chắn muốn xoá chương này?',
                              confirmText: 'Xoá',
                              confirmColor: 'primary',
                              cancelText: 'Không',
                              cancelColor: 'danger'
                            });
                            confirmResult &&
                              this._handleDeleteChapter(
                                chapterData.slug,
                                refetch
                              );
                          }}
                        >
                          <i className="ico ico-trash book-info__action__block__ico" />
                        </Button>
                      </li>
                    </ul>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  _handleShowChapter = bookSlug => e => {
    e.preventDefault();

    if (!this.state.expandedBookSlug) {
      this.setState({
        expandedBookSlug: bookSlug
      });
    } else {
      if (this.state.expandedBookSlug !== bookSlug) {
        this.setState({
          expandedBookSlug: bookSlug
        });
      } else {
        this.setState({
          expandedBookSlug: ''
        });
      }
    }
  };

  _handleShowActionListChapter = chapterSlug => e => {
    e.preventDefault();

    if (!this.state.expandedActionListChapter) {
      this.setState({
        expandedActionListChapter: chapterSlug
      });
    } else {
      if (this.state.expandedActionListChapter !== chapterSlug) {
        this.setState({
          expandedActionListChapter: chapterSlug
        });
      } else {
        this.setState({
          expandedActionListChapter: ''
        });
      }
    }
  };

  _updateChapterPartnership = el => {
    const {
      commonProps: {
        queries: { mutation },
        notify
      },
      client
    } = Common;

    client
      .mutate({
        mutation: mutation.updateChapterPartnership,
        variables: {
          slug: el.slug,
          partnership: el.value
        }
      })
      .then(
        ({ data }) =>
          data &&
          data.updateChapterPartnership &&
          data.updateChapterPartnership.success === true &&
          notify.success('Cập nhật hiển thị chương thành công!')
      )
      .catch(error => {
        if (error.networkError) {
          notify.error('Lỗi kết nối, xin vui lòng thử lại!');
        } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          if (error.graphQLErrors[0].data.errorCode === 401) {
            notify.error('Chưa đăng nhập, xin vui lòng đăng nhập!');
          }
          notify.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
      });
  };

  _handleDeleteChapter = (slug, refetchChapter) => {
    const {
      commonProps: {
        queries: { mutation },
        notify
      },
      client
    } = Common;
    client
      .mutate({
        mutation: mutation.deleteChapter,
        variables: {
          slug
        }
      })
      .then(({ data }) => {
        if (data && data.deleteChapter && data.deleteChapter.success === true) {
          notify.success('Xoá chương thành công!');
          refetchChapter();
        }
      })
      .catch(error => {
        if (error.networkError) {
          notify.error('Lỗi kết nối, xin vui lòng thử lại!');
        } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          if (error.graphQLErrors[0].data.errorCode === 401) {
            notify.error('Chưa đăng nhập, xin vui lòng đăng nhập!');
          }
          notify.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
      });
  };

  render() {
    const {
      commonProps: {
        queries: { query }
      },
      commonComps: { CommonLoading, CommonMessage, CommonPagination, Page500 }
    } = Common;

    const { isOwner } = this.props;

    return (
      <Subscribe to={[GlobalContext]}>
        {context => {
          const getAllBooksFilters = { isDel: false };

          if (!context.state.isLoggedIn || !isOwner) {
            getAllBooksFilters.partnership = PARTNERSHIP.PUBLIC;
            getAllBooksFilters.chapterCount = { $gt: 0 };
          }

          return (
            <Query
              query={query.getAllBooks}
              variables={{
                filters: getAllBooksFilters,
                filtersType: 'AND',
                options: {
                  populate: 'user',
                  populateMatch: {
                    slug: this.props.user.slug
                  },
                  ...this.state.variables
                }
              }}
              fetchPolicy="network-only"
            >
              {({ loading, error, data, refetch }) => {
                if (loading) {
                  return <CommonLoading />;
                }

                if (error && error.networkError) {
                  return <Page500 error={error.networkError} />;
                }

                if (
                  data &&
                  data.getAllBooks &&
                  data.getAllBooks.success === true
                ) {
                  const { books, pages } = data.getAllBooks;

                  if (!books.docs.length) {
                    return (
                      <CommonMessage
                        type="info"
                        messages={['Chưa có tác phẩm nào']}
                      />
                    );
                  }

                  return (
                    <div className="book-management">
                      <div className="book-list">
                        {books.docs.map((el, index) =>
                          this._booksMapper(
                            el,
                            index,
                            context.state.isLoggedIn,
                            refetch
                          )
                        )}
                      </div>
                      {pages > 1 && (
                        <div className="book-pagination">
                          <CommonPagination
                            currentPage={this.state.variables.page - 1}
                            totalPage={pages}
                            itemPerPage={this.state.variables.limit}
                            onPageChange={pageNumber =>
                              this._handlePageChange(pageNumber.selected + 1)
                            }
                          />
                        </div>
                      )}
                    </div>
                  );
                }
              }}
            </Query>
          );
        }}
      </Subscribe>
    );
  }
}
