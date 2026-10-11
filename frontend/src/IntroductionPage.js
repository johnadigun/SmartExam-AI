import React from "react";
import "./IntroductionPage.css";

function IntroductionPage() {
  const goToRegister = () => {
    window.location.href = "/register";
  };

  const goToLogin = () => {
    window.location.href = "/login";
  };

  const goToExams = () => {
    document
      .getElementById("our-exams")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const goToLocalExam = () => {
    window.location.href = "/local-countries";
  };

 const goToInternationalExam = () => {
  window.location.href = "/international";
  };

  return (
    <div className="introduction-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="intro-header">

        <div className="intro-header-inner">

          <div
            className="intro-logo"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            SMART<span>EXAM</span>
          </div>

          <nav className="intro-nav">

            <button
              type="button"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Home
            </button>

            <button
              type="button"
              onClick={goToExams}
            >
              Our Exams
            </button>

            <button
              type="button"
              onClick={goToLogin}
            >
              Login
            </button>

            <button
              type="button"
              className="intro-nav-register"
              onClick={goToRegister}
            >
              Register
            </button>

          </nav>

        </div>

      </header>

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="intro-hero">

        <div className="intro-hero-content">

          <div className="intro-hero-badge">
            COMPUTER-BASED EXAMINATION PLATFORM
          </div>

          <h1>
            Welcome to <span>SmartExam</span>
          </h1>

          <p className="intro-hero-text">
            SmartExam is a digital platform dedicated to examinations,
            computer-based tests, and online assessment. It enables candidates
            to access different examination systems, national examinations,
            professional examinations, and international examinations in a
            modern, organized, and secure environment.
          </p>

          <div className="intro-hero-actions">

            <button
              type="button"
              className="intro-primary-btn"
              onClick={goToExams}
            >
              Discover Our Exams
            </button>

            <button
              type="button"
              className="intro-secondary-btn"
              onClick={goToRegister}
            >
              Create an Account
            </button>

          </div>

        </div>

      </section>

      {/* ==================================================
          ABOUT SMARTEXAM
      ================================================== */}

      <section className="intro-section intro-about">

        <div className="intro-section-inner">

          <div className="intro-section-heading">

            <span className="intro-eyebrow">
              ABOUT SMARTEXAM
            </span>

            <h2>
              A Modern Platform for Examinations
            </h2>

          </div>

          <p>
            SmartExam provides a digital environment where candidates can
            access examinations, practice with computer-based tests, answer
            questions online, and review their results.
          </p>

          <p>
            The platform is designed to support different examination systems,
            multiple countries, examination bodies, categories, series,
            subjects, school assessments, and international examinations.
          </p>

        </div>

      </section>

      {/* ==================================================
          OUR EXAMS
      ================================================== */}

      <section
        id="our-exams"
        className="intro-section intro-platform-section"
      >

        <div className="intro-section-inner">

          <div className="intro-section-heading centered">

            <span className="intro-eyebrow">
              OUR EXAMS
            </span>

            <h2>
              Choose Your Examination Path
            </h2>

            <p>
              SmartExam clearly separates local examinations from
              international examinations.
            </p>

          </div>

          <div className="exam-products">

            {/* ==================================================
                LOCAL EXAMINATIONS
            ================================================== */}

            <div className="exam-card">

              <div className="intro-platform-icon">
                🌍
              </div>

              <span className="intro-platform-label">
                LOCAL EXAMINATIONS
              </span>

              <h3>
                National, School and Local Examinations
              </h3>

              <p>
                Access major national examinations, school examinations,
                internal assessments, practice tests, and professional
                examinations supported by SmartExam.
              </p>

              <ul>

                <li>
                  WAEC – West African Examinations Council
                </li>

                <li>
                  NECO – National Examinations Council
                </li>

                <li>
                  GCE – General Certificate of Education
                </li>

                <li>
                  IGCSE – International General Certificate of Secondary Education
                </li>

                <li>
                  JAMB – Joint Admissions and Matriculation Board
                </li>

                <li>
                  NABTEB – National Business and Technical Examinations Board
                </li>

                <li>
                  BECE – Basic Education Certificate Examination
                </li>

                <li>
                  NCEE – National Common Entrance Examination
                </li>

                <li>
                  Junior Secondary School Examinations
                </li>

                <li>
                  Senior Secondary School Examinations
                </li>

                <li>
                  School Mock Examinations
                </li>

                <li>
                  School Revision and Practice Tests
                </li>

                <li>
                  Professional Examinations
                </li>

              </ul>

              <button
                type="button"
                className="intro-platform-btn"
                onClick={goToLocalExam}
              >
                Access Local Examinations
              </button>

            </div>

            {/* ==================================================
                INTERNATIONAL EXAMINATIONS

                KEPT UNCHANGED
            ================================================== */}

            <div className="exam-card international-card">

              <div className="intro-platform-icon">
                🌐
              </div>

              <span className="intro-platform-label">
                INTERNATIONAL EXAMINATIONS
              </span>

              <h3>
                International Examinations
              </h3>

              <p>
                Access international examination pathways available through
                the SmartExam platform.
              </p>

              <ul>

                <li>
                  IELTS
                </li>

                <li>
                  TOEFL
                </li>

                <li>
                  SAT
                </li>

                <li>
                  GRE
                </li>

                <li>
                  GMAT
                </li>

                <li>
                  Cambridge English
                </li>

                <li>
                  PTE Academic
                </li>

                <li>
                  International professional examinations
                </li>

              </ul>

              <button
                type="button"
                className="intro-platform-btn"
                onClick={goToInternationalExam}
              >
                Access International Examinations
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          EXAMINATION ORGANIZATION
      ================================================== */}

      <section className="intro-section intro-types-section">

        <div className="intro-section-inner">

          <div className="intro-section-heading centered">

            <span className="intro-eyebrow">
              EXAMINATION ORGANIZATION
            </span>

            <h2>
              A Structure Adapted to Each Examination System
            </h2>

            <p>
              Local examinations are organized according to their education
              system and examination body.
            </p>

          </div>

          <div className="intro-steps">

            <div className="intro-step">

              <div className="intro-step-number">
                1
              </div>

              <div>

                <h3>
                  Examination Type
                </h3>

                <p>
                  Choose the examination family or type corresponding to your
                  academic or professional pathway.
                </p>

              </div>

            </div>

            <div className="intro-step">

              <div className="intro-step-number">
                2
              </div>

              <div>

                <h3>
                  Country
                </h3>

                <p>
                  Select the country associated with the examination.
                </p>

              </div>

            </div>

            <div className="intro-step">

              <div className="intro-step-number">
                3
              </div>

              <div>

                <h3>
                  Examination and Category
                </h3>

                <p>
                  Choose the examination body, examination, series, or
                  corresponding category.
                </p>

              </div>

            </div>

            <div className="intro-step">

              <div className="intro-step-number">
                4
              </div>

              <div>

                <h3>
                  Subject and CBT
                </h3>

                <p>
                  Select the subject and access your computer-based
                  examination.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          HOW IT WORKS
      ================================================== */}

      <section className="intro-section intro-how-section">

        <div className="intro-section-inner">

          <div className="intro-section-heading centered">

            <span className="intro-eyebrow">
              HOW IT WORKS
            </span>

            <h2>
              A Simple Path for Every Candidate
            </h2>

          </div>

          <div className="intro-types-grid">

            <div className="intro-type-card">

              <div className="intro-type-number">
                01
              </div>

              <h3>
                Create Your Account
              </h3>

              <p>
                Register or log in to your SmartExam account.
              </p>

            </div>

            <div className="intro-type-card">

              <div className="intro-type-number">
                02
              </div>

              <h3>
                Choose Your Examination
              </h3>

              <p>
                Select the examination pathway that matches your objective.
              </p>

            </div>

            <div className="intro-type-card">

              <div className="intro-type-number">
                03
              </div>

              <h3>
                Take Your Examination
              </h3>

              <p>
                Answer the questions in the computer-based examination
                environment.
              </p>

            </div>

            <div className="intro-type-card">

              <div className="intro-type-number">
                04
              </div>

              <h3>
                View Your Result
              </h3>

              <p>
                After the examination, view your result according to the
                applicable examination system.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          SMARTEXAM EVERYWHERE
      ================================================== */}

      <section className="intro-section intro-future-section">

        <div className="intro-section-inner">

          <div className="intro-future-content">

            <div>

              <span className="intro-eyebrow">
                SMARTEXAM EVERYWHERE
              </span>

              <h2>
                A Platform Designed for the Digital World
              </h2>

              <p>
                SmartExam is designed to provide a modern examination
                experience on computers, tablets, and compatible mobile
                devices.
              </p>

              <p>
                The future development of mobile applications, including
                Android applications, is part of the platform's planned
                expansion.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          FINAL CALL TO ACTION
      ================================================== */}

      <section className="intro-final">

        <div className="intro-final-inner">

          <span className="intro-eyebrow">
            GET STARTED WITH SMARTEXAM
          </span>

          <h2>
            Ready to Start Your Examination Journey?
          </h2>

          <p>
            Choose your examination and access the SmartExam platform
            corresponding to your pathway.
          </p>

          <div className="intro-final-actions">

            <button
              type="button"
              className="intro-final-btn"
              onClick={goToLocalExam}
            >
              🌍 Local Examinations
            </button>

            <button
              type="button"
              className="intro-final-btn"
              onClick={goToInternationalExam}
            >
              🌐 International Examinations
            </button>

          </div>

        </div>

      </section>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="intro-footer">

        <div className="intro-footer-inner">

          <div className="intro-footer-brand">
            SMART<span>EXAM</span>
          </div>

          <p>
            Digital Examinations • CBT • Assessment
          </p>

          <div className="intro-footer-links">

            <button
              type="button"
              onClick={goToLogin}
            >
              Login
            </button>

            <button
              type="button"
              onClick={goToRegister}
            >
              Register
            </button>

          </div>

          <p className="intro-footer-copy">
            © {new Date().getFullYear()} SmartExam. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default IntroductionPage;