import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import api from "../services/api";
import { useThemeMode } from "../context/ThemeContext";

const SellerRegister = () => {
  const navigate = useNavigate();

  const { isLuxuryMode } = useThemeMode();

  // =========================
  // THEME COLORS
  // =========================

  const pageBackground = isLuxuryMode
    ? "#0F0F0F"
    : "#F9F2FA";

  const cardBackground = isLuxuryMode
    ? "#1A1A1A"
    : "#FFFFFF";

  const primaryText = isLuxuryMode
    ? "#FFFFFF"
    : "#171717";

  const secondaryText = isLuxuryMode
    ? "#BDBDBD"
    : "#6B6B6B";

  const accent = isLuxuryMode
    ? "#C8A96B"
    : "#B61ECA";

  const accentHover = isLuxuryMode
    ? "#E0C080"
    : "#9615A8";

  const border = isLuxuryMode
    ? "#333333"
    : "#E8DCEB";

  const cardShadow = isLuxuryMode
    ? "0 12px 35px rgba(0,0,0,0.35)"
    : "0 12px 35px rgba(182,30,202,0.10)";

  const [formData, setFormData] = useState({
    businessName: "",
    sellerName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE SUBMIT
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setAlert({
      type: "",
      message: "",
    });

    try {
      setLoading(true);

      const response = await api.post(
        "/seller/register",
        formData
      );

      if (response.data.success) {
        setAlert({
          type: "success",
          message: "Seller registered successfully!",
        });

        setTimeout(() => {
          navigate("/seller/login");
        }, 1200);
      }
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error.response?.data?.message ||
          "Seller registration failed. Please try again.",
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
        py: 5,
        px: 2,
        transition: "background-color 0.3s ease",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 700,
          backgroundColor: cardBackground,
          border: `1px solid ${border}`,
          borderRadius: "12px",
          boxShadow: cardShadow,
          p: {
            xs: 3,
            sm: 5,
          },
          transition:
            "background-color 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* =========================
            HEADING
        ========================= */}

        <Box
          sx={{
            textAlign: "center",
            mb: 4,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 26,
                sm: 32,
              },
              fontWeight: 800,
              color: primaryText,
              mb: 1,
            }}
          >
            Become a Seller
          </Typography>

          <Typography
            sx={{
              color: secondaryText,
              fontSize: 14,
            }}
          >
            Create your seller account and start selling with us.
          </Typography>
        </Box>

        {/* =========================
            ALERT
        ========================= */}

        {alert.message && (
          <Alert
            severity={alert.type}
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
          >
            {alert.message}
          </Alert>
        )}

        {/* =========================
            FORM
        ========================= */}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* =========================
              BUSINESS DETAILS
          ========================= */}

          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: accent,
              mt: 1,
            }}
          >
            Business Details
          </Typography>

          <CustomInput
            label="Business Name"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Enter business name"
            required
          />

          <CustomInput
            label="Seller Name"
            name="sellerName"
            value={formData.sellerName}
            onChange={handleChange}
            placeholder="Enter seller name"
            required
          />

          {/* =========================
              ACCOUNT DETAILS
          ========================= */}

          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: accent,
              mt: 2,
            }}
          >
            Account Details
          </Typography>

          <CustomInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />

          <CustomInput
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />

          <CustomInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />

          {/* =========================
              BUSINESS ADDRESS
          ========================= */}

          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: accent,
              mt: 2,
            }}
          >
            Business Address
          </Typography>

          <CustomInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter business address"
            required
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <CustomInput
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              required
            />

            <CustomInput
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
              required
            />
          </Box>

          <CustomInput
            label="Pincode"
            name="pincode"
            type="text"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Enter 6-digit pincode"
            required
          />

          {/* =========================
              REGISTER BUTTON
          ========================= */}

          <Box sx={{ mt: 2 }}>
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

                "&:disabled": {
                  backgroundColor: isLuxuryMode
                    ? "#5C513B"
                    : "#D9A4DF",
                  color: isLuxuryMode
                    ? "#BDBDBD"
                    : "#FFFFFF",
                },
              }}
            >
              {loading
                ? "Creating Account..."
                : "Register as Seller"}
            </CustomButton>
          </Box>

          {/* =========================
              LOGIN LINK
          ========================= */}

          <Typography
            sx={{
              textAlign: "center",
              color: secondaryText,
              fontSize: 14,
              mt: 1,
            }}
          >
            Already have a seller account?{" "}

            <Link
              to="/seller/login"
              style={{
                color: accent,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SellerRegister;