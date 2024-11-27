import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Create the context
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap the app with context provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if user is logged in
  const navigate = useNavigate();

  // Login function to set the authentication state
  const login = () => {
    setIsAuthenticated(true); // Set user as authenticated
    navigate("/dashboard"); // Navigate to a protected route after login
  };

  // Logout function to clear the authentication state
  const logout = () => {
    setIsAuthenticated(false); // Clear authentication state
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
