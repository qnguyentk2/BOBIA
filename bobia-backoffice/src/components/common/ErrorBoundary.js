import React, { Component } from 'react';

const styles = {
  error: {
    backgroundColor: '#f98e7e',
    borderTop: '1px solid #777',
    borderBottom: '1px solid #777',
    padding: '12px'
  }
};

const catchFunc = (error, errorInfo, ctx) => {
  ctx.setState({
    error: error,
    errorInfo: errorInfo
  });
};

const handleError = ctx => (
  <div style={ctx.props.style || styles.error}>
    <h2>Có lỗi xảy ra.</h2>
    <details style={{ whiteSpace: 'pre-wrap' }}>
      <summary>Xem chi tiết</summary>
      {ctx.state.error && ctx.state.error.toString()}
      <br />
      {ctx.state.errorInfo.componentStack}
    </details>
  </div>
);

export const withErrorBoundary = WrappedComponent =>
  class extends Component {
    constructor(props) {
      super(props);
      this.state = { error: null, errorInfo: null };
    }

    componentDidCatch = (error, errorInfo) => catchFunc(error, errorInfo, this);

    render() {
      if (this.state.errorInfo) {
        return handleError(this);
      }
      return <WrappedComponent {...this.props} />;
    }
  };

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch = (error, errorInfo) => catchFunc(error, errorInfo, this);

  render() {
    if (this.state.errorInfo) {
      return handleError(this);
    }
    return this.props.children;
  }
}
