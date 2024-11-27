import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TakeOrder from "./components/TakeOrder";
import Dashboard from "./components/Dashboard";
import Analytics from './components/Analytics';
import Inventory from "./components/Inventory";
import ManageOrders from "./components/ManageOrders";
import CustomerHistory from "./components/CustomerHistory";
import { AuthProvider } from "./components/AuthContext"; // Your existing AuthContext
import { RoleProvider } from "./components/RoleContext"; // Import RoleProvider
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component

const App = () => {
  return (
    <Router>
      <AuthProvider> {/* Wrap AuthProvider with Router */}
        <RoleProvider> {/* Wrap RoleProvider inside AuthProvider */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/takeorder"
              element={
                <ProtectedRoute>
                  <TakeOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manageorders"
              element={
                <ProtectedRoute>
                  <ManageOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customerhistory"
              element={
                <ProtectedRoute>
                  <CustomerHistory />
                </ProtectedRoute>
              }
            />
          </Routes>
        </RoleProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
