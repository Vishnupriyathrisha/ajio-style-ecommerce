import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "../components/common/CustomButton";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  if (cartItems.length === 0) {
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
          sx={{ fontWeight: 700, mb: 2 }}
        >
          Your Bag is Empty
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Add some products to your bag and they will appear here.
        </Typography>

        <CustomButton
          fullWidth={false}
          onClick={() => navigate("/products")}
        >
          Continue Shopping
        </CustomButton>
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
        My Bag
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid size={{ xs: 12, md: 8 }}>
          {cartItems.map((item) => (
            <Box key={item.id} sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  alignItems: "center",
                }}
              >
                {/* Product Image */}
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{
                    width: { xs: 110, sm: 150 },
                    height: { xs: 140, sm: 190 },
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />

                {/* Product Details */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: "#555",
                      mb: 0.5,
                    }}
                  >
                    {item.brand}
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    ₹{item.price.toLocaleString("en-IN")}
                  </Typography>

                  {/* Quantity */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #ddd",
                      width: "fit-content",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity === 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>

                    <Typography
                      sx={{
                        px: 2,
                        fontWeight: 600,
                      }}
                    >
                      {item.quantity}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {/* Remove */}
                <IconButton
                  onClick={() => removeFromCart(item.id)}
                  sx={{
                    alignSelf: "flex-start",
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <Divider sx={{ mt: 3 }} />
            </Box>
          ))}
        </Grid>

        {/* Order Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              p: 3,
              position: "sticky",
              top: 20,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
              }}
            >
              Order Summary
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography color="text.secondary">
                Subtotal
              </Typography>

              <Typography sx={{ fontWeight: 600 }}>
                ₹{cartTotal.toLocaleString("en-IN")}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography color="text.secondary">
                Delivery
              </Typography>

              <Typography sx={{ fontWeight: 600 }}>
                FREE
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 3,
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
                ₹{cartTotal.toLocaleString("en-IN")}
              </Typography>
            </Box>

            <CustomButton onClick={() => navigate("/checkout")}>
                Proceed to Checkout
             </CustomButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Cart;