import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";

import CustomButton from "../components/common/CustomButton";
import api from "../services/api";
import { useThemeMode } from "../context/ThemeContext";

const SellerDashboard = () => {
  const navigate = useNavigate();

  const { isLuxuryMode } = useThemeMode();

  const [seller, setSeller] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // DYNAMIC THEME COLORS
  // --------------------------------------------------

  const pageBackground = isLuxuryMode ? "#0F0F0F" : "#F9F2FA";
  const cardBackground = isLuxuryMode ? "#1A1A1A" : "#FFFFFF";
  const primaryText = isLuxuryMode ? "#FFFFFF" : "#171717";
  const secondaryText = isLuxuryMode ? "#BDBDBD" : "#6B6B6B";
  const accent = isLuxuryMode ? "#C8A96B" : "#B61ECA";
  const accentHover = isLuxuryMode ? "#E0C080" : "#9615A8";
  const border = isLuxuryMode ? "#333333" : "#E8DCEB";

  const iconBackground = isLuxuryMode
    ? "rgba(200,169,107,0.12)"
    : "#F3D9F7";

  const warningBackground = isLuxuryMode
    ? "rgba(183,121,31,0.14)"
    : "#FFF3CD";

  const dangerBackground = isLuxuryMode
    ? "rgba(211,47,47,0.14)"
    : "#FDE2E2";

  // --------------------------------------------------
  // FETCH SELLER DASHBOARD
  // --------------------------------------------------

  useEffect(() => {
    const fetchSellerDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const sellerToken = localStorage.getItem("sellerToken");
        const sellerData = localStorage.getItem("seller");

        if (!sellerToken) {
          navigate("/seller/login");
          return;
        }

        if (sellerData) {
          setSeller(JSON.parse(sellerData));
        }

        const response = await api.get("/seller/dashboard", {
          headers: {
            Authorization: `Bearer ${sellerToken}`,
          },
        });

        if (response.data.success) {
          setDashboard(response.data.dashboard);
        }
      } catch (err) {
        console.error("Seller dashboard error:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("sellerToken");
          localStorage.removeItem("seller");

          navigate("/seller/login");
          return;
        }

        setError(
          err.response?.data?.message ||
            "Failed to load seller dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSellerDashboard();
  }, [navigate]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: pageBackground,
        }}
      >
        <CircularProgress
          sx={{
            color: accent,
          }}
        />
      </Box>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          backgroundColor: pageBackground,
          px: { xs: 2, md: 4 },
          py: 4,
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          <Alert severity="error">{error}</Alert>
        </Box>
      </Box>
    );
  }

  // --------------------------------------------------
  // DASHBOARD VALUES
  // --------------------------------------------------

  const totalProducts = dashboard?.totalProducts || 0;
  const lowStockProducts = dashboard?.lowStockProducts || 0;
  const outOfStockProducts =
    dashboard?.outOfStockProducts || 0;

  // --------------------------------------------------
  // SUMMARY CARD DATA
  // --------------------------------------------------

  const summaryCards = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: <Inventory2OutlinedIcon />,
      iconBackground,
      iconColor: accent,
    },
    {
      title: "Low Stock Products",
      value: lowStockProducts,
      icon: <WarningAmberOutlinedIcon />,
      iconBackground: warningBackground,
      iconColor: "#B7791F",
    },
    {
      title: "Out Of Stock",
      value: outOfStockProducts,
      icon: <RemoveShoppingCartOutlinedIcon />,
      iconBackground: dangerBackground,
      iconColor: "#D32F2F",
    },
  ];

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: pageBackground,
        py: { xs: 3, md: 5 },
        transition: "background-color 0.3s ease",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 4 },
        }}
      >
        {/* ================================================== */}
        {/* WELCOME HEADER */}
        {/* ================================================== */}

        <Box
          sx={{
            mb: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 4,

            background: isLuxuryMode
              ? "linear-gradient(135deg, #171717 0%, #242424 100%)"
              : "linear-gradient(135deg, #B61ECA 0%, #8E24AA 100%)",

            color: "#FFFFFF",

            border: isLuxuryMode
              ? "1px solid #3A3A3A"
              : "1px solid transparent",

            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 3,
            flexWrap: "wrap",

            boxShadow: isLuxuryMode
              ? "0 12px 35px rgba(0,0,0,0.35)"
              : "0 10px 30px rgba(182,30,202,0.20)",

            transition:
              "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 1,
                fontSize: {
                  xs: "1.8rem",
                  md: "2.2rem",
                },
              }}
            >
              Welcome, {seller?.sellerName || "Seller"} 👋
            </Typography>

            <Typography
              sx={{
                color: isLuxuryMode
                  ? "#D0D0D0"
                  : "rgba(255,255,255,0.9)",
                fontSize: "1rem",
              }}
            >
              {seller?.businessName || "Your Store"} Dashboard
            </Typography>
          </Box>

          {/* VIEW PROFILE */}

          <Box
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          >
            <CustomButton
              fullWidth={false}
              variant="outlined"
              onClick={() =>
                navigate("/seller/profile")
              }
              sx={{
                color: isLuxuryMode
                  ? "#C8A96B"
                  : "#FFFFFF",

                borderColor: isLuxuryMode
                  ? "#C8A96B"
                  : "#FFFFFF",

                "&:hover": {
                  borderColor: isLuxuryMode
                    ? "#E0C080"
                    : "#FFFFFF",

                  color: isLuxuryMode
                    ? "#E0C080"
                    : "#FFFFFF",

                  backgroundColor: isLuxuryMode
                    ? "rgba(200,169,107,0.10)"
                    : "rgba(255,255,255,0.10)",
                },
              }}
            >
              View Profile
            </CustomButton>
          </Box>
        </Box>

        {/* ================================================== */}
        {/* SUMMARY CARDS */}
        {/* ================================================== */}

        <Grid container spacing={3}>
          {summaryCards.map((item) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={item.title}
            >
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  backgroundColor: cardBackground,
                  border: `1px solid ${border}`,

                  boxShadow: isLuxuryMode
                    ? "0 8px 25px rgba(0,0,0,0.25)"
                    : "0 8px 25px rgba(182,30,202,0.08)",

                  transition:
                    "transform 0.25s ease, box-shadow 0.25s ease, background-color 0.3s ease",

                  "@media (hover: hover)": {
                    "&:hover": {
                      transform:
                        "translateY(-4px)",

                      boxShadow: isLuxuryMode
                        ? "0 14px 35px rgba(0,0,0,0.35)"
                        : "0 12px 30px rgba(182,30,202,0.12)",
                    },
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {/* ICON */}

                  <Box
                    sx={{
                      width: 55,
                      height: 55,
                      borderRadius: 3,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      backgroundColor:
                        item.iconBackground,

                      color: item.iconColor,

                      border: isLuxuryMode
                        ? "1px solid #3A3A3A"
                        : "none",

                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>

                  {/* CONTENT */}

                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: secondaryText,
                        mb: 0.5,
                        fontSize: 13,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: primaryText,
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SellerDashboard;