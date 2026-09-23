import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
} from "@mui/material";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

const MobileBottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Home",
      path: "/",
      icon: HomeOutlinedIcon,
    },
    {
      label: "Search",
      path: "/products",
      icon: SearchIcon,
    },
    {
      label: "Wishlist",
      path: "/wishlist",
      icon: FavoriteBorderIcon,
    },
    {
      label: "Cart",
      path: "/cart",
      icon: ShoppingBagOutlinedIcon,
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        display: {
          xs: "flex",
          md: "none",
        },

        position: "fixed",

        bottom: 0,

        left: 0,

        right: 0,

        height: 64,

        backgroundColor: "#FFFFFF",

        borderTop:
          "1px solid #E8DCEB",

        zIndex: 1200,

        alignItems: "center",

        justifyContent:
          "space-around",

        boxShadow:
          "0 -4px 16px rgba(0,0,0,0.08)",

        paddingBottom:
          "env(safe-area-inset-bottom)",
      }}
    >
      {menuItems.map((item) => {
        const Icon = item.icon;

        const isActive =
          item.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(
                item.path
              );

        return (
          <Box
            key={item.label}
            onClick={() =>
              handleNavigation(item.path)
            }
            sx={{
              flex: 1,

              height: "100%",

              display: "flex",

              flexDirection:
                "column",

              alignItems: "center",

              justifyContent:
                "center",

              cursor: "pointer",

              color: isActive
                ? "#B61ECA"
                : "#6B6B6B",

              transition:
                "color 0.2s ease",

              "&:active": {
                transform:
                  "scale(0.96)",
              },
            }}
          >
            <Icon
              sx={{
                fontSize: 24,

                mb: 0.3,
              }}
            />

            <Typography
              sx={{
                fontSize: 11,

                fontWeight:
                  isActive
                    ? 700
                    : 500,

                lineHeight: 1,
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default MobileBottomBar;