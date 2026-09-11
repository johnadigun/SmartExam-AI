
import React from "react";

import DashboardCards from "./DashboardCards";
import DashboardModal from "./DashboardModal";

import "./Dashboard.css";

function DashboardUI({
  loading,

  user,
  username,
  exam,

  dashboardStats,
  recentActivities,

  showCbtModal,
  closeModal,

  handleCBTClick,

  openPractice,
  openResults,
  openReview,
  openHistory,
  openCertificate,
  openPayment,
  openProfile,
  openSettings,
  openSupport,

  logout,
}) {
  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-box">
          <div className="dashboard-spinner"></div>

          <h2>Loading Dashboard...</h2>

          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      {/* ======================================================
          TOP HEADER
      ====================================================== */}

      <header className="dashboard-header">

        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">
            SE
          </div>

          <div>
            <h1>SmartExam</h1>

            <span>
              CBT Examination Portal
            </span>
          </div>
        </div>

        <div className="dashboard-user-area">

          <div className="dashboard-user-avatar">
            {(username || "S").charAt(0).toUpperCase()}
          </div>

          <div className="dashboard-user-info">
            <strong>{username}</strong>

            <small>
              Student Account
            </small>
          </div>

        </div>

      </header>


      {/* ======================================================
          WELCOME BAR
      ====================================================== */}

      <section className="dashboard-welcome">

        <div>

          <h2>
            Welcome back, {username}
          </h2>

          <p>
            Manage your examination, practice and results from
            your student dashboard.
          </p>

        </div>

        <button
          className="dashboard-primary-action"
          onClick={handleCBTClick}
        >
          Start CBT Examination
        </button>

      </section>


      {/* ======================================================
          MAIN DASHBOARD
      ====================================================== */}

      <main className="dashboard-main">

        {/* ====================================================
            LEFT / MAIN CONTENT
        ==================================================== */}

        <section className="dashboard-content">

          <DashboardCards

            user={user}

            exam={exam}

            dashboardStats={dashboardStats}

            recentActivities={recentActivities}

            handleCBTClick={handleCBTClick}

            openPractice={openPractice}

            openResults={openResults}

            openReview={openReview}

            openHistory={openHistory}

            openCertificate={openCertificate}

            openPayment={openPayment}

            openProfile={openProfile}

            openSettings={openSettings}

            openSupport={openSupport}

            logout={logout}

          />

        </section>


        {/* ====================================================
            RIGHT SIDEBAR
        ==================================================== */}

        <aside className="dashboard-sidebar">

          {/* ACCOUNT STATUS */}

          <div className="dashboard-panel">

            <div className="dashboard-panel-title">

              <h3>
                Account Status
              </h3>

              <span className="status-dot"></span>

            </div>


            <div className="dashboard-status-row">

              <span>CBT Access</span>

              <strong
                className={
                  user?.cbtAccess
                    ? "text-success"
                    : "text-danger"
                }
              >
                {user?.cbtAccess
                  ? "Active"
                  : "Payment Required"}
              </strong>

            </div>


            <div className="dashboard-status-row">

              <span>Examination</span>

              <strong>
                {user?.examTaken
                  ? "Completed"
                  : "Not Taken"}
              </strong>

            </div>


            <div className="dashboard-status-row">

              <span>Certificate</span>

              <strong
                className={
                  user?.certificateIssued
                    ? "text-success"
                    : ""
                }
              >
                {user?.certificateIssued
                  ? "Available"
                  : "Not Available"}
              </strong>

            </div>

          </div>


          {/* QUICK ACTIONS */}

          <div className="dashboard-panel">

            <div className="dashboard-panel-title">

              <h3>
                Quick Actions
              </h3>

            </div>


            <button
              className="quick-action"
              onClick={openPractice}
            >
              <span className="quick-action-icon">
                PR
              </span>

              <span>
                Practice Questions
              </span>
            </button>


            <button
              className="quick-action"
              onClick={openResults}
            >
              <span className="quick-action-icon">
                RE
              </span>

              <span>
                View Results
              </span>
            </button>


            <button
              className="quick-action"
              onClick={openHistory}
            >
              <span className="quick-action-icon">
                HI
              </span>

              <span>
                Examination History
              </span>
            </button>


            <button
              className="quick-action"
              onClick={openCertificate}
            >
              <span className="quick-action-icon">
                CE
              </span>

              <span>
                Certificate
              </span>
            </button>

          </div>


          {/* EXAMINATION GUIDE */}

          <div className="dashboard-panel guide-panel">

            <div className="dashboard-panel-title">

              <h3>
                CBT Guide
              </h3>

            </div>

            <div className="guide-step">
              <span>1</span>
              <p>Complete your payment</p>
            </div>

            <div className="guide-step">
              <span>2</span>
              <p>Verify your CBT access</p>
            </div>

            <div className="guide-step">
              <span>3</span>
              <p>Select your examination</p>
            </div>

            <div className="guide-step">
              <span>4</span>
              <p>Submit and view your result</p>
            </div>

          </div>


          {/* SUPPORT */}

          <div className="dashboard-support">

            <strong>
              Need Help?
            </strong>

            <p>
              Contact support if you have any
              examination or payment problems.
            </p>

            <button
              onClick={openSupport}
            >
              Contact Support
            </button>

          </div>

        </aside>

      </main>


      {/* ======================================================
          PAYMENT MODAL
      ====================================================== */}

      <DashboardModal
        show={showCbtModal}
        closeModal={closeModal}
        openPayment={openPayment}
      />


      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="dashboard-footer">

        <span>
          © {new Date().getFullYear()} SmartExam CBT System
        </span>

        <span>
          Student Portal
        </span>

      </footer>

    </div>
  );
}

export default DashboardUI;