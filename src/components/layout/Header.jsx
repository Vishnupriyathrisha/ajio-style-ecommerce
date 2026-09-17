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

const Header = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const categories = [
    { name: "MEN", value: "Men" },
    { name: "WOMEN", value: "Women" },
    { name: "KIDS", value: "Kids" },
    { name: "BEAUTY", value: "Beauty" },
    { name: "LUXE", value: "AJIO Luxe" },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  const handleSearch = (event) => {
    if (event.key === "Enter" && search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#b61eca",
        color: "#fff",
        borderBottom: "1px solid #2d2d2d",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: "64px", md: "76px" },
          px: { xs: 2, md: 5 },
          gap: { xs: 1, md: 3 },
        }}
      >
        {/* Brand */}
        <Box
          onClick={() => navigate("/")}
          sx={{
            cursor: "pointer",
            minWidth: { xs: 70, md: 120 },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 22, md: 27 },
              fontWeight: 900,
              letterSpacing: "3px",
              lineHeight: 1,
            }}
          >
            A<span style={{ color: "#C8A96B" }}>.</span>JIO
          </Typography>

          <Typography
            sx={{
              fontSize: 9,
              letterSpacing: "2px",
              color: "#aaa",
              mt: 0.5,
            }}
          >
            STYLE EDIT
          </Typography>
        </Box>

        {/* Categories */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 3,
            flex: 1,
          }}
        >
          {categories.map((category) => (
            <Box
              key={category.value}
              onClick={() => handleCategoryClick(category.value)}
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
                  transition: "transform 0.25s ease",
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
            backgroundColor: "#F7F5F0",
            borderRadius: "30px",
            px: 1.5,
            width: { xs: 140, sm: 210, md: 280 },
            height: 42,
          }}
        >
          <SearchIcon
            sx={{
              color: "#555",
              fontSize: 21,
            }}
          />

          <Box
            component="input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search styles..."
            sx={{
              border: "none",
              outline: "none",
              background: "transparent",
              width: "100%",
              px: 1,
              fontSize: 14,
              color: "#171717",
              "&::placeholder": {
                color: "#777",
              },
            }}
          />
        </Box>

<IconButton
  onClick={() => navigate("/support")}
  sx={{
    color: "#fff",
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
            ml: { xs: 0, md: 1 },
          }}
        >
          <IconButton
            onClick={() => navigate("/wishlist")}
            sx={{
              color: "#fff",
              "&:hover": {
                color: "#C8A96B",
              },
            }}
          >
            <FavoriteBorderIcon />
          </IconButton>

          <IconButton
            onClick={() => navigate("/cart")}
            sx={{
              color: "#fff",
              "&:hover": {
                color: "#C8A96B",
              },
            }}
          >
            <ShoppingBagOutlinedIcon />
          </IconButton>

          <IconButton
            onClick={() => navigate("/profile")}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              color: "#fff",
              "&:hover": {
                color: "#C8A96B",
              },
            }}
          >
           <PersonIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;