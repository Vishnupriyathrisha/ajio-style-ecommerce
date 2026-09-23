import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCard";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useThemeMode } from "../context/ThemeContext";

const Orders = () => {
  const navigate = useNavigate();

  const { isLuxuryMode } = useThemeMode();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // THEME COLORS
  // --------------------------------------------------

  const pageBackground = isLuxuryMode ? "#0F0F0F" : "#F9F2FA";
  const cardBackground = isLuxuryMode ? "#1A1A1A" : "#FFFFFF";
  const sectionBackground = isLuxuryMode ? "#151515" : "#FAF6FB";
  const softBackground = isLuxuryMode ? "#202020" : "#F3E3F6";

  const primaryText = isLuxuryMode ? "#FFFFFF" : "#171717";
  const secondaryText = isLuxuryMode ? "#BDBDBD" : "#6B6B6B";

  const accent = isLuxuryMode ? "#C8A96B" : "#B61ECA";
  const accentHover = isLuxuryMode ? "#E0C080" : "#9615A8";

  const border = isLuxuryMode ? "#333333" : "#E8DCEB";
  const softBorder = isLuxuryMode ? "#444444" : "#D9C7DC";

  // --------------------------------------------------
  // FETCH ORDERS
  // --------------------------------------------------

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedOrders = response.data?.orders || [];

        setOrders(
          Array.isArray(fetchedOrders) ? fetchedOrders : []
        );
      } catch (error) {
        console.error(
          "Failed to fetch orders:",
          error.response?.data || error.message
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }

        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // --------------------------------------------------
  // STATUS HELPERS
  // --------------------------------------------------

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return {
          color: "#2E7D5B",
          background: "#EDF7F2",
          border: "#CBE9DA",
        };

      case "Shipped":
        return {
          color: "#1976D2",
          background: "#EEF6FF",
          border: "#CFE5FA",
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
          background: "#FDEEEE",
          border: "#F5CACA",
        };

      case "Placed":
      default:
        return {
          color: "#D27B00",
          background: "#FFF6E5",
          border: "#F3DFB0",
        };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircleIcon />;

      case "Shipped":
        return <LocalShippingOutlinedIcon />;

      case "Confirmed":
        return <Inventory2OutlinedIcon />;

      case "Cancelled":
        return <AccessTimeOutlinedIcon />;

      case "Placed":
      default:
        return <AccessTimeOutlinedIcon />;
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
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

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // STATUS TIMELINE
  // --------------------------------------------------

  const StatusTimeline = ({ status }) => {
    const safeStatus = status || "Placed";

    const currentStep = getStatusStep(safeStatus);

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
    // CANCELLED TIMELINE
    // --------------------------------------------------

    if (safeStatus === "Cancelled") {
      return (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: "#FDEEEE",
            border: "1px solid #F5CACA",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AccessTimeOutlinedIcon
            sx={{
              color: "#C94C4C",
              fontSize: 20,
            }}
          />

          <Typography
            sx={{
              color: "#C94C4C",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            This order has been cancelled
          </Typography>
        </Box>
      );
    }

    // --------------------------------------------------
    // NORMAL TIMELINE
    // --------------------------------------------------

    return (
      <Box
        sx={{
          mt: 2.5,
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
              backgroundColor: softBorder,
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

            const active =
              stepNumber <= currentStep;

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
                {/* CIRCLE */}

                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: active
                      ? accent
                      : cardBackground,
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

                {/* LABEL */}

                <Typography
                  sx={{
                    fontSize: {
                      xs: 9,
                      sm: 10,
                    },
                    fontWeight: active
                      ? 800
                      : 600,
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
          size={36}
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
          Loading your orders...
        </Typography>
      </Box>
    );
  }

  // --------------------------------------------------
  // EMPTY ORDERS
  // --------------------------------------------------

  if (orders.length === 0) {
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
            maxWidth: 540,
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
              width: 86,
              height: 86,
              borderRadius: "50%",
              backgroundColor: softBackground,
              color: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <ShoppingBagOutlinedIcon
              sx={{
                fontSize: 42,
              }}
            />
          </Box>

          <Typography
            sx={{
              color: accent,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "2px",
              mb: 0.7,
            }}
          >
            YOUR COLLECTION
          </Typography>

          <Typography
            sx={{
              color: primaryText,
              fontSize: {
                xs: 27,
                sm: 32,
              },
              fontWeight: 800,
              mb: 1,
            }}
          >
            My Orders
          </Typography>

          <Typography
            sx={{
              color: secondaryText,
              fontSize: 14,
              lineHeight: 1.7,
              mb: 3,
            }}
          >
            You haven't placed any orders yet.
            Start exploring our latest styles and
            discover something you love.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/products")}
            sx={{
              backgroundColor: accent,
              color: isLuxuryMode
                ? "#171717"
                : "#FFFFFF",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "6px",
              px: 3,
              py: 1.2,
              "&:hover": {
                backgroundColor: accentHover,
                color: isLuxuryMode
                  ? "#171717"
                  : "#FFFFFF",
              },
            }}
          >
            Start Shopping
          </Button>
        </Box>
      </Box>
    );
  }

  // --------------------------------------------------
  // ORDERS PAGE
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
        {/* ------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------ */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            gap: 2,
            flexWrap: "wrap",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: accent,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "2px",
                mb: 0.5,
              }}
            >
              YOUR SHOPPING JOURNEY
            </Typography>

            <Typography
              sx={{
                color: primaryText,
                fontSize: {
                  xs: 29,
                  md: 36,
                },
                fontWeight: 800,
              }}
            >
              My Orders
            </Typography>

            <Typography
              sx={{
                color: secondaryText,
                fontSize: 14,
                mt: 0.5,
              }}
            >
              Track and manage all your orders in one place.
            </Typography>
          </Box>

          <Box
            onClick={() => navigate("/products")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              cursor: "pointer",
              color: secondaryText,
              "&:hover": {
                color: accent,
              },
            }}
          >
            <ArrowBackIcon
              sx={{
                fontSize: 19,
              }}
            />

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Continue Shopping
            </Typography>
          </Box>
        </Box>

        {/* ------------------------------------------ */}
        {/* ORDER COUNT BANNER */}
        {/* ------------------------------------------ */}

        <Box
          sx={{
            backgroundColor: cardBackground,
            border: `1px solid ${border}`,
            borderRadius: 3,
            px: {
              xs: 2,
              sm: 3,
            },
            py: 2,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              backgroundColor: softBackground,
              color: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReceiptLongOutlinedIcon />
          </Box>

          <Box>
            <Typography
              sx={{
                color: primaryText,
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              {orders.length}{" "}
              {orders.length === 1
                ? "Order"
                : "Orders"}
            </Typography>

            <Typography
              sx={{
                color: secondaryText,
                fontSize: 11,
              }}
            >
              Your complete order history
            </Typography>
          </Box>
        </Box>

        {/* ------------------------------------------ */}
        {/* ORDER CARDS */}
        {/* ------------------------------------------ */}

        <Grid container spacing={3}>
          {orders.map((order) => {
            const orderId =
              order?._id || order?.id || "";

            const orderStatus =
              order?.orderStatus || "Placed";

            const statusStyle =
              getStatusColor(orderStatus);

            const items = Array.isArray(order?.items)
              ? order.items
              : [];

            const visibleItems =
              items.slice(0, 2);

            const extraItems = Math.max(
              items.length - 2,
              0
            );

            const totalAmount = Number(
              order?.totalAmount || 0
            );

            return (
              <Grid
                key={orderId}
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: cardBackground,
                    border: `1px solid ${border}`,
                    borderRadius: 3,
                    overflow: "hidden",
                    transition:
                      "transform 0.25s ease, box-shadow 0.25s ease",
                    "@media (hover: hover)": {
                      "&:hover": {
                        transform:
                          "translateY(-5px)",
                        boxShadow: isLuxuryMode
                          ? "0 14px 35px rgba(0,0,0,0.35)"
                          : "0 14px 35px rgba(182,30,202,0.10)",
                      },
                    },
                  }}
                >
                  {/* -------------------------------- */}
                  {/* ORDER CARD HEADER */}
                  {/* -------------------------------- */}

                  <Box
                    sx={{
                      p: {
                        xs: 2,
                        sm: 2.5,
                      },
                      backgroundColor:
                        sectionBackground,
                      borderBottom:
                        `1px solid ${border}`,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            color: isLuxuryMode
                              ? "#888888"
                              : "#888888",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing:
                              "0.8px",
                            mb: 0.4,
                          }}
                        >
                          ORDER ID
                        </Typography>

                        <Typography
                          sx={{
                            color: primaryText,
                            fontSize: 12,
                            fontWeight: 700,
                            wordBreak:
                              "break-all",
                          }}
                        >
                          {orderId ||
                            "Order ID unavailable"}
                        </Typography>

                        <Typography
                          sx={{
                            color: secondaryText,
                            fontSize: 10,
                            mt: 0.7,
                          }}
                        >
                          Ordered on{" "}
                          {formatDate(
                            order?.createdAt ||
                              order?.updatedAt
                          )}
                        </Typography>
                      </Box>

                      <Chip
                        icon={getStatusIcon(
                          orderStatus
                        )}
                        label={orderStatus}
                        size="small"
                        sx={{
                          flexShrink: 0,
                          color:
                            statusStyle.color,
                          backgroundColor:
                            statusStyle.background,
                          border: `1px solid ${statusStyle.border}`,
                          fontWeight: 800,
                          fontSize: 10,
                          "& .MuiChip-icon": {
                            color:
                              statusStyle.color,
                            fontSize: 16,
                          },
                        }}
                      />
                    </Box>
                  </Box>

                  {/* -------------------------------- */}
                  {/* ORDER ITEMS */}
                  {/* -------------------------------- */}

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
                        fontSize: 13,
                        fontWeight: 800,
                        mb: 1.5,
                      }}
                    >
                      Ordered Items
                    </Typography>

                    {visibleItems.length === 0 ? (
                      <Typography
                        sx={{
                          color: secondaryText,
                          fontSize: 12,
                          py: 2,
                        }}
                      >
                        No item details available.
                      </Typography>
                    ) : (
                      visibleItems.map(
                        (item, index) => {
                          const itemId =
                            item?._id ||
                            item?.product ||
                            index;

                          const itemName =
                            item?.name ||
                            "Product";

                          const itemImage =
                            item?.image || "";

                          const itemPrice =
                            Number(
                              item?.price || 0
                            );

                          const itemQuantity =
                            Number(
                              item?.quantity || 0
                            );

                          const itemTotal =
                            itemPrice *
                            itemQuantity;

                          return (
                            <Box
                              key={itemId}
                              sx={{
                                display: "flex",
                                gap: 1.5,
                                mb: 1.8,
                              }}
                            >
                              {/* IMAGE */}

                              <Box
                                sx={{
                                  width: 76,
                                  height: 96,
                                  borderRadius: 1.5,
                                  overflow:
                                    "hidden",
                                  backgroundColor:
                                    softBackground,
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
                                      objectFit:
                                        "cover",
                                      display:
                                        "block",
                                    }}
                                  />
                                ) : (
                                  <Box
                                    sx={{
                                      width:
                                        "100%",
                                      height:
                                        "100%",
                                      display:
                                        "flex",
                                      alignItems:
                                        "center",
                                      justifyContent:
                                        "center",
                                      color:
                                        accent,
                                    }}
                                  >
                                    <ShoppingBagOutlinedIcon />
                                  </Box>
                                )}
                              </Box>

                              {/* DETAILS */}

                              <Box
                                sx={{
                                  flex: 1,
                                  minWidth: 0,
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: accent,
                                    fontSize: 10,
                                    fontWeight: 800,
                                    letterSpacing:
                                      "0.5px",
                                    mb: 0.4,
                                  }}
                                >
                                  {item?.brand ||
                                    "STYLE"}
                                </Typography>

                                <Typography
                                  sx={{
                                    color:
                                      primaryText,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    lineHeight:
                                      1.4,
                                    display:
                                      "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient:
                                      "vertical",
                                    overflow:
                                      "hidden",
                                  }}
                                >
                                  {itemName}
                                </Typography>

                                <Typography
                                  sx={{
                                    color:
                                      secondaryText,
                                    fontSize: 11,
                                    mt: 0.6,
                                  }}
                                >
                                  Quantity:{" "}
                                  {itemQuantity}
                                </Typography>

                                <Typography
                                  sx={{
                                    color:
                                      primaryText,
                                    fontSize: 14,
                                    fontWeight: 800,
                                    mt: 0.7,
                                  }}
                                >
                                  ₹
                                  {itemTotal.toLocaleString(
                                    "en-IN"
                                  )}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        }
                      )
                    )}

                    {/* MORE ITEMS */}

                    {extraItems > 0 && (
                      <Box
                        sx={{
                          display:
                            "inline-flex",
                          alignItems:
                            "center",
                          backgroundColor:
                            isLuxuryMode
                              ? "rgba(200,169,107,0.10)"
                              : "#F8F1FA",
                          color: accent,
                          borderRadius: 5,
                          px: 1.3,
                          py: 0.5,
                          mb: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 10,
                            fontWeight: 800,
                          }}
                        >
                          +{extraItems} more{" "}
                          {extraItems === 1
                            ? "item"
                            : "items"}
                        </Typography>
                      </Box>
                    )}

                    <Divider
                      sx={{
                        my: 2,
                        borderColor: border,
                      }}
                    />

                    {/* -------------------------------- */}
                    {/* PAYMENT + TOTAL */}
                    {/* -------------------------------- */}

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "1fr 1fr",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      {/* PAYMENT */}

                      <Box>
                        <Box
                          sx={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 0.7,
                            mb: 0.5,
                          }}
                        >
                          <CreditCardOutlinedIcon
                            sx={{
                              fontSize: 16,
                              color: accent,
                            }}
                          />

                          <Typography
                            sx={{
                              color: "#888888",
                              fontSize: 10,
                              fontWeight: 700,
                            }}
                          >
                            PAYMENT
                          </Typography>
                        </Box>

                        <Typography
                          sx={{
                            color: primaryText,
                            fontSize: 13,
                            fontWeight: 800,
                          }}
                        >
                          {order?.paymentMethod ||
                            "N/A"}
                        </Typography>

                        {order?.paymentStatus && (
                          <Typography
                            sx={{
                              color:
                                order.paymentStatus ===
                                "Paid"
                                  ? "#2E7D5B"
                                  : secondaryText,
                              fontSize: 10,
                              fontWeight: 700,
                              mt: 0.2,
                            }}
                          >
                            {order.paymentStatus}
                          </Typography>
                        )}
                      </Box>

                      {/* TOTAL */}

                      <Box
                        sx={{
                          textAlign: "right",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#888888",
                            fontSize: 10,
                            fontWeight: 700,
                            mb: 0.5,
                          }}
                        >
                          ORDER TOTAL
                        </Typography>

                        <Typography
                          sx={{
                            color: accent,
                            fontSize: 20,
                            fontWeight: 800,
                          }}
                        >
                          ₹
                          {totalAmount.toLocaleString(
                            "en-IN"
                          )}
                        </Typography>
                      </Box>
                    </Box>

                    {/* -------------------------------- */}
                    {/* STATUS TIMELINE */}
                    {/* -------------------------------- */}

                    <StatusTimeline
                      status={orderStatus}
                    />

                    {/* -------------------------------- */}
                    {/* VIEW ORDER BUTTON */}
                    {/* -------------------------------- */}

                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => {
                        if (orderId) {
                          navigate(
                            `/orders/${orderId}`
                          );
                        }
                      }}
                      endIcon={
                        <ArrowForwardIcon />
                      }
                      disabled={!orderId}
                      sx={{
                        mt: 2.5,
                        borderColor: accent,
                        color: accent,
                        textTransform:
                          "none",
                        fontWeight: 800,
                        borderRadius: "6px",
                        py: 1.1,
                        "&:hover": {
                          borderColor:
                            accentHover,
                          color: accentHover,
                          backgroundColor:
                            isLuxuryMode
                              ? "rgba(200,169,107,0.08)"
                              : "#FAF1FC",
                        },
                      }}
                    >
                      View Order Details
                    </Button>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default Orders;