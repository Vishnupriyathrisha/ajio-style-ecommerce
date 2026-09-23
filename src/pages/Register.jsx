import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import api from "../services/api";
import { useThemeMode } from "../context/ThemeContext";

const Register = () => {
  const navigate = useNavigate();

  const { isLuxuryMode } = useThemeMode();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // THEME COLORS
  // --------------------------------------------------

  const pageBackground = isLuxuryMode
    ? "#0F0F0F"
    : "#F7F7F7";

  const cardBackground = isLuxuryMode
    ? "#1A1A1A"
    : "#FFFFFF";

  const primaryText = isLuxuryMode
    ? "#FFFFFF"
    : "#171717";

  const secondaryText = isLuxuryMode
    ? "#BDBDBD"
    : "#6B6B6B";

  const border = isLuxuryMode
    ? "#333333"
    : "#E5E5E5";

  const accent = isLuxuryMode
    ? "#C8A96B"
    : "#B61ECA";

  const accentHover = isLuxuryMode
    ? "#E0C080"
    : "#9615A8";

  const inputBackground = isLuxuryMode
    ? "#222222"
    : "#FFFFFF";

  // --------------------------------------------------
  // HANDLE CHANGE
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  // --------------------------------------------------
  // HANDLE SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/register",
        {
          name: name.trim(),
          email: email.trim(),
          password,
        }
      );

      setSuccess(
        response.data.message ||
          "Registration successful!"
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 128px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 5,
        backgroundColor: pageBackground,
        transition: "background-color 0.3s ease",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 460,
          backgroundColor: cardBackground,
          border: `1px solid ${border}`,
          borderRadius: 2,
          p: { xs: 3, sm: 4 },
          boxShadow: isLuxuryMode
            ? "0 10px 35px rgba(0,0,0,0.35)"
            : "0 4px 20px rgba(0,0,0,0.06)",
          transition:
            "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {/* ------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------ */}

        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 800,
            mb: 1,
            color: primaryText,
            fontSize: {
              xs: 28,
              sm: 32,
            },
          }}
        >
          Create Account
        </Typography>

        <Typography
          variant="body2"
          align="center"
          sx={{
            mb: 3,
            color: secondaryText,
          }}
        >
          Register to start shopping
        </Typography>

        {/* ------------------------------------------ */}
        {/* ERROR */}
        {/* ------------------------------------------ */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: "8px",
            }}
          >
            {error}
          </Alert>
        )}

        {/* ------------------------------------------ */}
        {/* SUCCESS */}
        {/* ------------------------------------------ */}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 2,
              borderRadius: "8px",
            }}
          >
            {success}
          </Alert>
        )}

        {/* ------------------------------------------ */}
        {/* FORM */}
        {/* ------------------------------------------ */}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* FULL NAME */}

          <CustomInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          {/* EMAIL */}

          <CustomInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          {/* PASSWORD */}

          <CustomInput
            label="Password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      edge="end"
                      aria-label="toggle password visibility"
                      sx={{
                        color: isLuxuryMode
                          ? "#BDBDBD"
                          : "#666666",
                        "&:hover": {
                          color: accent,
                        },
                      }}
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

          {/* CONFIRM PASSWORD */}

          <CustomInput
            label="Confirm Password"
            name="confirmPassword"
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                      edge="end"
                      aria-label="toggle confirm password visibility"
                      sx={{
                        color: isLuxuryMode
                          ? "#BDBDBD"
                          : "#666666",
                        "&:hover": {
                          color: accent,
                        },
                      }}
                    >
                      {showConfirmPassword ? (
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

          {/* REGISTER BUTTON */}

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
                color: isLuxuryMode
                  ? "#171717"
                  : "#FFFFFF",
              },
            }}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </CustomButton>
        </Box>

        {/* ------------------------------------------ */}
        {/* LOGIN LINK */}
        {/* ------------------------------------------ */}

        <Typography
          variant="body2"
          align="center"
          sx={{
            mt: 3,
            color: secondaryText,
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
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
  );
};

export default Register;