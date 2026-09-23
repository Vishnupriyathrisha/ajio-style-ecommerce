import { Outlet } from "react-router-dom";

import Box from "@mui/material/Box";

import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "../common/Sidebar";
import MobileBottomBar from "../common/MobileBottomBar";

const UserLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",

        // Space for fixed mobile bottom bar
        pb: {
          xs: "64px",
          md: 0,
        },
      }}
    >
      <Header />

      <Sidebar role="user" />

      <Box
        component="main"
        sx={{
          flex: 1,
        }}
      >
        <Outlet />
      </Box>

      <Footer />

      <MobileBottomBar />
    </Box>
  );
};

export default UserLayout;