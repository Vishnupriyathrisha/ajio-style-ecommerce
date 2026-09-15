import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { useCart } from "../context/CartContext";
import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";

const Checkout = () => {
  const navigate = useNavigate();

const { cartItems, cartTotal, clearCart,} = useCart();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
  if (!address.fullName.trim()) {
    alert("Please enter your full name");
    return false;
  }

  if (!/^[6-9]\d{9}$/.test(address.phone)) {
    alert("Please enter a valid 10-digit phone number");
    return false;
  }

  if (!address.address.trim()) {
    alert("Please enter your address");
    return false;
  }

  if (!address.city.trim()) {
    alert("Please enter your city");
    return false;
  }

  if (!address.state.trim()) {
    alert("Please enter your state");
    return false;
  }

  if (!/^\d{6}$/.test(address.pincode)) {
    alert("Please enter a valid 6-digit pincode");
    return false;
  }

  return true;
};

const handlePlaceOrder = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    console.log("Selected Payment Method:", paymentMethod);
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const orderItems = cartItems.map((item) => ({
      product: item._id || item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    }));

    const orderData = {
      items: orderItems,
      shippingAddress: address,
      paymentMethod:
        paymentMethod === "cod" ? "COD" : "ONLINE",
      subtotal: cartTotal,
      deliveryCharge: 0,
      totalAmount: cartTotal,
    };

    // COD
    if (paymentMethod === "cod") {
      await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order placed successfully!");
      clearCart();
      navigate("/orders");
      return;
    }

    // ONLINE PAYMENT
    const response = await axios.post(
      "http://localhost:5000/api/payment/create-order",
      {
        amount: cartTotal,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const razorpayOrder = response.data.order;

const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  amount: razorpayOrder.amount,
  currency: razorpayOrder.currency,
  name: "AJIO Style",
  description: "Fashion Order",
  order_id: razorpayOrder.id,

  handler: async function (paymentResponse) {
  try {
    const token = localStorage.getItem("token");

    const verifyResponse = await axios.post(
      "http://localhost:5000/api/payment/verify-payment",
      {
        razorpay_order_id:
          paymentResponse.razorpay_order_id,

        razorpay_payment_id:
          paymentResponse.razorpay_payment_id,

        razorpay_signature:
          paymentResponse.razorpay_signature,

        orderData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (verifyResponse.data.success) {
      alert("Payment successful! Order placed successfully.");

      clearCart();

      navigate("/orders");
    }
  } catch (error) {
    console.error(
      "Payment verification failed:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
        "Payment verification failed. Please contact support."
    );
  }
},

  prefill: {
    name: address.fullName,
    contact: address.phone,
  },

  theme: {
    color: "#111111",
  },
};

const razorpay = new window.Razorpay(options);

razorpay.open();

  } catch (error) {
    console.error(
      "Failed to place order:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
        "Failed to place order. Please try again."
    );
  } finally {
    setLoading(false);
  }
};
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
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Your Bag is Empty
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
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Checkout
      </Typography>

      <Grid container spacing={4}>
        {/* Delivery Address */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              p: { xs: 2, md: 3 },
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 3 }}
            >
              Delivery Address
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomInput
                  label="Full Name"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleChange}
                  required
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={address.phone}
                  onChange={handleChange}
                  required
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <CustomInput
                  label="Address"
                  name="address"
                  value={address.address}
                  onChange={handleChange}
                  placeholder="House / Flat / Street"
                  required
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomInput
                  label="City"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  required
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomInput
                  label="State"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  required
                  error={!!errors.state}
                  helperText={errors.state}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomInput
                  label="Pincode"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  required
                  error={!!errors.pincode}
                  helperText={errors.pincode}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Payment Method */}
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              p: { xs: 2, md: 3 },
              mt: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Payment Method
            </Typography>

            <FormControl>
              <RadioGroup
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
              >
                <FormControlLabel
                  value="cod"
                  control={<Radio />}
                  label="Cash on Delivery"
                />

                <FormControlLabel
                  value="online"
                  control={<Radio />}
                  label="Online Payment"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid size={{ xs: 12, md: 5 }}>
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
              sx={{ fontWeight: 700, mb: 3 }}
            >
              Order Summary
            </Typography>

            {cartItems.map((item) => (
              <Box
                key={item.id}
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
                    width: 70,
                    height: 90,
                    objectFit: "cover",
                  }}
                />

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700 }}
                  >
                    {item.brand}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {item.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Qty: {item.quantity}
                  </Typography>

                  <Typography sx={{ fontWeight: 600, mt: 0.5 }}>
                    ₹
                    {(item.price * item.quantity).toLocaleString(
                      "en-IN"
                    )}
                  </Typography>
                </Box>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

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
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Total
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ₹{cartTotal.toLocaleString("en-IN")}
              </Typography>
            </Box>

            <CustomButton onClick={handlePlaceOrder}>
              Place Order
            </CustomButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Checkout;