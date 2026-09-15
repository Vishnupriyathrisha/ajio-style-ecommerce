import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
} from "@mui/material";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

        setOrders(response.data.orders || []);
      } catch (error) {
        console.error(
          "Failed to fetch orders:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

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
          Loading orders...
        </Typography>
      </Box>
    );
  }

  if (orders.length === 0) {
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
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          My Orders
        </Typography>

        <Typography color="text.secondary">
          You haven't placed any orders yet.
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
        My Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid
            key={order._id}
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Card
  elevation={0}
  onClick={() => navigate(`/orders/${order._id}`)}
  sx={{
    border: "1px solid #e0e0e0",
    borderRadius: 0,
    cursor: "pointer",
    transition: "0.3s",
    "&:hover": {
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    },
  }}
>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Order ID
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        wordBreak: "break-all",
                      }}
                    >
                      {order._id}
                    </Typography>
                  </Box>

                  <Chip
                    label={order.orderStatus}
                    size="small"
                  />
                </Box>

                <Divider sx={{ mb: 2 }} />

                {order.items.map((item) => (
                  <Box
                    key={item._id || item.product}
                    sx={{
                      display: "flex",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{
                        width: 80,
                        height: 100,
                        objectFit: "cover",
                      }}
                    />

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          mb: 0.5,
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        Quantity: {item.quantity}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        ₹
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
                    mb: 1,
                  }}
                >
                  <Typography color="text.secondary">
                    Payment
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
                    {order.totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Orders;