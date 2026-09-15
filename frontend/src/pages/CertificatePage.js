
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CertificatePage.css";

function CertificatePage() {

  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [user, setUser] = useState({});

  /* ==========================================
     LOAD DATA
  ========================================== */

  useEffect(() => {

    const savedResult =
      localStorage.getItem("cbt_result");

    if (!savedResult) {

      navigate("/dashboard");

      return;

    }

    try {

      const parsedResult =
        JSON.parse(savedResult);

      setResult(parsedResult);

      const savedUser =
        JSON.parse(
          localStorage.getItem("user") || "{}"
        );

      setUser(savedUser);

    } catch (err) {

      console.log(err);

      navigate("/dashboard");

    }

  }, [navigate]);

  /* ==========================================
     LOADING
  ========================================== */

  if (!result) {

    return (

      <div className="certificate-loading">

        <h2>
          Loading Certificate...
        </h2>

      </div>

    );

  }

  /* ==========================================
     RESULT DETAILS
  ========================================== */

  const {
    exam,
    category,
    subject,
    score,
    percentage,
    grade,
    completedAt,
  } = result;

  const totalQuestions =
    result.total ||
    result.totalQuestions ||
    exam?.questions?.length ||
    0;

  /* ==========================================
     CERTIFICATE ELIGIBILITY

     PASS = 50% OR ABOVE
     FAIL = BELOW 50%

     Backend certificateIssued is authoritative
     when available. Percentage is retained as a
     safe fallback for older stored CBT results.
  ========================================== */

  const status =
    Number(percentage) >= 50
      ? "PASS"
      : "FAIL";

  const certificateIssued =
    typeof result.certificateIssued === "boolean"
      ? result.certificateIssued
      : status === "PASS";

  /* ==========================================
     FAILED / CERTIFICATE NOT AVAILABLE
  ========================================== */

  if (!certificateIssued) {

    return (

      <div className="certificate-container">

        <div className="certificate-card">

          <div className="certificate-header">

            <h3>
              SMARTEXAM
            </h3>

            <h1>
              CERTIFICATE NOT AVAILABLE
            </h1>

            <h4>
              Computer Based Examination (CBT)
            </h4>

          </div>

          <div className="certificate-body">

            <p className="certificate-text">

              Your CBT examination has been completed.

            </p>

            <h2 className="student-name">

              {
                user.fullName ||
                user.name ||
                "Student"
              }

            </h2>

            <p className="certificate-text">

              Unfortunately, your examination result does not
              meet the minimum requirement for a certificate.

            </p>

            <p className="certificate-text">

              <strong>
                Minimum passing score: 50%
              </strong>

            </p>

          </div>

          <div className="certificate-details">

            <div className="certificate-item">

              <span>
                Examination
              </span>

              <strong>
                {
                  exam?.title ||
                  "SMARTEXAM CBT Examination"
                }
              </strong>

            </div>

            <div className="certificate-item">

              <span>
                Subject
              </span>

              <strong>
                {
                  subject ||
                  "-"
                }
              </strong>

            </div>

            <div className="certificate-item">

              <span>
                Category
              </span>

              <strong>
                {
                  category ||
                  "-"
                }
              </strong>

            </div>

            <div className="certificate-item">

              <span>
                Score
              </span>

              <strong>
                {score} / {totalQuestions}
              </strong>

            </div>

            <div className="certificate-item">

              <span>
                Percentage
              </span>

              <strong>
                {percentage}%
              </strong>

            </div>

            <div className="certificate-item">

              <span>
                Grade
              </span>

              <strong>
                {grade || "-"}
              </strong>

            </div>

            <div className="certificate-item certificate-fail">

              <span>
                Status
              </span>

              <strong>
                FAIL
              </strong>

            </div>

            <div className="certificate-item">

              <span>
                Date Completed
              </span>

              <strong>

                {
                  completedAt
                    ? new Date(
                        completedAt
                      ).toLocaleDateString()
                    : "-"
                }

              </strong>

            </div>

          </div>

        </div>

        {/* ======================================
            ACTION BUTTONS
        ====================================== */}

        <div className="certificate-buttons">

          <button
            className="back-btn"
            onClick={() => navigate("/result")}
          >
            Back to Result
          </button>

          <button
            className="dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

        </div>

      </div>

    );

  }

  /* ==========================================
     CERTIFICATE NUMBER
  ========================================== */

  const certificateNumber =

    result.certificateNumber ||

    `SMX-${new Date().getFullYear()}-${String(
      Date.now()
    ).slice(-6)}`;

  /* ==========================================
     BUTTON ACTIONS
  ========================================== */

  const printCertificate = () => {

    window.print();

  };

  const backToResult = () => {

    navigate("/result");

  };

  const dashboard = () => {

    navigate("/dashboard");

  };

  /* ==========================================
     CERTIFICATE PAGE
  ========================================== */

  return (

    <div className="certificate-container">

      <div className="certificate-card">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="certificate-header">

          <h3>
            SMARTEXAM
          </h3>

          <h1>
            CERTIFICATE OF ACHIEVEMENT
          </h1>

          <h4>
            Computer Based Examination (CBT)
          </h4>

        </div>

        {/* ======================================
            CERTIFICATE TEXT
        ====================================== */}

        <div className="certificate-body">

          <p className="certificate-text">

            This certificate is proudly awarded to

          </p>

          <h2 className="student-name">

            {
              user.fullName ||
              user.name ||
              "Student"
            }

          </h2>

          <p className="certificate-text">

            for successfully completing the

            <strong>

              {" "}
              SMARTEXAM Computer Based Examination

            </strong>

            .

          </p>

        </div>

        {/* ======================================
            CERTIFICATE INFORMATION
        ====================================== */}

        <div className="certificate-details">

          <div className="certificate-item">

            <span>
              Examination
            </span>

            <strong>
              {
                exam?.title ||
                "SMARTEXAM CBT Examination"
              }
            </strong>

          </div>

          <div className="certificate-item">

            <span>
              Subject
            </span>

            <strong>
              {
                subject ||
                "-"
              }
            </strong>

          </div>

          <div className="certificate-item">

            <span>
              Category
            </span>

            <strong>
              {
                category ||
                "-"
              }
            </strong>

          </div>

          <div className="certificate-item">

            <span>
              Score
            </span>

            <strong>
              {score} / {totalQuestions}
            </strong>

          </div>

          <div className="certificate-item">

            <span>
              Percentage
            </span>

            <strong>
              {percentage}%
            </strong>

          </div>

          <div className="certificate-item">

            <span>
              Grade
            </span>

            <strong>
              {grade || "-"}
            </strong>

          </div>

          <div
            className={
              `certificate-item ${
                status === "PASS"
                  ? "certificate-pass"
                  : "certificate-fail"
              }`
            }
          >

            <span>
              Status
            </span>

            <strong>
              {status}
            </strong>

          </div>

          <div className="certificate-item">

            <span>
              Date Completed
            </span>

            <strong>

              {
                completedAt
                  ? new Date(
                      completedAt
                    ).toLocaleDateString()
                  : "-"
              }

            </strong>

          </div>

          <div className="certificate-item">

            <span>
              Certificate No.
            </span>

            <strong>
              {certificateNumber}
            </strong>

          </div>

        </div>

        {/* ======================================
            FOOTER SIGNATURE AREA
        ====================================== */}

        <div className="certificate-footer">

          <div className="signature-block">

            <div className="signature-line"></div>

            <p>
              Candidate Signature
            </p>

          </div>

          <div className="seal-area">

            <div className="seal-circle">
              SMARTEXAM
            </div>

            <p>
              Official Seal
            </p>

          </div>

          <div className="signature-block">

            <div className="signature-line"></div>

            <p>
              Examination Controller
            </p>

          </div>

        </div>

      </div>

      {/* ======================================
          ACTION BUTTONS
      ====================================== */}

      <div className="certificate-buttons">

        <button
          className="print-btn"
          onClick={printCertificate}
        >
          Print Certificate
        </button>

        <button
          className="back-btn"
          onClick={backToResult}
        >
          Back to Result
        </button>

        <button
          className="dashboard-btn"
          onClick={dashboard}
        >
          Dashboard
        </button>

      </div>

    </div>

  );

}

export default CertificatePage;
