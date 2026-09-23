import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import api from "../services/api";
import { useThemeMode } from "../context/ThemeContext";

const SellerEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
    ? "0 10px 30px rgba(0, 0, 0, 0.35)"
    : "0 10px 30px rgba(182, 30, 202, 0.08)";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
    sizes: "",
    color: "",
  });

  // =========================
  // FETCH PRODUCT
  // =========================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const sellerToken = localStorage.getItem("sellerToken");

        if (!sellerToken) {
          navigate("/seller/login");
          return;
        }

        const response = await api.get(`/products/${id}`);

        const product = response.data.product;

        if (!product) {
          setAlert({
            type: "error",
            message: "Product not found.",
          });
          return;
        }

        setFormData({
          name: product.name || "",
          brand: product.brand || "",
          description: product.description || "",
          price: product.price || "",
          category: product.category || "",
          image: product.image || "",
          stock: product.stock || "",
          sizes: Array.isArray(product.sizes)
            ? product.sizes.join(", ")
            : product.sizes || "",
          color: product.color || "",
        });
      } catch (error) {
        console.error(
          "FETCH SELLER PRODUCT ERROR:",
          error
        );

        setAlert({
          type: "error",
          message:
            error.response?.data?.message ||
            "Failed to load product.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // UPDATE PRODUCT
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setAlert({
      type: "",
      message: "",
    });

    try {
      const sellerToken = localStorage.getItem("sellerToken");

      if (!sellerToken) {
        navigate("/seller/login");
        return;
      }

      setSaving(true);

      const response = await api.put(
        `/seller/products/${id}`,
        {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          sizes: formData.sizes
            .split(",")
            .map((size) => size.trim())
            .filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${sellerToken}`,
          },
        }
      );

      console.log(
        "SELLER PRODUCT UPDATED:",
        response.data
      );

      setAlert({
        type: "success",
        message: "Product updated successfully!",
      });

      setTimeout(() => {
        navigate("/seller/products");
      }, 1000);
    } catch (error) {
      console.error(
        "UPDATE SELLER PRODUCT ERROR:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("sellerToken");
        localStorage.removeItem("seller");

        navigate("/seller/login");
        return;
      }

      setAlert({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to update product.",
      });
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
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
  // UI
  // =========================

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 76px)",
        backgroundColor: pageBackground,
        px: { xs: 2, sm: 4, md: 6 },
        py: 5,
        transition: "background-color 0.3s ease",
      }}
    >
      <Box
        sx={{
          maxWidth: 850,
          mx: "auto",
          backgroundColor: cardBackground,
          border: `1px solid ${border}`,
          borderRadius: "12px",
          boxShadow,
          p: { xs: 3, sm: 5 },
          transition:
            "background-color 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* HEADER */}

        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: { xs: 26, sm: 32 },
              fontWeight: 800,
              color: primaryText,
            }}
          >
            Edit Product
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: secondaryText,
              mt: 0.5,
            }}
          >
            Update your product details.
          </Typography>
        </Box>

        {/* ALERT */}

        {alert.message && (
          <Alert
            severity={alert.type}
            sx={{
              mb: 3,
              borderRadius: "8px",
            }}
          >
            {alert.message}
          </Alert>
        )}

        {/* FORM */}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* PRODUCT NAME */}

          <CustomInput
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* BRAND */}

          <CustomInput
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />

          {/* DESCRIPTION */}

          <CustomInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            minRows={4}
            required
          />

          {/* PRICE + STOCK */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <CustomInput
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <CustomInput
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </Box>

          {/* CATEGORY + COLOR */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <CustomInput
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />

            <CustomInput
              label="Color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
            />
          </Box>

          {/* SIZES */}

          <CustomInput
            label="Sizes"
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            placeholder="Eg: S, M, L, XL"
          />

          {/* IMAGE */}

          <CustomInput
            label="Product Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />

          {/* BUTTONS */}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
              flexDirection: {
                xs: "column-reverse",
                sm: "row",
              },
            }}
          >
            <CustomButton
              type="button"
              variant="outlined"
              onClick={() =>
                navigate("/seller/products")
              }
              sx={{
                color: primaryText,
                borderColor: border,
                backgroundColor: "transparent",
                "&:hover": {
                  borderColor: accent,
                  backgroundColor: isLuxuryMode
                    ? "rgba(200, 169, 107, 0.08)"
                    : "rgba(182, 30, 202, 0.05)",
                },
              }}
            >
              Cancel
            </CustomButton>

            <CustomButton
              type="submit"
              disabled={saving}
              sx={{
                backgroundColor: accent,
                color: isLuxuryMode
                  ? "#171717"
                  : "#FFFFFF",
                "&:hover": {
                  backgroundColor: accentHover,
                },
              }}
            >
              {saving
                ? "Saving..."
                : "Update Product"}
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SellerEditProduct;