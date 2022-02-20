import React from 'react';
import ReactModal from 'react-modal';

import './styles.css';

export const Modal = React.memo((props: { isOpen: boolean; children: React.ReactNode; shouldCloseOnEsc?: boolean }) => {
  return (
    <ReactModal
      shouldCloseOnEsc={props.shouldCloseOnEsc}
      className="modal__content-wrapper"
      overlayClassName="modal"
      isOpen={props.isOpen}
    >
      {props.children}
    </ReactModal>
  );
});
Modal.displayName = 'Modal';
