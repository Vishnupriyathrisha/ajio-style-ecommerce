import { createTheme } from "@mui/material/styles";

const luxuryTheme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#C8A96B",
      contrastText: "#171717",
    },

    secondary: {
      main: "#FFFFFF",
      contrastText: "#171717",
    },

    background: {
      default: "#111111",
      paper: "#1A1A1A",
    },

    text: {
      primary: "#FFFFFF",
      secondary: "#BDBDBD",
    },

    divider: "#333333",
  },

  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",

    h1: {
      fontWeight: 800,
      letterSpacing: "-0.5px",
    },

    h2: {
      fontWeight: 800,
      letterSpacing: "-0.4px",
    },

    h3: {
      fontWeight: 700,
    },

    h4: {
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

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          minHeight: 44,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
  },
});

export default luxuryTheme;