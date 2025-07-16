/* eslint-disable prettier/prettier */
import React, { useState, createContext, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User is null by default

  // Function to log in (simulate async login)
  const login = async (userData) => {
    // Add logic for login (e.g., API call)
    
    setUser(userData);
  };

  // Function to log out
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
