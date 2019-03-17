import React, { Component } from 'react';
import { Alert } from 'reactstrap';

class CommonMessage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true
    };

    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss() {
    this.setState({ visible: false });
  }

  render() {
    return (
      <Alert
        color={this.props.type === 'error' ? 'danger' : this.props.type}
        fade={false}
        isOpen={this.state.visible}
        toggle={this.onDismiss}
      >
        <h4 className="alert-heading">
          {this.props.type === 'error' ? '' : this.props.type}
        </h4>
        {this.props.messages.map((message, index) => (
          <React.Fragment key={index.toString()}>{message}</React.Fragment>
        ))}
      </Alert>
    );
  }
}

export default CommonMessage;
