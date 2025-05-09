// src/components/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthService from "../../services/AuthService";

function ProtectedRoute({ allowedRoles }) {
  const user = AuthService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
