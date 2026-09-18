import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import api from "../services/api";

const SellerRegister = () => {
  const navigate = useNavigate();

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

      const response = await api.post("/seller/register", formData);

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
        background: "#F9F2FA",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 5,
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 700,
          background: "#fff",
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
              fontSize: { xs: 26, sm: 32 },
              fontWeight: 800,
              color: "#171717",
              mb: 1,
            }}
          >
            Become a Seller
          </Typography>

          <Typography
            sx={{
              color: "#6B6B6B",
              fontSize: 14,
            }}
          >
            Create your seller account and start selling with us.
          </Typography>
        </Box>

        {/* Alert */}
        {alert.message && (
          <Alert severity={alert.type} sx={{ mb: 3 }}>
            {alert.message}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Business Details */}
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: "#B61ECA",
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

          {/* Account Details */}
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: "#B61ECA",
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

          {/* Address */}
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: "#B61ECA",
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

          {/* Register */}
          <Box sx={{ mt: 2 }}>
            <CustomButton
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register as Seller"}
            </CustomButton>
          </Box>

          {/* Login Link */}
          <Typography
            sx={{
              textAlign: "center",
              color: "#6B6B6B",
              fontSize: 14,
              mt: 1,
            }}
          >
            Already have a seller account?{" "}
            <Link
              to="/seller/login"
              style={{
                color: "#B61ECA",
                fontWeight: 700,
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