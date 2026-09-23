import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import api from "../services/api";
import { useThemeMode } from "../context/ThemeContext";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { isLuxuryMode } = useThemeMode();

  // =========================
  // THEME COLORS
  // =========================

  const pageBackground = isLuxuryMode ? "#0F0F0F" : "#F9F2FA";
  const cardBackground = isLuxuryMode ? "#1A1A1A" : "#FFFFFF";
  const itemBackground = isLuxuryMode ? "#242424" : "#FAFAFA";

  const primaryText = isLuxuryMode ? "#FFFFFF" : "#171717";
  const secondaryText = isLuxuryMode ? "#BDBDBD" : "#6B6B6B";

  const accent = isLuxuryMode ? "#C8A96B" : "#B61ECA";
  const accentHover = isLuxuryMode ? "#E0C080" : "#9615A8";

  const border = isLuxuryMode ? "#333333" : "#E8DCEB";

  const cardShadow = isLuxuryMode
    ? "0 8px 25px rgba(0, 0, 0, 0.30)"
    : "0 4px 15px rgba(0, 0, 0, 0.06)";

  // =========================
  // FETCH SELLER ORDERS
  // =========================

  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        const sellerToken = localStorage.getItem("sellerToken");

        if (!sellerToken) {
          navigate("/seller/login");
          return;
        }

        const response = await api.get("/seller/orders", {
          headers: {
            Authorization: `Bearer ${sellerToken}`,
          },
        });

        setOrders(response.data.orders || []);
      } catch (error) {
        console.error(
          "GET SELLER ORDERS ERROR:",
          error
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("sellerToken");
          localStorage.removeItem("seller");

          navigate("/seller/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load seller orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSellerOrders();
  }, [navigate]);

  // =========================
  // STATUS COLOR
  // =========================

  const getStatusColor = (status) => {
    switch (status) {
      case "Placed":
        return "info";

      case "Confirmed":
        return isLuxuryMode
          ? "default"
          : "primary";

      case "Shipped":
        return "warning";

      case "Delivered":
        return "success";

      case "Cancelled":
        return "error";

      default:
        return "default";
    }
  };

  // =========================
  // STATUS UPDATE
  // =========================

  const handleStatusUpdate = async (
    orderId,
    newStatus
  ) => {
    try {
      const sellerToken =
        localStorage.getItem("sellerToken");

      if (!sellerToken) {
        navigate("/seller/login");
        return;
      }

      await api.put(
        `/seller/orders/${orderId}/status`,
        {
          orderStatus: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${sellerToken}`,
          },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: newStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        "UPDATE SELLER ORDER STATUS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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

  // =========================
  // UI
  // =========================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: pageBackground,
        p: { xs: 2, md: 4 },
        transition: "background-color 0.3s ease",
      }}
    >
      {/* =========================
          PAGE HEADER
      ========================= */}

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: primaryText,
          mb: 1,
        }}
      >
        Seller Orders
      </Typography>

      <Typography
        sx={{
          color: secondaryText,
          mb: 3,
        }}
      >
        View and manage orders containing your products
      </Typography>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* =========================
          NO ORDERS
      ========================= */}

      {orders.length === 0 ? (
        <Card
          sx={{
            borderRadius: 3,
            backgroundColor: cardBackground,
            border: `1px solid ${border}`,
            boxShadow: cardShadow,
            color: primaryText,
          }}
        >
          <CardContent
            sx={{
              textAlign: "center",
              py: 6,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1,
                color: primaryText,
              }}
            >
              No Orders Found
            </Typography>

            <Typography
              sx={{
                color: secondaryText,
              }}
            >
              Orders containing your products will
              appear here.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2,
          }}
        >
          {orders.map((order) => (
            <Card
              key={order._id}
              sx={{
                borderRadius: 3,
                backgroundColor: cardBackground,
                border: `1px solid ${border}`,
                boxShadow: cardShadow,
                transition:
                  "background-color 0.3s ease, border-color 0.3s ease",
              }}
            >
              <CardContent>
                {/* =========================
                    ORDER HEADER
                ========================= */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: primaryText,
                      }}
                    >
                      Order #{order._id.slice(-8)}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: secondaryText,
                      }}
                    >
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {/* =========================
                      ORDER STATUS
                  ========================= */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      label={order.orderStatus}
                      color={getStatusColor(
                        order.orderStatus
                      )}
                      sx={{
                        fontWeight: 600,

                        ...(isLuxuryMode &&
                          order.orderStatus ===
                            "Confirmed" && {
                            backgroundColor:
                              "rgba(200, 169, 107, 0.15)",
                            color: accent,
                            border: `1px solid ${accent}`,
                          }),
                      }}
                    />

                    <FormControl
                      size="small"
                      sx={{
                        minWidth: 160,

                        "& .MuiInputLabel-root": {
                          color: secondaryText,
                        },

                        "& .MuiInputLabel-root.Mui-focused": {
                          color: accent,
                        },

                        "& .MuiOutlinedInput-root": {
                          color: primaryText,

                          "& fieldset": {
                            borderColor: border,
                          },

                          "&:hover fieldset": {
                            borderColor: accent,
                          },

                          "&.Mui-focused fieldset": {
                            borderColor: accent,
                          },
                        },

                        "& .MuiSvgIcon-root": {
                          color: secondaryText,
                        },
                      }}
                    >
                      <InputLabel>
                        Status
                      </InputLabel>

                      <Select
                        value={order.orderStatus}
                        label="Status"
                        onChange={(event) =>
                          handleStatusUpdate(
                            order._id,
                            event.target.value
                          )
                        }
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              backgroundColor:
                                cardBackground,
                              color: primaryText,
                              border: `1px solid ${border}`,

                              "& .MuiMenuItem-root:hover":
                                {
                                  backgroundColor:
                                    isLuxuryMode
                                      ? "rgba(200, 169, 107, 0.10)"
                                      : "rgba(182, 30, 202, 0.06)",
                                },

                              "& .Mui-selected": {
                                backgroundColor:
                                  isLuxuryMode
                                    ? "rgba(200, 169, 107, 0.14) !important"
                                    : "rgba(182, 30, 202, 0.08) !important",
                                color: accent,
                              },
                            },
                          },
                        }}
                      >
                        <MenuItem value="Placed">
                          Placed
                        </MenuItem>

                        <MenuItem value="Confirmed">
                          Confirmed
                        </MenuItem>

                        <MenuItem value="Shipped">
                          Shipped
                        </MenuItem>

                        <MenuItem value="Delivered">
                          Delivered
                        </MenuItem>

                        <MenuItem value="Cancelled">
                          Cancelled
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <Divider
                  sx={{
                    mb: 2,
                    borderColor: border,
                  }}
                />

                {/* =========================
                    CUSTOMER
                ========================= */}

                <Typography
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    color: primaryText,
                  }}
                >
                  Customer
                </Typography>

                <Typography
                  sx={{
                    color: secondaryText,
                    mb: 2,
                  }}
                >
                  {order.user?.name || "Customer"}

                  {order.user?.email
                    ? ` • ${order.user.email}`
                    : ""}
                </Typography>

                {/* =========================
                    PRODUCTS
                ========================= */}

                <Typography
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: primaryText,
                  }}
                >
                  Products
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gap: 1.5,
                  }}
                >
                  {order.items?.map(
                    (item, index) => (
                      <Box
                        key={`${order._id}-${index}`}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor:
                            itemBackground,
                          border: `1px solid ${border}`,

                          "@media (max-width:600px)":
                            {
                              alignItems: "flex-start",
                            },
                        }}
                      >
                        {/* Product Image */}

                        {item.product?.image && (
                          <Box
                            component="img"
                            src={item.product.image}
                            alt={item.name}
                            sx={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 2,
                              flexShrink: 0,
                            }}
                          />
                        )}

                        {/* Product Details */}

                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: primaryText,
                              wordBreak: "break-word",
                            }}
                          >
                            {item.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: secondaryText,
                            }}
                          >
                            Quantity: {item.quantity}
                          </Typography>
                        </Box>

                        {/* Product Price */}

                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: primaryText,
                            whiteSpace: "nowrap",
                          }}
                        >
                          ₹{item.price}
                        </Typography>
                      </Box>
                    )
                  )}
                </Box>

                <Divider
                  sx={{
                    my: 2,
                    borderColor: border,
                  }}
                />

                {/* =========================
                    PAYMENT + TOTAL
                ========================= */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: secondaryText,
                      }}
                    >
                      Payment:{" "}
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 700,
                          color: primaryText,
                        }}
                      >
                        {order.paymentMethod}
                      </Box>
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: secondaryText,
                      }}
                    >
                      Payment Status:{" "}
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 700,
                          color: primaryText,
                        }}
                      >
                        {order.paymentStatus}
                      </Box>
                    </Typography>
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: accent,
                    }}
                  >
                    Total: ₹{order.totalAmount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SellerOrders;