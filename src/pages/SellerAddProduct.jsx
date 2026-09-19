import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import api from "../services/api";

const SellerAddProduct = () => {
  const navigate = useNavigate();

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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 76px)",
        background: "#F9F2FA",
        px: { xs: 2, sm: 4, md: 6 },
        py: 5,
      }}
    >
      <Box
        sx={{
          maxWidth: 850,
          mx: "auto",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E8DCEB",
          borderRadius: "12px",
          boxShadow:
            "0 10px 30px rgba(182, 30, 202, 0.08)",
          p: { xs: 3, sm: 5 },
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: { xs: 26, sm: 32 },
              fontWeight: 800,
              color: "#171717",
            }}
          >
            Add Product
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: "#6B6B6B",
              mt: 0.5,
            }}
          >
            Add a new product to your store.
          </Typography>
        </Box>

        {/* Alert */}
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

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Product Name */}
          <CustomInput
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />

          {/* Brand */}
          <CustomInput
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Enter brand name"
            required
          />

          {/* Description */}
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

          {/* Price + Stock */}
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

          {/* Category + Color */}
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

          {/* Sizes */}
          <CustomInput
            label="Sizes"
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            placeholder="Eg: S, M, L, XL"
          />

          {/* Image */}
          <CustomInput
            label="Product Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Enter product image URL"
            required
          />

          {/* Buttons */}
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
            >
              Cancel
            </CustomButton>

            <CustomButton type="submit">
              Add Product
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SellerAddProduct;