// src/context/UserContext.js
import React, { createContext, useState, useEffect } from "react";
import AuthService from "../services/AuthService";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const storedUser = AuthService.getCurrentUser();
  if (storedUser) {
    setUser(storedUser);
  }
}, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
