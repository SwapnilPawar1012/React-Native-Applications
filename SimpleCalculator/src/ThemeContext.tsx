import React, {createContext, useContext, useState, ReactNode} from 'react';
import buttons from './ButtonsModel';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';

const themes = {
  light: {
    bgThemeBox: '#cccccc',
    background: '#ffffff',
    bgBtnBox: '#cccccc',
    bgBtn: '#bbbbbb',
    btnText: '#000000',
    text: '#000000',
    resultText: '#555555',
    primary: '#007bff',
  },
  dark: {
    bgThemeBox: '#2d3845',
    background: '#212b36',
    bgBtnBox: '#2a3542',
    bgBtn: '#2d3845',
    btnText: '#ffffff',
    text: '#ffffff',
    resultText: '#cccccc',
    primary: '#1e90ff',
  },
};

const ThemeContext = createContext({
  theme: themes.light,
  ToggleTheme: () => {},
});

export const ThemeProvider = ({children}: {children: ReactNode}) => {
  const [theme, setTheme] = useState(themes.light);

  const ToggleTheme = () => {
    console.log('Toggle');
    setTheme(prevTheme =>
      prevTheme === themes.light ? themes.dark : themes.light,
    );
  };

  return (
    <ThemeContext.Provider value={{theme, ToggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
