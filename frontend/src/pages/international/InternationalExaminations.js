
import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import BASE_URL from "../../api/api";

import "./InternationalExaminations.css";

/* ========================================================
   COLOUR FLAG COMPONENTS
======================================================== */

function UnionJack({ x = 0, y = 0, width = 60, height = 30 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${width / 60} ${height / 30})`}>
      <rect width="60" height="30" fill="#012169" />

      <path
        d="M0 0 L60 30 M60 0 L0 30"
        stroke="#FFFFFF"
        strokeWidth="6"
      />

      <path
        d="M0 0 L60 30 M60 0 L0 30"
        stroke="#C8102E"
        strokeWidth="2.5"
      />

      <path
        d="M30 0 V30 M0 15 H60"
        stroke="#FFFFFF"
        strokeWidth="10"
      />

      <path
        d="M30 0 V30 M0 15 H60"
        stroke="#C8102E"
        strokeWidth="5"
      />
    </g>
  );
}

function Star({ cx, cy, r = 1.5, fill = "#FFFFFF" }) {
  const points = Array.from({ length: 10 }, (_, index) => {
    const angle = (Math.PI * index) / 5 - Math.PI / 2;
    const radius = index % 2 === 0 ? r : r * 0.45;

    return `${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`;
  }).join(" ");

  return <polygon points={points} fill={fill} />;
}

function CountryFlag({ code }) {
  switch (code) {
    case "US":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60 40"
          width="30"
          height="20"
          aria-hidden="true"
          focusable="false"
        >
          <rect width="60" height="40" fill="#FFFFFF" />

          {Array.from({ length: 7 }, (_, index) => (
            <rect
              key={index}
              x="0"
              y={index * 40 / 13 * 2}
              width="60"
              height={40 / 13}
              fill="#B22234"
            />
          ))}

          <rect
            x="0"
            y="0"
            width="24"
            height="21.55"
            fill="#3C3B6E"
          />

          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 6 }, (_, column) => (
              <circle
                key={`${row}-${column}`}
                cx={2 + column * 3.8}
                cy={2 + row * 4.2}
                r="0.85"
                fill="#FFFFFF"
              />
            ))
          )}
        </svg>
      );

    case "UK":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60 30"
          width="30"
          height="20"
          aria-hidden="true"
          focusable="false"
        >
          <UnionJack />
        </svg>
      );

    case "CA":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 25"
          width="30"
          height="20"
          aria-hidden="true"
          focusable="false"
        >
          <rect width="50" height="25" fill="#FFFFFF" />

          <rect width="12.5" height="25" fill="#D80621" />
          <rect x="37.5" width="12.5" height="25" fill="#D80621" />

          <path
            d="
              M25 3
              L27.2 8
              L31 6.8
              L29.4 11
              L33 13
              L28.8 14.5
              L30 19
              L26 17.5
              L25 22
              L24 17.5
              L20 19
              L21.2 14.5
              L17 13
              L20.6 11
              L19 6.8
              L22.8 8
              Z
            "
            fill="#D80621"
          />
        </svg>
      );

    case "AU":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60 30"
          width="30"
          height="20"
          aria-hidden="true"
          focusable="false"
        >
          <rect width="60" height="30" fill="#00008B" />

          <UnionJack width={30} height={15} />

          <Star cx={38} cy={20} r={3} />
          <Star cx={48} cy={11} r={1.8} />
          <Star cx={52} cy={21} r={1.8} />
          <Star cx={40} cy={27} r={1.5} />
          <Star cx={30} cy={17} r={1.4} />
        </svg>
      );

    case "NZ":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60 30"
          width="30"
          height="20"
          aria-hidden="true"
          focusable="false"
        >
          <rect width="60" height="30" fill="#00247D" />

          <UnionJack width={30} height={15} />

          <Star cx={39} cy={9} r={2.2} fill="#CC142B" />
          <Star cx={39} cy={9} r={1.4} />

          <Star cx={50} cy={15} r={2.2} fill="#CC142B" />
          <Star cx={50} cy={15} r={1.4} />

          <Star cx={43} cy={24} r={2.2} fill="#CC142B" />
          <Star cx={43} cy={24} r={1.4} />

          <Star cx={56} cy={23} r={1.8} fill="#CC142B" />
          <Star cx={56} cy={23} r={1.1} />
        </svg>
      );

    default:
      return null;
  }
}

function InternationalExaminations() {
  const navigate = useNavigate();

  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ========================================================
     MAJOR INTERNATIONAL DESTINATIONS
  ======================================================== */

  const majorDestinations = [
    { code: "US", name: "United States" },
    { code: "UK", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "NZ", name: "New Zealand" },
  ];

  /* ========================================================
     LOAD INTERNATIONAL EXAMINATIONS
  ======================================================== */

  useEffect(() => {
    const loadExaminations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${BASE_URL}/international/exams`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "Invalid examination data received."
          );
        }

        setExaminations(data);
      } catch (err) {
        console.error(
          "Error loading International examinations:",
          err
        );

        setError(
          "Unable to load the international examinations."
        );
      } finally {
        setLoading(false);
      }
    };

    loadExaminations();
  }, []);

  /* ========================================================
     SELECT EXAMINATION
  ======================================================== */

  const selectExamination = (examination) => {
    if (!examination?.code) {
      return;
    }

    navigate(
      `/international/${encodeURIComponent(
        examination.code
      )}`,
      {
        state: {
          examination,
        },
      }
    );
  };

  /* ========================================================
     SELECT DESTINATION
  ======================================================== */

  const selectDestination = (destination) => {
    console.log(
      "International destination selected:",
      destination
    );
  };

  /* ========================================================
     LOADING
  ======================================================== */

  if (loading) {
    return (
      <div className="international-page">
        <div className="international-loading">
          <div className="international-spinner"></div>

          <h2>
            Loading International Examinations...
          </h2>

          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  /* ========================================================
     ERROR
  ======================================================== */

  if (error) {
    return (
      <div className="international-page">
        <div className="international-error">
          <h2>
            Unable to Load Examinations
          </h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>

          <button
            type="button"
            className="international-back-btn"
            onClick={() => navigate("/")}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  /* ========================================================
     MAIN PAGE
  ======================================================== */

  return (
    <div className="international-page">
      <header className="international-header">
        <div className="international-header-inner">
          <div>
            <h1>
              International Examinations
            </h1>

            <p>
              Choose the international examination
              you would like to take.
            </p>
          </div>

          <button
            type="button"
            className="international-back-btn"
            onClick={() => navigate("/")}
          >
            Back
          </button>
        </div>

        {/* MAJOR INTERNATIONAL DESTINATIONS */}

        <div className="international-destinations">
          <div className="international-destinations-inner">
            <div className="international-destinations-title">
              <span>
                Major International Destinations
              </span>
            </div>

            <div className="international-destination-list">
              {majorDestinations.map((destination) => (
                <button
                  type="button"
                  key={destination.code}
                  className="international-destination-item"
                  onClick={() =>
                    selectDestination(destination)
                  }
                  title={destination.name}
                >
                  <span
                    className="international-destination-flag"
                    aria-hidden="true"
                  >
                    <CountryFlag code={destination.code} />
                  </span>

                  <span className="international-destination-name">
                    {destination.name}
                  </span>
                </button>
              ))}

              <div
                className="international-destination-count"
                title="International examination destinations"
              >
                +130 Countries
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* EXAMINATION CATALOGUE */}

      <main className="international-content">
        <section className="international-intro">
          <h2>
            Select Your Examination
          </h2>

          {/* SCROLLING ANNOUNCEMENT */}

          <div
            className="international-announcement"
            role="region"
            aria-label="SmartExam announcement"
          >
            <div className="international-announcement-track">
              <span className="international-announcement-label">
                ANNOUNCEMENT
              </span>

              <p className="international-announcement-message">
                SmartExam provides access to different
                international examinations and computer-based
                assessment pathways. Choose your examination
                and begin your journey to success!
              </p>
            </div>
          </div>
        </section>

        <section className="international-exam-grid">
          {examinations.map((examination) => (
            <button
              type="button"
              key={examination.code}
              className="international-exam-card"
              onClick={() =>
                selectExamination(examination)
              }
            >
              <div className="international-exam-code">
                {examination.code}
              </div>

              <h3>
                {examination.name}
              </h3>

              {examination.fullName && (
                <p className="international-exam-full-name">
                  {examination.fullName}
                </p>
              )}

              {examination.provider && (
                <p className="international-exam-provider">
                  {examination.provider}
                </p>
              )}

              {examination.description && (
                <p className="international-exam-description">
                  {examination.description}
                </p>
              )}

              <span className="international-select-label">
                Select →
              </span>
            </button>
          ))}
        </section>

        {examinations.length === 0 && (
          <div className="international-empty">
            <h3>
              No Examinations Available
            </h3>

            <p>
              No international examination
              is currently available.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default InternationalExaminations;

