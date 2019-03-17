import React, { memo } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import Common from 'components/common';
import { UrlHelper } from 'helpers/index';
import { MENU_ITEM } from 'constants/index';
import MenuIcon from 'assets/images/icons/up_round.png';

const CategorySideBar = memo(({ isShowSubMenu }) => {
  const {
    commonProps: {
      queries: { query }
    },
    commonComps: { CommonLoading, Page500, LazyImage }
  } = Common;

  const classShowSubMenu = classNames({
    'sub-menu': true,
    'sub-opened': isShowSubMenu
  });

  return (
    <Query
      query={query.getAllCategories}
      variables={{ options: { limit: 0 }, filters: { isDel: false } }}
    >
      {({ loading, error, data }) => {
        if (loading) {
          return <CommonLoading />;
        }
        if (error && error.networkError) {
          return <Page500 error={error.networkError} />;
        }
        if (
          data &&
          data.getAllCategories &&
          data.getAllCategories.success === true
        ) {
          return (
            <ul className={classShowSubMenu}>
              {data.getAllCategories.categories.docs.map((item, index) => {
                const oddIndex = index % 2 === 0;
                const itemClass = classNames({
                  'sub-menu__item': true,
                  'item-right': oddIndex,
                  'item-left': !oddIndex
                });
                return (
                  <li className={itemClass} key={`cat-${index.toString()}`}>
                    <Link
                      to={UrlHelper.getUrlBookListCategory({
                        categorySlug: item.slug
                      })}
                      className="sub-menu__item__link"
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
              <ul className="social">
                <li className="social__item">
                  <a className="social__item__link" href="https://twitter.com/">
                    <i className="ico ico-twitter ico-social" />
                  </a>
                </li>
                <li className="social__item">
                  <a
                    className="social__item__link"
                    href="https://www.facebook.com/Bobia.booksbyus/"
                  >
                    <i className="ico ico-facebook ico-social" />
                  </a>
                </li>
                <li className="social__item">
                  <a
                    className="social__item__link"
                    href="https://www.instagram.com/"
                  >
                    <i className="ico ico-instagram ico-social" />
                  </a>
                </li>
              </ul>
              <LazyImage src={MenuIcon} className="menu__img" alt="" />
            </ul>
          );
        }
      }}
    </Query>
  );
});

function Menubar(props) {
  return (
    <>
      <ul className="menu">
        {MENU_ITEM.map((item, index) => (
          <li
            key={index}
            className="menu__item"
            onClick={() => props.handleShowSubMenu(item, props.isMobie)}
          >
            <a href="/" className="menu__item__link">
              {item.value}
            </a>
            {item.key === 'DANH_MUC_TAC_PHAM' && <CategorySideBar {...props} />}
          </li>
        ))}
      </ul>
    </>
  );
}

export default memo(Menubar);
