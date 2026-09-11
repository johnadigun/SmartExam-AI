import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BASE_URL from "../../api/api";
import "./AdminDashboard.css";

import QuestionManager from "./QuestionManager";
import QuestionBankAdmin from "./QuestionBankAdmin";
import CreateExam from "./CreateExam";
import Exams from "./Exams";
import Users from "./Users";
import Students from "./Students";
import Administrators from "./Administrators";
import LiveMonitoring from "./LiveMonitoring";
import BulkUpload from "./BulkUpload";
import CheatingReports from "./CheatingReports";

function AdminDashboard() {
  const navigate = useNavigate();

  /* =========================
     AUTH
  ========================= */

  const token = localStorage.getItem("token");

  const [admin, setAdmin] = useState(null);

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] =
    useState("dashboard");

  /* =========================
     DASHBOARD STATS
  ========================= */

  const [stats, setStats] = useState({
    users: 0,
    students: 0,
    admins: 0,
    paidUsers: 0,
    questions: 0,
    exams: 0,
    sessions: 0,
    activeSessions: 0,
  });

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    const savedAdmin = JSON.parse(
      localStorage.getItem("admin") || "{}"
    );

    if (!token || !savedAdmin.email) {
      navigate("/admin-login");
      return;
    }

    setAdmin(savedAdmin);

    loadDashboard();
  }, []);

  /* =========================
     LOAD DASHBOARD
  ========================= */

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to load dashboard.");

        localStorage.removeItem("token");
        localStorage.removeItem("admin");

        navigate("/admin-login");

        return;
      }

      setStats({
        users: data.stats?.users || 0,
        students: data.stats?.students || 0,
        admins: data.stats?.admins || 0,
        paidUsers: data.stats?.paidUsers || 0,
        questions: data.stats?.questions || 0,
        exams: data.stats?.exams || 0,
        sessions: data.stats?.sessions || 0,
        activeSessions: data.stats?.activeSessions || 0,
      });

    } catch (err) {

      console.error("Dashboard Error:", err);

      alert("Unable to connect to server.");

    } finally {

      setLoading(false);

    }
  };
  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    navigate("/admin-login");
  };

  /* =========================
     DASHBOARD CARDS
  ========================= */

  const DashboardCards = () => (
    <div className="dashboard-cards">

      <div className="dashboard-card">
        <h3>Total Users</h3>
        <h1>{stats.users}</h1>
      </div>

      <div className="dashboard-card">
        <h3>Students</h3>
        <h1>{stats.students}</h1>
      </div>

      <div className="dashboard-card">
        <h3>Administrators</h3>
        <h1>{stats.admins}</h1>
      </div>

      <div className="dashboard-card">
        <h3>Paid Users</h3>
        <h1>{stats.paidUsers}</h1>
      </div>

      <div className="dashboard-card">
        <h3>Questions</h3>
        <h1>{stats.questions}</h1>
      </div>

      <div className="dashboard-card">
        <h3>Exams</h3>
        <h1>{stats.exams}</h1>
      </div>

      <div className="dashboard-card">
        <h3>Sessions</h3>
        <h1>{stats.sessions}</h1>
      </div>

      <div className="dashboard-card">
        <h3>Active CBT</h3>
        <h1>{stats.activeSessions}</h1>
      </div>

    </div>
  );

  /* =========================
     PAGE CONTENT
  ========================= */

  const renderContent = () => {

    switch (activeTab) {

      case "dashboard":
        return <DashboardCards />;

      case "questions":
        return <QuestionManager />;

      case "questionbank":
        return <QuestionBankAdmin />;

      case "createexam":
        return <CreateExam />;

      case "exams":
        return <Exams />;

      case "users":
        return <Users />;

      case "students":
        return <Students />;

      case "administrators":
         return <Administrators />;

      case "upload":
        return <BulkUpload />;

      case "live":
        return <LiveMonitoring />;

      case "cheating":
        return <CheatingReports />;

      default:
        return <DashboardCards />;
    }

  };
  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="admin-loading">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  /* =========================
     PAGE
  ========================= */

  return (

    <div className="admin-container">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="admin-sidebar">

        <h2>SmartExam</h2>

        <p className="admin-email">
          {admin.email}
        </p>

        <button onClick={() => setActiveTab("dashboard")}>
          Dashboard
        </button>

        <button onClick={() => setActiveTab("questions")}>
          Questions
        </button>

        <button onClick={() => setActiveTab("questionbank")}>
          Question Bank
        </button>

        <button onClick={() => setActiveTab("createexam")}>
          Create Exam
        </button>

        <button onClick={() => setActiveTab("exams")}>
          Exams
        </button>

        <button onClick={() => setActiveTab("users")}>
          Users
        </button>

        <button onClick={() => setActiveTab("students")}>
          Students
        </button>

        <button onClick={() => setActiveTab("administrators")}>
  Administrators
</button>

        <button onClick={() => setActiveTab("upload")}>
          Bulk Upload
        </button>

        <button onClick={() => setActiveTab("live")}>
          Live Monitoring
        </button>

        <button onClick={() => setActiveTab("cheating")}>
          Cheating Reports
        </button>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="admin-content">

        <div className="admin-header">

          <h1>
            SMARTEXAM ADMIN PANEL
          </h1>

        </div>

        <div className="admin-body">
          {renderContent()}

        </div>

      </main>

    </div>

  );
}

export default AdminDashboard;