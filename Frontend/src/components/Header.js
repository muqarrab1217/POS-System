import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { useRole } from './RoleContext'; // Import the useRole hook to access role

const Header = () => {
  const { role } = useRole(); // Get the role from RoleContext

  return (
    <header>
      <div className="dropdown">
        <img
          className="icons dropdown"
          src="/icons/menuBar.png"
          alt="Restaurant Logo"
        />
        <div className="dropdown-content">
          {/* Conditionally render links based on role */}
          {role === "admin" ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/takeorder">Take Order</Link>
              <Link to="/inventory">Inventory</Link>
              <Link to="/manageorders">Manage Orders</Link>
              <Link to="/analytics">Analytics</Link>
              <Link to="/customerhistory">Customer History</Link>
              <Link to="/settings">Settings</Link>
            </>
          ) : (
            <>
              <Link to="/takeorder">Take Order</Link>
              <Link to="/manageorders">Manage Orders</Link>
              <Link to="/customerhistory">Customer History</Link>
            </>
          )}
        </div>
      </div>
      <h1>Restaurant POS System</h1>
    </header>
  );
};

export default Header;
