import React, { PureComponent } from 'react';
import { Alert } from 'reactstrap';

export default class CommonMessage extends PureComponent {
  state = {
    visible: true
  };

  _handleDismiss = () => {
    this.setState({ visible: false });
  };

  render() {
    const { type = 'info', messages } = this.props;

    return (
      <Alert
        color={type === 'error' ? 'danger' : type}
        fade={false}
        isOpen={this.state.visible}
        // toggle={this._handleDismiss}
      >
        {/* <h4 className="alert-heading">{type.toUpperCase()}</h4> */}
        {typeof messages === 'string'
          ? { messages }
          : messages.map((message, index) => (
              <React.Fragment key={`common-message-${index}`}>
                {message}
              </React.Fragment>
            ))}
      </Alert>
    );
  }
}
