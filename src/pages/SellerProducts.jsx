import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import AddIcon from "@mui/icons-material/Add";

import api from "../services/api";

const SellerProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Delete seller product
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const sellerToken = localStorage.getItem("sellerToken");

      if (!sellerToken) {
        navigate("/seller/login");
        return;
      }

      await api.delete(`/seller/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${sellerToken}`,
        },
      });

      // Remove deleted product from current list
      setProducts((prev) =>
        prev.filter((product) => product._id !== productId)
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

  // Fetch seller products
  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const sellerToken = localStorage.getItem("sellerToken");

        if (!sellerToken) {
          navigate("/seller/login");
          return;
        }

        const response = await api.get("/seller/products", {
          headers: {
            Authorization: `Bearer ${sellerToken}`,
          },
        });

        console.log(
          "SELLER PRODUCTS RESPONSE:",
          response.data
        );

        setProducts(response.data.products || []);
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

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress
          sx={{
            color: "#B61ECA",
          }}
        />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          background: "#F9F2FA",
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

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 76px)",
        background: "#F9F2FA",
        px: {
          xs: 2,
          sm: 4,
          md: 6,
        },
        py: 5,
      }}
    >
      {/* Page Header */}
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
              color: "#171717",
            }}
          >
            My Products
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: "#6B6B6B",
              mt: 0.5,
            }}
          >
            Manage your store products
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            navigate("/seller/products/add")
          }
          sx={{
            backgroundColor: "#B61ECA",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "7px",
            px: 2.5,
            py: 1.2,
            "&:hover": {
              backgroundColor: "#9615A8",
            },
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* Empty State */}
      {products.length === 0 && (
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8DCEB",
            borderRadius: "12px",
            minHeight: 300,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            px: 3,
            boxShadow:
              "0 8px 25px rgba(182, 30, 202, 0.06)",
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 700,
              color: "#171717",
              mb: 1,
            }}
          >
            No Products Yet
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: "#6B6B6B",
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
              color: "#B61ECA",
              borderColor: "#B61ECA",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "7px",
              "&:hover": {
                borderColor: "#9615A8",
                backgroundColor: "#F9F2FA",
              },
            }}
          >
            Add Your First Product
          </Button>
        </Box>
      )}

      {/* Products */}
      {products.length > 0 && (
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8DCEB",
            borderRadius: "12px",
            p: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 700,
              color: "#171717",
              mb: 3,
            }}
          >
            Your Products ({products.length})
          </Typography>

          {products.map((product) => (
            <Box
              key={product._id}
              sx={{
                borderBottom: "1px solid #E8DCEB",
                py: 2,
                "&:last-child": {
                  borderBottom: "none",
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#171717",
                }}
              >
                {product.name}
              </Typography>

              <Typography
                sx={{
                  fontSize: 14,
                  color: "#6B6B6B",
                  mt: 0.5,
                }}
              >
                ₹{product.price} · Stock: {product.stock}
              </Typography>

              {/* Edit Button */}
              <Button
                variant="outlined"
                onClick={() =>
                  navigate(
                    `/seller/products/${product._id}/edit`
                  )
                }
                sx={{
                  mt: 1.5,
                  color: "#B61ECA",
                  borderColor: "#B61ECA",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "7px",
                  mr: 1,
                  "&:hover": {
                    borderColor: "#9615A8",
                    backgroundColor: "#F9F2FA",
                  },
                }}
              >
                Edit Product
              </Button>

              {/* Delete Button */}
              <Button
                variant="outlined"
                color="error"
                onClick={() =>
                  handleDelete(product._id)
                }
                sx={{
                  mt: 1.5,
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "7px",
                }}
              >
                Delete Product
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SellerProducts;