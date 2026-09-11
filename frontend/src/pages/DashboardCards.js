
import React from "react";

function DashboardCards({
  user,
  exam,

  dashboardStats,
  recentActivities,

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
  return (
    <>

      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="dashboard-summary-grid">

        {/* PAYMENT */}

        <div className="summary-card">

          <div className="summary-card-top">

            <div className="summary-icon payment-icon">
              $
            </div>

            <span>
              Payment
            </span>

          </div>

          <strong
            className={
              user?.cbtAccess
                ? "summary-value active"
                : "summary-value locked"
            }
          >
            {user?.cbtAccess
              ? "Active"
              : "Required"}
          </strong>

        </div>


        {/* EXAMINATION */}

        <div className="summary-card">

          <div className="summary-card-top">

            <div className="summary-icon exam-icon">
              EX
            </div>

            <span>
              Examination
            </span>

          </div>

          <strong className="summary-value">

            {exam
              ? exam.questions?.length || 0
              : 0}

            <small>
              Questions
            </small>

          </strong>

        </div>


        {/* PERFORMANCE */}

        <div className="summary-card">

          <div className="summary-card-top">

            <div className="summary-icon performance-icon">
              %
            </div>

            <span>
              Average Score
            </span>

          </div>

          <strong className="summary-value">

            {dashboardStats?.averageScore || 0}%

          </strong>

        </div>

      </div>


      {/* ======================================================
          PRIMARY CBT ACTION
      ====================================================== */}

      <section className="cbt-action-card">

        <div className="cbt-action-content">

          <div className="cbt-action-icon">
            CBT
          </div>

          <div>

            <h2>
              Computer Based Test
            </h2>

            <p>
              Start your official CBT examination and
              complete your assessment online.
            </p>

          </div>

        </div>

        <button
          onClick={handleCBTClick}
          className="cbt-start-button"
        >
          Start Examination
        </button>

      </section>


      {/* ======================================================
          STUDENT MENU
      ====================================================== */}

      <section className="student-menu-section">

        <div className="section-heading">

          <div>

            <h2>
              Student Services
            </h2>

            <p>
              Access your examination tools and account.
            </p>

          </div>

        </div>


        <div className="student-menu-grid">

          {/* PRACTICE */}

          <button
            className="student-menu-item"
            onClick={openPractice}
          >

            <span className="menu-item-icon practice">
              PR
            </span>

            <span className="menu-item-text">
              <strong>Practice</strong>
              <small>Practice questions</small>
            </span>

            <span className="menu-arrow">
              →
            </span>

          </button>


          {/* RESULTS */}

          <button
            className="student-menu-item"
            onClick={openResults}
          >

            <span className="menu-item-icon results">
              RE
            </span>

            <span className="menu-item-text">
              <strong>Results</strong>
              <small>View examination results</small>
            </span>

            <span className="menu-arrow">
              →
            </span>

          </button>


          {/* HISTORY */}

          <button
            className="student-menu-item"
            onClick={openHistory}
          >

            <span className="menu-item-icon history">
              HI
            </span>

            <span className="menu-item-text">
              <strong>History</strong>
              <small>Previous examinations</small>
            </span>

            <span className="menu-arrow">
              →
            </span>

          </button>


          {/* REVIEW */}

          <button
            className="student-menu-item"
            onClick={openReview}
          >

            <span className="menu-item-icon review">
              RV
            </span>

            <span className="menu-item-text">
              <strong>Review</strong>
              <small>Review previous work</small>
            </span>

            <span className="menu-arrow">
              →
            </span>

          </button>


          {/* CERTIFICATE */}

          <button
            className="student-menu-item"
            onClick={openCertificate}
          >

            <span className="menu-item-icon certificate">
              CE
            </span>

            <span className="menu-item-text">
              <strong>Certificate</strong>
              <small>View certificate</small>
            </span>

            <span className="menu-arrow">
              →
            </span>

          </button>


          {/* PAYMENT */}

          <button
            className="student-menu-item"
            onClick={openPayment}
          >

            <span className="menu-item-icon payment">
              PY
            </span>

            <span className="menu-item-text">
              <strong>Payment</strong>
              <small>Manage CBT payment</small>
            </span>

            <span className="menu-arrow">
              →
            </span>

          </button>


          {/* PROFILE */}

          <button
            className="student-menu-item"
            onClick={openProfile}
          >

            <span className="menu-item-icon profile">
              PR
            </span>

            <span className="menu-item-text">
              <strong>Profile</strong>
              <small>Manage your profile</small>
            </span>

            <span className="menu-arrow">
              →
            </span>

          </button>


          {/* SETTINGS */}

          <button
            className="student-menu-item"
            onClick={openSettings}
          >

            <span className="menu-item-icon settings">
              ST
            </span>

            <span className="menu-item-text">
              <strong>Settings</strong>
              <small>Account settings</small>
            </span>

            <span className="menu-arrow">
              →
            </span>

          </button>


          {/* SUPPORT */}

          <button
            className="student-menu-item"
            onClick={openSupport}
          >

            <span className="menu-item-icon support">
              SP
            </span>

            <span className="menu-item-text">
              <strong>Support</strong>
              <small>Get assistance</small>
            </span>

            <span className="menu-arrow">
              →
            </span>

          </button>


          {/* LOGOUT */}

          <button
            className="student-menu-item logout-menu-item"
            onClick={logout}
          >

            <span className="menu-item-icon logout">
              LO
            </span>

            <span className="menu-item-text">
              <strong>Logout</strong>
              <small>Sign out of account</small>
            </span>

            <span className="menu-arrow">
              →
            </span>

          </button>

        </div>

      </section>


      {/* ======================================================
          RECENT ACTIVITY
      ====================================================== */}

      <section className="dashboard-activity-card">

        <div className="section-heading">

          <div>

            <h2>
              Recent Practice Activity
            </h2>

            <p>
              Your latest practice performance.
            </p>

          </div>

        </div>


        {recentActivities.length === 0 ? (

          <div className="empty-activity">

            <div>
              —
            </div>

            <p>
              No practice history available yet.
            </p>

          </div>

        ) : (

          <div className="activity-table-wrapper">

            <table className="activity-table">

              <thead>

                <tr>

                  <th>
                    Category
                  </th>

                  <th>
                    Score
                  </th>

                  <th>
                    Grade
                  </th>

                  <th>
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentActivities.map(
                  (item, index) => (

                    <tr key={index}>

                      <td>
                        {item.category}
                      </td>

                      <td>
                        <strong>
                          {item.percentage}%
                        </strong>
                      </td>

                      <td>
                        <span className="grade-badge">
                          {item.grade}
                        </span>
                      </td>

                      <td>
                        {item.completedAt
                          ? new Date(
                              item.completedAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </>
  );
}

export default DashboardCards;