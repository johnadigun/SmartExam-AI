
import { useNavigate } from "react-router-dom";

/*
==========================================================
SMARTEXAM CBT SYSTEM
DASHBOARD ACTIONS — MASTER FILE

Controls navigation from the Student Dashboard.

This file does NOT control:
- CBT questions
- CBT examination engine
- Practice engine
- Results calculation
- Payment processing
- Authentication logic

It only controls dashboard navigation and logout.
==========================================================
*/

export default function useDashboardActions() {
  const navigate = useNavigate();

  /* ======================================================
     ROUTES
  ====================================================== */

  const ROUTES = {
    LOGIN: "/",

    DASHBOARD: "/dashboard",

    /* CBT */
    CBT_CATEGORIES: "/cbt-categories",
    CBT_SUBJECTS: "/cbt-subjects",
    CBT_EXAM: "/cbt-exam",

    /* PRACTICE */
    PRACTICE_CATEGORIES: "/practice-categories",
    PRACTICE_SUBJECTS: "/practice-subjects",
    PRACTICE_MODE: "/practice-mode",

    /* RESULTS */
    RESULT: "/result",
    RESULTS_HISTORY: "/results-history",

    /* REVIEW */
    REVIEW_ANSWERS: "/review-answers",

    /* ACCOUNT */
    PAYMENT: "/payment",
    CERTIFICATE: "/certificate",
  };

  /* ======================================================
     CBT NAVIGATION
  ====================================================== */

  const openCBTCategories = () => {
    navigate(ROUTES.CBT_CATEGORIES);
  };

  const openCBTSubjects = () => {
    navigate(ROUTES.CBT_SUBJECTS);
  };

  /*
  Dashboard CBT button starts at Categories.
  The user should select Category → Subject → Examination.
  */

  const openCBT = () => {
    navigate(ROUTES.CBT_CATEGORIES);
  };

  /* ======================================================
     PRACTICE NAVIGATION
  ====================================================== */

  const openPracticeCategories = () => {
    navigate(ROUTES.PRACTICE_CATEGORIES);
  };

  const openPracticeSubjects = () => {
    navigate(ROUTES.PRACTICE_SUBJECTS);
  };

  /*
  Dashboard Practice button now opens the
  category-free random Practice Mode.
  */

  const openPractice = () => {
    navigate(ROUTES.PRACTICE_MODE);
  };

  /* ======================================================
     RESULTS
  ====================================================== */

  const openResults = () => {
    navigate(ROUTES.RESULT);
  };

  const openHistory = () => {
    navigate(ROUTES.RESULTS_HISTORY);
  };

  /* ======================================================
     REVIEW
  ====================================================== */

  const openReview = () => {
    navigate(ROUTES.REVIEW_ANSWERS);
  };

  /* ======================================================
     CERTIFICATE
  ====================================================== */

  const openCertificate = () => {
    navigate(ROUTES.CERTIFICATE);
  };

  /* ======================================================
     PAYMENT
  ====================================================== */

  const openPayment = () => {
    navigate(ROUTES.PAYMENT);
  };

  /* ======================================================
     DASHBOARD
  ====================================================== */

  const openDashboard = () => {
    navigate(ROUTES.DASHBOARD);
  };

  /* ======================================================
     LOGOUT
  ====================================================== */

  const logout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    /* Authentication */
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    /* Practice session */
    localStorage.removeItem("practice_result");
    localStorage.removeItem("practice_history");
    localStorage.removeItem("practiceCategory");
    localStorage.removeItem("practiceSubject");

    /* CBT session/result */
    localStorage.removeItem("cbt_result");
    localStorage.removeItem("cbtCategory");
    localStorage.removeItem("cbtSubject");

    /* Return to login */
    navigate(ROUTES.LOGIN, {
      replace: true,
    });
  };

  /* ======================================================
     RETURN
  ====================================================== */

  return {
    /* CBT */
    openCBTCategories,
    openCBTSubjects,
    openCBT,

    /* Practice */
    openPracticeCategories,
    openPracticeSubjects,
    openPractice,

    /* Results */
    openResults,
    openHistory,

    /* Review */
    openReview,

    /* Account */
    openCertificate,
    openPayment,

    /* Dashboard */
    openDashboard,

    /* Authentication */
    logout,
  };
}

