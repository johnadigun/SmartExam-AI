import React from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  try {
    const admin = JSON.parse(localStorage.getItem("admin") || "{}");
    const token = localStorage.getItem("token");

    // Not logged in
    if (!token || !admin.email) {
      return <Navigate to="/admin-login" replace />;
    }

    // Allow only administrator roles
    const allowedRoles = [
      "super-admin",
      "school-admin",
    ];

    if (!allowedRoles.includes(admin.role)) {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      return <Navigate to="/admin-login" replace />;
    }

    return children;

  } catch (error) {
    console.error("AdminRoute Error:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    return <Navigate to="/admin-login" replace />;
  }
}

export default AdminRoute;