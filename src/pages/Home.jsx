import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import heroImage from "../assets/hero.png";

const categories = [
  {
    title: "Women",
    value: "Women",
    subtitle: "New styles for every occasion",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Men",
    value: "Men",
    subtitle: "Everyday essentials & trends",
    image:
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Kids",
    value: "Kids",
    subtitle: "Fun styles for little ones",
    image:
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Beauty",
    value: "Beauty",
    subtitle: "Beauty & personal care",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "AJIO Luxe",
    value: "AJIO Luxe",
    subtitle: "Premium fashion & beauty",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
  },
];

const featuredProducts = [
  {
    title: "Trending Fashion",
    subtitle: "Discover the latest styles",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Everyday Essentials",
    subtitle: "Comfort meets style",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Premium Collection",
    subtitle: "Elevate your wardrobe",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "New Arrivals",
    subtitle: "Fresh looks just for you",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
  },
];

const Home = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(
      `/products?category=${encodeURIComponent(category)}`
    );
  };

  return (
    <Box sx={{ backgroundColor: "#fff" }}>
     {/* ================= HERO SECTION ================= */}
<Box
  sx={{
    position: "relative",
    minHeight: { xs: 460, sm: 520, md: 620 },
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#eeeae5",
  }}
>
  {/* Hero Image */}
  <Box
    component="img"
    src={heroImage}
    alt="New season fashion collection"
    sx={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center",
    }}
  />

  {/* Premium Overlay */}
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(90deg, rgba(238,234,229,0.98) 0%, rgba(238,234,229,0.90) 25%, rgba(238,234,229,0.35) 50%, rgba(238,234,229,0.05) 75%, rgba(238,234,229,0) 100%)",
    }}
  />

  {/* Hero Content */}
  <Box
    sx={{
      position: "relative",
      zIndex: 2,
      width: "100%",
      maxWidth: "1400px",
      mx: "auto",
      px: { xs: 3, sm: 5, md: 8 },
      py: { xs: 4, sm: 6, md: 8 },
    }}
  >
    <Typography
      sx={{
        fontSize: { xs: "13px", md: "15px" },
        letterSpacing: "4px",
        fontWeight: 700,
        color: "#444",
        mb: 2,
      }}
    >
      NEW SEASON
    </Typography>

    <Typography
      sx={{
        fontSize: {
         xs: "42px",
         sm: "58px",
         md: "82px",
         },
        lineHeight: 0.95,
        fontWeight: 800,
        letterSpacing: "-2px",
        color: "#111",
        mb: { xs: 2, md: 3 },
      }}
    >
      Style
      <br />
      Starts Here.
    </Typography>

    <Typography
      sx={{
        fontSize: { xs: "15px", sm: "17px", md: "19px" },
        lineHeight: { xs: 1.5, md: 1.6 },
        color: "#555",
        maxWidth: { xs: 360, md: 470 },
        mb: { xs: 3, md: 4 },
      }}
    >
      Discover fashion, beauty and everyday essentials
      designed for your style.
    </Typography>

    <Button
      variant="contained"
      size="large"
      endIcon={<ArrowForwardIcon />}
      onClick={() => navigate("/products")}
      sx={{
        backgroundColor: "#111",
        color: "#fff",
        width: { xs: "100%", sm: "auto" },
        px: { xs: 2, sm: 4 },
        py: { xs: 1.4, sm: 1.6 },
        borderRadius: "4px",
        fontSize: "15px",
        fontWeight: 700,
        textTransform: "none",
        "&:hover": {
          backgroundColor: "#333",
        },
      }}
    >
      Shop Now
    </Button>
  </Box>

  {/* Bottom Label */}
  <Box
    sx={{
      position: "absolute",
      bottom: 25,
      right: { xs: 20, md: 50 },
      zIndex: 2,
    }}
  >
    <Typography
      sx={{
        color: "#fff",
        fontSize: "12px",
        letterSpacing: "3px",
        fontWeight: 600,
        textShadow: "0 1px 5px rgba(0,0,0,0.5)",
      }}
    >
      THE LATEST EDIT
    </Typography>
  </Box>
</Box>

      {/* ================= SHOP BY CATEGORY ================= */}
      <Box
        sx={{
          px: { xs: 2, md: 6 },
          py: { xs: 4, sm: 5, md: 7 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Shop by Category
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Find your style
        </Typography>

        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid
              key={category.title}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                lg: 2.4,
              }}
            >
              <Paper
  elevation={0}
  onClick={() => handleCategoryClick(category.value)}
  sx={{
    minHeight: { xs: 280, sm: 320 },
    p: { xs: 2, sm: 3 },
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",

    backgroundImage: `
      linear-gradient(
        to top,
        rgba(0,0,0,0.75) 0%,
        rgba(0,0,0,0.25) 55%,
        rgba(0,0,0,0.05) 100%
      ),
      url(${category.image})
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",

    borderRadius: 0,
    cursor: "pointer",
    overflow: "hidden",
    transition: "0.3s",

    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
    },
  }}
>
  <Typography
    variant="h5"
    sx={{
      fontWeight: 700,
      color: "#fff",
    }}
  >
    {category.title}
  </Typography>

  <Typography
    variant="body2"
    sx={{
      mt: 1,
      color: "rgba(255,255,255,0.9)",
    }}
  >
    {category.subtitle}
  </Typography>

  <Typography
    sx={{
      mt: 2,
      fontWeight: 600,
      fontSize: 14,
      color: "#fff",
    }}
  >
    Explore →
  </Typography>
</Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ================= FEATURED COLLECTIONS ================= */}
     <Grid
  container
  spacing={2}
  sx={{
    width: "100%",
    margin: 0,
  }}
>
  {featuredProducts.map((product) => (
    <Grid
      key={product.title}
      size={{
        xs: 12,
        sm: 6,
        md: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          minHeight: 360,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          p: 3,

          backgroundImage: `
            linear-gradient(
              to top,
              rgba(0,0,0,0.8) 0%,
              rgba(0,0,0,0.3) 55%,
              rgba(0,0,0,0.05) 100%
            ),
            url(${product.image})
          `,

          backgroundSize: "cover",
          backgroundPosition: "center",

          border: "1px solid #e5e5e5",
          cursor: "pointer",
          transition: "0.3s",

          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {product.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {product.subtitle}
        </Typography>

        <Button
          variant="text"
          onClick={() => navigate("/products")}
          sx={{
            alignSelf: "flex-start",
            px: 0,
            mt: 2,
            color: "#fff",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "transparent",
              opacity: 0.8,
            },
          }}
        >
          View Collection →
        </Button>
      </Box>
    </Grid>
  ))}
</Grid>

      {/* ================= BOTTOM CTA ================= */}
      <Box
        sx={{
          textAlign: "center",
          px: 2,
          py: { xs: 5, md: 8 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Your Style. Your Choice.
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mb: 3,
            maxWidth: 600,
            mx: "auto",
          }}
        >
          Explore our latest collections and find something
          made for you.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/products")}
          sx={{
            backgroundColor: "#111",
            px: 4,
            py: 1.3,
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          Explore Now
        </Button>
      </Box>
    </Box>
  );
};

export default Home;