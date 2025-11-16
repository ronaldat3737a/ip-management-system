import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ user, allowedRoles }) => {
  if (!user) {
    // If no user is logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If the user's role is not in the allowed roles, redirect to a default page
    // You might want to create a specific "Unauthorized" page for a better UX
    return <Navigate to="/submit" />; 
  }

  // If the user is authenticated and has the required role, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
