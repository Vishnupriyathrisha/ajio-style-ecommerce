import { Outlet } from "react-router-dom";

import Box from "@mui/material/Box";

import Sidebar from "../common/Sidebar";
import AdminHeader from "../common/AdminHeader";

const AdminLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AdminHeader />

      <Box
        sx={{
          display: "flex",
          flex: 1,
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
    </Box>
  );
};

export default AdminLayout;