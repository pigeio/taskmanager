import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // ✅ read directly

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Logged in but not authorized
    return <Navigate to="/login" replace />;
  }

  // Authorized, render child routes
  return <Outlet />;
};

export default PrivateRoute;


