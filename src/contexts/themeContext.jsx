import React, { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const [theme, setTheme] = useState('gradient');
  const [navColor, setNavColor] = useState('');
  const [logoColor, setLogoColor] = useState('');

  useEffect(() => {
    setMode(localStorage.getItem('mode') || 'light');
    setTheme(localStorage.getItem('theme') || 'static');
    setTheme(localStorage.getItem('navColor') || '');
    setTheme(localStorage.getItem('logoColor') || '');
  }, []);

  const changeMode = (val) => {
    setMode(val);
  };
  const changeThemeMode = (val) => {
    setTheme(val);
  };
  const changeNavColor = (val) => {
    setNavColor(val);
  };
  const changeLogoColor = (val) => {
    setLogoColor(val);
  };

  return (
    <ThemeContext.Provider value={{ mode, theme, navColor, logoColor, changeMode, changeThemeMode, changeNavColor, changeLogoColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
