import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("adminToken");
  const adminData = localStorage.getItem("admin");

  if (!token || !adminData) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const admin = JSON.parse(adminData);

    if (admin.role !== "admin") {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");

      return <Navigate to="/admin/login" replace />;
    }
  } catch {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;