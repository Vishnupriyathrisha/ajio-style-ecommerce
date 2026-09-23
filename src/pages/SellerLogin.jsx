import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import api from "../services/api";
import { useThemeMode } from "../context/ThemeContext";

const SellerLogin = () => {
  const navigate = useNavigate();

  const { isLuxuryMode } = useThemeMode();

  // =========================
  // THEME COLORS
  // =========================

  const pageBackground = isLuxuryMode ? "#0F0F0F" : "#F9F2FA";
  const cardBackground = isLuxuryMode ? "#1A1A1A" : "#FFFFFF";

  const primaryText = isLuxuryMode ? "#FFFFFF" : "#171717";
  const secondaryText = isLuxuryMode ? "#BDBDBD" : "#6B6B6B";

  const accent = isLuxuryMode ? "#C8A96B" : "#B61ECA";
  const accentHover = isLuxuryMode ? "#E0C080" : "#9615A8";

  const border = isLuxuryMode ? "#333333" : "#E8DCEB";

  const boxShadow = isLuxuryMode
    ? "0 12px 35px rgba(0, 0, 0, 0.40)"
    : "0 12px 35px rgba(182, 30, 202, 0.10)";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  // =========================
  // HANDLE INPUT CHANGES
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE SELLER LOGIN
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setAlert({
      type: "",
      message: "",
    });

    // Basic validation
    if (!formData.email.trim() || !formData.password.trim()) {
      setAlert({
        type: "error",
        message: "Please enter email and password.",
      });
      return;
    }

    try {
      setLoading(true);

      // Remove old seller session
      localStorage.removeItem("sellerToken");
      localStorage.removeItem("seller");

      const response = await api.post("/seller/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log("SELLER LOGIN RESPONSE:", response.data);

      if (!response.data.success || !response.data.token) {
        setAlert({
          type: "error",
          message:
            response.data.message || "Seller login failed.",
        });
        return;
      }

      // Save seller information
      localStorage.setItem(
        "seller",
        JSON.stringify(response.data.seller)
      );

      // Save seller JWT token
      localStorage.setItem(
        "sellerToken",
        response.data.token
      );

      // Verify saved token
      console.log(
        "NEW SELLER TOKEN SAVED:",
        localStorage.getItem("sellerToken")
      );

      console.log(
        "SELLER DETAILS SAVED:",
        localStorage.getItem("seller")
      );

      setAlert({
        type: "success",
        message: "Seller login successful!",
      });

      // Navigate to seller dashboard
      setTimeout(() => {
        navigate("/seller/dashboard", {
          replace: true,
        });
      }, 800);
    } catch (error) {
      console.error("SELLER LOGIN ERROR:", error);

      setAlert({
        type: "error",
        message:
          error.response?.data?.message ||
          "Login failed. Please check your email and password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 76px)",
        backgroundColor: pageBackground,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        py: 5,
        transition: "background-color 0.3s ease",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 450,
          backgroundColor: cardBackground,
          border: `1px solid ${border}`,
          borderRadius: "12px",
          boxShadow,
          p: {
            xs: 3,
            sm: 5,
          },
          transition:
            "background-color 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* Heading */}

        <Box
          sx={{
            textAlign: "center",
            mb: 4,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 27,
                sm: 32,
              },
              fontWeight: 800,
              color: primaryText,
              mb: 1,
            }}
          >
            Seller Login
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: secondaryText,
            }}
          >
            Login to manage your store and products.
          </Typography>
        </Box>

        {/* Alert */}

        {alert.message && (
          <Alert
            severity={alert.type}
            sx={{
              mb: 3,
              borderRadius: "8px",
            }}
          >
            {alert.message}
          </Alert>
        )}

        {/* Login Form */}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Email */}

          <CustomInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter seller email"
            required
          />

          {/* Password */}

          <CustomInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />

          {/* Login Button */}

          <Box sx={{ mt: 1 }}>
            <CustomButton
              type="submit"
              disabled={loading}
              sx={{
                backgroundColor: accent,
                color: isLuxuryMode
                  ? "#171717"
                  : "#FFFFFF",

                "&:hover": {
                  backgroundColor: accentHover,
                },
              }}
            >
              {loading
                ? "Logging in..."
                : "Login as Seller"}
            </CustomButton>
          </Box>

          {/* Register Link */}

          <Typography
            sx={{
              textAlign: "center",
              color: secondaryText,
              fontSize: 14,
              mt: 1,
            }}
          >
            Don't have a seller account?{" "}
            <Link
              to="/seller/register"
              style={{
                color: accent,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Register
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SellerLogin;