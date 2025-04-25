import React, { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    setMode(localStorage.getItem('mode') || 'light');
  }, []);

  const changeThemeMode = (val) => {
    setMode(val);
  };

  return <ThemeContext.Provider value={{ mode, changeThemeMode }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
