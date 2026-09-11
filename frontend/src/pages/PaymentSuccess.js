import React from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

function PaymentSuccess() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (

    <div className="payment-success-container">

      <div className="payment-success-card">

        <div className="success-icon">
          ✅
        </div>

        <h1>Payment Successful</h1>

        <p>
          Congratulations!
        </p>

        <p>
          Your payment has been verified successfully.
        </p>

        <p>
          CBT Examination Access has been activated.
        </p>

        <div className="candidate-box">

          <strong>Candidate</strong>

          <br />

          {user.email || "Student"}

        </div>

        <button
          className="success-button"
          onClick={() => navigate("/dashboard")}
        >
          Continue to Dashboard
        </button>

      </div>

    </div>

  );

}

export default PaymentSuccess;