import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = AuthService.getCurrentUser();

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return children;
};

export default PrivateRoute;
