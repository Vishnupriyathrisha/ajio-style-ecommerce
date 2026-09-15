import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Chip,
} from "@mui/material";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
const [cancelling, setCancelling] = useState(false);

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

        setOrder(response.data.order);
      } catch (error) {
        console.error(
          "Failed to fetch order:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography color="text.secondary">
          Loading order details...
        </Typography>
      </Box>
    );
  }

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

    alert(
      error.response?.data?.message ||
        "Failed to cancel order. Please try again."
    );
  } finally {
    setCancelling(false);
  }
};

  if (!order) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Order Not Found
        </Typography>

        <Typography
          color="text.secondary"
          onClick={() => navigate("/orders")}
          sx={{
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Back to My Orders
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        minHeight: "100vh",
        px: { xs: 2, md: 6 },
        py: 5,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 4,
        }}
      >
        Order Details
      </Typography>

      {/* Order Header */}
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          p: { xs: 2, md: 3 },
          mb: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              Order ID
            </Typography>

            <Typography
              sx={{
                fontWeight: 700,
                wordBreak: "break-all",
              }}
            >
              {order._id}
            </Typography>
          </Grid>

          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              alignItems: "center",
            }}
          >
            <Chip
              label={order.orderStatus}
              sx={{
                fontWeight: 600,
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Products */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              p: { xs: 2, md: 3 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
              }}
            >
              Ordered Items
            </Typography>

            {order.items.map((item) => (
              <Box
                key={item._id || item.product}
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{
                    width: 100,
                    height: 120,
                    objectFit: "cover",
                  }}
                />

                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Quantity: {item.quantity}
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    ₹
                    {item.price.toLocaleString("en-IN")}
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      mt: 0.5,
                    }}
                  >
                    Item Total: ₹
                    {(
                      item.price * item.quantity
                    ).toLocaleString("en-IN")}
                  </Typography>
                </Box>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Typography color="text.secondary">
                Subtotal
              </Typography>

              <Typography sx={{ fontWeight: 600 }}>
                ₹
                {order.subtotal.toLocaleString("en-IN")}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Typography color="text.secondary">
                Delivery
              </Typography>

              <Typography sx={{ fontWeight: 600 }}>
                {order.deliveryCharge === 0
                  ? "FREE"
                  : `₹${order.deliveryCharge.toLocaleString(
                      "en-IN"
                    )}`}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                Total
              </Typography>

              <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                ₹
                {order.totalAmount.toLocaleString("en-IN")}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Order Information */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              p: { xs: 2, md: 3 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
              }}
            >
              Delivery Information
            </Typography>

            <Typography sx={{ fontWeight: 700, mb: 1 }}>
              {order.shippingAddress.fullName}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              {order.shippingAddress.phone}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              {order.shippingAddress.address}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.state}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Pincode: {order.shippingAddress.pincode}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Payment Information
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Typography color="text.secondary">
                Method
              </Typography>

              <Typography sx={{ fontWeight: 600 }}>
                {order.paymentMethod}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography color="text.secondary">
                Status
              </Typography>

              <Typography sx={{ fontWeight: 600 }}>
                {order.paymentStatus}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

{(order.orderStatus === "Placed" ||
  order.orderStatus === "Confirmed") && (
  <Box sx={{ mt: 3 }}>
    <Button
      variant="outlined"
      onClick={handleCancelOrder}
      disabled={cancelling}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        borderColor: "#d32f2f",
        color: "#d32f2f",
        "&:hover": {
          borderColor: "#b71c1c",
          backgroundColor: "#fff5f5",
        },
      }}
    >
      {cancelling ? "Cancelling..." : "Cancel Order"}
    </Button>
  </Box>
)}

      {/* Back Button */}
      <Box
        sx={{
          mt: 3,
          cursor: "pointer",
          display: "inline-block",
        }}
        onClick={() => navigate("/orders")}
      >
        <Typography
          sx={{
            fontWeight: 600,
            textDecoration: "underline",
          }}
        >
          ← Back to My Orders
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderDetails;