
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

/* ==========================================================
   PUBLIC / USER PAGES
========================================================== */

import IntroductionPage from "./IntroductionPage";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import PaymentPage from "./pages/PaymentPage";
import VerifyPayment from "./pages/VerifyPayment";
import PaymentSuccess from "./pages/PaymentSuccess";

import CBTCategories from "./pages/CBTCategories";
import CBTSubjects from "./pages/CBTSubjects";

import PracticeCategories from "./pages/PracticeCategories";
import PracticeSubjects from "./pages/PracticeSubjects";
import PracticeMode from "./pages/PracticeMode";
import PracticeResult from "./pages/PracticeResult";

import ReviewAnswers from "./pages/ReviewAnswers";

import ResultsHistory from "./pages/ResultsHistory";

import MockExamMode from "./pages/MockExamMode";
import ResultPage from "./pages/ResultPage";
import CertificatePage from "./pages/CertificatePage";

/* ==========================================================
   ADMIN
========================================================== */

import Administrators from "./pages/admin/Administrators";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRoute from "./pages/admin/AdminRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import QuestionManager from "./pages/admin/QuestionManager";
import QuestionBankAdmin from "./pages/admin/QuestionBankAdmin";
import CreateExam from "./pages/admin/CreateExam";
import Exams from "./pages/admin/Exams";

import LiveMonitoring from "./pages/admin/LiveMonitoring";
import BulkUpload from "./pages/admin/BulkUpload";
import Users from "./pages/admin/Users";
import Students from "./pages/admin/Students";
import CheatingReports from "./pages/admin/CheatingReports";

/*
==========================================================
SMARTEXAM CBT SYSTEM
MASTER APPLICATION ROUTER

Public entry:
- Introduction Page
- Login
- Register

All existing student and admin routes are preserved.
==========================================================
*/

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==================================================
            PUBLIC
        ================================================== */}

        {/* SmartExam Introduction / Landing Page */}
        <Route
          path="/"
          element={<IntroductionPage />}
        />

        {/* Existing Login Page */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Existing Registration Page */}
        <Route
          path="/register"
          element={<Register />}
        />


        {/* ==================================================
            STUDENT DASHBOARD
        ================================================== */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* ==================================================
            PAYMENT
        ================================================== */}

        <Route
          path="/payment"
          element={<PaymentPage />}
        />

        <Route
          path="/verify"
          element={<VerifyPayment />}
        />

        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />


        {/* ==================================================
            CBT
        ================================================== */}

        <Route
          path="/cbt-categories"
          element={<CBTCategories />}
        />

        <Route
          path="/cbt-subjects"
          element={<CBTSubjects />}
        />

        <Route
          path="/cbt-exam"
          element={<MockExamMode />}
        />


        {/* ==================================================
            PRACTICE
        ================================================== */}

        <Route
          path="/practice"
          element={<PracticeCategories />}
        />

        <Route
          path="/practice-categories"
          element={<PracticeCategories />}
        />

        <Route
          path="/practice-subjects"
          element={<PracticeSubjects />}
        />

        <Route
          path="/practice-mode"
          element={<PracticeMode />}
        />

        <Route
          path="/practice-result"
          element={<PracticeResult />}
        />


        {/* ==================================================
            RESULTS HISTORY
        ================================================== */}

        <Route
          path="/results-history"
          element={<ResultsHistory />}
        />


        {/* ==================================================
            REVIEW ANSWERS
        ================================================== */}

        <Route
          path="/review-answers"
          element={<ReviewAnswers />}
        />


        {/* ==================================================
            MOCK EXAM RESULT
        ================================================== */}

        <Route
          path="/result"
          element={<ResultPage />}
        />


        {/* ==================================================
            CERTIFICATE
        ================================================== */}

        <Route
          path="/certificate"
          element={<CertificatePage />}
        />


        {/* ==================================================
            ADMIN LOGIN
        ================================================== */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />


        {/* ==================================================
            PROTECTED ADMIN
        ================================================== */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/questions"
          element={
            <AdminRoute>
              <QuestionManager />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/question-bank"
          element={
            <AdminRoute>
              <QuestionBankAdmin />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/create-exam"
          element={
            <AdminRoute>
              <CreateExam />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/exams"
          element={
            <AdminRoute>
              <Exams />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <AdminRoute>
              <Students />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/administrators"
          element={
            <AdminRoute>
              <Administrators />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/live"
          element={
            <AdminRoute>
              <LiveMonitoring />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/upload"
          element={
            <AdminRoute>
              <BulkUpload />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/cheating"
          element={
            <AdminRoute>
              <CheatingReports />
            </AdminRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;