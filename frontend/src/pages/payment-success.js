import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";

function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get("reference");

        if (!reference) {
          alert("No payment reference found");
          navigate("/");
          return;
        }

        const res = await fetch(`${BASE_URL}/payments/verify/${reference}`);
        const data = await res.json();

        if (data.success) {
          alert("Payment successful! CBT unlocked ✔");

          // refresh user data
          const token = localStorage.getItem("token");

          const userRes = await fetch(`${BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const userData = await userRes.json();

          if (userData.user) {
            localStorage.setItem("user", JSON.stringify(userData.user));
          }

          navigate("/"); // go back to dashboard
        } else {
          alert(data.message || "Payment verification failed");
          navigate("/payment");
        }
      } catch (err) {
        console.log("Payment verify error:", err);
        alert("Network error during payment verification");
        navigate("/payment");
      }
    };

    verifyPayment();
  }, [navigate]);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2>Verifying Payment...</h2>
      <p>Please wait while we confirm your CBT access.</p>
    </div>
  );
}

export default PaymentSuccess;