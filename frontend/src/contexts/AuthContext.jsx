import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initial state from localStorage
    const stored = localStorage.getItem('userDetails');
    return stored ? JSON.parse(stored) : null;
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    setLoggedIn(localStorage.getItem('loggedIn'));
  }, []);

  useEffect(() => {
    if (user) {
      setRole(user.Role);
    }
  }, [user]);

  const login = (userDetails) => {
    setUser(userDetails);
    setRole(userDetails?.Role);
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('userDetails');
    setUser(null);
    setRole('');
    setLoggedIn(false);
  };

  return <AuthContext.Provider value={{ user, role, loggedIn, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
