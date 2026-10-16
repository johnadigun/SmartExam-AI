
import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import BASE_URL from "../../api/api";

function InternationalExamDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { examCode } = useParams();

  const normalizedCode = decodeURIComponent(
    examCode || ""
  ).trim();

  /* ======================================================
     STATE
  ====================================================== */

  const [examination, setExamination] = useState(
    location.state?.examination || null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [proceedMessage, setProceedMessage] = useState("");

  const [pricing, setPricing] = useState(null);
  const [pricingLoading, setPricingLoading] = useState(true);
  const [pricingError, setPricingError] = useState("");

  const [selectedPackageCode, setSelectedPackageCode] =
    useState("SINGLE");

  const [availableExaminations, setAvailableExaminations] =
    useState([]);

  const [examinationsLoading, setExaminationsLoading] =
    useState(false);

  const [examinationsError, setExaminationsError] =
    useState("");

  const [selectedExamCodes, setSelectedExamCodes] =
    useState(normalizedCode ? [normalizedCode] : []);

  const [paymentLoading, setPaymentLoading] = useState(false);

  /* ======================================================
     KEEP THE CURRENT EXAMINATION SELECTED
  ====================================================== */

  useEffect(() => {
    setSelectedExamCodes(
      normalizedCode ? [normalizedCode] : []
    );
  }, [normalizedCode]);

  /* ======================================================
     LOAD EXAMINATION DETAILS
  ====================================================== */

  useEffect(() => {
    let cancelled = false;

    const loadExamination = async () => {
      if (!normalizedCode) {
        setError("No examination code was provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${BASE_URL}/international/exams/${encodeURIComponent(
            normalizedCode
          )}`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "This international examination could not be found."
              : `Server error: ${response.status}`
          );
        }

        const data = await response.json();

        const details =
          data?.exam ||
          data?.examination ||
          data?.data?.exam ||
          data?.data?.examination ||
          data?.data ||
          data;

        if (
          !details ||
          typeof details !== "object" ||
          Array.isArray(details)
        ) {
          throw new Error(
            "The examination information received is invalid."
          );
        }

        if (!cancelled) {
          setExamination(details);
        }
      } catch (err) {
        console.error(
          "International examination loading error:",
          err
        );

        if (!cancelled) {
          setError(
            err.message ||
              "Unable to load examination information."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadExamination();

    return () => {
      cancelled = true;
    };
  }, [normalizedCode]);

  /* ======================================================
     LOAD INTERNATIONAL PRICING
  ====================================================== */

  useEffect(() => {
    let cancelled = false;

    const loadPricing = async () => {
      try {
        setPricingLoading(true);
        setPricingError("");

        const response = await fetch(
          `${BASE_URL}/international/pricing`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "The international pricing service was not found."
              : `Unable to load prices. Server error: ${response.status}.`
          );
        }

        const data = await response.json();

        if (
          data?.success !== true ||
          !data?.exchangeRate ||
          !Array.isArray(data?.packages)
        ) {
          throw new Error(
            "The pricing information received from the server is invalid."
          );
        }

        if (!cancelled) {
          setPricing(data);
        }
      } catch (err) {
        console.error(
          "International pricing loading error:",
          err
        );

        if (!cancelled) {
          setPricingError(
            err.message ||
              "Unable to load international examination prices."
          );
        }
      } finally {
        if (!cancelled) {
          setPricingLoading(false);
        }
      }
    };

    loadPricing();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ======================================================
     LOAD AVAILABLE EXAMINATIONS FOR THE THREE-EXAM BUNDLE
  ====================================================== */

  useEffect(() => {
    if (selectedPackageCode !== "BUNDLE_3") {
      return undefined;
    }

    let cancelled = false;

    const loadAvailableExaminations = async () => {
      try {
        setExaminationsLoading(true);
        setExaminationsError("");

        const response = await fetch(
          `${BASE_URL}/international/exams`
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load the examination list (server error ${response.status}).`
          );
        }

        const data = await response.json();

        let items = [];

        if (Array.isArray(data)) {
          items = data;
        } else if (Array.isArray(data?.exams)) {
          items = data.exams;
        } else if (Array.isArray(data?.examinations)) {
          items = data.examinations;
        } else if (Array.isArray(data?.data?.exams)) {
          items = data.data.exams;
        } else if (Array.isArray(data?.data?.examinations)) {
          items = data.data.examinations;
        } else if (Array.isArray(data?.data)) {
          items = data.data;
        }

        const normalizedItems = items
          .filter(
            (item) =>
              item &&
              typeof item === "object" &&
              !Array.isArray(item)
          )
          .map((item) => {
            const code = String(
              item.code ||
                item.examCode ||
                item.examinationCode ||
                ""
            ).trim();

            const name = String(
              item.name ||
                item.fullName ||
                item.title ||
                item.examName ||
                code
            ).trim();

            return {
              ...item,
              code,
              name,
            };
          })
          .filter((item) => item.code);

        if (!cancelled) {
          const currentExam =
            examination &&
            typeof examination === "object"
              ? {
                  ...examination,
                  code: String(
                    examination.code ||
                      examination.examCode ||
                      normalizedCode
                  ).trim(),
                  name:
                    examination.name ||
                    examination.fullName ||
                    examination.title ||
                    normalizedCode,
                }
              : {
                  code: normalizedCode,
                  name: normalizedCode,
                };

          const combined = [
            currentExam,
            ...normalizedItems,
          ].filter((item) => item.code);

          const unique = Array.from(
            new Map(
              combined.map((item) => [
                item.code,
                item,
              ])
            ).values()
          );

          setAvailableExaminations(unique);

          if (unique.length < 3) {
            setExaminationsError(
              "Fewer than three distinct examinations are currently available. Please check the international examination list."
            );
          }
        }
      } catch (err) {
        console.error(
          "Available international examinations loading error:",
          err
        );

        if (!cancelled) {
          setExaminationsError(
            err.message ||
              "Unable to load the available examinations."
          );

          setAvailableExaminations(
            examination
              ? [
                  {
                    ...examination,
                    code: String(
                      examination.code ||
                        examination.examCode ||
                        normalizedCode
                    ).trim(),
                    name:
                      examination.name ||
                      examination.fullName ||
                      examination.title ||
                      normalizedCode,
                  },
                ]
              : [
                  {
                    code: normalizedCode,
                    name: normalizedCode,
                  },
                ]
          );
        }
      } finally {
        if (!cancelled) {
          setExaminationsLoading(false);
        }
      }
    };

    loadAvailableExaminations();

    return () => {
      cancelled = true;
    };
  }, [selectedPackageCode, normalizedCode, examination]);

  /* ======================================================
     NAVIGATION AND SELECTED PACKAGE
  ====================================================== */

  const returnToExaminations = () => {
    navigate("/international");
  };

  const selectedPackage = pricing?.packages?.find(
    (item) => item.code === selectedPackageCode
  );

  /* ======================================================
     FORMAT NAIRA
  ====================================================== */

  const formatNaira = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

  /* ======================================================
     SELECT OR DESELECT A BUNDLE EXAMINATION
  ====================================================== */

  const toggleExamSelection = (code) => {
    setProceedMessage("");

    setSelectedExamCodes((previous) => {
      if (previous.includes(code)) {
        return previous.filter((item) => item !== code);
      }

      if (previous.length >= 3) {
        setProceedMessage(
          "You can select only three different examinations for this package."
        );

        return previous;
      }

      return [...previous, code];
    });
  };

  /* ======================================================
     INITIALIZE INTERNATIONAL PAYMENT
  ====================================================== */

  const handleProceed = async () => {
    if (paymentLoading) return;

    setProceedMessage("");

    if (!normalizedCode) {
      setProceedMessage(
        "The examination code is missing. Please select the examination again."
      );
      return;
    }

    if (
      pricingLoading ||
      pricingError ||
      !selectedPackage
    ) {
      setProceedMessage(
        "The selected package is unavailable. Please refresh the prices and try again."
      );
      return;
    }

    let examCodesToPayFor = [];

    if (selectedPackage.code === "SINGLE") {
      examCodesToPayFor = [normalizedCode];
    } else if (selectedPackage.code === "BUNDLE_3") {
      const uniqueCodes = Array.from(
        new Set(
          selectedExamCodes
            .map((code) => String(code).trim())
            .filter(Boolean)
        )
      );

      if (uniqueCodes.length !== 3) {
        setProceedMessage(
          "Please select exactly three different examinations before proceeding to payment."
        );
        return;
      }

      examCodesToPayFor = uniqueCodes;
    } else {
      setProceedMessage(
        "The selected package is not supported by this payment step."
      );
      return;
    }

    const token = localStorage.getItem("internationalToken");

    const selectedExamPath =
      `/international/${encodeURIComponent(normalizedCode)}`;

    if (!token) {
      navigate("/login", {
        state: {
          returnTo: selectedExamPath,
          selectedPackageCode: selectedPackage.code,
          selectedExamCodes: examCodesToPayFor,
        },
      });

      return;
    }

    try {
      setPaymentLoading(true);
      setProceedMessage(
        "Connecting securely to the payment service..."
      );

      const response = await fetch(
        `${BASE_URL}/international/payments/initialize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            examCodes: examCodesToPayFor,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        setProceedMessage(
          data.message ||
            "Your session has expired. Please log in again."
        );
        return;
      }

      if (!response.ok || data.success !== true) {
        throw new Error(
          data.message ||
            `Payment initialization failed (${response.status}). Please try again.`
        );
      }

      const authorizationUrl =
        data.authorizationUrl ||
        data.authorization_url ||
        data.data?.authorizationUrl ||
        data.data?.authorization_url ||
        data.data?.data?.authorization_url;

      if (
        typeof authorizationUrl !== "string" ||
        !authorizationUrl.trim()
      ) {
        console.error(
          "Payment initialization response did not contain a checkout URL:",
          data
        );

        throw new Error(
          "The payment service did not return a checkout link."
        );
      }

      let checkoutUrl;

      try {
        checkoutUrl = new URL(authorizationUrl);
      } catch {
        throw new Error(
          "The payment service returned an invalid checkout link."
        );
      }

      const isPaystackHost =
        checkoutUrl.hostname === "paystack.com" ||
        checkoutUrl.hostname.endsWith(".paystack.com");

      if (
        checkoutUrl.protocol !== "https:" ||
        !isPaystackHost
      ) {
        throw new Error(
          "The payment service returned an unrecognized checkout address."
        );
      }

      window.location.assign(checkoutUrl.href);
    } catch (err) {
      console.error(
        "International payment initialization error:",
        err
      );

      setProceedMessage(
        err.message ||
          "Unable to start payment. Please try again."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  /* ======================================================
     MODULES AND SECTIONS
  ====================================================== */

  const modules = Array.isArray(examination?.modules)
    ? examination.modules
    : Array.isArray(examination?.sections)
      ? examination.sections
      : [];

  /* ======================================================
     LOADING SCREEN
  ====================================================== */

  if (loading && !examination) {
    return (
      <div style={styles.page}>
        <div style={styles.panel}>
          <div style={styles.spinner} />

          <h2 style={styles.heading}>
            Loading examination...
          </h2>

          <p style={styles.muted}>
            Please wait while the examination information loads.
          </p>
        </div>
      </div>
    );
  }

  /* ======================================================
     EXAMINATION ERROR
  ====================================================== */

  if (error && !examination) {
    return (
      <div style={styles.page}>
        <div style={styles.panel}>
          <h2 style={styles.heading}>
            Examination unavailable
          </h2>

          <p style={styles.error}>{error}</p>

          <button
            type="button"
            style={styles.primaryButton}
            onClick={returnToExaminations}
          >
            Return to International Examinations
          </button>
        </div>
      </div>
    );
  }

  /* ======================================================
     MAIN PAGE
  ====================================================== */

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <p style={styles.eyebrow}>SMARTEXAM</p>

            <h1 style={styles.title}>
              International Examinations
            </h1>

            <p style={styles.subtitle}>
              Details of the selected examination
            </p>
          </div>

          <button
            type="button"
            style={styles.secondaryButton}
            onClick={returnToExaminations}
          >
            Back
          </button>
        </div>
      </header>

      <main style={styles.content}>
        {/* EXAMINATION INFORMATION */}

        <section style={styles.panel}>
          <div style={styles.examHeading}>
            <div style={styles.examCode}>
              {examination?.code || normalizedCode}
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={styles.examTitle}>
                {examination?.name ||
                  examination?.fullName ||
                  normalizedCode}
              </h2>

              {examination?.fullName &&
                examination?.name && (
                  <p style={styles.muted}>
                    {examination.fullName}
                  </p>
                )}
            </div>
          </div>

          {examination?.provider && (
            <p style={styles.detail}>
              <strong>Examination Provider:</strong>{" "}
              {examination.provider}
            </p>
          )}

          {examination?.examType && (
            <p style={styles.detail}>
              <strong>Examination Type:</strong>{" "}
              {examination.examType}
            </p>
          )}

          {examination?.description && (
            <p style={styles.description}>
              {examination.description}
            </p>
          )}
        </section>

        {/* MODULES AND SUBJECTS */}

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Modules and Subjects
          </h2>

          <p style={styles.muted}>
            Review the modules and sections available for this examination.
          </p>

          {modules.length > 0 ? (
            <div style={styles.moduleGrid}>
              {modules.map((module, index) => {
                const moduleCode =
                  typeof module === "string"
                    ? module
                    : module.code ||
                      module.moduleCode ||
                      module._id ||
                      `MODULE_${index + 1}`;

                const moduleName =
                  typeof module === "string"
                    ? module
                    : module.name ||
                      module.title ||
                      module.fullName ||
                      module.code ||
                      `Module ${index + 1}`;

                const sections = Array.isArray(
                  module?.sections
                )
                  ? module.sections
                  : Array.isArray(module?.subsections)
                    ? module.subsections
                    : [];

                return (
                  <article
                    key={moduleCode}
                    style={styles.moduleCard}
                  >
                    <div style={styles.moduleNumber}>
                      {index + 1}
                    </div>

                    <h3 style={styles.moduleTitle}>
                      {moduleName}
                    </h3>

                    {typeof module === "object" &&
                      module.description && (
                        <p style={styles.muted}>
                          {module.description}
                        </p>
                      )}

                    {sections.length > 0 ? (
                      <div style={styles.sectionList}>
                        <p style={styles.sectionLabel}>
                          Available Sections
                        </p>

                        {sections.map(
                          (section, sectionIndex) => {
                            const sectionName =
                              typeof section === "string"
                                ? section
                                : section.name ||
                                  section.title ||
                                  section.code ||
                                  `Section ${sectionIndex + 1}`;

                            const sectionKey =
                              typeof section === "string"
                                ? section
                                : section.code ||
                                  section._id ||
                                  `${moduleCode}-${sectionIndex}`;

                            return (
                              <div
                                key={sectionKey}
                                style={styles.sectionItem}
                              >
                                <span>{sectionName}</span>
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <p style={styles.muted}>
                        {typeof module === "object" &&
                        module.description
                          ? ""
                          : "No detailed sections are available."}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div style={styles.empty}>
              <h3 style={styles.emptyTitle}>
                No Modules Available
              </h3>

              <p style={styles.muted}>
                Detailed module information for this examination is not yet available.
              </p>
            </div>
          )}
        </section>

        {/* PACKAGE SELECTION */}

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Choose Your Package
          </h2>

          <p style={styles.muted}>
            Prices are loaded from the server. Select the package that suits your needs.
          </p>

          {pricingLoading ? (
            <p role="status" style={styles.muted}>
              Loading international prices...
            </p>
          ) : pricingError ? (
            <div style={styles.pricingError}>
              <p role="alert" style={styles.error}>
                {pricingError}
              </p>

              <button
                type="button"
                style={styles.secondaryButton}
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div style={styles.moduleGrid}>
                {pricing.packages.map((item) => {
                  const isSelected =
                    selectedPackageCode === item.code;

                  const isBundle =
                    item.code === "BUNDLE_3";

                  return (
                    <article
                      key={item.code}
                      style={{
                        ...styles.packageCard,
                        ...(isSelected
                          ? styles.packageCardSelected
                          : {}),
                      }}
                    >
                      <p style={styles.packageLabel}>
                        {isBundle
                          ? "Three-Examination Package"
                          : "Single Examination"}
                      </p>

                      <h3 style={styles.packageTitle}>
                        {isBundle
                          ? "Three Examinations"
                          : "One Examination"}
                      </h3>

                      <p style={styles.packagePrice}>
                        {formatNaira(item.amountNgn)}
                      </p>

                      <p style={styles.muted}>
                        {item.examCount} examination
                        {item.examCount === 1 ? "" : "s"}{" "}
                        · {item.accessDays} day
                        {item.accessDays === 1 ? "" : "s"}{" "}
                        of access
                      </p>

                      <button
                        type="button"
                        aria-pressed={isSelected}
                        style={
                          isSelected
                            ? styles.packageSelectedButton
                            : styles.packageButton
                        }
                        disabled={paymentLoading}
                        onClick={() => {
                          setSelectedPackageCode(item.code);
                          setSelectedExamCodes(
                            normalizedCode
                              ? [normalizedCode]
                              : []
                          );
                          setProceedMessage("");
                          setExaminationsError("");
                        }}
                      >
                        {isSelected
                          ? "Package Selected"
                          : "Choose This Package"}
                      </button>

                      {isBundle && (
                        <p style={styles.packageNote}>
                          Select three different examinations below before proceeding to payment.
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>

              {/* THREE-EXAMINATION SELECTION */}

              {selectedPackageCode === "BUNDLE_3" && (
                <div style={styles.bundleSelection}>
                  <h3 style={styles.bundleTitle}>
                    Select Your Three Examinations
                  </h3>

                  <p style={styles.muted}>
                    Choose exactly three different examination types. The examination you opened is selected first; you may change your selection.
                  </p>

                  <p style={styles.selectionCount}>
                    Selected: {selectedExamCodes.length} of 3
                  </p>

                  {examinationsLoading ? (
                    <p role="status" style={styles.muted}>
                      Loading available examinations...
                    </p>
                  ) : (
                    <div style={styles.examOptionsGrid}>
                      {availableExaminations.map((item) => {
                        const code = item.code;
                        const isChecked =
                          selectedExamCodes.includes(code);

                        const limitReached =
                          selectedExamCodes.length >= 3 &&
                          !isChecked;

                        return (
                          <label
                            key={code}
                            style={{
                              ...styles.examOption,
                              ...(isChecked
                                ? styles.examOptionSelected
                                : {}),
                              ...(limitReached
                                ? styles.examOptionDisabled
                                : {}),
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={
                                paymentLoading ||
                                limitReached
                              }
                              onChange={() =>
                                toggleExamSelection(code)
                              }
                            />

                            <span>
                              <strong>
                                {item.name || code}
                              </strong>

                              <small>
                                Examination code: {code}
                              </small>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {examinationsError && (
                    <p
                      role="alert"
                      style={styles.error}
                    >
                      {examinationsError}
                    </p>
                  )}

                  {!examinationsLoading &&
                    availableExaminations.length < 3 && (
                      <p style={styles.muted}>
                        The bundle requires three distinct examination codes. Please ensure the international examination list contains at least three active examinations.
                      </p>
                    )}
                </div>
              )}

              {pricing.exchangeRate && (
                <p style={styles.rateNote}>
                  Reference exchange rate: 1 USD ={" "}
                  {Number(
                    pricing.exchangeRate.rate
                  ).toLocaleString("en-NG")}{" "}
                  NGN
                  {pricing.exchangeRate.rateDate
                    ? ` · Rate date: ${pricing.exchangeRate.rateDate}`
                    : ""}
                  . The displayed price is the NGN amount returned by the server.
                </p>
              )}
            </>
          )}
        </section>

        {/* PAYMENT ACTION */}

        <section style={styles.notice}>
          <h3 style={styles.noticeTitle}>
            Next Step
          </h3>

          <p style={styles.muted}>
            Sign in or create an account to continue. Payment starts after the selected package and examinations have been validated.
          </p>

          {proceedMessage && (
            <p
              role="status"
              aria-live="polite"
              style={styles.proceedMessage}
            >
              {proceedMessage}
            </p>
          )}

          <button
            type="button"
            style={{
              ...styles.primaryButton,
              ...(paymentLoading
                ? styles.disabledButton
                : {}),
            }}
            onClick={handleProceed}
            disabled={
              paymentLoading ||
              pricingLoading ||
              Boolean(pricingError) ||
              !selectedPackage ||
              (
                selectedPackageCode === "BUNDLE_3" &&
                (
                  examinationsLoading ||
                  selectedExamCodes.length !== 3
                )
              )
            }
          >
            {paymentLoading
              ? "Connecting to Paystack..."
              : "Proceed to Examination"}
          </button>
        </section>

        <div style={styles.footerActions}>
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={returnToExaminations}
            disabled={paymentLoading}
          >
            Choose Another Examination
          </button>
        </div>
      </main>
    </div>
  );
}

/* ======================================================
   PAGE STYLES
====================================================== */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#1f2937",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
  },

  headerInner: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
  },

  eyebrow: {
    margin: "0 0 8px",
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1.5px",
  },

  title: {
    margin: 0,
    fontSize: "clamp(24px, 4vw, 32px)",
    fontWeight: 700,
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  content: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "28px 24px 40px",
  },

  panel: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
  },

  examHeading: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  },

  examCode: {
    minWidth: "64px",
    minHeight: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    borderRadius: "10px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: 700,
    fontSize: "14px",
    overflowWrap: "anywhere",
  },

  examTitle: {
    margin: 0,
    fontSize: "24px",
    lineHeight: 1.35,
  },

  detail: {
    margin: "10px 0",
    lineHeight: 1.6,
  },

  description: {
    margin: "18px 0 0",
    lineHeight: 1.7,
    color: "#475569",
    whiteSpace: "pre-wrap",
  },

  section: {
    marginBottom: "24px",
  },

  sectionTitle: {
    margin: "0 0 8px",
    fontSize: "22px",
  },

  muted: {
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  moduleGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
    gap: "18px",
    marginTop: "20px",
  },

  moduleCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "22px",
    minWidth: 0,
  },

  moduleNumber: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: 700,
    marginBottom: "14px",
  },

  moduleTitle: {
    margin: "0 0 12px",
    fontSize: "18px",
    overflowWrap: "anywhere",
  },

  sectionList: {
    marginTop: "18px",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "14px",
  },

  sectionLabel: {
    fontSize: "13px",
    fontWeight: 700,
    margin: "0 0 10px",
  },

  sectionItem: {
    padding: "10px 12px",
    marginBottom: "8px",
    background: "#f8fafc",
    borderRadius: "6px",
    fontSize: "14px",
    overflowWrap: "anywhere",
  },

  empty: {
    background: "#ffffff",
    border: "1px dashed #cbd5e1",
    borderRadius: "12px",
    padding: "28px",
    marginTop: "20px",
    textAlign: "center",
  },

  emptyTitle: {
    margin: "0 0 8px",
    fontSize: "18px",
  },

  notice: {
    padding: "20px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    marginTop: "24px",
  },

  noticeTitle: {
    margin: "0 0 8px",
    fontSize: "17px",
  },

  proceedMessage: {
    color: "#334155",
    fontSize: "14px",
    lineHeight: 1.6,
    margin: "12px 0",
    overflowWrap: "anywhere",
  },

  footerActions: {
    display: "flex",
    justifyContent: "flex-start",
    marginTop: "24px",
  },

  primaryButton: {
    border: "none",
    borderRadius: "8px",
    padding: "12px 18px",
    background: "#1d4ed8",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "12px",
  },

  disabledButton: {
    opacity: 0.65,
    cursor: "wait",
  },

  secondaryButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "11px 16px",
    background: "#ffffff",
    color: "#334155",
    fontWeight: 600,
    cursor: "pointer",
  },

  heading: {
    margin: "16px 0 8px",
    fontSize: "22px",
  },

  error: {
    color: "#b91c1c",
    lineHeight: 1.6,
    marginBottom: "20px",
  },

  spinner: {
    width: "36px",
    height: "36px",
    margin: "0 auto",
    border: "4px solid #dbeafe",
    borderTopColor: "#2563eb",
    borderRadius: "50%",
    animation: "smartexam-spin 0.8s linear infinite",
  },

  packageCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "22px",
    minWidth: 0,
  },

  packageCardSelected: {
    border: "2px solid #2563eb",
    padding: "21px",
    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.08)",
  },

  packageLabel: {
    margin: "0 0 8px",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },

  packageTitle: {
    margin: "0 0 10px",
    fontSize: "18px",
  },

  packagePrice: {
    margin: "0 0 8px",
    fontSize: "28px",
    fontWeight: 700,
    color: "#1d4ed8",
  },

  packageButton: {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "11px 14px",
    background: "#ffffff",
    color: "#334155",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "12px",
  },

  packageSelectedButton: {
    width: "100%",
    border: "1px solid #1d4ed8",
    borderRadius: "8px",
    padding: "11px 14px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "12px",
  },

  packageNote: {
    color: "#64748b",
    fontSize: "12px",
    lineHeight: 1.5,
    margin: "12px 0 0",
  },

  bundleSelection: {
    marginTop: "24px",
    padding: "22px",
    background: "#ffffff",
    border: "1px solid #dbeafe",
    borderRadius: "12px",
  },

  bundleTitle: {
    margin: "0 0 8px",
    fontSize: "19px",
  },

  selectionCount: {
    margin: "14px 0",
    color: "#1d4ed8",
    fontWeight: 700,
    fontSize: "14px",
  },

  examOptionsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
    gap: "12px",
    marginTop: "16px",
  },

  examOption: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "15px",
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    cursor: "pointer",
    minWidth: 0,
  },

  examOptionSelected: {
    background: "#eff6ff",
    border: "1px solid #2563eb",
  },

  examOptionDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  rateNote: {
    color: "#64748b",
    fontSize: "12px",
    lineHeight: 1.6,
    marginTop: "16px",
  },

  pricingError: {
    background: "#ffffff",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    padding: "16px",
    marginTop: "16px",
  },
};

export default InternationalExamDetails;

