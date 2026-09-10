import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#111111",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#555555",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },

  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 4,
  },
});

export default theme;