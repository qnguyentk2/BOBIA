import React, { PureComponent } from 'react';

export default class DefaultAside extends PureComponent {
  state = {
    isShowSubMenuCategory: false
  };

  handleShowSubMenu = (item, isMobie) => {
    if (isMobie) {
      this.setState({
        isShowSubMenuCategory:
          item.key === 'DANH_MUC_TAC_PHAM' && !this.state.isShowSubMenuCategory
      });
    }
  };

  render() {
    const { children } = this.props;
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(
        child,
        Object.assign(
          {
            isShowSubMenuCategory: this.state.isShowSubMenuCategory,
            isMobie: window.innerWidth < 768,
            handleShowSubMenu: this.handleShowSubMenu,
            changeAsideContent: this.changeAsideContent
          },
          this.props
        )
      )
    );
    return <nav className="navbar">{childrenWithProps}</nav>;
  }
}
