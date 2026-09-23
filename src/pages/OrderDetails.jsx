import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Typography,
  Grid,
  Divider,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

import { useThemeMode } from "../context/ThemeContext";

// --------------------------------------------------
// STATUS TIMELINE
// --------------------------------------------------

const StatusTimeline = ({
  status,
  isLuxuryMode,
  accent,
  primaryText,
  border,
}) => {
  const safeStatus = status || "Placed";

  const getStatusStep = () => {
    switch (safeStatus) {
      case "Delivered":
        return 4;

      case "Shipped":
        return 3;

      case "Confirmed":
        return 2;

      case "Cancelled":
        return 0;

      case "Placed":
      default:
        return 1;
    }
  };

  const currentStep = getStatusStep();

  const steps = [
    {
      label: "Placed",
      icon: <ShoppingBagOutlinedIcon />,
    },
    {
      label: "Confirmed",
      icon: <CheckCircleIcon />,
    },
    {
      label: "Shipped",
      icon: <LocalShippingOutlinedIcon />,
    },
    {
      label: "Delivered",
      icon: <Inventory2OutlinedIcon />,
    },
  ];

  // --------------------------------------------------
  // CANCELLED
  // --------------------------------------------------

  if (safeStatus === "Cancelled") {
    return (
      <Box
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 2,
          backgroundColor: isLuxuryMode
            ? "rgba(201,76,76,0.10)"
            : "#FDEEEE",
          border: isLuxuryMode
            ? "1px solid rgba(201,76,76,0.35)"
            : "1px solid #F5CACA",
          display: "flex",
          alignItems: "center",
          gap: 1.2,
        }}
      >
        <CancelOutlinedIcon
          sx={{
            color: "#C94C4C",
            fontSize: 22,
          }}
        />

        <Box>
          <Typography
            sx={{
              color: "#C94C4C",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            Order Cancelled
          </Typography>

          <Typography
            sx={{
              color: isLuxuryMode ? "#D6A0A0" : "#9A5A5A",
              fontSize: 11,
              mt: 0.3,
            }}
          >
            This order is no longer being processed.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 2,
        px: {
          xs: 0,
          sm: 1,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* BACKGROUND LINE */}

        <Box
          sx={{
            position: "absolute",
            left: "8%",
            right: "8%",
            top: 15,
            height: 2,
            backgroundColor: border,
          }}
        />

        {/* ACTIVE LINE */}

        <Box
          sx={{
            position: "absolute",
            left: "8%",
            width:
              currentStep === 1
                ? "0%"
                : currentStep === 2
                ? "28%"
                : currentStep === 3
                ? "58%"
                : "84%",
            top: 15,
            height: 2,
            backgroundColor: accent,
            transition: "0.3s ease",
          }}
        />

        {/* STEPS */}

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const active = stepNumber <= currentStep;

          return (
            <Box
              key={step.label}
              sx={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "25%",
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: active
                    ? accent
                    : isLuxuryMode
                    ? "#202020"
                    : "#FFFFFF",
                  border: active
                    ? `2px solid ${accent}`
                    : `2px solid ${border}`,
                  color: active
                    ? isLuxuryMode
                      ? "#171717"
                      : "#FFFFFF"
                    : isLuxuryMode
                    ? "#777777"
                    : "#AAAAAA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: active
                    ? isLuxuryMode
                      ? "0 4px 12px rgba(200,169,107,0.18)"
                      : "0 4px 12px rgba(182,30,202,0.18)"
                    : "none",
                }}
              >
                {active ? (
                  <CheckCircleIcon
                    sx={{
                      fontSize: 17,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: isLuxuryMode
                        ? "#555555"
                        : "#D7D7D7",
                    }}
                  />
                )}
              </Box>

              <Typography
                sx={{
                  fontSize: {
                    xs: 9,
                    sm: 10,
                  },
                  fontWeight: active ? 800 : 600,
                  color: active
                    ? primaryText
                    : isLuxuryMode
                    ? "#777777"
                    : "#999999",
                  mt: 0.8,
                  textAlign: "center",
                }}
              >
                {step.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { isLuxuryMode } = useThemeMode();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // --------------------------------------------------
  // DYNAMIC THEME COLORS
  // --------------------------------------------------

  const pageBackground = isLuxuryMode
    ? "#0F0F0F"
    : "#F9F2FA";

  const cardBackground = isLuxuryMode
    ? "#1A1A1A"
    : "#FFFFFF";

  const sectionBackground = isLuxuryMode
    ? "#151515"
    : "#FAF6FB";

  const softBackground = isLuxuryMode
    ? "#202020"
    : "#F8F1FA";

  const imageBackground = isLuxuryMode
    ? "#242424"
    : "#F3E3F6";

  const primaryText = isLuxuryMode
    ? "#FFFFFF"
    : "#171717";

  const secondaryText = isLuxuryMode
    ? "#BDBDBD"
    : "#6B6B6B";

  const mutedText = isLuxuryMode
    ? "#888888"
    : "#777777";

  const accent = isLuxuryMode
    ? "#C8A96B"
    : "#B61ECA";

  const accentHover = isLuxuryMode
    ? "#E0C080"
    : "#9615A8";

  const border = isLuxuryMode
    ? "#333333"
    : "#E8DCEB";

  const softBorder = isLuxuryMode
    ? "#444444"
    : "#D9C7DC";

  // --------------------------------------------------
  // FETCH ORDER
  // --------------------------------------------------

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(response.data?.order || null);
      } catch (error) {
        console.error(
          "Failed to fetch order:",
          error.response?.data || error.message
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }

        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  // --------------------------------------------------
  // CANCEL ORDER
  // --------------------------------------------------

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/orders/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order cancelled successfully!");

      setOrder((prevOrder) => ({
        ...prevOrder,
        orderStatus: "Cancelled",
      }));
    } catch (error) {
      console.error(
        "Failed to cancel order:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to cancel order. Please try again."
      );
    } finally {
      setCancelling(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          backgroundColor: pageBackground,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress
          size={38}
          thickness={4}
          sx={{
            color: accent,
          }}
        />

        <Typography
          sx={{
            color: secondaryText,
            fontSize: 14,
          }}
        >
          Loading order details...
        </Typography>
      </Box>
    );
  }

  // --------------------------------------------------
  // ORDER NOT FOUND
  // --------------------------------------------------

  if (!order) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          backgroundColor: pageBackground,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
          py: 6,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 520,
            backgroundColor: cardBackground,
            border: `1px solid ${border}`,
            borderRadius: 3,
            textAlign: "center",
            px: {
              xs: 3,
              sm: 5,
            },
            py: 6,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: imageBackground,
              color: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <ReceiptLongOutlinedIcon
              sx={{
                fontSize: 40,
              }}
            />
          </Box>

          <Typography
            sx={{
              color: primaryText,
              fontSize: 28,
              fontWeight: 800,
              mb: 1,
            }}
          >
            Order Not Found
          </Typography>

          <Typography
            sx={{
              color: secondaryText,
              fontSize: 14,
              lineHeight: 1.7,
              mb: 3,
            }}
          >
            We couldn't find the order you're looking for.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/orders")}
            sx={{
              backgroundColor: accent,
              color: isLuxuryMode ? "#171717" : "#FFFFFF",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "6px",
              px: 3,
              py: 1.2,
              "&:hover": {
                backgroundColor: accentHover,
                color: isLuxuryMode ? "#171717" : "#FFFFFF",
              },
            }}
          >
            Back to My Orders
          </Button>
        </Box>
      </Box>
    );
  }

  // --------------------------------------------------
  // SAFE VALUES
  // --------------------------------------------------

  const orderId = order?._id || order?.id || "";

  const orderStatus = order?.orderStatus || "Placed";

  const items = Array.isArray(order?.items)
    ? order.items
    : [];

  const shippingAddress =
    order?.shippingAddress || {};

  const subtotal = Number(
    order?.subtotal || 0
  );

  const deliveryCharge = Number(
    order?.deliveryCharge || 0
  );

  const totalAmount = Number(
    order?.totalAmount || 0
  );

  const paymentMethod =
    order?.paymentMethod || "N/A";

  const paymentStatus =
    order?.paymentStatus || "Pending";

  // --------------------------------------------------
  // STATUS STYLE
  // --------------------------------------------------

  const getStatusStyle = () => {
    switch (orderStatus) {
      case "Delivered":
        return {
          color: "#2E7D5B",
          background: isLuxuryMode
            ? "rgba(46,125,91,0.12)"
            : "#EDF7F2",
          border: isLuxuryMode
            ? "rgba(46,125,91,0.35)"
            : "#CBE9DA",
        };

      case "Shipped":
        return {
          color: "#1976D2",
          background: isLuxuryMode
            ? "rgba(25,118,210,0.12)"
            : "#EEF6FF",
          border: isLuxuryMode
            ? "rgba(25,118,210,0.35)"
            : "#CFE5FA",
        };

      case "Confirmed":
        return {
          color: accent,
          background: isLuxuryMode
            ? "rgba(200,169,107,0.10)"
            : "#FAF1FC",
          border: isLuxuryMode
            ? "rgba(200,169,107,0.35)"
            : "#E8C9ED",
        };

      case "Cancelled":
        return {
          color: "#C94C4C",
          background: isLuxuryMode
            ? "rgba(201,76,76,0.10)"
            : "#FDEEEE",
          border: isLuxuryMode
            ? "rgba(201,76,76,0.35)"
            : "#F5CACA",
        };

      default:
        return {
          color: "#D27B00",
          background: isLuxuryMode
            ? "rgba(210,123,0,0.10)"
            : "#FFF6E5",
          border: isLuxuryMode
            ? "rgba(210,123,0,0.35)"
            : "#F3DFB0",
        };
    }
  };

  const statusStyle = getStatusStyle();

  // --------------------------------------------------
  // PAYMENT STATUS STYLE
  // --------------------------------------------------

  const getPaymentStatusStyle = () => {
    if (paymentStatus === "Paid") {
      return {
        color: "#2E7D5B",
        background: isLuxuryMode
          ? "rgba(46,125,91,0.12)"
          : "#EDF7F2",
        border: isLuxuryMode
          ? "rgba(46,125,91,0.35)"
          : "#CBE9DA",
      };
    }

    if (paymentStatus === "Failed") {
      return {
        color: "#C94C4C",
        background: isLuxuryMode
          ? "rgba(201,76,76,0.10)"
          : "#FDEEEE",
        border: isLuxuryMode
          ? "rgba(201,76,76,0.35)"
          : "#F5CACA",
      };
    }

    return {
      color: "#D27B00",
      background: isLuxuryMode
        ? "rgba(210,123,0,0.10)"
        : "#FFF6E5",
      border: isLuxuryMode
        ? "rgba(210,123,0,0.35)"
        : "#F3DFB0",
    };
  };

  const paymentStatusStyle =
    getPaymentStatusStyle();

  // --------------------------------------------------
  // RETURN
  // --------------------------------------------------

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: pageBackground,
        px: {
          xs: 2,
          sm: 3,
          md: 5,
          lg: 7,
        },
        py: {
          xs: 3,
          md: 5,
        },
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
        }}
      >
        {/* ================================================== */}
        {/* TOP HEADER */}
        {/* ================================================== */}

        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
            mb: 4,
          }}
        >
          <Box>
            <Box
              onClick={() => navigate("/orders")}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.7,
                cursor: "pointer",
                color: secondaryText,
                mb: 1.2,
                "&:hover": {
                  color: accent,
                },
              }}
            >
              <ArrowBackIcon
                sx={{
                  fontSize: 18,
                }}
              />

              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Back to My Orders
              </Typography>
            </Box>

            <Typography
              sx={{
                color: accent,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "2px",
                mb: 0.5,
              }}
            >
              ORDER INFORMATION
            </Typography>

            <Typography
              sx={{
                color: primaryText,
                fontSize: {
                  xs: 28,
                  md: 36,
                },
                fontWeight: 800,
              }}
            >
              Order Details
            </Typography>

            <Typography
              sx={{
                color: secondaryText,
                fontSize: 14,
                mt: 0.5,
              }}
            >
              Review your order, payment and delivery details.
            </Typography>
          </Box>

          <Chip
            icon={
              orderStatus === "Cancelled" ? (
                <CancelOutlinedIcon />
              ) : (
                <CheckCircleIcon />
              )
            }
            label={orderStatus}
            sx={{
              color: statusStyle.color,
              backgroundColor: statusStyle.background,
              border: `1px solid ${statusStyle.border}`,
              fontWeight: 800,
              fontSize: 12,
              px: 0.5,
              "& .MuiChip-icon": {
                color: statusStyle.color,
                fontSize: 17,
              },
            }}
          />
        </Box>

        {/* ================================================== */}
        {/* ORDER SUMMARY BANNER */}
        {/* ================================================== */}

        <Box
          sx={{
            backgroundColor: cardBackground,
            border: `1px solid ${border}`,
            borderRadius: 3,
            p: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
            mb: 3,
          }}
        >
          <Grid container spacing={3}>
            <Grid
              size={{
                xs: 12,
                md: 5,
              }}
            >
              <Typography
                sx={{
                  color: isLuxuryMode ? "#888888" : "#888",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "1px",
                  mb: 0.6,
                }}
              >
                ORDER ID
              </Typography>

              <Typography
                sx={{
                  color: primaryText,
                  fontSize: 13,
                  fontWeight: 700,
                  wordBreak: "break-all",
                }}
              >
                {orderId || "Order ID unavailable"}
              </Typography>
            </Grid>

            <Grid
              size={{
                xs: 6,
                md: 3,
              }}
            >
              <Typography
                sx={{
                  color: isLuxuryMode ? "#888888" : "#888",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "1px",
                  mb: 0.6,
                }}
              >
                ORDER DATE
              </Typography>

              <Typography
                sx={{
                  color: primaryText,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {order.createdAt
                  ? new Date(
                      order.createdAt
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Date unavailable"}
              </Typography>
            </Grid>

            <Grid
              size={{
                xs: 6,
                md: 4,
              }}
            >
              <Typography
                sx={{
                  color: isLuxuryMode ? "#888888" : "#888",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "1px",
                  mb: 0.6,
                }}
              >
                PAYMENT
              </Typography>

              <Typography
                sx={{
                  color: primaryText,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {paymentMethod}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* ================================================== */}
        {/* STATUS TRACKING */}
        {/* ================================================== */}

        <Box
          sx={{
            backgroundColor: cardBackground,
            border: `1px solid ${border}`,
            borderRadius: 3,
            p: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                backgroundColor: imageBackground,
                color: accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LocalShippingOutlinedIcon />
            </Box>

            <Box>
              <Typography
                sx={{
                  color: primaryText,
                  fontSize: 14,
                  fontWeight: 800,
                }}
              >
                Order Tracking
              </Typography>

              <Typography
                sx={{
                  color: mutedText,
                  fontSize: 11,
                }}
              >
                Current status: {orderStatus}
              </Typography>
            </Box>
          </Box>

          <StatusTimeline
            status={orderStatus}
            isLuxuryMode={isLuxuryMode}
            accent={accent}
            primaryText={primaryText}
            border={border}
          />
        </Box>

        {/* ================================================== */}
        {/* MAIN CONTENT */}
        {/* ================================================== */}

        <Grid container spacing={3}>
          {/* ================================================= */}
          {/* ORDERED ITEMS */}
          {/* ================================================= */}

          <Grid
            size={{
              xs: 12,
              md: 7,
            }}
          >
            <Box
              sx={{
                backgroundColor: cardBackground,
                border: `1px solid ${border}`,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              {/* HEADER */}

              <Box
                sx={{
                  p: {
                    xs: 2,
                    sm: 2.5,
                  },
                  backgroundColor: sectionBackground,
                  borderBottom: `1px solid ${border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 2,
                    backgroundColor: imageBackground,
                    color: accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShoppingBagOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: primaryText,
                      fontSize: 15,
                      fontWeight: 800,
                    }}
                  >
                    Ordered Items
                  </Typography>

                  <Typography
                    sx={{
                      color: mutedText,
                      fontSize: 11,
                    }}
                  >
                    {items.length}{" "}
                    {items.length === 1
                      ? "item"
                      : "items"}{" "}
                    in this order
                  </Typography>
                </Box>
              </Box>

              {/* ITEMS */}

              <Box
                sx={{
                  p: {
                    xs: 2,
                    sm: 2.5,
                  },
                }}
              >
                {items.length === 0 ? (
                  <Typography
                    sx={{
                      color: mutedText,
                      fontSize: 13,
                      py: 3,
                      textAlign: "center",
                    }}
                  >
                    No item details available.
                  </Typography>
                ) : (
                  items.map((item, index) => {
                    const itemName =
                      item?.name || "Product";

                    const itemImage =
                      item?.image || "";

                    const itemPrice = Number(
                      item?.price || 0
                    );

                    const itemQuantity = Number(
                      item?.quantity || 0
                    );

                    const itemTotal =
                      itemPrice * itemQuantity;

                    const itemId =
                      item?._id ||
                      item?.product ||
                      index;

                    return (
                      <Box
                        key={itemId}
                        sx={{
                          display: "flex",
                          gap: {
                            xs: 1.5,
                            sm: 2,
                          },
                          pb:
                            index ===
                            items.length - 1
                              ? 0
                              : 2.5,
                          mb:
                            index ===
                            items.length - 1
                              ? 0
                              : 2.5,
                          borderBottom:
                            index ===
                            items.length - 1
                              ? "none"
                              : `1px solid ${border}`,
                        }}
                      >
                        {/* IMAGE */}

                        <Box
                          sx={{
                            width: {
                              xs: 90,
                              sm: 110,
                            },
                            height: {
                              xs: 115,
                              sm: 140,
                            },
                            borderRadius: 2,
                            overflow: "hidden",
                            backgroundColor: imageBackground,
                            flexShrink: 0,
                          }}
                        >
                          {itemImage ? (
                            <Box
                              component="img"
                              src={itemImage}
                              alt={itemName}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: accent,
                              }}
                            >
                              <ShoppingBagOutlinedIcon
                                sx={{
                                  fontSize: 36,
                                }}
                              />
                            </Box>
                          )}
                        </Box>

                        {/* DETAILS */}

                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 0,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            sx={{
                              color: accent,
                              fontSize: 10,
                              fontWeight: 800,
                              letterSpacing: "0.7px",
                              mb: 0.5,
                            }}
                          >
                            {item?.brand ||
                              "AJIO STYLE"}
                          </Typography>

                          <Typography
                            sx={{
                              color: primaryText,
                              fontSize: {
                                xs: 14,
                                sm: 16,
                              },
                              fontWeight: 800,
                              lineHeight: 1.4,
                              mb: 1,
                            }}
                          >
                            {itemName}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                              mb: 1.2,
                            }}
                          >
                            <Chip
                              label={`Qty: ${itemQuantity}`}
                              size="small"
                              sx={{
                                height: 25,
                                backgroundColor:
                                  isLuxuryMode
                                    ? "rgba(200,169,107,0.12)"
                                    : "#F8F1FA",
                                color: accent,
                                border: isLuxuryMode
                                  ? "1px solid rgba(200,169,107,0.25)"
                                  : "none",
                                fontSize: 10,
                                fontWeight: 700,
                              }}
                            />

                            <Chip
                              label={`₹${itemPrice.toLocaleString(
                                "en-IN"
                              )} each`}
                              size="small"
                              sx={{
                                height: 25,
                                backgroundColor:
                                  isLuxuryMode
                                    ? "#242424"
                                    : "#F7F7F7",
                                color: secondaryText,
                                border: isLuxuryMode
                                  ? "1px solid #333333"
                                  : "none",
                                fontSize: 10,
                                fontWeight: 700,
                              }}
                            />
                          </Box>

                          <Box
                            sx={{
                              mt: "auto",
                              display: "flex",
                              justifyContent:
                                "space-between",
                              alignItems: "flex-end",
                              gap: 2,
                            }}
                          >
                            <Typography
                              sx={{
                                color: mutedText,
                                fontSize: 11,
                              }}
                            >
                              Item Total
                            </Typography>

                            <Typography
                              sx={{
                                color: primaryText,
                                fontSize: {
                                  xs: 16,
                                  sm: 18,
                                },
                                fontWeight: 800,
                              }}
                            >
                              ₹
                              {itemTotal.toLocaleString(
                                "en-IN"
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })
                )}

                {/* ================================================= */}
                {/* PRICE SUMMARY */}
                {/* ================================================= */}

                <Divider
                  sx={{
                    my: 3,
                    borderColor: border,
                  }}
                />

                <Typography
                  sx={{
                    color: primaryText,
                    fontSize: 14,
                    fontWeight: 800,
                    mb: 2,
                  }}
                >
                  Price Summary
                </Typography>

                {/* SUBTOTAL */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.3,
                  }}
                >
                  <Typography
                    sx={{
                      color: mutedText,
                      fontSize: 13,
                    }}
                  >
                    Subtotal
                  </Typography>

                  <Typography
                    sx={{
                      color: primaryText,
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </Typography>
                </Box>

                {/* DELIVERY */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      color: mutedText,
                      fontSize: 13,
                    }}
                  >
                    Delivery
                  </Typography>

                  <Typography
                    sx={{
                      color:
                        deliveryCharge === 0
                          ? "#2E7D5B"
                          : primaryText,
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {deliveryCharge === 0
                      ? "FREE"
                      : `₹${deliveryCharge.toLocaleString(
                          "en-IN"
                        )}`}
                  </Typography>
                </Box>

                <Divider
                  sx={{
                    mb: 2,
                    borderColor: border,
                  }}
                />

                {/* TOTAL */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: primaryText,
                        fontSize: 17,
                        fontWeight: 800,
                      }}
                    >
                      Order Total
                    </Typography>

                    <Typography
                      sx={{
                        color: mutedText,
                        fontSize: 10,
                        mt: 0.2,
                      }}
                    >
                      Inclusive of applicable charges
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      color: accent,
                      fontSize: 24,
                      fontWeight: 900,
                    }}
                  >
                    ₹
                    {totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* ================================================= */}
          {/* RIGHT SIDE */}
          {/* ================================================= */}

          <Grid
            size={{
              xs: 12,
              md: 5,
            }}
          >
            {/* ================================================= */}
            {/* DELIVERY INFORMATION */}
            {/* ================================================= */}

            <Box
              sx={{
                backgroundColor: cardBackground,
                border: `1px solid ${border}`,
                borderRadius: 3,
                overflow: "hidden",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  p: {
                    xs: 2,
                    sm: 2.5,
                  },
                  backgroundColor: sectionBackground,
                  borderBottom: `1px solid ${border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 2,
                    backgroundColor: imageBackground,
                    color: accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LocationOnOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: primaryText,
                      fontSize: 15,
                      fontWeight: 800,
                    }}
                  >
                    Delivery Information
                  </Typography>

                  <Typography
                    sx={{
                      color: mutedText,
                      fontSize: 11,
                    }}
                  >
                    Shipping address
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  p: {
                    xs: 2,
                    sm: 2.5,
                  },
                }}
              >
                <Typography
                  sx={{
                    color: primaryText,
                    fontSize: 14,
                    fontWeight: 800,
                    mb: 1,
                  }}
                >
                  {shippingAddress.fullName ||
                    "Name unavailable"}
                </Typography>

                {shippingAddress.phone && (
                  <Typography
                    sx={{
                      color: secondaryText,
                      fontSize: 12,
                      mb: 0.7,
                    }}
                  >
                    {shippingAddress.phone}
                  </Typography>
                )}

                {shippingAddress.address && (
                  <Typography
                    sx={{
                      color: secondaryText,
                      fontSize: 12,
                      lineHeight: 1.6,
                      mb: 0.5,
                    }}
                  >
                    {shippingAddress.address}
                  </Typography>
                )}

                {(shippingAddress.city ||
                  shippingAddress.state) && (
                  <Typography
                    sx={{
                      color: secondaryText,
                      fontSize: 12,
                      lineHeight: 1.6,
                      mb: 0.5,
                    }}
                  >
                    {shippingAddress.city || ""}
                    {shippingAddress.city &&
                    shippingAddress.state
                      ? ", "
                      : ""}
                    {shippingAddress.state || ""}
                  </Typography>
                )}

                {shippingAddress.pincode && (
                  <Typography
                    sx={{
                      color: secondaryText,
                      fontSize: 12,
                    }}
                  >
                    Pincode:{" "}
                    {shippingAddress.pincode}
                  </Typography>
                )}

                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: softBackground,
                    border: isLuxuryMode
                      ? "1px solid #333333"
                      : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <LocalShippingOutlinedIcon
                    sx={{
                      color: accent,
                      fontSize: 19,
                    }}
                  />

                  <Typography
                    sx={{
                      color: isLuxuryMode
                        ? "#CFCFCF"
                        : "#6B4A70",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Your order will be delivered to this address.
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* ================================================= */}
            {/* PAYMENT INFORMATION */}
            {/* ================================================= */}

            <Box
              sx={{
                backgroundColor: cardBackground,
                border: `1px solid ${border}`,
                borderRadius: 3,
                overflow: "hidden",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  p: {
                    xs: 2,
                    sm: 2.5,
                  },
                  backgroundColor: sectionBackground,
                  borderBottom: `1px solid ${border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 2,
                    backgroundColor: imageBackground,
                    color: accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CreditCardOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: primaryText,
                      fontSize: 15,
                      fontWeight: 800,
                    }}
                  >
                    Payment Information
                  </Typography>

                  <Typography
                    sx={{
                      color: mutedText,
                      fontSize: 11,
                    }}
                  >
                    Payment details
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  p: {
                    xs: 2,
                    sm: 2.5,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: mutedText,
                      fontSize: 12,
                    }}
                  >
                    Payment Method
                  </Typography>

                  <Typography
                    sx={{
                      color: primaryText,
                      fontSize: 13,
                      fontWeight: 800,
                    }}
                  >
                    {paymentMethod}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: mutedText,
                      fontSize: 12,
                    }}
                  >
                    Payment Status
                  </Typography>

                  <Chip
                    label={paymentStatus}
                    size="small"
                    sx={{
                      color: paymentStatusStyle.color,
                      backgroundColor:
                        paymentStatusStyle.background,
                      border: `1px solid ${paymentStatusStyle.border}`,
                      fontSize: 10,
                      fontWeight: 800,
                      height: 26,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: softBackground,
                    border: isLuxuryMode
                      ? "1px solid #333333"
                      : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <SecurityOutlinedIcon
                    sx={{
                      color: accent,
                      fontSize: 18,
                    }}
                  />

                  <Typography
                    sx={{
                      color: isLuxuryMode
                        ? "#CFCFCF"
                        : "#6B4A70",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Your payment information is securely processed.
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* ================================================= */}
            {/* CANCEL ORDER */}
            {/* ================================================= */}

            {(orderStatus === "Placed" ||
              orderStatus === "Confirmed") && (
              <Box
                sx={{
                  backgroundColor: cardBackground,
                  border: "1px solid #F5CACA",
                  borderRadius: 3,
                  p: {
                    xs: 2,
                    sm: 2.5,
                  },
                  mb: 3,
                }}
              >
                <Typography
                  sx={{
                    color: primaryText,
                    fontSize: 13,
                    fontWeight: 800,
                    mb: 0.5,
                  }}
                >
                  Need to cancel?
                </Typography>

                <Typography
                  sx={{
                    color: mutedText,
                    fontSize: 11,
                    lineHeight: 1.6,
                    mb: 1.5,
                  }}
                >
                  You can cancel this order while it is still being processed.
                </Typography>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  startIcon={<CancelOutlinedIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 800,
                    borderColor: "#C94C4C",
                    color: "#C94C4C",
                    borderRadius: "6px",
                    py: 1,
                    "&:hover": {
                      borderColor: "#B71C1C",
                      color: "#B71C1C",
                      backgroundColor: isLuxuryMode
                        ? "rgba(201,76,76,0.08)"
                        : "#FFF5F5",
                    },
                  }}
                >
                  {cancelling
                    ? "Cancelling..."
                    : "Cancel Order"}
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* ================================================== */}
        {/* BOTTOM ACTIONS */}
        {/* ================================================== */}

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/orders")}
            sx={{
              borderColor: accent,
              color: accent,
              textTransform: "none",
              fontWeight: 800,
              borderRadius: "6px",
              px: 2.5,
              py: 1.1,
              "&:hover": {
                borderColor: accentHover,
                color: accentHover,
                backgroundColor: isLuxuryMode
                  ? "rgba(200,169,107,0.08)"
                  : "#FAF1FC",
              },
            }}
          >
            Back to My Orders
          </Button>

          <Button
            variant="contained"
            startIcon={<ShoppingBagOutlinedIcon />}
            onClick={() => navigate("/products")}
            sx={{
              backgroundColor: accent,
              color: isLuxuryMode
                ? "#171717"
                : "#FFFFFF",
              textTransform: "none",
              fontWeight: 800,
              borderRadius: "6px",
              px: 2.5,
              py: 1.1,
              "&:hover": {
                backgroundColor: accentHover,
                color: isLuxuryMode
                  ? "#171717"
                  : "#FFFFFF",
              },
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderDetails;