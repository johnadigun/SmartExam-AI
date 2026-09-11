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

    if (!reference) {

      setStatus("failed");

      setTimeout(() => {

        navigate("/payment", {
          replace: true,
        });

      }, 2500);

      return;

    }

    const verifyPayment = async () => {

      try {

        const response = await fetch(

          `${BASE_URL}/payments/verify/${reference}`

        );

        const data = await response.json();

        console.log("VERIFY RESPONSE:", data);

        if (!data.success) {

          setStatus("failed");

          setTimeout(() => {

            navigate("/payment", {
              replace: true,
            });

          }, 3000);

          return;

        }

        /* ==========================================
           UPDATE LOCAL USER
        ========================================== */

        const oldUser = JSON.parse(

          localStorage.getItem("user") || "{}"

        );

        const updatedUser = {

          ...oldUser,

          isPaid: true,

          cbtAccess: true,

          cbtExpiry: data.expiryTime,

          remainingAttempts: 1,

        };

        localStorage.setItem(

          "user",

          JSON.stringify(updatedUser)

        );

        setStatus("success");

        setTimeout(() => {

          navigate("/dashboard", {
            replace: true,
          });

        }, 2500);

      } catch (err) {

        console.log(err);

        setStatus("failed");

        setTimeout(() => {

          navigate("/payment", {
            replace: true,
          });

        }, 3000);

      }

    };

    verifyPayment();

  }, [reference, navigate]);

  return (

    <div className="verify-container">

      <div className="verify-card">

        {

          status === "verifying" && (

            <>

              <h2>⏳ Verifying Payment...</h2>

              <p>

                Please wait while we verify your payment.

              </p>

            </>

          )

        }

        {

          status === "success" && (

            <>

              <h2 className="success">

                ✅ Payment Successful

              </h2>

              <p>

                CBT access has been activated.

              </p>

              <p>

                Access expires in <strong>5 hours</strong>.

              </p>

              <p>

                Redirecting to Dashboard...

              </p>

            </>

          )

        }

        {

          status === "failed" && (

            <>

              <h2 className="failed">

                ❌ Verification Failed

              </h2>

              <p>

                Unable to verify payment.

              </p>

              <p>

                Redirecting to payment page...

              </p>

            </>

          )

        }

      </div>

    </div>

  );

}

export default VerifyPayment;