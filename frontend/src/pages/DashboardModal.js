import React from "react";

function DashboardModal({
  show,
  closeModal,
  openPayment,
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay">

      <div className="modal-card">

        <div className="modal-icon">
          🔒
        </div>

        <h2>
          CBT Payment Required
        </h2>

        <p>
          Your CBT examination has not yet been activated.
        </p>

        <p>
          To gain access to the CBT Examination, you must complete your payment verification.
        </p>

        <p>
          Once payment is successfully verified, CBT access will be activated automatically on your account.
        </p>

        <div className="modal-actions">

          <button
            className="modal-pay-btn"
            onClick={openPayment}
          >
            Proceed to Payment
          </button>

          <button
            className="modal-close-btn"
            onClick={closeModal}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}

export default DashboardModal;