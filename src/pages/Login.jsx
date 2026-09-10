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

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  setError("");

  const { email, password } = formData;

  if (!email.trim() || !password) {
    setError("Please enter your email and password.");
    return;
  }

  try {
    setLoading(true);

    const response = await api.post("/auth/login", {
      email: email.trim(),
      password,
    });

    localStorage.setItem("token", response.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    navigate("/");
  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Login failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 128px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 5,
        backgroundColor: "#f7f7f7",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 460,
          backgroundColor: "#fff",
          border: "1px solid #e5e5e5",
          borderRadius: 2,
          p: { xs: 3, sm: 4 },
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Welcome Back
        </Typography>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Login to continue shopping
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
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
          <CustomInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <CustomInput
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
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

          <Box sx={{ textAlign: "right" }}>
            <Link
              to="/forgot-password"
              style={{
                color: "#111",
                fontSize: "14px",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Forgot Password?
            </Link>
          </Box>

          <CustomButton type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </CustomButton>
        </Box>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 3 }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#111",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Register
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;