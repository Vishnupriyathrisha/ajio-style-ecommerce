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
  const [searchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category");

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products"
        );

        const backendProducts = response.data.products || [];

        // Use backend products when available.
        // Keep mock products as fallback while database is empty.
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

        // Keep existing mock products if backend is unavailable
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(
        (product) => product.category === selectedCategory
      )
    : products;

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };
  const { addToCart } = useCart();
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

  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* Page Header */}
      <Box
        sx={{
          px: { xs: 2, md: 6 },
          pt: 5,
          pb: 3,
          borderBottom: "1px solid #e5e5e5",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          {selectedCategory || "Fashion"}
        </Typography>

        <Typography color="text.secondary">
          Discover the latest styles and trends
        </Typography>
      </Box>

      {/* Filter / Sort Bar */}
      <Box
        sx={{
          px: { xs: 2, md: 6 },
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e5e5",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="body2" color="text.secondary">
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
          {sortedProducts.map((product) => (
            <Grid
              key={product._id || product.id}
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
                  border: "1px solid #e5e5e5",
                  borderRadius: 0,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow:
                      "0 8px 25px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="320"
                  image={product.image}
                  alt={product.name}
                  sx={{
                    objectFit: "cover",
                  }}
                />

                <CardContent sx={{ p: 2.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: "#555",
                      mb: 0.5,
                    }}
                  >
                    {product.brand}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      mb: 1.5,
                    }}
                  >
                    {product.name}
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    ₹{product.price.toLocaleString("en-IN")}
                  </Typography>

                  <Button
                      fullWidth
                      variant="contained"
                      onClick={(event) => {
  event.stopPropagation();
  console.log("ADD TO BAG CLICKED:", product);
  addToCart(product, 1);
}}
                     sx={{
                      backgroundColor: "#111",
                      color: "#fff",
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.1,
                      borderRadius: "4px",
                      "&:hover": {
                        backgroundColor: "#333",
                      },
                    }}
                  >
                    Add to Bag
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Products;