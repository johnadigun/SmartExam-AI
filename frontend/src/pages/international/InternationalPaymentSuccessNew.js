
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api/api";

const styles = {
  page: {
    maxWidth: "760px",
    margin: "50px auto",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    color: "#1f2937",
    lineHeight: 1.6,
  },
  panel: {
    padding: "24px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    overflowWrap: "anywhere",
  },
  button: {
    padding: "12px 18px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    backgroundColor: "#ffffff",
    color: "#1f2937",
  },
  primaryButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    backgroundColor: "#1d4ed8",
    color: "#ffffff",
  },
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "12px",
    marginTop: "24px",
  },
};

function InternationalPaymentSuccessNew() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Please wait while we verify your international examination payment."
  );
  const [purchase, setPurchase] = useState(null);

  const verifyPayment = useCallback(async (signal) => {
    setStatus("verifying");
    setMessage("Please wait while we verify your payment.");
    setPurchase(null);

    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    const token = localStorage.getItem("token");

    if (!reference) {
      setStatus("error");
      setMessage(
        "No payment reference was found in the page address. Please check your payment status."
      );
      return;
    }

    if (!token) {
      setStatus("error");
      setMessage(
        "Your login session could not be found. Please sign in again before verifying your payment."
      );
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/international/payments/verify/${encodeURIComponent(reference)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          signal,
        }
      );

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          response.ok
            ? "The server returned an unexpected response. Please try verifying your payment again."
            : `Payment verification could not be completed (HTTP ${response.status}). Please try again.`
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "International payment verification failed."
        );
      }

      setPurchase(data.purchase || null);
      setStatus("success");
      setMessage(
        data.message ||
          "Your international examination payment has been verified successfully."
      );
    } catch (error) {
      if (error.name === "AbortError") return;

      console.error("International payment verification error:", error);

      setStatus("error");
      setMessage(
        error.message ||
          "A network error occurred while verifying your payment. Please try again."
      );
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    verifyPayment(controller.signal);

    return () => {
      controller.abort();
    };
  }, [verifyPayment]);

  const purchasedExamCodes = Array.isArray(purchase?.examCodes)
    ? [
        ...new Set(
          purchase.examCodes.filter(
            (code) =>
              typeof code === "string" && code.trim().length > 0
          )
        ),
      ]
    : [];

  const openPurchasedExam = (examCode) => {
    const paymentIsVerified =
      status === "success" &&
      String(purchase?.status || "").toLowerCase() === "success" &&
      purchasedExamCodes.includes(examCode);

    if (!paymentIsVerified) return;

    navigate(`/international/${encodeURIComponent(examCode)}`, {
      state: {
        purchase,
        purchasedExamCodes,
        selectedExamCode: examCode,
      },
    });
  };

  const formatAmount = (amount) => {
    if (typeof amount === "number") {
      return amount.toLocaleString("en-NG");
    }

    return amount ?? "Confirmed";
  };

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString("en-NG");
  };

  const returnToDashboard = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <main style={styles.page}>
      <section style={styles.panel}>
        {status === "verifying" && (
          <div role="status" aria-live="polite" style={{ textAlign: "center" }}>
            <h1>Verifying Payment</h1>
            <p>{message}</p>
            <p>Please keep this page open while verification is in progress.</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <header style={{ textAlign: "center" }}>
              <h1>Payment Verified</h1>
              <p role="status" aria-live="polite">{message}</p>
            </header>

            {purchase && (
              <section
                style={{
                  marginTop: "24px",
                  padding: "18px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                }}
              >
                <h2>Purchase Confirmation</h2>
                <p>
                  <strong>Package:</strong>{" "}
                  {purchase.packageCode || "International examination"}
                </p>
                <p>
                  <strong>Amount:</strong>{" "}
                  {purchase.currency || "NGN"}{" "}
                  {formatAmount(purchase.amount)}
                </p>
                <p>
                  <strong>Payment Reference:</strong>{" "}
                  {purchase.reference || "Verified"}
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  {purchase.status || "Verified"}
                </p>

                {purchase.accessStartsAt && (
                  <p>
                    <strong>Access Starts:</strong>{" "}
                    {formatDate(purchase.accessStartsAt)}
                  </p>
                )}

                {purchase.accessExpiresAt && (
                  <p>
                    <strong>Access Expires:</strong>{" "}
                    {formatDate(purchase.accessExpiresAt)}
                  </p>
                )}
              </section>
            )}

            <section style={{ marginTop: "28px" }}>
              <h2>Your Purchased Examinations</h2>

              {purchasedExamCodes.length > 0 ? (
                <>
                  <p>
                    Select an examination included in your verified purchase.
                  </p>

                  <div style={{ display: "grid", gap: "12px" }}>
                    {purchasedExamCodes.map((examCode) => (
                      <div
                        key={examCode}
                        style={{
                          padding: "16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "12px",
                        }}
                      >
                        <div>
                          <strong>{examCode}</strong>
                          <p style={{ margin: "4px 0 0" }}>
                            Purchased examination
                          </p>
                        </div>

                        <button
                          type="button"
                          style={styles.primaryButton}
                          onClick={() => openPurchasedExam(examCode)}
                          disabled={
                            String(purchase?.status || "").toLowerCase() !==
                            "success"
                          }
                        >
                          Continue to Examination Details
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p>
                  Your payment has been verified, but the server did not return
                  any purchased examination codes. Please contact support
                  before making another payment.
                </p>
              )}
            </section>

            <div style={styles.buttonRow}>
              <button
                type="button"
                style={styles.button}
                onClick={() => navigate("/international")}
              >
                International Examinations
              </button>

              <button
                type="button"
                style={styles.button}
                onClick={returnToDashboard}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div style={{ textAlign: "center" }}>
            <h1>Payment Verification Pending</h1>
            <p role="alert" aria-live="polite">{message}</p>
            <p>
              If your account was charged, please do not make another payment
              until the payment status has been checked.
            </p>

            <div style={styles.buttonRow}>
              <button
                type="button"
                style={styles.primaryButton}
                onClick={() => verifyPayment()}
              >
                Retry Verification
              </button>

              <button
                type="button"
                style={styles.button}
                onClick={returnToDashboard}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default InternationalPaymentSuccessNew;
