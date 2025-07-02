import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  const token = localStorage.getItem('token');
  const role = user?.role || localStorage.getItem('role');

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const normalizedRole = role === "member" ? "user" : role;

  if (allowedRoles.length > 0 && !allowedRoles.includes(normalizedRole)) {
    return <Navigate to={`/${normalizedRole}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;




