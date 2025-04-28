import React, { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const [theme, setTheme] = useState('gradient');

  useEffect(() => {
    setMode(localStorage.getItem('mode') || 'light');
    setTheme(localStorage.getItem('theme') || 'static');
  }, []);

  const changeMode = (val) => {
    setMode(val);
  };
  const changeThemeMode = (val) => {
    setTheme(val);
  };

  return <ThemeContext.Provider value={{ mode, theme, changeMode, changeThemeMode }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
