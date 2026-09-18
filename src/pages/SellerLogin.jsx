import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import api from "../services/api";

const SellerLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

    try {
      setLoading(true);

      const response = await api.post("/seller/login", formData);

      if (response.data.success) {
        // Store seller information
        localStorage.setItem(
          "seller",
          JSON.stringify(response.data.seller)
        );

        localStorage.setItem("sellerToken", response.data.token);
        
        setAlert({
          type: "success",
          message: "Seller login successful!",
        });

        setTimeout(() => {
          navigate("/seller/dashboard");
        }, 800);
      }
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error.response?.data?.message ||
          "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 76px)",
        background: "#F9F2FA",
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
          backgroundColor: "#fff",
          border: "1px solid #E8DCEB",
          borderRadius: "12px",
          boxShadow: "0 12px 35px rgba(182, 30, 202, 0.10)",
          p: { xs: 3, sm: 5 },
        }}
      >
        {/* Heading */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            sx={{
              fontSize: { xs: 27, sm: 32 },
              fontWeight: 800,
              color: "#171717",
              mb: 1,
            }}
          >
            Seller Login
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: "#6B6B6B",
            }}
          >
            Login to manage your store and products.
          </Typography>
        </Box>

        {/* Alert */}
        {alert.message && (
          <Alert severity={alert.type} sx={{ mb: 3 }}>
            {alert.message}
          </Alert>
        )}

        {/* Form */}
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
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter seller email"
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

          <Box sx={{ mt: 1 }}>
            <CustomButton
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login as Seller"}
            </CustomButton>
          </Box>

          {/* Register Link */}
          <Typography
            sx={{
              textAlign: "center",
              color: "#6B6B6B",
              fontSize: 14,
              mt: 1,
            }}
          >
            Don't have a seller account?{" "}
            <Link
              to="/seller/register"
              style={{
                color: "#B61ECA",
                fontWeight: 700,
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