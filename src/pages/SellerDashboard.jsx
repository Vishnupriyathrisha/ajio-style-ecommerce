import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";

import axios from "axios";

const SellerDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const sellerToken = localStorage.getItem("sellerToken");

        if (!sellerToken) {
          navigate("/seller/login");
          return;
        }

        const response = await axios.get(
  "http://localhost:5000/api/seller/dashboard",
  {
    headers: {
      Authorization: `Bearer ${sellerToken}`,
    },
  }
);

        setDashboard(response.data.dashboard);
      } catch (error) {
        console.error("Seller dashboard error:", error);
          console.log("SELLER AUTH ERROR RESPONSE:", error.response?.data);
        if (error.response?.status === 401) {
          localStorage.removeItem("sellerToken");
          localStorage.removeItem("seller");
          navigate("/seller/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load seller dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "#B61ECA" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const seller = JSON.parse(localStorage.getItem("seller") || "{}");

  return (
    <Box
      sx={{
        minHeight: "80vh",
        backgroundColor: "#F9F2FA",
        p: { xs: 2, md: 4 },
      }}
    >
      {/* Welcome Header */}
      <Box
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 3,
          background:
            "linear-gradient(135deg, #B61ECA 0%, #8E24AA 100%)",
          color: "#fff",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 1,
          }}
        >
          Welcome, {seller.sellerName || "Seller"} 👋
        </Typography>

        <Typography sx={{ opacity: 0.9 }}>
          {seller.businessName || "Your Store"} Dashboard
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        {/* Total Products */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #E8DCEB",
              boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Inventory2OutlinedIcon
                sx={{
                  fontSize: 40,
                  color: "#B61ECA",
                  mb: 1,
                }}
              />

              <Typography
                variant="h4"
                sx={{ fontWeight: 800 }}
              >
                {dashboard?.totalProducts || 0}
              </Typography>

              <Typography color="text.secondary">
                Total Products
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock */}
         <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #E8DCEB",
              boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <WarningAmberOutlinedIcon
                sx={{
                  fontSize: 40,
                  color: "#ED6C02",
                  mb: 1,
                }}
              />

              <Typography
                variant="h4"
                sx={{ fontWeight: 800 }}
              >
                {dashboard?.lowStockProducts || 0}
              </Typography>

              <Typography color="text.secondary">
                Low Stock Products
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Out of Stock */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #E8DCEB",
              boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <RemoveShoppingCartOutlinedIcon
                sx={{
                  fontSize: 40,
                  color: "#D32F2F",
                  mb: 1,
                }}
              />

              <Typography
                variant="h4"
                sx={{ fontWeight: 800 }}
              >
                {dashboard?.outOfStockProducts || 0}
              </Typography>

              <Typography color="text.secondary">
                Out of Stock
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SellerDashboard;