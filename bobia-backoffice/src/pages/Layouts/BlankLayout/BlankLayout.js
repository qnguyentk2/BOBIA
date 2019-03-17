import React, { Component } from 'react';

class BlankLayout extends Component {
  render() {
    const { children } = this.props;
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, this.props)
    );
    return <React.Fragment>{childrenWithProps}</React.Fragment>;
  }
}

export default BlankLayout;
