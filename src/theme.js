import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#171717",
      contrastText: "#ffffff",
    },

    secondary: {
      main: "#C8A96B",
      contrastText: "#171717",
    },

    background: {
      default: "#F7F5F0",
      paper: "#FFFFFF",
    },

    success: {
      main: "#2E7D5B",
    },

    error: {
      main: "#C94C4C",
    },

    text: {
      primary: "#171717",
      secondary: "#6B6B6B",
    },
  },

  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",

    h1: {
      fontWeight: 800,
    },

    h2: {
      fontWeight: 800,
    },

    h3: {
      fontWeight: 700,
    },

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 700,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 6,
  },
});

export default theme;