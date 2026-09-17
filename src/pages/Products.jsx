import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const mockProducts = [
  {
    id: 1,
    brand: "TRENDY WEAR",
    name: "Women Relaxed Fit Top",
    price: 899,
    category: "Women",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    brand: "URBAN STYLE",
    name: "Men Casual Shirt",
    price: 1299,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    brand: "FASHION HUB",
    name: "Women Straight Fit Jeans",
    price: 1599,
    category: "Women",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    brand: "STYLE HOUSE",
    name: "Men Slim Fit T-Shirt",
    price: 799,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    brand: "MODERN LOOK",
    name: "Women Floral Dress",
    price: 1899,
    category: "Women",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    brand: "URBAN EDGE",
    name: "Men Regular Fit Jeans",
    price: 1499,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 8,
    brand: "DAILY STYLE",
    name: "Men Casual Sneakers",
    price: 1999,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 9,
    brand: "KIDS WORLD",
    name: "Boys Casual T-Shirt & Shorts Set",
    price: 899,
    category: "Kids",
    image:
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 10,
    brand: "LITTLE STYLE",
    name: "Girls Floral Party Dress",
    price: 1299,
    category: "Kids",
    image:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 11,
    brand: "MINI TREND",
    name: "Kids Denim Jacket & Jeans Set",
    price: 1499,
    category: "Kids",
    image:
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 12,
    brand: "MINIMALIST",
    name: "Niacinamide 5% Face Serum",
    price: 599,
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 13,
    brand: "LAKME",
    name: "Matte Liquid Lipstick",
    price: 499,
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 14,
    brand: "L'OREAL PARIS",
    name: "Moisturizing Shampoo",
    price: 699,
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 15,
    brand: "DIESEL",
    name: "Only The Brave Eau De Toilette",
    price: 5368,
    category: "AJIO Luxe",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 16,
    brand: "EMPORIO ARMANI",
    name: "Luxury Eau De Parfum",
    price: 9800,
    category: "AJIO Luxe",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 17,
    brand: "JUICY COUTURE",
    name: "Viva La Rose Eau De Parfum",
    price: 3570,
    category: "AJIO Luxe",
    image:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=600&q=80",
  },
];

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("");
  const [wishlistItems, setWishlistItems] = useState([]);

  const [searchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category");

  const { addToCart } = useCart();

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products"
        );

        const backendProducts = response.data.products || [];

        if (backendProducts.length > 0) {
          setProducts(backendProducts);
        } else {
          setProducts(mockProducts);
        }
      } catch (error) {
        console.error(
          "Failed to fetch products:",
          error.response?.data || error.message
        );

        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by category
  const filteredProducts = selectedCategory
    ? products.filter(
        (product) => product.category === selectedCategory
      )
    : products;

  // Sort products
  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "low") {
      return a.price - b.price;
    }

    if (sort === "high") {
      return b.price - a.price;
    }

    if (sort === "name") {
      return a.name.localeCompare(b.name);
    }

    return 0;
  });

  // Wishlist toggle
  const handleWishlistToggle = (event, product) => {
    event.stopPropagation();

    const productId = product._id || product.id;

    setWishlistItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F9F2FA",
        minHeight: "100vh",
      }}
    >
      {/* Page Header + Style Spotlight */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #F9F2FA 0%, #F3E3F6 100%)",
          px: { xs: 3, md: 7 },
          py: { xs: 4, md: 5 },
          borderBottom: "1px solid #E8DCEB",
        }}
      >
        <Box
          sx={{
            maxWidth: 1400,
            mx: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          {/* Left Section */}
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: "#171717",
                mb: 1,
              }}
            >
              {selectedCategory || "Fashion"}
            </Typography>

            <Typography
              sx={{
                color: "#6B6B6B",
                fontSize: 16,
              }}
            >
              Discover the latest styles and trends
            </Typography>
          </Box>

          {/* Right Section */}
          <Box
            sx={{
              minWidth: { xs: "100%", md: 420 },
              textAlign: { xs: "left", md: "right" },
            }}
          >
            <Typography
              sx={{
                color: "#B61ECA",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "2px",
                mb: 0.5,
              }}
            >
              STYLE SPOTLIGHT
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: 22, md: 28 },
                fontWeight: 700,
                color: "#171717",
                mb: 0.5,
              }}
            >
              Curated looks for every mood
            </Typography>

            <Typography
              sx={{
                color: "#6B6B6B",
                fontSize: 14,
              }}
            >
              Explore styles made for your everyday moments.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Filter / Sort Bar */}
      <Box
        sx={{
          px: { xs: 2, md: 6 },
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #E8DCEB",
          gap: 2,
          flexWrap: "wrap",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {loading
            ? "Loading..."
            : `${sortedProducts.length} Products`}
        </Typography>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Sort By</InputLabel>

          <Select
            value={sort}
            label="Sort By"
            onChange={handleSortChange}
          >
            <MenuItem value="">Recommended</MenuItem>

            <MenuItem value="low">
              Price: Low to High
            </MenuItem>

            <MenuItem value="high">
              Price: High to Low
            </MenuItem>

            <MenuItem value="name">
              Name: A to Z
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Products */}
      <Box
        sx={{
          px: { xs: 2, md: 6 },
          py: 4,
        }}
      >
        <Grid container spacing={3}>
          {sortedProducts.map((product) => {
            const productId = product._id || product.id;

            const isWishlisted =
              wishlistItems.includes(productId);

            return (
              <Grid
                key={productId}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                  lg: 3,
                }}
              >
                <Card
                  elevation={0}
                  onClick={() =>
                    navigate("/product-details", {
                      state: { product },
                    })
                  }
                  sx={{
                    height: "100%",
                    border: "1px solid #E8DCEB",
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: "pointer",
                    backgroundColor: "#FFFFFF",
                    transition: "0.3s ease",
                    position: "relative",

                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow:
                        "0 12px 30px rgba(182,30,202,0.15)",
                    },
                  }}
                >
                  {/* Product Image */}
                  <Box
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="320"
                      image={product.image}
                      alt={product.name}
                      sx={{
                        objectFit: "cover",
                        transition: "0.4s ease",

                        "&:hover": {
                          transform: "scale(1.04)",
                        },
                      }}
                    />

                    {/* Trending Badge */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        backgroundColor: "#B61ECA",
                        color: "#FFFFFF",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "20px",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.8px",
                      }}
                    >
                      TRENDING
                    </Box>

                    {/* Wishlist Button */}
                    <Box
                      onClick={(event) =>
                        handleWishlistToggle(event, product)
                      }
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor:
                          "rgba(255,255,255,0.95)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "0.2s",

                        "&:hover": {
                          backgroundColor: "#B61ECA",
                          color: "#FFFFFF",
                        },
                      }}
                    >
                      {isWishlisted ? (
                        <FavoriteIcon
                          sx={{
                            color: "#B61ECA",
                            fontSize: 22,
                          }}
                        />
                      ) : (
                        <FavoriteBorderIcon
                          sx={{
                            fontSize: 22,
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Product Details */}
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: "#B61ECA",
                        mb: 0.5,
                        fontSize: 12,
                        letterSpacing: "0.5px",
                      }}
                    >
                      {product.brand}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        mb: 1.5,
                        color: "#171717",
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        mb: 2,
                        color: "#171717",
                      }}
                    >
                      ₹{product.price.toLocaleString("en-IN")}
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={(event) => {
                        event.stopPropagation();
                        addToCart(product, 1);
                      }}
                      sx={{
                        backgroundColor: "#B61ECA",
                        color: "#FFFFFF",
                        textTransform: "none",
                        fontWeight: 600,
                        py: 1.1,
                        borderRadius: "6px",

                        "&:hover": {
                          backgroundColor: "#9615A8",
                        },
                      }}
                    >
                      Add to Bag
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default Products;