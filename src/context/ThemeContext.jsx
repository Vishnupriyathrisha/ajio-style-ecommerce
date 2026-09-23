import { createContext, useContext, useState } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import theme from "../theme";
import luxuryTheme from "../themeLuxury";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isLuxuryMode, setIsLuxuryMode] = useState(false);

  const toggleLuxuryMode = () => {
    setIsLuxuryMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        isLuxuryMode,
        toggleLuxuryMode,
      }}
    >
      <MuiThemeProvider
        theme={isLuxuryMode ? luxuryTheme : theme}
      >
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  return useContext(ThemeContext);
};