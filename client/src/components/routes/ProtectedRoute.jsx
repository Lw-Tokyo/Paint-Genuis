// src/components/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthService from "../../services/AuthService";

function ProtectedRoute({ allowedRoles }) {
  const user = AuthService.getCurrentUser();

  // Redirect to auth page if not logged in
  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Redirect if user doesn't have allowed role
  if (!allowedRoles.includes(user.role)) {
    // Redirect to their proper dashboard instead of "/"
    return <Navigate to={`/${user.role}/dashboard`} />;
  }

  // Don't wrap with DashboardLayout here as each dashboard component already uses it
  return <Outlet />;
}

export default ProtectedRoute;