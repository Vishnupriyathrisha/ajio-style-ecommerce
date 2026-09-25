import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";


import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";

const AdminDashboard = () => {

    const [dashboard, setDashboard] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const response = await adminApi.get("/admin/dashboard");

      setDashboard(response.data.dashboard);
    } catch (error) {
      console.error("Dashboard fetch error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);

  const stats = [
  {
    title: "Total Users",
    value: dashboard?.totalUsers ?? 0,
  },
  {
    title: "Total Sellers",
    value: dashboard?.totalSellers ?? 0,
  },
  {
    title: "Total Products",
    value: dashboard?.totalProducts ?? 0,
  },
  {
    title: "Total Orders",
    value: dashboard?.totalOrders ?? 0,
  },
  {
    title: "Total Sales",
    value: `₹${dashboard?.totalSales ?? 0}`,
  },
];

if (loading) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography>Loading dashboard...</Typography>
    </Box>
  );
}

if (error) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography color="error">
        {error}
      </Typography>
    </Box>
  );
}

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h4"
        fontWeight={600}
        sx={{ mb: 3 }}
      >
        Admin Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3}>
        {stats.map((item) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={2.4}
            key={item.title}
          >
            <Card
              sx={{
                height: "100%",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {item.title}
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={700}
                >
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Orders Section */}
      <Card
  sx={{
    mt: 4,
    borderRadius: 2,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  }}
>
  <CardContent>
    <Typography
      variant="h6"
      fontWeight={600}
      sx={{ mb: 2 }}
    >
      Recent Orders
    </Typography>

    {dashboard?.recentOrders?.length > 0 ? (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {dashboard.recentOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  {order.user?.name || "Unknown"}
                </TableCell>

                <TableCell>
                  {order.user?.email || "-"}
                </TableCell>

                <TableCell>
                  ₹{order.totalAmount}
                </TableCell>

                <TableCell>
                  {order.paymentStatus}
                </TableCell>

                <TableCell>
                  <Chip
                    label={order.orderStatus}
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Typography color="text.secondary">
        No recent orders available.
      </Typography>
    )}
  </CardContent>
</Card>
    </Box>
  );
};

export default AdminDashboard;