import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import PeopleIcon from "@mui/icons-material/People";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

import { useThemeMode } from "../../context/ThemeContext";

const Sidebar = ({ role = "user" }) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { isLuxuryMode } = useThemeMode();

  // =========================
  // THEME COLORS
  // =========================

  const sidebarBackground = isLuxuryMode
    ? "#1A1A1A"
    : "#FFFFFF";

  const primaryText = isLuxuryMode
    ? "#FFFFFF"
    : "#444444";

  const secondaryText = isLuxuryMode
    ? "#BDBDBD"
    : "#888888";

  const accent = isLuxuryMode
    ? "#C8A96B"
    : "#B61ECA";

  const accentHover = isLuxuryMode
    ? "#E0C080"
    : "#9615A8";

  const hoverBackground = isLuxuryMode
    ? "rgba(200, 169, 107, 0.12)"
    : "#F9EAFB";

  const border = isLuxuryMode
    ? "#333333"
    : "#E8DCEB";

  const logoutHover = isLuxuryMode
    ? "rgba(211, 47, 47, 0.12)"
    : "#FDEAEA";

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    if (role === "seller") {
      localStorage.removeItem("sellerToken");
      localStorage.removeItem("seller");
      navigate("/seller/login");
    } else if (role === "admin") {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
      navigate("/login");
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }

    setOpen(false);
  };

  // =========================
  // USER MENU
  // =========================

  const userMenu = [
    {
      label: "Home",
      icon: <DashboardOutlinedIcon />,
      path: "/",
    },
    {
      label: "Products",
      icon: <Inventory2OutlinedIcon />,
      path: "/products",
    },
    {
      label: "Wishlist",
      icon: <FavoriteBorderIcon />,
      path: "/wishlist",
    },
    {
      label: "Cart",
      icon: <ShoppingCartOutlinedIcon />,
      path: "/cart",
    },
    {
      label: "Orders",
      icon: <ShoppingBagOutlinedIcon />,
      path: "/orders",
    },
    {
      label: "Profile",
      icon: <PersonIcon />,
      path: "/profile",
    },
    {
      label: "Support",
      icon: <SupportAgentOutlinedIcon />,
      path: "/support",
    },
  ];

  // =========================
  // SELLER MENU
  // =========================

  const sellerMenu = [
    {
      label: "Dashboard",
      icon: <DashboardOutlinedIcon />,
      path: "/seller/dashboard",
    },
    {
      label: "My Products",
      icon: <Inventory2OutlinedIcon />,
      path: "/seller/products",
    },
    {
      label: "Add Product",
      icon: <AddBoxOutlinedIcon />,
      path: "/seller/products/add",
    },
    {
      label: "Orders",
      icon: <ShoppingBagOutlinedIcon />,
      path: "/seller/orders",
    },
    {
      label: "Sales Summary",
      icon: <BarChartOutlinedIcon />,
      path: "/seller/sales-summary",
    },
    {
      label: "Profile",
      icon: <PersonIcon />,
      path: "/seller/profile",
    },
    {
      label: "Support",
      icon: <SupportAgentOutlinedIcon />,
      path: "/seller/support",
    },
  ];

  // =========================
  // ADMIN MENU
  // =========================

  const adminMenu = [
    {
      label: "Dashboard",
      icon: <DashboardOutlinedIcon />,
      path: "/admin/dashboard",
    },
    {
      label: "Users",
      icon: <PeopleIcon />,
      path: "/admin/users",
    },
    {
      label: "Sellers",
      icon: <StorefrontOutlinedIcon />,
      path: "/admin/sellers",
    },
    {
      label: "Products",
      icon: <Inventory2OutlinedIcon />,
      path: "/admin/products",
    },
    {
      label: "Orders",
      icon: <ShoppingBagOutlinedIcon />,
      path: "/admin/orders",
    },
    {
      label: "Translations",
      icon: <TranslateOutlinedIcon />,
      path: "/admin/translations",
    },
    {
      label: "Support Tickets",
      icon: <SupportAgentOutlinedIcon />,
      path: "/admin/support-tickets",
    },
  ];

  // =========================
  // SELECT MENU
  // =========================

  const menuItems =
    role === "seller"
      ? sellerMenu
      : role === "admin"
      ? adminMenu
      : userMenu;

  // =========================
  // NAVIGATION
  // =========================

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  // =========================
  // ACTIVE MENU
  // =========================

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  // =========================
  // SIDEBAR HEADER
  // =========================

  const sidebarHeaderBackground = isLuxuryMode
    ? "linear-gradient(135deg, #171717 0%, #242424 100%)"
    : "linear-gradient(135deg, #B61ECA 0%, #8E24AA 100%)";

  return (
    <>
      {/* =========================
          HAMBURGER BUTTON
      ========================= */}

      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          top: {
            xs: 12,
            sm: 18,
          },
          left: {
            xs: 12,
            sm: 18,
          },
          zIndex: 1200,

          width: 48,
          height: 48,

          backgroundColor: accent,
          color: isLuxuryMode
            ? "#171717"
            : "#FFFFFF",

          borderRadius: "12px",

          boxShadow: isLuxuryMode
            ? "0 5px 15px rgba(0,0,0,0.35)"
            : "0 5px 15px rgba(182,30,202,0.25)",

          "&:hover": {
            backgroundColor: accentHover,
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* =========================
          SIDEBAR DRAWER
      ========================= */}

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: {
              xs: 280,
              sm: 300,
            },

            backgroundColor: sidebarBackground,

            borderRight: `1px solid ${border}`,

            color: primaryText,

            transition:
              "background-color 0.3s ease",
          },
        }}
      >
        {/* =========================
            SIDEBAR HEADER
        ========================= */}

        <Box
          sx={{
            px: 2.5,
            py: 2,

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            background: sidebarHeaderBackground,
            color: "#FFFFFF",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "1.4rem",
                fontWeight: 800,
              }}
            >
              A.JIO
            </Typography>

            <Typography
              sx={{
                fontSize: "0.65rem",
                letterSpacing: "3px",
                opacity: 0.85,
              }}
            >
              STYLE EDIT
            </Typography>
          </Box>

          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              color: "#FFFFFF",

              "&:hover": {
                backgroundColor:
                  "rgba(255,255,255,0.10)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* =========================
            ROLE
        ========================= */}

        <Box
          sx={{
            px: 2.5,
            py: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: secondaryText,
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontWeight: 600,
            }}
          >
            {role} Panel
          </Typography>
        </Box>

        <Divider
          sx={{
            borderColor: border,
          }}
        />

        {/* =========================
            MENU
        ========================= */}

        <List
          sx={{
            px: 1.5,
            py: 2,
          }}
        >
          {menuItems.map((item) => {
            const active = isActive(item.path);

            return (
              <ListItem
                key={item.label}
                disablePadding
                sx={{
                  mb: 0.5,
                }}
              >
                <ListItemButton
                  onClick={() =>
                    handleNavigation(item.path)
                  }
                  sx={{
                    borderRadius: "10px",
                    py: 1.2,

                    color: active
                      ? accent
                      : primaryText,

                    backgroundColor: active
                      ? hoverBackground
                      : "transparent",

                    "& .MuiListItemIcon-root": {
                      minWidth: 42,

                      color: active
                        ? accent
                        : isLuxuryMode
                        ? "#BDBDBD"
                        : "#6B6B6B",
                    },

                    "&:hover": {
                      backgroundColor:
                        hoverBackground,

                      color: accent,

                      "& .MuiListItemIcon-root": {
                        color: accent,
                      },
                    },
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: active
                        ? 700
                        : 600,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}

          {/* =========================
              DIVIDER
          ========================= */}

          <Divider
            sx={{
              my: 1.5,
              borderColor: border,
            }}
          />

          {/* =========================
              LOGOUT
          ========================= */}

          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: "10px",
                py: 1.2,

                color: "#D32F2F",

                "& .MuiListItemIcon-root": {
                  minWidth: 42,
                  color: "#D32F2F",
                },

                "&:hover": {
                  backgroundColor: logoutHover,
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>

              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;