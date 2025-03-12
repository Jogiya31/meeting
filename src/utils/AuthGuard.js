import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const isAuthenticated = localStorage.getItem('loggedIn') === 'true'; // Ensure it's a string

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default AuthGuard;
