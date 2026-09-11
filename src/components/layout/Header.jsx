import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "MEN", value: "Men" },
    { name: "WOMEN", value: "Women" },
    { name: "KIDS", value: "Kids" },
    { name: "BEAUTY", value: "Beauty" },
    { name: "AJIO LUXE", value: "AJIO Luxe" },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <AppBar
      position="static"
      color="primary"
      elevation={0}
    >
      <Toolbar
        sx={{
          minHeight: "70px",
          px: { xs: 2, md: 5 },
          gap: 3,
        }}
      >
        {/* Logo */}
        <Typography
          variant="h5"
          onClick={() => navigate("/")}
          sx={{
            fontWeight: 800,
            letterSpacing: "1px",
            mr: { xs: 1, md: 4 },
            cursor: "pointer",
          }}
        >
          AJIO
        </Typography>

        {/* Navigation */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 3,
            flex: 1,
          }}
        >
          {categories.map((category) => (
            <Typography
              key={category.value}
              onClick={() => handleCategoryClick(category.value)}
              sx={{
                cursor: "pointer",
                fontWeight: 500,
                "&:hover": {
                  opacity: 0.7,
                },
              }}
            >
              {category.name}
            </Typography>
          ))}
        </Box>

        {/* Search */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "4px",
            px: 1.5,
            width: { sm: 180, md: 250 },
          }}
        >
          <SearchIcon sx={{ color: "#555" }} />

          <Box
            component="input"
            placeholder="Search"
            sx={{
              border: "none",
              outline: "none",
              width: "100%",
              px: 1,
              py: 1,
              fontSize: "14px",
            }}
          />
        </Box>

        {/* Icons */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton sx={{ color: "#fff" }}>
            <FavoriteBorderIcon />
          </IconButton>

          <IconButton sx={{ color: "#fff" }}>
            <ShoppingBagOutlinedIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;