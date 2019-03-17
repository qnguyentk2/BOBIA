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

export default class BlogManagement extends PureComponent {
  state = {
    variables: {
      limit: 10,
      page: 1,
      orderBy: 'updatedAt',
      dir: 'desc'
    },
    expandedActionListBlog: '',
    expandedActionListChapter: '',
    expandedBlogSlug: ''
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

  _blogsMapper = (blogData, index, isLoggedIn, refetch) => {
    const {
      commonComps: { CommonConfirm, LazyImage }
    } = Common;

    const { isOwner } = this.props;

    const partnershipOptions = [
      {
        label: 'Công khai',
        value: PARTNERSHIP.PUBLIC,
        slug: blogData.slug
      },
      {
        label: 'Riêng tư',
        value: PARTNERSHIP.PRIVATE,
        slug: blogData.slug
      }
    ];
    const selectedOption = partnershipOptions.find(
      el => el.value === blogData.partnership
    );
    const selectedValue = selectedOption ? selectedOption.label : 'Chọn';

    const getAllChaptersFilters = { isDel: false };

    if (!isLoggedIn || !isOwner) {
      getAllChaptersFilters.partnership = PARTNERSHIP.PUBLIC;
      getAllChaptersFilters.state = APPROVE_STATES.PUBLISHED;
    }

    return (
      <React.Fragment key={`book-info__blog-key-${blogData.slug}`}>
        <div className="book-item">
          <div className="book-info">
            <div className="book-info__order-number">
              {(this.state.variables.page - 1) * 10 + index + 1}
            </div>
            <div className="book-info__book-created">
              <span className="book-info__book-created__date">
                <DateTimeBlock
                  date={blogData.createdAt}
                  className="Author__updated"
                />
              </span>
              <Link
                to={UrlHelper.getUrlBlogDetail({ slugBlog: blogData.slug })}
                className="book-info__book-created__name"
              >
                {blogData.title}
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
                  onChange={this._updateBlogPartnership}
                  onBlur={this.handleBlur}
                  placeholder={selectedValue}
                />
              )}
            </div>
            <div className="book-info__action">
              <div className="book-info__action__block">
                {isOwner && (
                  <LazyImage
                    className="book-info__action__menu"
                    src={iconMore}
                    alt="action menu"
                    onClick={this._handleShowActionListBlog(blogData.slug)}
                  />
                )}
              </div>
            </div>
            {this.state.expandedActionListBlog &&
              this.state.expandedActionListBlog === blogData.slug && (
                <div className="book-info__menu-action">
                  <ul>
                    <li>
                      <Link
                        to={UrlHelper.getUrlBlogUpdate({
                          slugBlog: blogData.slug
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
                            message: 'Bạn chắc chắn muốn xoá bài viết này?',
                            confirmText: 'Xoá',
                            confirmColor: 'primary',
                            cancelText: 'Không',
                            cancelColor: 'danger'
                          });
                          confirmResult &&
                            this._handleDeleteBlog(blogData.slug, refetch);
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
            <ul className="rating-list">
              <li className="rating-item">
                <i className="ico ico-eye rating-item__ico" />
                <span className="rating-item__number">
                  {blogData.viewCount}
                </span>
              </li>
              <li className="rating-item">
                <i className="ico ico-like rating-item__ico" />
                <span className="rating-item__number">
                  {blogData.likeCount}
                </span>
              </li>
              <li className="rating-item">
                <i className="ico ico-chat rating-item__ico" />
                <span className="rating-item__number">
                  {blogData.commentCount}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  };

  _updateBlogPartnership = el => {
    const {
      commonProps: {
        queries: { mutation },
        notify
      },
      client
    } = Common;

    client
      .mutate({
        mutation: mutation.updateBlogPartnership,
        variables: {
          slug: el.slug,
          partnership: el.value
        }
      })
      .then(
        ({ data }) =>
          data &&
          data.updateBlogPartnership &&
          data.updateBlogPartnership.success === true &&
          notify.success('Cập nhật hiển thị bài viết thành công!')
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

  _handleShowActionListBlog = blogSlug => e => {
    e.preventDefault();

    if (!this.state.expandedActionListBlog) {
      this.setState({
        expandedActionListBlog: blogSlug
      });
    } else {
      if (this.state.expandedActionListBlog !== blogSlug) {
        this.setState({
          expandedActionListBlog: blogSlug
        });
      } else {
        this.setState({
          expandedActionListBlog: ''
        });
      }
    }
  };

  _handleDeleteBlog = (slug, refetchBlog) => {
    const {
      commonProps: {
        queries: { mutation },
        notify
      },
      client
    } = Common;
    client
      .mutate({
        mutation: mutation.deleteBlog,
        variables: {
          slug
        }
      })
      .then(({ data }) => {
        if (data && data.deleteBlog && data.deleteBlog.success === true) {
          notify.success('Xoá bài viết thành công!');
          refetchBlog();
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
          const getAllBlogsFilters = { isDel: false };

          if (!context.state.isLoggedIn || !isOwner) {
            getAllBlogsFilters.partnership = PARTNERSHIP.PUBLIC;
          }

          return (
            <Query
              query={query.getAllBlogs}
              variables={{
                filters: getAllBlogsFilters,
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
                  data.getAllBlogs &&
                  data.getAllBlogs.success === true
                ) {
                  const { blogs, pages } = data.getAllBlogs;

                  if (!blogs.docs.length) {
                    return (
                      <CommonMessage
                        type="info"
                        messages={['Chưa có bài viết nào']}
                      />
                    );
                  }

                  return (
                    <div className="book-management">
                      <div className="book-list">
                        {blogs.docs.map((el, index) =>
                          this._blogsMapper(
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
