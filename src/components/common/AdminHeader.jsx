import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonIcon from "@mui/icons-material/Person";
import Brightness4Icon from "@mui/icons-material/Brightness4";

import { useThemeMode } from "../../context/ThemeContext";

const AdminHeader = () => {
  const navigate = useNavigate();

  const { isLuxuryMode, toggleLuxuryMode } = useThemeMode();

  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const admin = JSON.parse(
    localStorage.getItem("admin") || "null"
  );

  const handleSearch = (event) => {
    if (event.key === "Enter" && search.trim()) {
      console.log("Admin search:", search.trim());
    }
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    handleMenuClose();

    navigate("/admin/login");
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: isLuxuryMode ? "#111111" : "#B61ECA",
        color: "#FFFFFF",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: "58px",
            sm: "64px",
            md: "76px",
          },

          px: {
            xs: 1.5,
            sm: 2,
            md: 5,
          },

          gap: {
            xs: 0.5,
            sm: 1,
            md: 3,
          },
        }}
      >
        {/* LOGO */}
        <Box
          onClick={() => navigate("/admin/dashboard")}
          sx={{
            cursor: "pointer",
            minWidth: {
              xs: 70,
              sm: 100,
              md: 130,
            },
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 18,
                sm: 21,
                md: 27,
              },
              fontWeight: 900,
              letterSpacing: {
                xs: "1.5px",
                md: "3px",
              },
              lineHeight: 1,
              color: "#FFFFFF",
            }}
          >
            A
            <span style={{ color: "#C8A96B" }}>.</span>
            JIO
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: 7,
                md: 9,
              },
              letterSpacing: {
                xs: "1px",
                md: "2px",
              },
              color: "#EEEEEE",
              mt: 0.5,
            }}
          >
            ADMIN PANEL
          </Typography>
        </Box>

        {/* SPACE */}
        <Box sx={{ flex: 1 }} />

        {/* SEARCH */}
        <Box
          sx={{
            display: {
              xs: "none",
              sm: "flex",
            },
            alignItems: "center",
            backgroundColor: "#F7F5F0",
            borderRadius: "30px",
            px: 1.5,
            width: {
              sm: 200,
              md: 280,
            },
            height: 42,
            flexShrink: 1,
          }}
        >
          <SearchIcon
            sx={{
              color: "#555555",
              fontSize: 21,
              flexShrink: 0,
            }}
          />

          <Box
            component="input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search..."
            sx={{
              border: "none",
              outline: "none",
              background: "transparent",
              width: "100%",
              minWidth: 0,
              px: 1,
              fontSize: 14,
              color: "#171717",

              "&::placeholder": {
                color: "#777777",
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* NOTIFICATION */}
        <IconButton
          sx={{
            color: "#FFFFFF",
            width: 42,
            height: 42,

            "&:hover": {
              color: "#C8A96B",
            },
          }}
        >
          <NotificationsNoneIcon />
        </IconButton>

        {/* CLASSIC / LUXURY TOGGLE */}
        <Box
  onClick={toggleLuxuryMode}
  sx={{
    display: {
      xs: "none",
      md: "flex",
    },

    alignItems: "center",
    justifyContent: "center",

    px: 1.5,
    height: 36,

    border: isLuxuryMode
      ? "1px solid #C8A96B"
      : "1px solid rgba(255,255,255,0.35)",

    borderRadius: "20px",

    cursor: "pointer",

    color: isLuxuryMode
      ? "#C8A96B"
      : "#FFFFFF",

    backgroundColor: isLuxuryMode
      ? "rgba(200,169,107,0.08)"
      : "transparent",

    fontSize: 12,
    fontWeight: 700,

    whiteSpace: "nowrap",

    transition: "all 0.25s ease",

    "&:hover": {
      backgroundColor: "rgba(200,169,107,0.15)",
      borderColor: "#C8A96B",
      color: "#C8A96B",
    },
  }}
>
  {isLuxuryMode ? "Classic" : "Luxury"}
</Box>

        {/* PROFILE */}
        <IconButton
          onClick={handleProfileClick}
          sx={{
            color: "#FFFFFF",
            width: 42,
            height: 42,

            "&:hover": {
              color: "#C8A96B",
            },
          }}
        >
          <PersonIcon />
        </IconButton>

        {/* ADMIN NAME */}
        <Typography
          sx={{
            display: {
              xs: "none",
              md: "block",
            },

            fontSize: 14,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {admin?.name || "Admin"}
        </Typography>

        {/* PROFILE MENU */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            Profile
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;