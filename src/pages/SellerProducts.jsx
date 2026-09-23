import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import AddIcon from "@mui/icons-material/Add";

import api from "../services/api";
import { useThemeMode } from "../context/ThemeContext";

const SellerProducts = () => {
  const navigate = useNavigate();

  const { isLuxuryMode } = useThemeMode();

  // =========================
  // THEME COLORS
  // =========================

  const pageBackground = isLuxuryMode ? "#0F0F0F" : "#F9F2FA";
  const cardBackground = isLuxuryMode ? "#1A1A1A" : "#FFFFFF";
  const primaryText = isLuxuryMode ? "#FFFFFF" : "#171717";
  const secondaryText = isLuxuryMode ? "#BDBDBD" : "#6B6B6B";

  const accent = isLuxuryMode ? "#C8A96B" : "#B61ECA";
  const accentHover = isLuxuryMode ? "#E0C080" : "#9615A8";

  const border = isLuxuryMode ? "#333333" : "#E8DCEB";

  const boxShadow = isLuxuryMode
    ? "0 8px 25px rgba(0, 0, 0, 0.30)"
    : "0 8px 25px rgba(182, 30, 202, 0.06)";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // DELETE SELLER PRODUCT
  // =========================

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const sellerToken =
        localStorage.getItem("sellerToken");

      if (!sellerToken) {
        navigate("/seller/login");
        return;
      }

      await api.delete(
        `/seller/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${sellerToken}`,
          },
        }
      );

      // Remove deleted product from current list
      setProducts((prev) =>
        prev.filter(
          (product) => product._id !== productId
        )
      );
    } catch (error) {
      console.error(
        "DELETE SELLER PRODUCT ERROR:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("sellerToken");
        localStorage.removeItem("seller");

        navigate("/seller/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  // =========================
  // FETCH SELLER PRODUCTS
  // =========================

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const sellerToken =
          localStorage.getItem("sellerToken");

        if (!sellerToken) {
          navigate("/seller/login");
          return;
        }

        const response = await api.get(
          "/seller/products",
          {
            headers: {
              Authorization: `Bearer ${sellerToken}`,
            },
          }
        );

        console.log(
          "SELLER PRODUCTS RESPONSE:",
          response.data
        );

        setProducts(
          response.data.products || []
        );
      } catch (error) {
        console.error(
          "SELLER PRODUCTS ERROR:",
          error
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("sellerToken");
          localStorage.removeItem("seller");

          navigate("/seller/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load seller products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProducts();
  }, [navigate]);

  // =========================
  // LOADING STATE
  // =========================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: pageBackground,
        }}
      >
        <CircularProgress
          sx={{
            color: accent,
          }}
        />
      </Box>
    );
  }

  // =========================
  // ERROR STATE
  // =========================

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          backgroundColor: pageBackground,
          px: {
            xs: 2,
            sm: 4,
            md: 6,
          },
          py: 5,
        }}
      >
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 76px)",
        backgroundColor: pageBackground,
        px: {
          xs: 2,
          sm: 4,
          md: 6,
        },
        py: 5,
        transition: "background-color 0.3s ease",
      }}
    >
      {/* =========================
          PAGE HEADER
      ========================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: 26,
                sm: 32,
              },
              fontWeight: 800,
              color: primaryText,
            }}
          >
            My Products
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: secondaryText,
              mt: 0.5,
            }}
          >
            Manage your store products
          </Typography>
        </Box>

        {/* Add Product */}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            navigate("/seller/products/add")
          }
          sx={{
            backgroundColor: accent,
            color: isLuxuryMode
              ? "#171717"
              : "#FFFFFF",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "7px",
            px: 2.5,
            py: 1.2,

            "&:hover": {
              backgroundColor: accentHover,
            },
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* =========================
          EMPTY STATE
      ========================= */}

      {products.length === 0 && (
        <Box
          sx={{
            backgroundColor: cardBackground,
            border: `1px solid ${border}`,
            borderRadius: "12px",
            minHeight: 300,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            px: 3,
            boxShadow,
            transition:
              "background-color 0.3s ease, border-color 0.3s ease",
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 700,
              color: primaryText,
              mb: 1,
            }}
          >
            No Products Yet
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: secondaryText,
              mb: 3,
            }}
          >
            Start adding products to your store.
          </Typography>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() =>
              navigate("/seller/products/add")
            }
            sx={{
              color: accent,
              borderColor: accent,
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "7px",

              "&:hover": {
                borderColor: accentHover,
                backgroundColor: isLuxuryMode
                  ? "rgba(200, 169, 107, 0.08)"
                  : "#F9F2FA",
              },
            }}
          >
            Add Your First Product
          </Button>
        </Box>
      )}

      {/* =========================
          PRODUCTS
      ========================= */}

      {products.length > 0 && (
        <Box
          sx={{
            backgroundColor: cardBackground,
            border: `1px solid ${border}`,
            borderRadius: "12px",
            p: {
              xs: 2,
              sm: 3,
            },
            transition:
              "background-color 0.3s ease, border-color 0.3s ease",
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 700,
              color: primaryText,
              mb: 3,
            }}
          >
            Your Products ({products.length})
          </Typography>

          {products.map((product) => (
            <Box
              key={product._id}
              sx={{
                borderBottom: `1px solid ${border}`,
                py: 2,

                "&:last-child": {
                  borderBottom: "none",
                },
              }}
            >
              {/* Product Name */}

              <Typography
                sx={{
                  fontWeight: 700,
                  color: primaryText,
                }}
              >
                {product.name}
              </Typography>

              {/* Price + Stock */}

              <Typography
                sx={{
                  fontSize: 14,
                  color: secondaryText,
                  mt: 0.5,
                }}
              >
                ₹{product.price} · Stock:{" "}
                {product.stock}
              </Typography>

              {/* =========================
                  ACTION BUTTONS
              ========================= */}

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  mt: 1.5,
                }}
              >
                {/* Edit */}

                <Button
                  variant="outlined"
                  onClick={() =>
                    navigate(
                      `/seller/products/${product._id}/edit`
                    )
                  }
                  sx={{
                    color: accent,
                    borderColor: accent,
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: "7px",

                    "&:hover": {
                      borderColor: accentHover,
                      backgroundColor:
                        isLuxuryMode
                          ? "rgba(200, 169, 107, 0.08)"
                          : "#F9F2FA",
                    },
                  }}
                >
                  Edit Product
                </Button>

                {/* Delete */}

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() =>
                    handleDelete(product._id)
                  }
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: "7px",
                  }}
                >
                  Delete Product
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SellerProducts;