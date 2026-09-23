import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import InputAdornment from "@mui/material/InputAdornment";

import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

import { useCart } from "../context/CartContext";
import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import api from "../services/api";
import { useThemeMode } from "../context/ThemeContext";

const Checkout = () => {
  const navigate = useNavigate();

  const { isLuxuryMode } = useThemeMode();

  const pageBackground = isLuxuryMode ? "#0F0F0F" : "#F9F2FA";
  const cardBackground = isLuxuryMode ? "#1A1A1A" : "#FFFFFF";
  const sectionBackground = isLuxuryMode ? "#151515" : "#FAF6FB";
  const softBackground = isLuxuryMode ? "#202020" : "#F8F2FA";
  const selectedBackground = isLuxuryMode
    ? "rgba(200,169,107,0.10)"
    : "#FAF1FC";
  const imageBackground = isLuxuryMode ? "#242424" : "#F3E3F6";
  const securityBackground = isLuxuryMode ? "#202020" : "#F8F8F8";
  const primaryText = isLuxuryMode ? "#FFFFFF" : "#171717";
  const secondaryText = isLuxuryMode ? "#BDBDBD" : "#6B6B6B";
  const mutedText = isLuxuryMode ? "#999999" : "#777777";
  const accent = isLuxuryMode ? "#C8A96B" : "#B61ECA";
  const accentHover = isLuxuryMode ? "#E0C080" : "#9615A8";
  const border = isLuxuryMode ? "#333333" : "#E8DCEB";

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [addressType, setAddressType] = useState("home");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const [errors, setErrors] = useState({});

  // --------------------------------------------------
  // LOAD SAVED PROFILE ADDRESS
  // --------------------------------------------------

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setProfileLoading(false);
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/profile");

        const profile = response.data;

        setAddress({
          fullName: profile.name || "",
          phone: profile.phone || "",
          address: profile.address || "",
          city: profile.city || "",
          state: profile.state || "",
          pincode: profile.pincode || "",
        });
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error.response?.data || error.message
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  // --------------------------------------------------
  // ADDRESS CHANGE
  // --------------------------------------------------

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

  // --------------------------------------------------
  // DELIVERY ESTIMATE
  // --------------------------------------------------

  const deliveryEstimate = useMemo(() => {
    if (address.pincode.length === 6) {
      return "Expected delivery in 3–5 business days";
    }

    return "Enter your pincode to see delivery estimate";
  }, [address.pincode]);

  // --------------------------------------------------
  // COUPON
  // --------------------------------------------------

  const handleApplyCoupon = () => {
    const code = couponCode.trim();

    if (!code) {
      setCouponMessage("Please enter a coupon code.");
      setCouponApplied(false);
      return;
    }

    setCouponApplied(true);

    setCouponMessage(
      "Coupon code added. Final discount will be validated during order placement."
    );
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponApplied(false);
    setCouponMessage("");
  };

  // --------------------------------------------------
  // DISCOUNT
  // --------------------------------------------------

  const discountAmount = 0;

  const finalTotal = Math.max(
    cartTotal - discountAmount,
    0
  );

  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------

  const validateForm = () => {
    const newErrors = {};

    if (!address.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!/^[6-9]\d{9}$/.test(address.phone)) {
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

    if (!/^\d{6}$/.test(address.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --------------------------------------------------
  // PLACE ORDER
  // --------------------------------------------------

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const orderItems = cartItems.map((item) => ({
        product: item._id || item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const orderData = {
        items: orderItems,

        shippingAddress: {
          ...address,
        },

        paymentMethod:
          paymentMethod === "cod"
            ? "COD"
            : "ONLINE",

        subtotal: cartTotal,

        deliveryCharge: 0,

        totalAmount: finalTotal,

        ...(couponCode.trim()
          ? {
              couponCode: couponCode.trim(),
            }
          : {}),
      };

      // ------------------------------------------------
      // CASH ON DELIVERY
      // ------------------------------------------------

      if (paymentMethod === "cod") {
        await api.post("/orders", orderData);

        alert("Order placed successfully!");

        clearCart();

        navigate("/orders");

        return;
      }

      // ------------------------------------------------
      // RAZORPAY ONLINE PAYMENT
      // ------------------------------------------------

      const response = await api.post(
        "/payment/create-order",
        {
          amount: finalTotal,
        }
      );

      const razorpayOrder = response.data.order;

      if (!window.Razorpay) {
        alert(
          "Razorpay is not loaded. Please refresh the page and try again."
        );

        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "AJIO Style",

        description: "Fashion Order",

        order_id: razorpayOrder.id,

        handler: async function (paymentResponse) {
          try {
            const verifyResponse = await api.post(
              "/payment/verify-payment",
              {
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature,

                orderData,
              }
            );

            if (verifyResponse.data.success) {
              alert(
                "Payment successful! Order placed successfully."
              );

              clearCart();

              navigate("/orders");
            }
          } catch (error) {
            console.error(
              "Payment verification failed:",
              error.response?.data || error.message
            );

            if (error.response?.status === 401) {
              localStorage.removeItem("token");
              navigate("/login");
              return;
            }

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

        notes: {
          addressType,
        },

        theme: {
          color: accent,
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error(
        "Failed to place order:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");

        alert("Your session has expired. Please login again.");

        navigate("/login");

        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // EMPTY CART
  // --------------------------------------------------

  if (cartItems.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          backgroundColor: pageBackground,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
            px: { xs: 3, md: 5 },
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
            <ShoppingBagOutlinedIcon sx={{ fontSize: 38 }} />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: primaryText,
              mb: 1.5,
            }}
          >
            Your Bag is Empty
          </Typography>

          <Typography
            sx={{
              color: secondaryText,
              fontSize: 14,
              lineHeight: 1.7,
              mb: 3.5,
            }}
          >
            Add some products to your bag before proceeding
            to checkout.
          </Typography>

          <CustomButton
            fullWidth={false}
            onClick={() => navigate("/products")}
            sx={{
              backgroundColor: accent,
              color: isLuxuryMode ? "#171717" : "#FFFFFF",
              "&:hover": {
                backgroundColor: accentHover,
              },
            }}
          >
            Continue Shopping
          </CustomButton>
        </Box>
      </Box>
    );
  }

  // --------------------------------------------------
  // MAIN CHECKOUT
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
        {/* HEADER */}

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
              SECURE CHECKOUT
            </Typography>

            <Typography
              variant="h4"
              sx={{
                color: primaryText,
                fontWeight: 800,
                fontSize: {
                  xs: 28,
                  md: 36,
                },
              }}
            >
              Complete Your Order
            </Typography>

            <Typography
              sx={{
                color: secondaryText,
                fontSize: 14,
                mt: 0.5,
              }}
            >
              Review your details and place your order.
            </Typography>
          </Box>

          <Box
            onClick={() => navigate("/cart")}
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
            <ArrowBackIcon sx={{ fontSize: 19 }} />

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Edit Bag
            </Typography>
          </Box>
        </Box>

        {/* CHECKOUT PROGRESS */}

        <Box
          sx={{
            backgroundColor: cardBackground,
            border: `1px solid ${border}`,
            borderRadius: 3,
            p: {
              xs: 2,
              sm: 3,
            },
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: "8%",
                right: "8%",
                top: 18,
                height: 2,
                backgroundColor: border,
              }}
            />

            {[
              {
                number: "1",
                title: "Bag Review",
              },
              {
                number: "2",
                title: "Delivery",
              },
              {
                number: "3",
                title: "Payment",
              },
            ].map((step) => (
              <Box
                key={step.number}
                sx={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.7,
                  minWidth: 80,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: accent,
                    color: isLuxuryMode ? "#171717" : "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 800,
                    boxShadow: isLuxuryMode
                      ? "0 4px 12px rgba(200,169,107,0.18)"
                      : "0 4px 12px rgba(182,30,202,0.25)",
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 20 }} />
                </Box>

                <Typography
                  sx={{
                    fontSize: {
                      xs: 10,
                      sm: 12,
                    },
                    fontWeight: 700,
                    color: primaryText,
                  }}
                >
                  {step.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* DELIVERY + SUMMARY */}

        <Grid container spacing={3}>
          {/* LEFT */}

          <Grid size={{ xs: 12, md: 7 }}>
            {/* SAVED ADDRESS */}

            <Paper
              elevation={0}
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
                  px: {
                    xs: 2,
                    sm: 3,
                  },
                  py: 2.2,
                  backgroundColor: sectionBackground,
                  borderBottom: `1px solid ${border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: primaryText,
                      fontWeight: 800,
                      fontSize: 17,
                    }}
                  >
                    Delivery Address
                  </Typography>

                  <Typography
                    sx={{
                      color: mutedText,
                      fontSize: 12,
                      mt: 0.3,
                    }}
                  >
                    Where should we deliver your order?
                  </Typography>
                </Box>

                <LocationOnOutlinedIcon
                  sx={{
                    color: accent,
                    fontSize: 25,
                  }}
                />
              </Box>

              <Box
                sx={{
                  p: {
                    xs: 2,
                    sm: 3,
                  },
                }}
              >
                {profileLoading && (
                  <LinearProgress
                    sx={{
                      mb: 2,
                      borderRadius: 5,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: accent,
                      },
                    }}
                  />
                )}

                {/* ADDRESS TYPE */}

                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: primaryText,
                    mb: 1.2,
                  }}
                >
                  Address Type
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr 1fr",
                      sm: "repeat(3, 1fr)",
                    },
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  {/* HOME */}

                  <Box
                    onClick={() =>
                      setAddressType("home")
                    }
                    sx={{
                      border:
                        addressType === "home"
                          ? `2px solid ${accent}`
                          : `1px solid ${border}`,
                      backgroundColor:
                        addressType === "home"
                          ? selectedBackground
                          : cardBackground,
                      borderRadius: 2,
                      p: 1.5,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <HomeOutlinedIcon
                      sx={{
                        color: accent,
                        fontSize: 22,
                      }}
                    />

                    <Box>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 800,
                        }}
                      >
                        Home
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 10,
                          color: mutedText,
                        }}
                      >
                        Personal
                      </Typography>
                    </Box>
                  </Box>

                  {/* WORK */}

                  <Box
                    onClick={() =>
                      setAddressType("work")
                    }
                    sx={{
                      border:
                        addressType === "work"
                          ? `2px solid ${accent}`
                          : `1px solid ${border}`,
                      backgroundColor:
                        addressType === "work"
                          ? selectedBackground
                          : cardBackground,
                      borderRadius: 2,
                      p: 1.5,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <WorkOutlineOutlinedIcon
                      sx={{
                        color: accent,
                        fontSize: 22,
                      }}
                    />

                    <Box>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 800,
                        }}
                      >
                        Work
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 10,
                          color: mutedText,
                        }}
                      >
                        Office
                      </Typography>
                    </Box>
                  </Box>

                  {/* OTHER */}

                  <Box
                    onClick={() =>
                      setAddressType("other")
                    }
                    sx={{
                      border:
                        addressType === "other"
                          ? `2px solid ${accent}`
                          : `1px solid ${border}`,
                      backgroundColor:
                        addressType === "other"
                          ? selectedBackground
                          : cardBackground,
                      borderRadius: 2,
                      p: 1.5,
                      cursor: "pointer",
                      display: {
                        xs: "none",
                        sm: "flex",
                      },
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <LocationOnOutlinedIcon
                      sx={{
                        color: accent,
                        fontSize: 22,
                      }}
                    />

                    <Box>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 800,
                        }}
                      >
                        Other
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 10,
                          color: mutedText,
                        }}
                      >
                        Other place
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* ADDRESS FORM */}

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
                      label="House / Flat / Street"
                      name="address"
                      value={address.address}
                      onChange={handleChange}
                      placeholder="Enter your complete address"
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

                {/* DELIVERY ESTIMATE */}

                <Box
                  sx={{
                    mt: 2.5,
                    p: 1.8,
                    borderRadius: 2,
                    backgroundColor: softBackground,
                    border: `1px solid ${border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                  }}
                >
                  <LocalShippingOutlinedIcon
                    sx={{
                      color: accent,
                      fontSize: 22,
                    }}
                  />

                  <Box>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: primaryText,
                      }}
                    >
                      Delivery Estimate
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 12,
                        color: secondaryText,
                        mt: 0.2,
                      }}
                    >
                      {deliveryEstimate}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* PAYMENT METHOD */}

            <Paper
              elevation={0}
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
                  px: {
                    xs: 2,
                    sm: 3,
                  },
                  py: 2.2,
                  backgroundColor: sectionBackground,
                  borderBottom: `1px solid ${border}`,
                }}
              >
                <Typography
                  sx={{
                    color: primaryText,
                    fontWeight: 800,
                    fontSize: 17,
                  }}
                >
                  Payment Method
                </Typography>

                <Typography
                  sx={{
                    color: mutedText,
                    fontSize: 12,
                    mt: 0.3,
                  }}
                >
                  Choose how you want to pay.
                </Typography>
              </Box>

              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <FormControl fullWidth>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                  >
                    {/* COD */}

                    <Box
                      sx={{
                        border:
                          paymentMethod === "cod"
                            ? `2px solid ${accent}`
                            : `1px solid ${border}`,
                        backgroundColor:
                          paymentMethod === "cod"
                            ? selectedBackground
                            : cardBackground,
                        borderRadius: 2,
                        mb: 1.5,
                        transition: "0.2s ease",
                      }}
                    >
                      <FormControlLabel
                        value="cod"
                        control={
                          <Radio
                            sx={{
                              color: accent,
                              "&.Mui-checked": {
                                color: accent,
                              },
                            }}
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <AccountBalanceWalletOutlinedIcon
                              sx={{
                                color: accent,
                              }}
                            />

                            <Box>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  fontWeight: 800,
                                  color: primaryText,
                                }}
                              >
                                Cash on Delivery
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 11,
                                  color: mutedText,
                                }}
                              >
                                Pay when your order arrives
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{
                          width: "100%",
                          m: 0,
                          px: 1,
                          py: 1,
                        }}
                      />
                    </Box>

                    {/* ONLINE */}

                    <Box
                      sx={{
                        border:
                          paymentMethod === "online"
                            ? `2px solid ${accent}`
                            : `1px solid ${border}`,
                        backgroundColor:
                          paymentMethod === "online"
                            ? selectedBackground
                            : cardBackground,
                        borderRadius: 2,
                        transition: "0.2s ease",
                      }}
                    >
                      <FormControlLabel
                        value="online"
                        control={
                          <Radio
                            sx={{
                              color: accent,
                              "&.Mui-checked": {
                                color: accent,
                              },
                            }}
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <CreditCardOutlinedIcon
                              sx={{
                                color: accent,
                              }}
                            />

                            <Box>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  fontWeight: 800,
                                  color: primaryText,
                                }}
                              >
                                Online Payment
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 11,
                                  color: mutedText,
                                }}
                              >
                                UPI, Cards, Net Banking & Wallets
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{
                          width: "100%",
                          m: 0,
                          px: 1,
                          py: 1,
                        }}
                      />
                    </Box>
                  </RadioGroup>
                </FormControl>

                {/* PAYMENT SECURITY */}

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "#2E7D5B",
                  }}
                >
                  <SecurityOutlinedIcon
                    sx={{ fontSize: 19 }}
                  />

                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    Secure & encrypted payment
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* SUPPORT */}

            <Box
              sx={{
                backgroundColor: cardBackground,
                border: `1px solid ${border}`,
                borderRadius: 3,
                p: {
                  xs: 2,
                  sm: 2.5,
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    backgroundColor: imageBackground,
                    color: accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SupportAgentOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: primaryText,
                    }}
                  >
                    Need help?
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 11,
                      color: mutedText,
                    }}
                  >
                    Our support team is here for you.
                  </Typography>
                </Box>
              </Box>

              <CustomButton
                variant="outlined"
                fullWidth={false}
                onClick={() => navigate("/support")}
                sx={{
                  color: accent,
                  borderColor: accent,
                  "&:hover": {
                    borderColor: accentHover,
                    color: accentHover,
                    backgroundColor: "transparent",
                  },
                }}
              >
                Contact Support
              </CustomButton>
            </Box>
          </Grid>

          {/* RIGHT */}

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                position: {
                  md: "sticky",
                },
                top: {
                  md: 20,
                },
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: cardBackground,
                  border: `1px solid ${border}`,
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                {/* SUMMARY HEADER */}

                <Box
                  sx={{
                    px: 3,
                    py: 2.2,
                    backgroundColor: sectionBackground,
                    borderBottom: `1px solid ${border}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: primaryText,
                    }}
                  >
                    Order Summary
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 11,
                      color: mutedText,
                      mt: 0.3,
                    }}
                  >
                    {cartItems.length}{" "}
                    {cartItems.length === 1
                      ? "item"
                      : "items"}{" "}
                    ready to order
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* ORDER ITEMS */}

                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: primaryText,
                      mb: 1.5,
                    }}
                  >
                    Your Items
                  </Typography>

                  <Box
                    sx={{
                      maxHeight: 320,
                      overflowY: "auto",
                      pr: 0.5,
                    }}
                  >
                    {cartItems.map((item) => {
                      const productId =
                        item._id || item.id;

                      return (
                        <Box
                          key={productId}
                          sx={{
                            display: "flex",
                            gap: 1.5,
                            mb: 2,
                          }}
                        >
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{
                              width: 68,
                              height: 85,
                              borderRadius: 1.5,
                              objectFit: "cover",
                              backgroundColor: imageBackground,
                              flexShrink: 0,
                            }}
                          />

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
                                mb: 0.3,
                              }}
                            >
                              {item.brand}
                            </Typography>

                            <Typography
                              sx={{
                                color: primaryText,
                                fontSize: 13,
                                fontWeight: 700,
                                lineHeight: 1.4,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {item.name}
                            </Typography>

                            <Typography
                              sx={{
                                color: mutedText,
                                fontSize: 11,
                                mt: 0.5,
                              }}
                            >
                              Qty: {item.quantity}
                            </Typography>

                            <Typography
                              sx={{
                                color: primaryText,
                                fontSize: 14,
                                fontWeight: 800,
                                mt: 0.5,
                              }}
                            >
                              ₹
                              {(
                                item.price *
                                item.quantity
                              ).toLocaleString("en-IN")}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>

                  <Divider
                    sx={{
                      my: 2.5,
                      borderColor: border,
                    }}
                  />

                  {/* COUPON */}

                  <Box
                    sx={{
                      backgroundColor: sectionBackground,
                      border: `1px solid ${border}`,
                      borderRadius: 2,
                      p: 1.5,
                      mb: 2.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                        mb: 1.2,
                      }}
                    >
                      <LocalOfferOutlinedIcon
                        sx={{
                          fontSize: 19,
                          color: accent,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: primaryText,
                        }}
                      >
                        Have a coupon?
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <CustomInput
                        label=""
                        name="couponCode"
                        value={couponCode}
                        onChange={(event) =>
                          setCouponCode(
                            event.target.value
                          )
                        }
                        placeholder="Enter coupon code"
                        slotProps={{
                          input: {
                            endAdornment:
                              couponApplied ? (
                                <InputAdornment position="end">
                                  <CheckCircleIcon
                                    sx={{
                                      color: "#2E7D5B",
                                      fontSize: 19,
                                    }}
                                  />
                                </InputAdornment>
                              ) : null,
                          },
                        }}
                      />

                      {!couponApplied ? (
                        <CustomButton
                          fullWidth={false}
                          variant="outlined"
                          onClick={handleApplyCoupon}
                          sx={{
                            color: accent,
                            borderColor: accent,
                            "&:hover": {
                              borderColor: accentHover,
                              color: accentHover,
                            },
                          }}
                        >
                          Apply
                        </CustomButton>
                      ) : (
                        <CustomButton
                          fullWidth={false}
                          variant="outlined"
                          onClick={handleRemoveCoupon}
                          sx={{
                            color: accent,
                            borderColor: accent,
                            "&:hover": {
                              borderColor: accentHover,
                              color: accentHover,
                            },
                          }}
                        >
                          Remove
                        </CustomButton>
                      )}
                    </Box>

                    {couponMessage && (
                      <Typography
                        sx={{
                          fontSize: 10,
                          color: couponApplied
                            ? "#2E7D5B"
                            : "#C94C4C",
                          mt: 1,
                          lineHeight: 1.5,
                        }}
                      >
                        {couponMessage}
                      </Typography>
                    )}
                  </Box>

                  {/* PRICE BREAKDOWN */}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1.7,
                    }}
                  >
                    <Typography
                      sx={{
                        color: secondaryText,
                        fontSize: 13,
                      }}
                    >
                      Bag Total
                    </Typography>

                    <Typography
                      sx={{
                        color: primaryText,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      ₹
                      {cartTotal.toLocaleString("en-IN")}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1.7,
                    }}
                  >
                    <Typography
                      sx={{
                        color: secondaryText,
                        fontSize: 13,
                      }}
                    >
                      Discount
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          discountAmount > 0
                            ? "#2E7D5B"
                            : mutedText,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {discountAmount > 0
                        ? `-₹${discountAmount.toLocaleString(
                            "en-IN"
                          )}`
                        : "₹0"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1.7,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.7,
                      }}
                    >
                      <LocalShippingOutlinedIcon
                        sx={{
                          fontSize: 18,
                          color: accent,
                        }}
                      />

                      <Typography
                        sx={{
                          color: secondaryText,
                          fontSize: 13,
                        }}
                      >
                        Delivery
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        color: "#2E7D5B",
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      FREE
                    </Typography>
                  </Box>

                  <Divider
                    sx={{
                      my: 2.2,
                      borderColor: border,
                    }}
                  />

                  {/* TOTAL */}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2.5,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 17,
                          fontWeight: 800,
                          color: primaryText,
                        }}
                      >
                        Total
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 10,
                          color: mutedText,
                          mt: 0.3,
                        }}
                      >
                        Inclusive of all taxes
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: accent,
                      }}
                    >
                      ₹
                      {finalTotal.toLocaleString("en-IN")}
                    </Typography>
                  </Box>

                  {/* PLACE ORDER */}

                  <CustomButton
                    onClick={handlePlaceOrder}
                    disabled={loading || profileLoading}
                    sx={{
                      backgroundColor: accent,
                      color: isLuxuryMode ? "#171717" : "#FFFFFF",
                      "&:hover": {
                        backgroundColor: accentHover,
                      },
                    }}
                  >
                    {loading
                      ? "Processing..."
                      : paymentMethod === "online"
                      ? "Proceed to Secure Payment"
                      : "Place Order"}
                  </CustomButton>

                  {/* SECURITY */}

                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: securityBackground,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <SecurityOutlinedIcon
                      sx={{
                        fontSize: 18,
                        color: "#2E7D5B",
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 10,
                        color: mutedText,
                        lineHeight: 1.5,
                      }}
                    >
                      Your payment and personal
                      information are protected with
                      secure encryption.
                    </Typography>
                  </Box>

                  {/* EDIT BAG */}

                  <Box
                    onClick={() => navigate("/cart")}
                    sx={{
                      mt: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 0.7,
                      cursor: "pointer",
                      color: mutedText,
                      "&:hover": {
                        color: accent,
                      },
                    }}
                  >
                    <EditOutlinedIcon
                      sx={{ fontSize: 16 }}
                    />

                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Edit your bag
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* PAYMENT METHODS */}

              <Box
                sx={{
                  mt: 2,
                  backgroundColor: cardBackground,
                  border: `1px solid ${border}`,
                  borderRadius: 3,
                  p: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: primaryText,
                    mb: 1.5,
                  }}
                >
                  We accept
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    icon={<PaymentsOutlinedIcon />}
                    label="UPI"
                    size="small"
                    variant="outlined"
                  />

                  <Chip
                    icon={<CreditCardOutlinedIcon />}
                    label="Cards"
                    size="small"
                    variant="outlined"
                  />

                  <Chip
                    icon={
                      <AccountBalanceWalletOutlinedIcon />
                    }
                    label="Wallets"
                    size="small"
                    variant="outlined"
                  />

                  <Chip
                    label="Net Banking"
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Checkout;
