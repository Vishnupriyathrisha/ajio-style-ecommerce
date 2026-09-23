import { Outlet } from "react-router-dom";

import Box from "@mui/material/Box";

import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "../common/Sidebar";

const SellerLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Common Header */}
      <Header />

      {/* Seller Sidebar */}
      <Sidebar role="seller" />

      {/* Seller Page Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
        }}
      >
        <Outlet />
      </Box>

      {/* Common Footer */}
      <Footer />
    </Box>
  );
};

export default SellerLayout;