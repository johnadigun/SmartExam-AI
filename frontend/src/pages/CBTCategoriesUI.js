import React from "react";
import "./CBTCategories.css";

function CBTCategoriesUI({
  loading,
  categories,
  selectCategory,
  backToDashboard,
}) {
  /* ==========================================
     SELECTED COUNTRY
  ========================================== */

  const selectedCountry =
    localStorage.getItem("selectedCountry") || "";

  const selectedCountryCode =
    localStorage.getItem("selectedCountryCode") || "";

  const countryFlagUrl = selectedCountryCode
    ? `https://flagcdn.com/w80/${selectedCountryCode.toLowerCase()}.png`
    : "";

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="categories-loading">
        <h2>Loading Categories...</h2>
      </div>
    );
  }

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <div className="categories-container">

      {/* ================= HEADER ================= */}

      <div className="categories-header">

        <h1>
          SMARTEXAM CBT SYSTEM
        </h1>

        <p>
          Choose your examination category to continue.
        </p>

        {/* ==========================================
            SELECTED COUNTRY
        ========================================== */}

        {selectedCountry &&
          selectedCountryCode && (
            <div
              className="categories-selected-country"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginTop: "16px",
              }}
            >

              <img
                src={countryFlagUrl}
                alt={`${selectedCountry} flag`}
                style={{
                  width: "42px",
                  height: "28px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  border: "1px solid #dbe2ea",
                  display: "block",
                }}
              />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  lineHeight: "1.2",
                }}
              >

                <strong
                  style={{
                    color: "#0f172a",
                    fontSize: "14px",
                  }}
                >
                  {selectedCountry}
                </strong>

                <small
                  style={{
                    color: "#64748b",
                    fontSize: "11px",
                  }}
                >
                  Selected Country
                </small>

              </div>

            </div>
          )}

      </div>


      {/* ================= CATEGORY GRID ================= */}

      <div className="categories-grid">

        {categories.map((category) => (

          <button
            key={category.id}
            className="category-card"
            onClick={() =>
              selectCategory(category)
            }
            type="button"
          >

            {/* CATEGORY ICON */}

            <div className="category-icon">
              {category.icon}
            </div>


            {/* CATEGORY NAME */}

            <h2>
              {category.name}
            </h2>


            {/* SUBJECTS */}

            <p className="category-subjects">
              {category.description}
            </p>


            {/* ACTION */}

            <span className="category-action">
              {"Click to Continue \u2192"}
            </span>

          </button>

        ))}

      </div>


      {/* ================= FOOTER ================= */}

      <div className="categories-footer">

        <button
          className="back-btn"
          onClick={backToDashboard}
          type="button"
        >
          {"\u2190 Back to Dashboard"}
        </button>

      </div>

    </div>
  );
}

export default CBTCategoriesUI;