import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LogoutIcon from "@mui/icons-material/Logout";

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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!profile.name.trim() || !profile.email.trim()) {
      alert("Name and email are required");
      return;
    }

    if (profile.phone && !/^[6-9]\d{9}$/.test(profile.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    if (profile.pincode && !/^\d{6}$/.test(profile.pincode)) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }

    if (profile.password && profile.password.length < 6) {
      alert("Password must be at least 6 characters");
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

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update profile"
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
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "75vh",
        backgroundColor: "#fafafa",
        px: { xs: 2, md: 6 },
        py: { xs: 4, md: 6 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            letterSpacing: "0.5px",
            mb: 1,
          }}
        >
          My Account
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Manage your account and personal information
        </Typography>

        <Grid container spacing={4}>
          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #e2e2e2",
                backgroundColor: "#fff",
              }}
            >
              <Box sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 55,
                    height: 55,
                    borderRadius: "50%",
                    backgroundColor: "#111",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <PersonIcon />
                </Box>

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 17,
                  }}
                >
                  {profile.name || "My Account"}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {profile.email}
                </Typography>
              </Box>

              <Divider />

              <Box
                onClick={() => navigate("/profile")}
                sx={{
                  px: 3,
                  py: 2,
                  cursor: "pointer",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  fontWeight: 600,
                }}
              >
                <PersonIcon fontSize="small" />
                My Profile
              </Box>

              <Box
                onClick={() => navigate("/orders")}
                sx={{
                  px: 3,
                  py: 2,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <ShoppingBagOutlinedIcon fontSize="small" />
                My Orders
              </Box>

              <Box
                onClick={() => navigate("/wishlist")}
                sx={{
                  px: 3,
                  py: 2,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <FavoriteBorderIcon fontSize="small" />
                My Wishlist
              </Box>

              <Divider />

              <Box
                onClick={handleLogout}
                sx={{
                  px: 3,
                  py: 2,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  color: "#c62828",
                  "&:hover": {
                    backgroundColor: "#fff5f5",
                  },
                }}
              >
                <LogoutIcon fontSize="small" />
                Logout
              </Box>
            </Paper>
          </Grid>

          {/* Profile Content */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #e2e2e2",
                backgroundColor: "#fff",
                p: { xs: 3, md: 4 },
              }}
            >
              <Box component="form" onSubmit={handleSubmit}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 3 }}
                >
                  Personal Information
                </Typography>

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

                <Divider sx={{ my: 4 }} />

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 3 }}
                >
                  Change Password
                </Typography>

                <Box sx={{ maxWidth: 350 }}>
                  <CustomInput
                    label="New Password"
                    name="password"
                    type="password"
                    value={profile.password}
                    onChange={handleChange}
                    placeholder="Leave empty to keep current"
                  />
                </Box>

                <Divider sx={{ my: 4 }} />

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 3 }}
                >
                  Delivery Address
                </Typography>

                <Stack spacing={2.5}>
                  <CustomInput
                    label="Address"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                  />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <CustomInput
                        label="City"
                        name="city"
                        value={profile.city}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <CustomInput
                        label="State"
                        name="state"
                        value={profile.state}
                        onChange={handleChange}
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

                <Box sx={{ mt: 4, maxWidth: 200 }}>
                  <CustomButton
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </CustomButton>
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