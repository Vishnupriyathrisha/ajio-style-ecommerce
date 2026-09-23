import { Outlet } from "react-router-dom";

import Box from "@mui/material/Box";

import Sidebar from "../common/Sidebar";

const AdminLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Sidebar role="admin" />

      <Box
        component="main"
        sx={{
          flex: 1,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;