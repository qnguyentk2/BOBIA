import React, { PureComponent } from 'react';
import { render } from 'react-dom';
import defaults from 'lodash.defaults';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

class PopupModal extends PureComponent {
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

  _handleCloseModal = () => {
    this._toggleModal(false);
  };

  render() {
    const { message, title, closeText, closeColor, className } = this.props;

    let modalHeader = null;
    let closeButton = null;

    if (title) {
      modalHeader = (
        <ModalHeader toggle={this._handleCloseModal}>{title}</ModalHeader>
      );
    }

    if (closeText) {
      closeButton = (
        <Button color={closeColor} onClick={this._handleCloseModal}>
          {closeText}
        </Button>
      );
    }

    return (
      <Modal isOpen={this.state.modalOpen} className={className}>
        {modalHeader}
        <ModalBody>{message}</ModalBody>
        <ModalFooter>{closeButton}</ModalFooter>
      </Modal>
    );
  }
}

class Popup {
  constructor(options) {
    this.options = defaults(options, {
      message: 'Nội dung thông báo',
      title: 'Thông báo!',
      closeText: 'OK',
      closeColor: 'primary'
    });

    this.el = document.createElement('div');
  }

  open() {
    let confirmPromise = new Promise(resolve => {
      render(
        <PopupModal
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

export default function popup(options = {}) {
  const instance = new Popup(options);

  return instance.open();
}
