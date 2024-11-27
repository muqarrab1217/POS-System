import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import the useAuth hook

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  return children; // If authenticated, render the children components
};

export default ProtectedRoute;
