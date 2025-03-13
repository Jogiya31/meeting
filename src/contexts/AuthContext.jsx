import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  const login = (userDetails) => {
    setUser(userDetails);
    setRole(userDetails?.Role);
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('role');
    setUser(null);
    setRole('');
    setLoggedIn(false);
  };

  return <AuthContext.Provider value={{ user, role, loggedIn, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
