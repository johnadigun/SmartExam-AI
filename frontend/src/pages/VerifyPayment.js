
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import BASE_URL from "../api/api";

import "./VerifyPayment.css";

function VerifyPayment() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [status, setStatus] = useState("verifying");

  const reference =
    params.get("reference") ||
    params.get("trxref");

  useEffect(() => {
    let active = true;
    let redirectTimer;

    const redirectTo = (path, delay) => {
      redirectTimer = setTimeout(() => {
        if (active) {
          navigate(path, { replace: true });
        }
      }, delay);
    };

    const verifyPayment = async () => {
      if (!reference) {
        if (active) {
          setStatus("failed");
          redirectTo("/payment", 2500);
        }
        return;
      }

      try {
        /* ==========================================
           STEP 1: VERIFY PAYMENT WITH THE BACKEND
        ========================================== */

        const response = await fetch(
          `${BASE_URL}/payments/verify/${encodeURIComponent(reference)}`
        );

        const data = await response.json();

        console.log("VERIFY RESPONSE:", data);

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Payment verification failed."
          );
        }

        /* ==========================================
           STEP 2: REFRESH THE AUTHORITATIVE USER
        ========================================== */

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Your session has expired. Please sign in again."
          );
        }

        const userResponse = await fetch(
          `${BASE_URL}/auth/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = await userResponse.json();

        if (
          !userResponse.ok ||
          !userData.success ||
          !userData.user
        ) {
          throw new Error(
            userData.message ||
              "Unable to refresh your account information."
          );
        }

        /* ==========================================
           STEP 3: CONFIRM THE ACCOUNT IS ACTIVATED
        ========================================== */

        const actualUser = userData.user;

        const hasValidExpiry =
          actualUser.cbtExpiry &&
          Number.isFinite(
            new Date(actualUser.cbtExpiry).getTime()
          ) &&
          new Date(actualUser.cbtExpiry).getTime() > Date.now();

        if (
          !actualUser.cbtAccess ||
          !actualUser.isPaid ||
          Number(actualUser.remainingAttempts) < 1 ||
          actualUser.examTaken ||
          !hasValidExpiry
        ) {
          throw new Error(
            "Payment was verified, but examination access is not active. Please contact support before paying again."
          );
        }

        /* ==========================================
           STEP 4: SAVE THE ACTUAL USER RECORD
        ========================================== */

        localStorage.setItem(
          "user",
          JSON.stringify(actualUser)
        );

        if (!active) return;

        setStatus("success");

        redirectTo("/dashboard", 2500);
      } catch (error) {
        console.error("PAYMENT VERIFICATION ERROR:", error);

        if (!active) return;

        setStatus("failed");
        redirectTo("/payment", 3000);
      }
    };

    verifyPayment();

    return () => {
      active = false;
      clearTimeout(redirectTimer);
    };
  }, [reference, navigate]);

  return (
    <div className="verify-container">
      <div className="verify-card">
        {status === "verifying" && (
          <>
            <h2>⏳ Verifying Payment...</h2>
            <p>
              Please wait while we verify your payment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="success">
              ✅ Payment Successful
            </h2>

            <p>
              CBT access has been activated.
            </p>

            <p>
              Access expires in{" "}
              <strong>5 hours</strong>.
            </p>

            <p>
              Redirecting to Dashboard...
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <h2 className="failed">
              ❌ Verification Failed
            </h2>

            <p>
              We could not complete the payment verification
              or confirm active examination access.
            </p>

            <p>
              If your payment was successful, please do not
              pay again. Contact support to check your
              transaction and account access.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyPayment;

