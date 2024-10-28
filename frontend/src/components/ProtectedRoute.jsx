import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roleRequired }) => {
    const token = sessionStorage.getItem('token') || sessionStorage.getItem('UserToken'); // Ambil token dari sessionStorage
    // console.log('Token received', token);
  
    if (!token) {
      // Jika tidak ada token, arahkan ke halaman login
      return <Navigate to="/login" />;
    }
  
    try {
      // Validasi dan decode JWT
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Token is not properly formatted');
      }
  
      const decodedPayload = JSON.parse(atob(tokenParts[1])); // Decode payload JWT
      const userRole = decodedPayload.role || 'no-role'; // Ambil role dari payload
     
      // Jika user tidak memiliki role, arahkan ke halaman default
    if (userRole === 'no-role') {
      console.log('User has no role, redirecting to default page');
      return <Navigate to="/home" />;
    }

      if (userRole !== roleRequired) {
        // Jika role tidak sesuai, arahkan ke halaman home
        return <Navigate to="/home" />;
      }
  
      // Jika role sesuai, tampilkan halaman yang diminta
      return children;
    } catch (error) {
      console.error("Error decoding token:", error);
      // Jika token tidak valid, arahkan ke halaman login
      return <Navigate to="/login" />;
    }
  };
  

export default ProtectedRoute;
