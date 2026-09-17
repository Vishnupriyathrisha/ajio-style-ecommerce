import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LogoutIcon from "@mui/icons-material/Logout";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import api from "../services/api";

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile");
        const user = response.data.user;

        setProfile({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          password: "",
          address: user.address || "",
          city: user.city || "",
          state: user.state || "",
          pincode: user.pincode || "",
        });
      } catch (error) {
        console.error(
          "Failed to fetch profile:",
          error.response?.data || error.message
        );

        setMessageType("error");
        setMessage(
          error.response?.data?.message ||
            "Failed to load profile information"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    setProfile((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

    if (message) {
      setMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!profile.name.trim() || !profile.email.trim()) {
      setMessageType("error");
      setMessage("Name and email are required");
      return;
    }

    if (profile.phone && !/^[6-9]\d{9}$/.test(profile.phone)) {
      setMessageType("error");
      setMessage("Please enter a valid 10-digit phone number");
      return;
    }

    if (profile.pincode && !/^\d{6}$/.test(profile.pincode)) {
      setMessageType("error");
      setMessage("Please enter a valid 6-digit pincode");
      return;
    }

    if (profile.password && profile.password.length < 6) {
      setMessageType("error");
      setMessage("Password must be at least 6 characters");
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
      };

      if (profile.password) {
        updateData.password = profile.password;
      }

      const response = await api.put("/profile", updateData);

      setProfile((prev) => ({
        ...prev,
        name: response.data.user.name || "",
        email: response.data.user.email || "",
        phone: response.data.user.phone || "",
        address: response.data.user.address || "",
        city: response.data.user.city || "",
        state: response.data.user.state || "",
        pincode: response.data.user.pincode || "",
        password: "",
      }));

      setMessageType("success");
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error.response?.data || error.message
      );

      setMessageType("error");
      setMessage(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F9F2FA",
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress sx={{ color: "#B61ECA" }} />
          <Typography color="text.secondary">
            Loading profile...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "75vh",
        backgroundColor: "#F9F2FA",
        px: { xs: 2, sm: 3, md: 6 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: { xs: 28, md: 36 },
              fontWeight: 800,
              color: "#171717",
              letterSpacing: "-0.5px",
            }}
          >
            My Account
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              color: "#6B6B6B",
              fontSize: 15,
            }}
          >
            Manage your personal information, orders and preferences
          </Typography>
        </Box>

        <Grid container spacing={3.5}>
          {/* ================= SIDEBAR ================= */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #E8DCEB",
                borderRadius: "14px",
                overflow: "hidden",
                backgroundColor: "#FFFFFF",
              }}
            >
              {/* Profile Header */}
              <Box
                sx={{
                  p: 3,
                  background:
                    "linear-gradient(145deg, #B61ECA 0%, #8E18A0 100%)",
                  color: "#FFFFFF",
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.18)",
                    border: "2px solid rgba(255,255,255,0.55)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 32 }} />
                </Box>

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: 18,
                    wordBreak: "break-word",
                  }}
                >
                  {profile.name || "My Account"}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: 13,
                    opacity: 0.9,
                    wordBreak: "break-word",
                  }}
                >
                  {profile.email}
                </Typography>
              </Box>

              {/* Navigation */}
              <Box sx={{ py: 1 }}>
                {/* Profile */}
                <Box
                  onClick={() => navigate("/profile")}
                  sx={{
                    mx: 1,
                    px: 2,
                    py: 1.5,
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    backgroundColor: "#F9F2FA",
                    color: "#B61ECA",
                    fontWeight: 700,
                  }}
                >
                  <PersonIcon fontSize="small" />
                  <Typography fontSize={14} fontWeight={700}>
                    My Profile
                  </Typography>
                </Box>

                {/* Orders */}
                <Box
                  onClick={() => navigate("/orders")}
                  sx={{
                    mx: 1,
                    px: 2,
                    py: 1.5,
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    color: "#4F4F4F",
                    "&:hover": {
                      backgroundColor: "#F9F2FA",
                      color: "#B61ECA",
                    },
                  }}
                >
                  <ShoppingBagOutlinedIcon fontSize="small" />
                  <Typography fontSize={14}>
                    My Orders
                  </Typography>
                </Box>

                {/* Wishlist */}
                <Box
                  onClick={() => navigate("/wishlist")}
                  sx={{
                    mx: 1,
                    px: 2,
                    py: 1.5,
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    color: "#4F4F4F",
                    "&:hover": {
                      backgroundColor: "#F9F2FA",
                      color: "#B61ECA",
                    },
                  }}
                >
                  <FavoriteBorderIcon fontSize="small" />
                  <Typography fontSize={14}>
                    My Wishlist
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Logout */}
              <Box
                onClick={handleLogout}
                sx={{
                  mx: 1,
                  my: 1,
                  px: 2,
                  py: 1.5,
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  color: "#C62828",
                  "&:hover": {
                    backgroundColor: "#FFF5F5",
                  },
                }}
              >
                <LogoutIcon fontSize="small" />
                <Typography fontSize={14} fontWeight={600}>
                  Logout
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* ================= PROFILE CONTENT ================= */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #E8DCEB",
                borderRadius: "14px",
                backgroundColor: "#FFFFFF",
                p: { xs: 2.5, sm: 3.5, md: 4.5 },
              }}
            >
              {/* Content Header */}
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "10px",
                    backgroundColor: "#F9F2FA",
                    color: "#B61ECA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EditOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#171717",
                    }}
                  >
                    Edit Profile
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#6B6B6B",
                    }}
                  >
                    Keep your account information up to date
                  </Typography>
                </Box>
              </Stack>

              {message && (
                <Alert
                  severity={messageType}
                  onClose={() => setMessage("")}
                  sx={{
                    mb: 3,
                    borderRadius: "8px",
                  }}
                >
                  {message}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                {/* ================= PERSONAL INFORMATION ================= */}
                <Box sx={{ mb: 3 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 2.5 }}
                  >
                    <PersonIcon
                      sx={{
                        fontSize: 20,
                        color: "#B61ECA",
                      }}
                    />

                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: 17,
                      }}
                    >
                      Personal Information
                    </Typography>
                  </Stack>

                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <CustomInput
                        label="Full Name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <CustomInput
                        label="Email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleChange}
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <CustomInput
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* ================= PASSWORD ================= */}
                <Box sx={{ mb: 3 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <LockOutlinedIcon
                      sx={{
                        fontSize: 20,
                        color: "#B61ECA",
                      }}
                    />

                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: 17,
                      }}
                    >
                      Change Password
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      color: "#6B6B6B",
                      fontSize: 13,
                      mb: 2.5,
                    }}
                  >
                    Leave this field empty if you don't want to change
                    your password.
                  </Typography>

                  <Box sx={{ maxWidth: 400 }}>
                    <CustomInput
                      label="New Password"
                      name="password"
                      type="password"
                      value={profile.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* ================= ADDRESS ================= */}
                <Box sx={{ mb: 3 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <LocationOnOutlinedIcon
                      sx={{
                        fontSize: 20,
                        color: "#B61ECA",
                      }}
                    />

                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: 17,
                      }}
                    >
                      Delivery Address
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      color: "#6B6B6B",
                      fontSize: 13,
                      mb: 2.5,
                    }}
                  >
                    Add your delivery details for a smoother checkout
                    experience.
                  </Typography>

                  <Stack spacing={2.5}>
                    <CustomInput
                      label="Address"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      placeholder="Enter your complete address"
                    />

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <CustomInput
                          label="City"
                          name="city"
                          value={profile.city}
                          onChange={handleChange}
                          placeholder="City"
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 4 }}>
                        <CustomInput
                          label="State"
                          name="state"
                          value={profile.state}
                          onChange={handleChange}
                          placeholder="State"
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 4 }}>
                        <CustomInput
                          label="Pincode"
                          name="pincode"
                          value={profile.pincode}
                          onChange={handleChange}
                          placeholder="6-digit pincode"
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </Box>

                {/* ================= SAVE ================= */}
                <Box
                  sx={{
                    mt: 4,
                    pt: 3,
                    borderTop: "1px solid #E8DCEB",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Box sx={{ width: { xs: "100%", sm: 190 } }}>
                    <CustomButton
                      type="submit"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </CustomButton>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Profile;