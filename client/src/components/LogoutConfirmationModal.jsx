import React from "react";
import { FaExclamationCircle } from "react-icons/fa";
import "./LogoutConfirmationModal.css";

function LogoutConfirmationModal({ show, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="logout-modal-overlay" onClick={onCancel}>
      <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="logout-modal-icon">
          <FaExclamationCircle />
        </div>
        <h3 className="logout-modal-title">Confirm Logout</h3>
        <p className="logout-modal-message">
          Are you sure you want to logout? You'll need to login again to access your account.
        </p>
        <div className="logout-modal-buttons">
          <button 
            className="logout-btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="logout-btn-confirm"
            onClick={onConfirm}
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmationModal;