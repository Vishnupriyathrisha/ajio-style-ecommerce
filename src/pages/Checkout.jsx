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

import { useCart } from "../context/CartContext";
import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";

const Checkout = () => {
  const navigate = useNavigate();

  const { cartItems, cartTotal } = useCart();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

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

  const handlePlaceOrder = () => {
    const newErrors = {};

    if (!address.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!address.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(address.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!address.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!address.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!address.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!address.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(address.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    console.log("Address:", address);
    console.log("Payment Method:", paymentMethod);

    // Payment/order API will be connected in the next step.
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