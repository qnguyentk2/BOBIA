import React, { memo, PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { commarize, getServerDirectUrl } from 'utils';
import Common from 'components/common';
import { BOOK_STATUS } from 'constants/index';
import bookCoverDefaultUrl from 'assets/images/image-not-found.png';
import { UrlHelper } from 'helpers/index';
import Slider from 'react-slick';
import { splitArray } from 'utils';

class BookAppoint extends PureComponent {
  state = {
    isBookmark: false
  };

  _toggleBookmark = () => {
    this.setState({
      isBookmark: !this.state.isBookmark
    });
  };

  _renderBookStatus = ({ status }) => {
    if (status === BOOK_STATUS.COMPLETED) {
      return (
        <span className={`Book__label status-item ${status.toLowerCase()}`}>
          Đã hoàn thành
        </span>
      );
    } else if (status === BOOK_STATUS.DROPPED) {
      return (
        <span className={`Book__label status-item ${status.toLowerCase()}`}>
          Tạm ngưng
        </span>
      );
    }

    return (
      <span className={`Book__label status-item ${status.toLowerCase()}`}>
        Đang tiến hành
      </span>
    );
  };

  render() {
    const {
      commonComps: { LazyImage }
    } = Common;
    const { bookDetails } = this.props;
    const {
      title,
      slug,
      coverPage,
      createdUser,
      viewCount,
      likeCount,
      commentCount,
      rating
    } = bookDetails;

    return (
      <div className="Book Book-appoint">
        <div className="row Book__intro">
          <div className="col-4 col-md-2 Book__image">
            <LazyImage
              href={UrlHelper.getUrlBookDetail({ slugBook: slug })}
              src={getServerDirectUrl(coverPage)}
              defaultImage={bookCoverDefaultUrl}
              alt="Ảnh bìa"
              className="Book__image__custom-img"
            />
          </div>
          <div className="col-8 col-md-10 Book__info">
            <Link
              to={UrlHelper.getUrlBookDetail({ slugBook: slug })}
              className="Book__title"
            >
              {title}
            </Link>
            <div className="Book__info__bottom">
              <div className="Book__labels">
                <span className="Book__label label-age ">{rating}</span>
                {this._renderBookStatus(bookDetails)}
              </div>
              {createdUser && (
                <div className="Author">
                  <span className="Author__display-name">
                    <Link
                      to={UrlHelper.getUrlUserDetail({
                        slugUser: createdUser.slug
                      })}
                    >
                      {createdUser.displayName}
                    </Link>
                  </span>

                  {/* <i
                    className={`pointer ico ico-bookmark ${
                      this.state.isBookmark ? 'active' : ''
                    }`}
                    onClick={this._toggleBookmark}
                  /> */}
                </div>
              )}
              {/* todo add as component */}
              <div className="Book__rating">
                <ul>
                  <li>
                    <i className="ico ico-eye" />
                    {commarize(viewCount || 0)}
                  </li>
                  <li>
                    <i className="ico ico-like" />
                    {commarize(likeCount || 0)}
                  </li>
                  <li>
                    <i className="ico ico-chat" />
                    {commarize(commentCount || 0)}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const BookSameCategory = ({ items }) => {
  const settingSlider = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false
  };

  const _renderBookList = (block, index) => (
    <div key={`same-cat-${index}`} className="Book-appoint-wrapper">
      {block.map((item, idx) => (
        <BookAppoint key={`book-appoint-${idx}`} bookDetails={item} />
      ))}
    </div>
  );
  return (
    <div className="row">
      <div className="col-md-3" />
      <div className="Block Block-Appoints block-slider col-md-9">
        <h3 className="Chapter-title">Truyện cùng thể loại</h3>
        <div>
          <Slider {...settingSlider}>
            {splitArray(items, 2).map((block, index) =>
              _renderBookList(block, index)
            )}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default memo(BookSameCategory);
