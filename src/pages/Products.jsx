import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Button,
} from "@mui/material";

import { useCart } from "../context/CartContext";
import { useThemeMode } from "../context/ThemeContext";
import ProductCard from "../components/common/ProductCard";

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
  const [searchParams] = useSearchParams();

  const { addToCart } = useCart();
  const { isLuxuryMode } = useThemeMode();

  const selectedCategory =
    searchParams.get("category") || "";

  const searchQuery =
    searchParams.get("search") || "";

  // ================= THEME COLORS =================

  const pageBackground = isLuxuryMode
    ? "#0F0F0F"
    : "#F9F2FA";

  const sectionBackground = isLuxuryMode
    ? "#151515"
    : "#FFFFFF";

  const cardSectionBackground = isLuxuryMode
    ? "#111111"
    : "#F9F2FA";

  const primaryText = isLuxuryMode
    ? "#FFFFFF"
    : "#171717";

  const secondaryText = isLuxuryMode
    ? "#BDBDBD"
    : "#6B6B6B";

  const accent = isLuxuryMode
    ? "#C8A96B"
    : "#B61ECA";

  const accentHover = isLuxuryMode
    ? "#E0C080"
    : "#9615A8";

  const border = isLuxuryMode
    ? "#333333"
    : "#E8DCEB";

  // ================= PRODUCTS =================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  // ================= SORT =================

  const [sort, setSort] = useState("");

  // ================= WISHLIST =================

  const [wishlistItems, setWishlistItems] = useState([]);

  // ================= PAGINATION =================

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 12,
    totalProducts: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // ================= RESET PAGE =================

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchQuery, sort]);

  // ================= FETCH PRODUCTS =================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "http://localhost:5000/api/products",
          {
            params: {
              page,
              limit: 12,
              category:
                selectedCategory || undefined,
              search:
                searchQuery.trim() || undefined,
              sort: sort || undefined,
            },
          }
        );

        const backendProducts =
          response.data.products || [];

        setProducts(backendProducts);

        setPagination(
          response.data.pagination || {
            currentPage: page,
            limit: 12,
            totalProducts:
              backendProducts.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: page > 1,
          }
        );
      } catch (error) {
        console.error(
          "Failed to fetch products:",
          error.response?.data ||
            error.message
        );

        /*
         * Fallback for development
         */

        let fallbackProducts = [
          ...mockProducts,
        ];

        // Category filter

        if (selectedCategory) {
          fallbackProducts =
            fallbackProducts.filter(
              (product) =>
                product.category ===
                selectedCategory
            );
        }

        // Search filter

        if (searchQuery.trim()) {
          const searchText =
            searchQuery
              .trim()
              .toLowerCase();

          fallbackProducts =
            fallbackProducts.filter(
              (product) =>
                product.name
                  .toLowerCase()
                  .includes(searchText) ||
                product.brand
                  .toLowerCase()
                  .includes(searchText) ||
                product.category
                  .toLowerCase()
                  .includes(searchText)
            );
        }

        // Sort

        if (sort === "low") {
          fallbackProducts.sort(
            (a, b) => a.price - b.price
          );
        }

        if (sort === "high") {
          fallbackProducts.sort(
            (a, b) => b.price - a.price
          );
        }

        if (sort === "name") {
          fallbackProducts.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        }

        const totalProducts =
          fallbackProducts.length;

        const limit = 12;

        const totalPages =
          Math.ceil(
            totalProducts / limit
          ) || 1;

        const startIndex =
          (page - 1) * limit;

        const paginatedProducts =
          fallbackProducts.slice(
            startIndex,
            startIndex + limit
          );

        setProducts(
          paginatedProducts
        );

        setPagination({
          currentPage: page,
          limit,
          totalProducts,
          totalPages,
          hasNextPage:
            page < totalPages,
          hasPreviousPage:
            page > 1,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    page,
    selectedCategory,
    searchQuery,
    sort,
  ]);

  // ================= SORT =================

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  // ================= WISHLIST =================

  const handleWishlistToggle = (
    event,
    product
  ) => {
    event.stopPropagation();

    const productId =
      product._id || product.id;

    setWishlistItems((prev) =>
      prev.includes(productId)
        ? prev.filter(
            (id) => id !== productId
          )
        : [...prev, productId]
    );
  };

  // ================= ADD TO CART =================

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  // ================= NEXT PAGE =================

  const handleNextPage = () => {
    if (!pagination.hasNextPage) {
      return;
    }

    setPage((prev) => prev + 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= PREVIOUS PAGE =================

  const handlePreviousPage = () => {
    if (!pagination.hasPreviousPage) {
      return;
    }

    setPage((prev) => prev - 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",

        backgroundColor: pageBackground,

        transition:
          "background-color 0.3s ease",
      }}
    >
      {/* ================= PAGE HEADER ================= */}

      <Box
        sx={{
          background: isLuxuryMode
            ? "linear-gradient(135deg, #111111 0%, #1D1D1D 100%)"
            : "linear-gradient(135deg, #F9F2FA 0%, #F3E3F6 100%)",

          px: {
            xs: 2,
            sm: 3,
            md: 6,
          },

          py: {
            xs: 3,
            sm: 4,
            md: 5,
          },

          borderBottom:
            `1px solid ${border}`,

          transition:
            "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        <Box
          sx={{
            maxWidth: 1400,

            mx: "auto",

            display: "flex",

            alignItems: {
              xs: "flex-start",
              md: "center",
            },

            justifyContent:
              "space-between",

            gap: {
              xs: 2,
              md: 4,
            },

            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >
          {/* ================= LEFT ================= */}

          <Box>
            <Typography
              sx={{
                fontWeight: 800,

                color: primaryText,

                fontSize: {
                  xs: 30,
                  sm: 36,
                  md: 42,
                },

                lineHeight: 1.15,

                mb: 1,

                transition:
                  "color 0.3s ease",
              }}
            >
              {selectedCategory ||
                (searchQuery
                  ? `Search: ${searchQuery}`
                  : "Fashion")}
            </Typography>

            <Typography
              sx={{
                color: secondaryText,

                fontSize: {
                  xs: 14,
                  sm: 15,
                  md: 16,
                },

                transition:
                  "color 0.3s ease",
              }}
            >
              Discover the latest styles
              and trends
            </Typography>
          </Box>

          {/* ================= RIGHT ================= */}

          <Box
            sx={{
              width: {
                xs: "100%",
                md: "auto",
              },

              textAlign: {
                xs: "left",
                md: "right",
              },
            }}
          >
            <Typography
              sx={{
                color: accent,

                fontSize: 11,

                fontWeight: 800,

                letterSpacing: "2px",

                mb: 0.5,

                transition:
                  "color 0.3s ease",
              }}
            >
              STYLE SPOTLIGHT
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: 20,
                  sm: 24,
                  md: 28,
                },

                fontWeight: 700,

                color: primaryText,

                mb: 0.5,

                transition:
                  "color 0.3s ease",
              }}
            >
              Curated looks for every mood
            </Typography>

            <Typography
              sx={{
                color: secondaryText,

                fontSize: {
                  xs: 13,
                  md: 14,
                },

                transition:
                  "color 0.3s ease",
              }}
            >
              Explore styles made for
              your everyday moments.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ================= FILTER / SORT ================= */}

      <Box
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 6,
          },

          py: {
            xs: 1.5,
            md: 2,
          },

          display: "flex",

          justifyContent:
            "space-between",

          alignItems: {
            xs: "stretch",
            sm: "center",
          },

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          gap: {
            xs: 1.5,
            sm: 2,
          },

          borderBottom:
            `1px solid ${border}`,

          backgroundColor:
            sectionBackground,

          transition:
            "background-color 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* Product Count */}

        <Typography
          sx={{
            color: secondaryText,

            fontSize: {
              xs: 13,
              sm: 14,
            },

            transition:
              "color 0.3s ease",
          }}
        >
          {loading
            ? "Loading..."
            : `${pagination.totalProducts} Products`}
        </Typography>

        {/* Sort */}

        <FormControl
          size="small"
          sx={{
            width: {
              xs: "100%",
              sm: 180,
            },
          }}
        >
          <InputLabel
            sx={{
              color: secondaryText,

              "&.Mui-focused": {
                color: accent,
              },
            }}
          >
            Sort By
          </InputLabel>

          <Select
            value={sort}
            label="Sort By"
            onChange={handleSortChange}
            sx={{
              backgroundColor:
                isLuxuryMode
                  ? "#222222"
                  : "#FFFFFF",

              color: primaryText,

              minHeight: 44,

              "& .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: border,
                },

              "&:hover .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: accent,
                },

              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: accent,
                },

              "& .MuiSvgIcon-root": {
                color: accent,
              },
            }}
          >
            <MenuItem value="">
              Recommended
            </MenuItem>

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

      {/* ================= PRODUCTS SECTION ================= */}

      <Box
        sx={{
          maxWidth: 1500,

          mx: "auto",

          px: {
            xs: 1.5,
            sm: 3,
            md: 5,
            lg: 6,
          },

          py: {
            xs: 2.5,
            sm: 3.5,
            md: 4.5,
          },

          backgroundColor:
            cardSectionBackground,

          transition:
            "background-color 0.3s ease",
        }}
      >
        {/* ================= LOADING ================= */}

        {loading ? (
          <Box
            sx={{
              minHeight: 400,

              display: "flex",

              alignItems: "center",

              justifyContent:
                "center",
            }}
          >
            <CircularProgress
              sx={{
                color: accent,
              }}
            />
          </Box>
        ) : products.length === 0 ? (
          /* ================= EMPTY ================= */

          <Box
            sx={{
              minHeight: 350,

              display: "flex",

              flexDirection:
                "column",

              alignItems: "center",

              justifyContent:
                "center",

              textAlign: "center",

              px: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: 20,
                  md: 24,
                },

                fontWeight: 700,

                color: primaryText,

                mb: 1,
              }}
            >
              No products found
            </Typography>

            <Typography
              sx={{
                color: secondaryText,

                fontSize: 14,
              }}
            >
              Try another category
              or search term.
            </Typography>
          </Box>
        ) : (
          <>
            {/* ================= PRODUCT GRID ================= */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                },

                gap: {
                  xs: 2.5,
                  sm: 3,
                  md: 3.5,
                  lg: 4,
                },

                alignItems:
                  "stretch",
              }}
            >
              {products.map(
                (product) => {
                  const productId =
                    product._id ||
                    product.id;

                  const isWishlisted =
                    wishlistItems.includes(
                      productId
                    );

                  return (
                    <ProductCard
                      key={productId}
                      product={product}
                      isWishlisted={
                        isWishlisted
                      }
                      onWishlistToggle={
                        handleWishlistToggle
                      }
                      onAddToCart={
                        handleAddToCart
                      }
                    />
                  );
                }
              )}
            </Box>

            {/* ================= PAGINATION ================= */}

            {pagination.totalPages >
              1 && (
              <Box
                sx={{
                  display: "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  gap: {
                    xs: 1.5,
                    sm: 2,
                  },

                  mt: {
                    xs: 3,
                    sm: 4,
                  },

                  pb: {
                    xs: 1,
                    sm: 2,
                  },
                }}
              >
                {/* Previous */}

                <Button
                  variant="outlined"
                  disabled={
                    !pagination.hasPreviousPage
                  }
                  onClick={
                    handlePreviousPage
                  }
                  sx={{
                    minWidth: {
                      xs: 100,
                      sm: 110,
                    },

                    minHeight: 44,

                    borderColor: accent,

                    color: accent,

                    textTransform:
                      "none",

                    fontWeight: 700,

                    borderRadius: "7px",

                    "&:hover": {
                      borderColor:
                        accentHover,

                      backgroundColor:
                        isLuxuryMode
                          ? "#222222"
                          : "#F9F2FA",
                    },

                    "&.Mui-disabled": {
                      borderColor:
                        isLuxuryMode
                          ? "#444444"
                          : "#E8DCEB",

                      color:
                        isLuxuryMode
                          ? "#666666"
                          : "#BDBDBD",
                    },
                  }}
                >
                  Previous
                </Button>

                {/* Page Number */}

                <Typography
                  sx={{
                    minWidth: {
                      xs: 55,
                      sm: 70,
                    },

                    textAlign:
                      "center",

                    fontWeight: 700,

                    color: primaryText,

                    fontSize: {
                      xs: 14,
                      sm: 15,
                    },
                  }}
                >
                  {pagination.currentPage}{" "}
                  /{" "}
                  {pagination.totalPages}
                </Typography>

                {/* Next */}

                <Button
                  variant="contained"
                  disabled={
                    !pagination.hasNextPage
                  }
                  onClick={
                    handleNextPage
                  }
                  sx={{
                    minWidth: {
                      xs: 100,
                      sm: 110,
                    },

                    minHeight: 44,

                    backgroundColor:
                      accent,

                    color: isLuxuryMode
                      ? "#171717"
                      : "#FFFFFF",

                    textTransform:
                      "none",

                    fontWeight: 700,

                    borderRadius: "7px",

                    boxShadow:
                      "none",

                    "&:hover": {
                      backgroundColor:
                        accentHover,

                      boxShadow:
                        "none",
                    },

                    "&.Mui-disabled": {
                      backgroundColor:
                        isLuxuryMode
                          ? "#333333"
                          : "#E8DCEB",

                      color:
                        isLuxuryMode
                          ? "#666666"
                          : "#AAAAAA",
                    },
                  }}
                >
                  Next
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Products;