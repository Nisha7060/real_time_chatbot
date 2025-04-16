// components/Modal.js
import React from 'react';
import './AcceptModal.css'; // Simpler CSS file

const Modal = ({ isOpen, onClose, onAccept, onReject }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="accespmodal-content">
        <h2>Alert?</h2>
        <p>Are you sure want to Add Collaborator ?...</p>
        <div className="modal-buttons">
          <button className="accept-btn" onClick={onAccept}>
            Accept
          </button>
          <button className="reject-btn" onClick={onReject}>
            Reject
          </button>
        </div>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Modal;
