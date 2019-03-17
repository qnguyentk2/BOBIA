import React, { memo } from 'react';
import { Motion, spring } from 'react-motion';
import LoginModal from 'components/Auth/Login';
import RegisterModal from 'components/Auth/Register';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

function AuthenModal(props) {
  const stiffness = 255;
  const damping = 10;
  const frontStyle = {
    rotation: spring(0, { stiffness, damping })
  };

  const backStyle = {
    rotation: spring(180, { stiffness, damping })
  };

  const { authenModal, authenFlip, toggleAuthenModal } = props;

  return (
    <Modal
      isOpen={authenModal.active}
      toggle={toggleAuthenModal()}
      className="modal-lg modal-primary"
    >
      <ModalHeader toggle={toggleAuthenModal()}>{authenFlip.label}</ModalHeader>
      <ModalBody>
        <Motion style={authenFlip.isFlipped ? backStyle : frontStyle}>
          {({ rotation }) => (
            <article
              className="card__front"
              style={{
                transform: `rotateY(${rotation}deg)`,
                display: authenFlip.isFlipped ? 'none' : 'block'
              }}
            >
              <LoginModal />
            </article>
          )}
        </Motion>
        <Motion style={authenFlip.isFlipped ? frontStyle : backStyle}>
          {({ rotation }) => (
            <article
              className="card__back"
              style={{
                transform: `rotateY(${rotation}deg)`,
                display: authenFlip.isFlipped ? 'block' : 'none'
              }}
            >
              <RegisterModal />
            </article>
          )}
        </Motion>
      </ModalBody>
    </Modal>
  );
}

export default memo(AuthenModal);
