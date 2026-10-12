import React from "react";
import "./EnglishCountries.css";

/* ==========================================================
   ENGLISH COUNTRIES UI
========================================================== */

function EnglishCountriesUI({
  countries,
  onSelectCountry,
  onBack,
}) {
  return (
    <div className="english-countries-page">

      <div className="english-countries-container">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="english-countries-header">

          <div className="english-countries-brand">

            <div className="english-countries-logo">
              SE
            </div>

            <div>
              <h1>SmartExam</h1>

              <span>
                Local Examination
              </span>
            </div>

          </div>

          <div className="english-countries-heading">

            <span className="english-countries-label">
              LOCAL EXAMINATION
            </span>

            <h2>
              Choose Your Country
            </h2>

            <p>
              Select your country to view the examinations,
              competitions, and study areas available.
            </p>

          </div>

        </header>

        {/* ==================================================
            COUNTRY GRID
        ================================================== */}

        <main className="english-countries-content">

          <div className="english-countries-grid">

            {countries.map((country) => (

              <button
                key={country.code}
                type="button"
                className="english-country-card"
                onClick={() =>
                  onSelectCountry(country)
                }
              >

                {/* ==================================================
                    COLOURED COUNTRY FLAG
                ================================================== */}

                <span className="english-country-flag">

                  <img
                    src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                    alt={`${country.name} flag`}
                    loading="lazy"
                  />

                </span>

                {/* ==================================================
                    COUNTRY NAME
                ================================================== */}

                <span className="english-country-name">
                  {country.name}
                </span>

                {/* ==================================================
                    COUNTRY CODE
                ================================================== */}

                <span className="english-country-code">
                  Country Code: {country.code}
                </span>

                {/* ==================================================
                    PHONE CODE
                ================================================== */}

                <span className="english-country-phone">
                  Dialing Code: {country.phoneCode}
                </span>

                {/* ==================================================
                    ACTION
                ================================================== */}

                <span className="english-country-action">
                  {"View Examinations \u2192"}
                </span>

              </button>

            ))}

          </div>

        </main>

        {/* ==================================================
            INFORMATION
        ================================================== */}

        <section className="english-countries-info">

          <strong>
            How does Local Examination work?
          </strong>

          <p>
            Choose your country to discover the examinations
            and preparation areas available. Common subjects
            can use a shared question bank to reduce duplication
            of learning content.
          </p>

        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer className="english-countries-footer">

          <button
            type="button"
            className="english-countries-back-btn"
            onClick={onBack}
          >
            {"\u2190 Back to English Platform"}
          </button>

        </footer>

      </div>

    </div>
  );
}

export default EnglishCountriesUI;