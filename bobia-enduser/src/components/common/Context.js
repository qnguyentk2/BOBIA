import React from 'react';
import { Container } from 'unstated';
import { Helmet } from 'react-helmet';
import Common from 'components/common';
import BobiaLogo from 'assets/images/logo.png';

export class GlobalContext extends Container {
  state = {
    isLoggedIn: false,
    banner: null,
    user: null,
    asideContent: null,
    authenModal: {
      active: false
    },
    authenFlip: {
      isFlipped: false,
      label: 'Đăng nhập'
    }
  };

  changeAsideContent = asideContent => {
    this.setState({ asideContent });
  };

  changeLoggedInState = ({ isLoggedIn, banner, user }, callback) => {
    if (this.state.isLoggedIn !== isLoggedIn) {
      this.setState(
        {
          isLoggedIn,
          banner,
          user,
          authenModal: { active: false }
        },
        typeof callback === 'function' ? callback : () => {}
      );
    }
  };

  changeUserInfo = (user, callback) => {
    this.setState(
      { user },
      typeof callback === 'function' ? callback : () => {}
    );
  };

  toggleAuthenModal = (type, callback) => e => {
    e.preventDefault();

    this.setState(
      {
        authenModal: {
          active: !this.state.authenModal.active
        },
        authenFlip: {
          isFlipped:
            type && type === 'register' ? true : this.state.authenModal.active,
          label: type && type === 'register' ? 'Đăng ký' : 'Đăng nhập'
        }
      },
      typeof callback === 'function' ? callback : () => {}
    );
  };

  toggleAuthenFlip = () => e => {
    e.preventDefault();

    this.setState({
      authenFlip: {
        isFlipped: !this.state.authenFlip.isFlipped,
        label: this.state.authenFlip.isFlipped ? 'Đăng nhập' : 'Đăng ký'
      }
    });
  };

  renderNeedLogin = () => (
    <Common.commonComps.CommonMessage
      type="info"
      messages={[
        <div>
          Chưa đăng nhập. Vui lòng{' '}
          <span
            className="need-login"
            onClick={this.toggleAuthenModal('login')}
          >
            đăng nhập
          </span>
        </div>
      ]}
    />
  );

  renderMeta = meta => {
    const defaultMeta = {
      title: 'BOBIA – Book by Us',
      url: 'https://bbtest.company',
      description:
        'CEGA BOBIA Book by Us Giới thiệu Bobia là mạng xã hội cung cấp môi trường trực tuyến cho các cây bút trẻ sáng tác, đọc, trau dồi kỹ năng. Bobia là đại lý về bản quyền giữa các tác giả và các bên khai thác. Mục đích Tạo ra “hệ sinh thái” online cho người viết. Tạo ra một phương thức xuất bản minh bạc',
      image: BobiaLogo
    };

    if (!meta) {
      meta = defaultMeta;
    }

    return (
      <Helmet>
        <title>{meta.title || defaultMeta.title}</title>
        <meta property="og:url" content={meta.url || defaultMeta.url} />
        <meta
          name="description"
          content={meta.description || defaultMeta.description}
        />
        <meta name="og:image" content={meta.image || defaultMeta.image} />
      </Helmet>
    );
  };
}

export class SocialContext extends Container {
  state = {
    keyword: '',
    type: 'all',
    kind: 'all',
    category: 'all',
    orderBy: 'updatedAt',
    dir: 'asc',
    limit: 10,
    page: 1
  };

  search = args => {
    this.setState(...args);
  };
}

export class SearchContext extends Container {
  state = {
    keyword: '',
    type: 'all',
    kind: 'all',
    category: 'all',
    orderBy: 'updatedAt',
    dir: 'asc',
    limit: 10,
    page: 1
  };

  search = args => {
    this.setState(...args);
  };
}
