import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import Common from 'components/common';
import { getServerDirectUrl, parseEditorContent, commarize } from 'utils';
import { UrlHelper } from 'helpers/index';
import bookCoverDefaultUrl from 'assets/images/image-not-found.png';

function BookSlider({ blogDetails, className }) {
  const {
    commonComps: { LazyImage }
  } = Common;

  const settingSlider = {
    slidesToShow: 1,
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

  const docs = blogDetails.blogs.docs;

  return (
    blogDetails && (
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
                docs.map((itemBlogDetail, index) => {
                  return (
                    <div
                      key={'bookDetail_' + itemBlogDetail.slug + '_' + index}
                    >
                      <article className="Book">
                        <div className="row Book__intro">
                          <div className="col-sm-8 Book__info">
                            <Link
                              className="Book__title"
                              to={UrlHelper.getUrlBlogDetail({
                                slugBlog: itemBlogDetail.slug
                              })}
                            >
                              {itemBlogDetail.title}
                            </Link>
                            <div className="Book__description">
                              <div className="Book__summary">
                                {parseEditorContent(
                                  itemBlogDetail.content,
                                  100
                                )}
                              </div>
                            </div>
                            <div className="Book__rating">
                              <ul>
                                <li>
                                  <i className="ico ico-eye" />
                                  {commarize(itemBlogDetail.viewCount + 1)}
                                </li>
                                <li>
                                  <i className="ico ico-like" />
                                  {commarize(itemBlogDetail.likeCount)}
                                </li>
                                <li>
                                  <i className="ico ico-chat" />
                                  {commarize(itemBlogDetail.commentCount)}
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="col-sm-4 Book__image">
                            <LazyImage
                              src={getServerDirectUrl(itemBlogDetail.coverPage)}
                              defaultImage={bookCoverDefaultUrl}
                              alt="Ảnh bìa"
                              href={UrlHelper.getUrlBlogDetail({
                                slugBlog: itemBlogDetail.slug
                              })}
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
