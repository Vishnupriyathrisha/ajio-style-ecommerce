import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import App from "./App";
import theme from "./theme";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <CartProvider>
  <WishlistProvider>
    <App />
  </WishlistProvider>
</CartProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);