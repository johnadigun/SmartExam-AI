import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedExamRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const allowed = user?.cbtAccess === true && user?.examTaken !== true;

  if (!allowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedExamRoute;