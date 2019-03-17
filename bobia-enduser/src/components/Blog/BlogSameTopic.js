import React, { memo, PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { commarize, getServerDirectUrl } from 'utils';
import Common from 'components/common';
import blogCoverDefaultUrl from 'assets/images/image-not-found.png';
import { UrlHelper } from 'helpers/index';
import Slider from 'react-slick';
import { splitArray } from 'utils';

class BlogAppoint extends PureComponent {
  state = {
    isBlogmark: false
  };

  _toggleBlogmark = () => {
    this.setState({
      isBlogmark: !this.state.isBlogmark
    });
  };

  render() {
    const {
      commonComps: { LazyImage }
    } = Common;
    const { blogDetails } = this.props;
    const {
      title,
      slug,
      coverPage,
      createdUser,
      viewCount,
      likeCount,
      commentCount
    } = blogDetails;

    return (
      <div className="Book Book-appoint">
        <div className="row Book__intro">
          <div className="col-4 col-md-2 Book__image">
            <LazyImage
              href={UrlHelper.getUrlBlogDetail({ slugBlog: slug })}
              src={getServerDirectUrl(coverPage)}
              defaultImage={blogCoverDefaultUrl}
              alt="Ảnh bìa"
              className="Book__image__custom-img"
            />
          </div>
          <div className="col-8 col-md-10 Book__info">
            <Link
              to={UrlHelper.getUrlBlogDetail({ slugBlog: slug })}
              className="Book__title"
            >
              {title}
            </Link>
            <div className="Book__info__bottom">
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
                    className={`pointer ico ico-blogmark ${
                      this.state.isBlogmark ? 'active' : ''
                    }`}
                    onClick={this._toggleBlogmark}
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

const BlogSameTopic = ({ items }) => {
  const settingSlider = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false
  };

  const _renderBlogList = (block, index) => (
    <div key={`same-cat-${index}`} className="Book-appoint-wrapper">
      {block.map((item, idx) => (
        <BlogAppoint key={`book-appoint-${idx}`} blogDetails={item} />
      ))}
    </div>
  );
  return (
    <div className="row">
      <div className="col-md-3" />
      <div className="Block Block-Appoints block-slider col-md-9">
        <h3 className="Chapter-title">Bài viết cùng thể loại</h3>
        <div>
          <Slider {...settingSlider}>
            {splitArray(items, 2).map((block, index) =>
              _renderBlogList(block, index)
            )}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default memo(BlogSameTopic);
