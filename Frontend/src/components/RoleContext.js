// RoleContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context for managing the user's role
const RoleContext = createContext();

// RoleProvider component to wrap the entire app and provide the role context
export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState("guest"); // Default role could be "guest" or another default role

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

// Custom hook to use role in other components
export const useRole = () => {
  return useContext(RoleContext);
};
