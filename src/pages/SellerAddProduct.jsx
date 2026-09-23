import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import api from "../services/api";
import { useThemeMode } from "../context/ThemeContext";

const SellerAddProduct = () => {
  const navigate = useNavigate();

  const { isLuxuryMode } = useThemeMode();

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

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  // --------------------------------------------------
  // THEME COLORS
  // --------------------------------------------------

  const pageBackground = isLuxuryMode
    ? "#0F0F0F"
    : "#F9F2FA";

  const cardBackground = isLuxuryMode
    ? "#1A1A1A"
    : "#FFFFFF";

  const primaryText = isLuxuryMode
    ? "#FFFFFF"
    : "#171717";

  const secondaryText = isLuxuryMode
    ? "#BDBDBD"
    : "#6B6B6B";

  const border = isLuxuryMode
    ? "#333333"
    : "#E8DCEB";

  const accent = isLuxuryMode
    ? "#C8A96B"
    : "#B61ECA";

  const accentHover = isLuxuryMode
    ? "#E0C080"
    : "#9615A8";

  // --------------------------------------------------
  // HANDLE CHANGE
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (alert.message) {
      setAlert({
        type: "",
        message: "",
      });
    }
  };

  // --------------------------------------------------
  // HANDLE SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setAlert({
      type: "",
      message: "",
    });

    try {
      const sellerToken =
        localStorage.getItem("sellerToken");

      if (!sellerToken) {
        navigate("/seller/login");
        return;
      }

      const response = await api.post(
        "/seller/products",
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
        "SELLER PRODUCT CREATED:",
        response.data
      );

      setAlert({
        type: "success",
        message: "Product added successfully!",
      });

      setTimeout(() => {
        navigate("/seller/products");
      }, 1000);
    } catch (error) {
      console.error(
        "ADD SELLER PRODUCT ERROR:",
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
          "Failed to add product.",
      });
    }
  };

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

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
          boxShadow: isLuxuryMode
            ? "0 12px 35px rgba(0,0,0,0.35)"
            : "0 10px 30px rgba(182, 30, 202, 0.08)",
          p: { xs: 3, sm: 5 },
          transition:
            "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {/* ------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------ */}

        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: { xs: 26, sm: 32 },
              fontWeight: 800,
              color: primaryText,
              transition: "color 0.3s ease",
            }}
          >
            Add Product
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: secondaryText,
              mt: 0.5,
              transition: "color 0.3s ease",
            }}
          >
            Add a new product to your store.
          </Typography>
        </Box>

        {/* ------------------------------------------ */}
        {/* ALERT */}
        {/* ------------------------------------------ */}

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

        {/* ------------------------------------------ */}
        {/* FORM */}
        {/* ------------------------------------------ */}

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
            placeholder="Enter product name"
            required
          />

          {/* BRAND */}

          <CustomInput
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Enter brand name"
            required
          />

          {/* DESCRIPTION */}

          <CustomInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
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
              placeholder="Enter price"
              required
            />

            <CustomInput
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Enter stock quantity"
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
              placeholder="Eg: Men, Women, Kids"
              required
            />

            <CustomInput
              label="Color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Eg: Black"
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
            placeholder="Enter product image URL"
            required
          />

          {/* ------------------------------------------ */}
          {/* BUTTONS */}
          {/* ------------------------------------------ */}

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
            {/* CANCEL */}

            <CustomButton
              type="button"
              variant="outlined"
              onClick={() =>
                navigate("/seller/products")
              }
              sx={{
                borderColor: isLuxuryMode
                  ? "#555555"
                  : "#B61ECA",
                color: isLuxuryMode
                  ? "#C8A96B"
                  : "#B61ECA",

                "&:hover": {
                  borderColor: accentHover,
                  color: accentHover,
                  backgroundColor: isLuxuryMode
                    ? "rgba(200,169,107,0.08)"
                    : "#FAF1FC",
                },
              }}
            >
              Cancel
            </CustomButton>

            {/* ADD PRODUCT */}

            <CustomButton
              type="submit"
              sx={{
                backgroundColor: accent,
                color: isLuxuryMode
                  ? "#171717"
                  : "#FFFFFF",

                "&:hover": {
                  backgroundColor: accentHover,
                  color: isLuxuryMode
                    ? "#171717"
                    : "#FFFFFF",
                },
              }}
            >
              Add Product
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SellerAddProduct;