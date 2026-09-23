import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonIcon from "@mui/icons-material/Person";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";

import { useThemeMode } from "../../context/ThemeContext";

const Header = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const { isLuxuryMode, toggleLuxuryMode } = useThemeMode();

  const categories = [
    { name: "MEN", value: "Men" },
    { name: "WOMEN", value: "Women" },
    { name: "KIDS", value: "Kids" },
    { name: "BEAUTY", value: "Beauty" },
    { name: "LUXE", value: "AJIO Luxe" },
  ];

  const handleCategoryClick = (category) => {
    navigate(
      `/products?category=${encodeURIComponent(category)}`
    );
  };

  const handleSearch = (event) => {
    if (event.key === "Enter" && search.trim()) {
      navigate(
        `/products?search=${encodeURIComponent(search.trim())}`
      );
    }
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: isLuxuryMode
          ? "#111111"
          : "#B61ECA",

        color: "#FFFFFF",

        borderBottom: isLuxuryMode
          ? "1px solid #333333"
          : "1px solid rgba(255,255,255,0.15)",

        transition:
          "background-color 0.3s ease, border-color 0.3s ease",
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

          pl: {
            xs: 8.5,
            sm: 8.5,
            md: 5,
          },

          gap: {
            xs: 0.5,
            sm: 1,
            md: 3,
          },
        }}
      >
        {/* Brand */}
        <Box
          onClick={() => navigate("/")}
          sx={{
            cursor: "pointer",

            minWidth: {
              xs: 65,
              sm: 90,
              md: 120,
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
            <span
              style={{
                color: "#C8A96B",
              }}
            >
              .
            </span>
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

              color: isLuxuryMode
                ? "#BDBDBD"
                : "#EEEEEE",

              mt: 0.5,
            }}
          >
            STYLE EDIT
          </Typography>
        </Box>

        {/* Desktop Categories */}
        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },

            alignItems: "center",

            gap: 3,

            flex: 1,
          }}
        >
          {categories.map((category) => (
            <Box
              key={category.value}
              onClick={() =>
                handleCategoryClick(category.value)
              }
              sx={{
                position: "relative",

                cursor: "pointer",

                py: 1,

                "&::after": {
                  content: '""',

                  position: "absolute",

                  left: 0,
                  right: 0,
                  bottom: 0,

                  height: "2px",

                  backgroundColor: "#C8A96B",

                  transform: "scaleX(0)",

                  transformOrigin: "center",

                  transition:
                    "transform 0.25s ease",
                },

                "&:hover::after": {
                  transform: "scaleX(1)",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,

                  fontWeight: 600,

                  letterSpacing: "0.5px",

                  color: "#FFFFFF",
                }}
              >
                {category.name}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Search */}
        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            backgroundColor: isLuxuryMode
              ? "#222222"
              : "#F7F5F0",

            borderRadius: "30px",

            px: {
              xs: 1,
              sm: 1.5,
            },

            width: {
              xs: "clamp(120px, 32vw, 180px)",
              sm: 210,
              md: 280,
            },

            height: {
              xs: 38,
              sm: 42,
            },

            flexShrink: 1,

            border: isLuxuryMode
              ? "1px solid #3A3A3A"
              : "1px solid transparent",

            transition:
              "background-color 0.3s ease, border-color 0.3s ease",
          }}
        >
          <SearchIcon
            sx={{
              color: isLuxuryMode
                ? "#C8A96B"
                : "#555555",

              fontSize: {
                xs: 19,
                sm: 21,
              },

              flexShrink: 0,
            }}
          />

          <Box
            component="input"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            onKeyDown={handleSearch}
            placeholder="Search styles..."
            sx={{
              border: "none",

              outline: "none",

              background: "transparent",

              width: "100%",

              minWidth: 0,

              px: 1,

              fontSize: {
                xs: 12,
                sm: 14,
              },

              color: isLuxuryMode
                ? "#FFFFFF"
                : "#171717",

              "&::placeholder": {
                color: isLuxuryMode
                  ? "#AAAAAA"
                  : "#777777",

                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Support */}
        <IconButton
          onClick={() => navigate("/support")}
          sx={{
            display: {
              xs: "none",
              sm: "inline-flex",
            },

            color: "#FFFFFF",

            width: 42,

            height: 42,

            "&:hover": {
              color: "#C8A96B",
            },
          }}
        >
          <SupportAgentOutlinedIcon />
        </IconButton>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            flexShrink: 0,
          }}
        >
          {/* Wishlist */}
          <IconButton
            onClick={() => navigate("/wishlist")}
            sx={{
              color: "#FFFFFF",

              width: {
                xs: 40,
                sm: 42,
              },

              height: {
                xs: 40,
                sm: 42,
              },

              "&:hover": {
                color: "#C8A96B",
              },
            }}
          >
            <FavoriteBorderIcon
              sx={{
                fontSize: {
                  xs: 21,
                  sm: 24,
                },
              }}
            />
          </IconButton>

          {/* Cart */}
          <IconButton
            onClick={() => navigate("/cart")}
            sx={{
              color: "#FFFFFF",

              width: {
                xs: 40,
                sm: 42,
              },

              height: {
                xs: 40,
                sm: 42,
              },

              "&:hover": {
                color: "#C8A96B",
              },
            }}
          >
            <ShoppingBagOutlinedIcon
              sx={{
                fontSize: {
                  xs: 21,
                  sm: 24,
                },
              }}
            />
          </IconButton>

          {/* Luxury / Classic Toggle */}
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

              letterSpacing: "0.4px",

              whiteSpace: "nowrap",

              transition:
                "all 0.25s ease",

              "&:hover": {
                backgroundColor:
                  "rgba(200,169,107,0.15)",

                borderColor: "#C8A96B",

                color: "#C8A96B",
              },
            }}
          >
            {isLuxuryMode
              ? "Classic"
              : "Luxury"}
          </Box>

          {/* Profile */}
          <IconButton
            onClick={() => navigate("/profile")}
            sx={{
              display: {
                xs: "none",
                sm: "inline-flex",
              },

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
        </Box>
      </Toolbar>

      {/* Mobile Category Strip */}
      <Box
        sx={{
          display: {
            xs: "flex",
            md: "none",
          },

          overflowX: "auto",

          gap: 1,

          px: 1.5,

          pb: 1.2,

          scrollbarWidth: "none",

          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {categories.map((category) => (
          <Box
            key={category.value}
            onClick={() =>
              handleCategoryClick(category.value)
            }
            sx={{
              flexShrink: 0,

              px: 2,

              py: 0.7,

              borderRadius: "20px",

              backgroundColor: isLuxuryMode
                ? "rgba(200,169,107,0.15)"
                : "rgba(255,255,255,0.15)",

              border: isLuxuryMode
                ? "1px solid rgba(200,169,107,0.25)"
                : "1px solid transparent",

              cursor: "pointer",

              whiteSpace: "nowrap",

              "&:active": {
                backgroundColor: isLuxuryMode
                  ? "rgba(200,169,107,0.3)"
                  : "rgba(255,255,255,0.3)",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: 12,

                fontWeight: 700,

                letterSpacing: "0.5px",

                color: "#FFFFFF",
              }}
            >
              {category.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </AppBar>
  );
};

export default Header;