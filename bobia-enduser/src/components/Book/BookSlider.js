import _ from 'lodash';
import React, { memo } from 'react';
import Slider from 'react-slick';
import Common from 'components/common';
import BookCounts from './BookCounts';
import BookSummary from './BookSummary';
import BookTitle from './BookTitle';
import { getServerDirectUrl } from 'utils';
import bookCoverDefaultUrl from 'assets/images/image-not-found.png';

function BookSlider({ bookDetails, className }) {
  const {
    commonComps: { LazyImage }
  } = Common;

  const settingSlider = {
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  const docs = _.get(bookDetails, 'books.docs', []);

  return (
    bookDetails && (
      <div className="wrapper block-slider">
        <div className={`Block BooksBlock ${className}`}>
          <div className="Block-header">
            <a href="/" className="Block-header__text view-more">
              Xem tất cả
            </a>
          </div>
          <div>
            <Slider {...settingSlider}>
              {docs &&
                docs.map((itemBookDetail, index) => {
                  return (
                    <div
                      key={'bookDetail_' + itemBookDetail.slug + '_' + index}
                    >
                      <article className="Book">
                        <div className="row Book__intro">
                          <div className="col-sm-8 Book__info">
                            <BookTitle data={itemBookDetail} />
                            <BookSummary
                              data={itemBookDetail}
                              limitWords={100}
                            />
                            <BookCounts data={itemBookDetail} />
                          </div>
                          <div className="col-sm-4 Book__image">
                            <LazyImage
                              src={getServerDirectUrl(itemBookDetail.coverPage)}
                              defaultImage={bookCoverDefaultUrl}
                              alt="Ảnh bìa"
                              href={itemBookDetail.slug}
                            />
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    )
  );
}

export default memo(BookSlider);
