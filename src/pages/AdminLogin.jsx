import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import api from "../services/api";
import { useThemeMode } from "../context/ThemeContext";

const AdminLogin = () => {
  const navigate = useNavigate();

  const { isLuxuryMode } = useThemeMode();

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

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setAlert({
      type: "",
      message: "",
    });

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setAlert({
        type: "error",
        message: "Please enter email and password.",
      });

      return;
    }

    try {
      setLoading(true);

      // Remove old admin session
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Only admin users can access Admin Panel
      if (user?.role !== "admin") {
        setAlert({
          type: "error",
          message: "Access denied. Admin account required.",
        });

        return;
      }

      if (!token) {
        setAlert({
          type: "error",
          message: "Admin login failed. Token not received.",
        });

        return;
      }

      // Save admin session separately
      localStorage.setItem("adminToken", token);

      localStorage.setItem(
        "admin",
        JSON.stringify(user)
      );

      setAlert({
        type: "success",
        message: "Admin login successful!",
      });

      setTimeout(() => {
        navigate("/admin/dashboard", {
          replace: true,
        });
      }, 700);
    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error);

      setAlert({
        type: "error",
        message:
          error.response?.data?.message ||
          "Admin login failed. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: pageBackground,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        py: 5,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 450,
          backgroundColor: cardBackground,
          border: `1px solid ${border}`,
          borderRadius: "12px",
          boxShadow: isLuxuryMode
            ? "0 12px 35px rgba(0,0,0,0.40)"
            : "0 12px 35px rgba(182,30,202,0.10)",
          p: {
            xs: 3,
            sm: 5,
          },
        }}
      >
        {/* ICON */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isLuxuryMode
                ? "rgba(200,169,107,0.12)"
                : "#F9EAFB",
              color: accent,
            }}
          >
            <AdminPanelSettingsOutlinedIcon
              sx={{
                fontSize: 34,
              }}
            />
          </Box>
        </Box>

        {/* HEADING */}

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
            Admin Login
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: secondaryText,
            }}
          >
            Login to manage your e-commerce platform.
          </Typography>
        </Box>

        {/* ALERT */}

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

        {/* FORM */}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CustomInput
            label="Admin Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter admin email"
            required
          />

          <CustomInput
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter admin password"
            required
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

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
                : "Login as Admin"}
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLogin;