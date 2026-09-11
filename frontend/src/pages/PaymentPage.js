
import React, { useState } from "react";
import BASE_URL from "../api/api";
import "./PaymentPage.css";

function PaymentPage() {
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const payNow = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/payments/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          userId: user._id,
          amount: 1000,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Payment initialization failed.");
        return;
      }

      window.location.href = data.authorization_url;
    } catch (err) {
      console.log(err);
      alert("Unable to connect to payment server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">

      <div className="payment-card">

        {/* ================= HEADER ================= */}

        <h1>
          SmartExam CBT Payment
        </h1>

        <p className="payment-text">
          Complete payment to activate your CBT examination access.
        </p>


        {/* ================= PRICE ================= */}

        <div className="payment-price">
          ₦1,000
        </div>


        {/* ================= PAYMENT INFORMATION ================= */}

        <div className="payment-info">

          <div className="payment-candidate">

            <strong>
              Candidate
            </strong>

            <span>
              {user.email}
            </span>

          </div>


          <hr />


          <div className="payment-access">

            <strong>
              Access Includes
            </strong>

            <ul>
              <li>Full CBT Examination</li>
              <li>Instant Result</li>
              <li>Certificate Printing</li>
              <li>12 Hours Access</li>
            </ul>

          </div>

        </div>


        {/* ================= PAYMENT BUTTON ================= */}

        <button
          className="payment-button"
          onClick={payNow}
          disabled={loading}
        >
          {loading
            ? "Connecting to Paystack..."
            : "Pay ₦1,000"}
        </button>

      </div>

    </div>
  );
}

export default PaymentPage;