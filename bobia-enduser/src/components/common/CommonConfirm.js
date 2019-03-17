import React, { PureComponent } from 'react';
import { render } from 'react-dom';
import defaults from 'lodash.defaults';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

class ConfirmModal extends PureComponent {
  state = {
    modalOpen: true
  };

  _toggleModal = (result = true) => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });

    if (typeof this.props.onClose === 'function') {
      this.props.onClose(result);
    }
  };

  _handleconfirm = () => {
    this._toggleModal(true);
  };

  _handleCancel = () => {
    this._toggleModal(false);
  };

  render() {
    const {
      message,
      title,
      confirmText,
      cancelText,
      confirmColor,
      cancelColor,
      className
    } = this.props;

    let modalHeader = null;
    let cancelButton = null;

    if (title) {
      modalHeader = (
        <ModalHeader toggle={this._handleCancel}>{title}</ModalHeader>
      );
    }

    if (cancelText) {
      cancelButton = (
        <Button
          color={cancelColor}
          onClick={this._handleCancel}
          className="ml-auto"
        >
          {cancelText}
        </Button>
      );
    }

    return (
      <Modal isOpen={this.state.modalOpen} className={className}>
        {modalHeader}
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          {cancelButton}{' '}
          <Button
            color={confirmColor}
            onClick={this._handleconfirm}
            className="mr-auto"
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

class Confirm {
  constructor(options) {
    this.options = defaults(options, {
      message: 'Bạn chắc chắn?',
      title: 'Xác nhận!',
      confirmText: 'Ok',
      cancelText: 'Huỷ',
      confirmColor: 'primary',
      cancelColor: 'secondary'
    });

    this.el = document.createElement('div');
  }

  open() {
    let confirmPromise = new Promise(resolve => {
      render(
        <ConfirmModal
          {...this.options}
          onClose={result => {
            resolve(result);
          }}
        />,
        this.el
      );
    });

    return confirmPromise;
  }
}

export default function confirm(options = {}) {
  const instance = new Confirm(options);

  return instance.open();
}
