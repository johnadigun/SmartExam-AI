
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin") || "{}");

  const logout = () => {
    if (!window.confirm("Are you sure you want to logout?")) {
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    navigate("/admin-login");
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    display: "block",
    padding: "12px 15px",
    marginBottom: "8px",
    borderRadius: "6px",
    textDecoration: "none",
    color: "#fff",
    backgroundColor: isActive(path) ? "#0d6efd" : "#343a40",
    fontWeight: isActive(path) ? "bold" : "normal",
    transition: "0.3s",
  });

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        minHeight: 0,
        background: "#dfe3e8",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside
        style={{
          width: "250px",
          minWidth: "250px",
          height: "100%",
          background: "#2f343a",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
          flexShrink: 0,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            padding: "25px",
            borderBottom: "1px solid #454b52",
            flexShrink: 0,
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              color: "#4fc3f7",
            }}
          >
            SmartExam
          </h2>

          <small
            style={{
              color: "#cccccc",
            }}
          >
            Administrator Panel
          </small>
        </div>

        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <nav
          style={{
            flex: "1 1 auto",
            minHeight: 0,
            padding: "20px 15px",
            boxSizing: "border-box",
            overflowY: "auto",
          }}
        >
          <Link to="/admin" style={linkStyle("/admin")}>
            Dashboard
          </Link>

          <Link
            to="/admin/question-bank"
            style={linkStyle("/admin/question-bank")}
          >
            Question Bank
          </Link>

          <Link
            to="/admin/questions"
            style={linkStyle("/admin/questions")}
          >
            Question Manager
          </Link>

          <Link
            to="/admin/create-exam"
            style={linkStyle("/admin/create-exam")}
          >
            Create Exam
          </Link>

          <Link
            to="/admin/exams"
            style={linkStyle("/admin/exams")}
          >
            Exams
          </Link>

          <Link
            to="/admin/users"
            style={linkStyle("/admin/users")}
          >
            Users
          </Link>

          <Link
            to="/admin/students"
            style={linkStyle("/admin/students")}
          >
            Students
          </Link>

          <Link
            to="/admin/upload"
            style={linkStyle("/admin/upload")}
          >
            Bulk Upload
          </Link>

          <Link
            to="/admin/live"
            style={linkStyle("/admin/live")}
          >
            Live Monitoring
          </Link>

          <Link
            to="/admin/cheating"
            style={linkStyle("/admin/cheating")}
          >
            Cheating Reports
          </Link>
        </nav>

        {/* ==================================================
            LOGOUT
        ================================================== */}

        <div
          style={{
            padding: "15px",
            borderTop: "1px solid #454b52",
            flexShrink: 0,
            boxSizing: "border-box",
          }}
        >
          <button
            onClick={logout}
            style={{
              width: "100%",
              border: "none",
              padding: "12px 15px",
              borderRadius: "6px",
              background: "#c62828",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ==================================================
          MAIN APPLICATION AREA

          The application shell stays within the viewport.
          The PAGE CONTENT below is responsible for vertical
          scrolling and can grow to any required height.
      ================================================== */}

      <div
        style={{
          flex: "1 1 auto",
          minWidth: 0,
          minHeight: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <header
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            padding: "18px 25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
            boxSizing: "border-box",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#1565c0",
                fontSize: "20px",
              }}
            >
              SmartExam Administration
            </h2>

            <small
              style={{
                color: "#6b7280",
              }}
            >
              Welcome {admin.email || "Administrator"}
            </small>
          </div>

          <button
            onClick={logout}
            style={{
              background: "#c62828",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </header>

        {/* ==================================================
            MAIN PAGE CONTENT

            IMPORTANT:
            This is the single vertical scrolling area.

            Pages such as:
            - Exam Manager
            - Create Exam
            - Question Manager
            - Question Bank

            can now grow vertically without being clipped
            by a fixed page height.
        ================================================== */}

        <main
          style={{
            flex: "1 1 0",
            minWidth: 0,
            minHeight: 0,
            width: "100%",
            padding: "20px",
            background: "#dfe3e8",
            overflowY: "auto",
            overflowX: "hidden",
            boxSizing: "border-box",
          }}
        >
          {children}
        </main>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer
          style={{
            background: "#ffffff",
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
            padding: "12px",
            color: "#6b7280",
            fontSize: "14px",
            flexShrink: 0,
            boxSizing: "border-box",
          }}
        >
          © {new Date().getFullYear()} SmartExam CBT System — Admin Panel
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;