import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";

import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";

import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import api from "../services/api";
import { useThemeMode } from "../context/ThemeContext";

const SellerProfile = () => {
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

  const softBackground = isLuxuryMode
    ? "#242424"
    : "#F3E3F6";

  const headerGradient = isLuxuryMode
    ? "linear-gradient(135deg, #171717, #2A2A2A)"
    : "linear-gradient(135deg, #B61ECA, #8E18A1)";

  const cardShadow = isLuxuryMode
    ? "0 10px 30px rgba(0,0,0,0.35)"
    : "0 10px 30px rgba(182,30,202,0.10)";

  const rightCardShadow = isLuxuryMode
    ? "0 10px 30px rgba(0,0,0,0.25)"
    : "0 10px 30px rgba(0,0,0,0.06)";

  const [formData, setFormData] = useState({
    businessName: "",
    sellerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // FETCH PROFILE
  // =========================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const sellerToken =
          localStorage.getItem("sellerToken");

        if (!sellerToken) {
          navigate("/seller/login");
          return;
        }

        const response = await api.get(
          "/seller/profile",
          {
            headers: {
              Authorization: `Bearer ${sellerToken}`,
            },
          }
        );

        const seller = response.data.seller;

        setFormData({
          businessName: seller.businessName || "",
          sellerName: seller.sellerName || "",
          email: seller.email || "",
          phone: seller.phone || "",
          address: seller.address || "",
          city: seller.city || "",
          state: seller.state || "",
          pincode: seller.pincode || "",
        });

        setStatus(seller.status || "Pending");
      } catch (error) {
        console.error(
          "GET SELLER PROFILE ERROR:",
          error
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("sellerToken");
          localStorage.removeItem("seller");

          navigate("/seller/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load seller profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const sellerToken =
        localStorage.getItem("sellerToken");

      if (!sellerToken) {
        navigate("/seller/login");
        return;
      }

      const response = await api.put(
        "/seller/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${sellerToken}`,
          },
        }
      );

      const updatedSeller = response.data.seller;

      const existingSeller =
        JSON.parse(
          localStorage.getItem("seller")
        ) || {};

      localStorage.setItem(
        "seller",
        JSON.stringify({
          ...existingSeller,
          ...updatedSeller,
        })
      );

      setStatus(
        updatedSeller.status || status
      );

      setSuccess(
        response.data.message ||
          "Seller profile updated successfully."
      );
    } catch (error) {
      console.error(
        "UPDATE SELLER PROFILE ERROR:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("sellerToken");
        localStorage.removeItem("seller");

        navigate("/seller/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to update seller profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: pageBackground,
        }}
      >
        <CircularProgress
          sx={{
            color: accent,
          }}
        />
      </Box>
    );
  }

  // =========================
  // STATUS COLORS
  // =========================

  const statusApproved =
    status === "Approved";

  const statusColor = statusApproved
    ? "#4CAF7D"
    : isLuxuryMode
    ? "#C8A96B"
    : "#8A5A00";

  const statusBackground = statusApproved
    ? isLuxuryMode
      ? "rgba(76,175,125,0.15)"
      : "#E7F7EF"
    : isLuxuryMode
    ? "rgba(200,169,107,0.15)"
    : "#FFF4D6";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isLuxuryMode
          ? pageBackground
          : "linear-gradient(135deg, #F9F2FA 0%, #F3E3F6 100%)",
        p: { xs: 2, md: 4 },
        transition: "background 0.3s ease",
      }}
    >
      {/* =========================
          PAGE HEADER
      ========================= */}

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: primaryText,
            mb: 0.5,
          }}
        >
          Seller Profile
        </Typography>

        <Typography
          sx={{
            color: secondaryText,
            fontSize: "15px",
          }}
        >
          Manage your business information and account details
        </Typography>
      </Box>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* =========================
          SUCCESS
      ========================= */}

      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* =========================
            LEFT PROFILE CARD
        ========================= */}

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 4,
              overflow: "hidden",
              backgroundColor: cardBackground,
              border: `1px solid ${border}`,
              boxShadow: cardShadow,
              transition:
                "background-color 0.3s ease, border-color 0.3s ease",
            }}
          >
            {/* Profile Header */}

            <Box
              sx={{
                height: 110,
                background: headerGradient,
                position: "relative",
              }}
            />

            <CardContent
              sx={{
                textAlign: "center",
                pt: 0,
                px: 3,
                pb: 4,
              }}
            >
              {/* Avatar */}

              <Avatar
                sx={{
                  width: 92,
                  height: 92,
                  margin: "-46px auto 15px",
                  backgroundColor: cardBackground,
                  color: accent,
                  border: `5px solid ${cardBackground}`,
                  boxShadow:
                    "0 6px 18px rgba(0,0,0,0.20)",
                }}
              >
                <StorefrontOutlinedIcon
                  sx={{
                    fontSize: 45,
                  }}
                />
              </Avatar>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: primaryText,
                }}
              >
                {formData.businessName}
              </Typography>

              <Typography
                sx={{
                  color: secondaryText,
                  mt: 0.5,
                }}
              >
                {formData.sellerName}
              </Typography>

              {/* Status */}

              <Chip
                label={status}
                size="small"
                sx={{
                  mt: 2,
                  fontWeight: 700,
                  color: statusColor,
                  backgroundColor:
                    statusBackground,
                  borderRadius: 2,
                  px: 1,
                  border: isLuxuryMode
                    ? `1px solid ${statusColor}`
                    : "none",
                }}
              />

              <Divider
                sx={{
                  my: 3,
                  borderColor: border,
                }}
              />

              {/* Contact Information */}

              <Box
                sx={{
                  textAlign: "left",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: primaryText,
                  }}
                >
                  Contact Information
                </Typography>

                {/* Email */}

                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <EmailOutlinedIcon
                    sx={{
                      color: accent,
                      fontSize: 21,
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      color: secondaryText,
                      wordBreak:
                        "break-word",
                    }}
                  >
                    {formData.email}
                  </Typography>
                </Box>

                {/* Phone */}

                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                  }}
                >
                  <PhoneOutlinedIcon
                    sx={{
                      color: accent,
                      fontSize: 21,
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      color: secondaryText,
                    }}
                  >
                    {formData.phone}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* =========================
            RIGHT EDIT PROFILE
        ========================= */}

        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 4,
              backgroundColor: cardBackground,
              border: `1px solid ${border}`,
              boxShadow: rightCardShadow,
              transition:
                "background-color 0.3s ease, border-color 0.3s ease",
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2.5,
                  md: 4,
                },
              }}
            >
              {/* Section Header */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      isLuxuryMode
                        ? "rgba(200,169,107,0.12)"
                        : "#F3E3F6",
                    color: accent,
                  }}
                >
                  <PersonOutlineOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: primaryText,
                    }}
                  >
                    Profile Information
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: secondaryText,
                    }}
                  >
                    Keep your seller details up to date
                  </Typography>
                </Box>
              </Box>

              <Divider
                sx={{
                  mb: 3,
                  borderColor: border,
                }}
              />

              <Box
                component="form"
                onSubmit={handleSubmit}
              >
                {/* =========================
                    BUSINESS INFORMATION
                ========================= */}

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: accent,
                    mb: 2,
                  }}
                >
                  Business Information
                </Typography>

                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <CustomInput
                      label="Business Name"
                      name="businessName"
                      value={
                        formData.businessName
                      }
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CustomInput
                      label="Seller Name"
                      name="sellerName"
                      value={
                        formData.sellerName
                      }
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </Grid>

                {/* =========================
                    CONTACT INFORMATION
                ========================= */}

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: accent,
                    mt: 4,
                    mb: 2,
                  }}
                >
                  Contact Information
                </Typography>

                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <CustomInput
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CustomInput
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </Grid>

                {/* =========================
                    BUSINESS ADDRESS
                ========================= */}

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: accent,
                    mt: 4,
                    mb: 2,
                  }}
                >
                  Business Address
                </Typography>

                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <CustomInput
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <CustomInput
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <CustomInput
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <CustomInput
                      label="Pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </Grid>

                {/* =========================
                    SAVE BUTTON
                ========================= */}

                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Box
                    sx={{
                      width: {
                        xs: "100%",
                        sm: 220,
                      },
                    }}
                  >
                    <CustomButton
                      type="submit"
                      disabled={saving}
                      sx={{
                        backgroundColor: accent,
                        color: isLuxuryMode
                          ? "#171717"
                          : "#FFFFFF",

                        "&:hover": {
                          backgroundColor:
                            accentHover,
                        },
                      }}
                    >
                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </CustomButton>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SellerProfile;