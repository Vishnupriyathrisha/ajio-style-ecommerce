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

import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import api from "../services/api";
import { useThemeMode } from "../context/ThemeContext";

const SellerSalesSummary = () => {
  const navigate = useNavigate();

  const { isLuxuryMode } = useThemeMode();

  // =========================
  // THEME COLORS
  // =========================

  const pageBackground = isLuxuryMode
    ? "#0F0F0F"
    : "#F9F2FA";

  const cardBackground = isLuxuryMode
    ? "#1A1A1A"
    : "#FFFFFF";

  const primaryText = isLuxuryMode
    ? "#FFFFFF"
    : "#171717";

  const secondaryText = isLuxuryMode
    ? "#BDBDBD"
    : "#6B6B6B";

  const border = isLuxuryMode
    ? "#333333"
    : "#E8DCEB";

  const accent = isLuxuryMode
    ? "#C8A96B"
    : "#B61ECA";

  const accentHover = isLuxuryMode
    ? "#E0C080"
    : "#9615A8";

  const headerBackground = isLuxuryMode
    ? "linear-gradient(135deg, #171717 0%, #242424 100%)"
    : "linear-gradient(135deg, #B61ECA 0%, #8E24AA 100%)";

  const cardShadow = isLuxuryMode
    ? "0 8px 25px rgba(0,0,0,0.30)"
    : "0 8px 25px rgba(182,30,202,0.08)";

  const cardHoverShadow = isLuxuryMode
    ? "0 12px 30px rgba(0,0,0,0.45)"
    : "0 12px 30px rgba(182,30,202,0.14)";

  // =========================
  // STATE
  // =========================

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH SALES SUMMARY
  // =========================

  useEffect(() => {
    const fetchSalesSummary = async () => {
      try {
        setLoading(true);
        setError("");

        const sellerToken =
          localStorage.getItem("sellerToken");

        if (!sellerToken) {
          navigate("/seller/login");
          return;
        }

        const response = await api.get(
          "/seller/orders/sales-summary",
          {
            headers: {
              Authorization: `Bearer ${sellerToken}`,
            },
          }
        );

        if (response.data.success) {
          setSummary(
            response.data.salesSummary
          );
        }
      } catch (error) {
        console.error(
          "GET SELLER SALES SUMMARY ERROR:",
          error
        );

        if (error.response?.status === 401) {
          localStorage.removeItem(
            "sellerToken"
          );
          localStorage.removeItem("seller");

          navigate("/seller/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load sales summary."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSalesSummary();
  }, [navigate]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          backgroundColor: pageBackground,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: pageBackground,
          p: {
            xs: 2,
            md: 4,
          },
        }}
      >
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  // =========================
  // SUMMARY CARDS
  // =========================

  const cards = [
    {
      title: "Total Revenue",
      value: `₹${summary?.totalRevenue || 0}`,
      icon: <CurrencyRupeeOutlinedIcon />,
      classicBackground: "#F3D9F7",
      classicColor: "#B61ECA",
      luxuryBackground:
        "rgba(200,169,107,0.12)",
      luxuryColor: "#C8A96B",
    },
    {
      title: "Total Orders",
      value: summary?.totalOrders || 0,
      icon: <ShoppingBagOutlinedIcon />,
      classicBackground: "#E8E0FF",
      classicColor: "#6C3FC5",
      luxuryBackground:
        "rgba(108,63,197,0.14)",
      luxuryColor: "#B39DDB",
    },
    {
      title: "Products Sold",
      value:
        summary?.totalProductsSold || 0,
      icon: <Inventory2OutlinedIcon />,
      classicBackground: "#DFF4EA",
      classicColor: "#198754",
      luxuryBackground:
        "rgba(25,135,84,0.14)",
      luxuryColor: "#66BB8A",
    },
    {
      title: "Delivered Orders",
      value:
        summary?.deliveredOrders || 0,
      icon: <LocalShippingOutlinedIcon />,
      classicBackground: "#DDF1FF",
      classicColor: "#1976D2",
      luxuryBackground:
        "rgba(25,118,210,0.14)",
      luxuryColor: "#64B5F6",
    },
    {
      title: "Active Orders",
      value: summary?.activeOrders || 0,
      icon: <PendingActionsOutlinedIcon />,
      classicBackground: "#FFF3CD",
      classicColor: "#B7791F",
      luxuryBackground:
        "rgba(200,169,107,0.14)",
      luxuryColor: "#E0C080",
    },
    {
      title: "Cancelled Orders",
      value:
        summary?.cancelledOrders || 0,
      icon: <CancelOutlinedIcon />,
      classicBackground: "#FDE2E2",
      classicColor: "#D32F2F",
      luxuryBackground:
        "rgba(211,47,47,0.14)",
      luxuryColor: "#EF6C6C",
    },
  ];

  // =========================
  // MAIN
  // =========================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: pageBackground,
        py: {
          xs: 3,
          md: 5,
        },
        transition:
          "background-color 0.3s ease",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: {
            xs: 2,
            md: 4,
          },
        }}
      >
        {/* =========================
            PAGE HEADER
        ========================= */}

        <Box
          sx={{
            mb: 4,
            p: {
              xs: 3,
              md: 4,
            },
            borderRadius: 4,
            background: headerBackground,
            color: "#FFFFFF",
            border: isLuxuryMode
              ? "1px solid #3A3A3A"
              : "none",
            boxShadow: isLuxuryMode
              ? "0 10px 30px rgba(0,0,0,0.35)"
              : "0 10px 30px rgba(182,30,202,0.20)",
            transition:
              "background 0.3s ease, box-shadow 0.3s ease",
          }}
        >
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
            Sales Summary
          </Typography>

          <Typography
            sx={{
              opacity: 0.9,
              color: isLuxuryMode
                ? "#D8D8D8"
                : "#FFFFFF",
            }}
          >
            Track your store performance and sales
            overview
          </Typography>
        </Box>

        {/* =========================
            SUMMARY CARDS
        ========================= */}

        <Grid container spacing={3}>
          {cards.map((card) => {
            const iconBackground =
              isLuxuryMode
                ? card.luxuryBackground
                : card.classicBackground;

            const iconColor =
              isLuxuryMode
                ? card.luxuryColor
                : card.classicColor;

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={card.title}
              >
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    backgroundColor:
                      cardBackground,
                    border: `1px solid ${border}`,
                    boxShadow: cardShadow,
                    transition:
                      "transform 0.25s ease, box-shadow 0.25s ease, background-color 0.3s ease",

                    "&:hover": {
                      transform:
                        "translateY(-4px)",
                      boxShadow:
                        cardHoverShadow,
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
                    {/* Icon */}

                    <Box
                      sx={{
                        width: 58,
                        height: 58,
                        flexShrink: 0,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "center",
                        backgroundColor:
                          iconBackground,
                        color: iconColor,
                      }}
                    >
                      {card.icon}
                    </Box>

                    {/* Content */}

                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: secondaryText,
                          mb: 0.5,
                        }}
                      >
                        {card.title}
                      </Typography>

                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 800,
                          color: primaryText,
                        }}
                      >
                        {card.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default SellerSalesSummary;