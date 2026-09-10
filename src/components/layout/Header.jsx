import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Header = () => {
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
          sx={{
            fontWeight: 800,
            letterSpacing: "1px",
            mr: { xs: 1, md: 4 },
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
          <Typography sx={{ cursor: "pointer" }}>
            MEN
          </Typography>

          <Typography sx={{ cursor: "pointer" }}>
            WOMEN
          </Typography>

          <Typography sx={{ cursor: "pointer" }}>
            KIDS
          </Typography>

          <Typography sx={{ cursor: "pointer" }}>
            BEAUTY
          </Typography>

          <Typography sx={{ cursor: "pointer" }}>
            AJIO LUXE
          </Typography>
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