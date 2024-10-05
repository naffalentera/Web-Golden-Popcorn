import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roleRequired, ...rest }) => {
  const token = localStorage.getItem('token'); // Ambil token dari localStorage
  const userRole = token ? JSON.parse(atob(token.split('.')[1])).role : null; // Decode role dari token JWT

  return (
    <Route
      {...rest}
      element={
        token && userRole === roleRequired ? (
          children
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
