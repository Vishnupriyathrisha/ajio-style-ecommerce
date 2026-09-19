import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import api from "../services/api";

const SellerEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: { xs: 26, sm: 32 },
              fontWeight: 800,
              color: "#171717",
            }}
          >
            Edit Product
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: "#6B6B6B",
              mt: 0.5,
            }}
          >
            Update your product details.
          </Typography>
        </Box>

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

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CustomInput
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <CustomInput
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />

          <CustomInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            minRows={4}
            required
          />

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

          <CustomInput
            label="Sizes"
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            placeholder="Eg: S, M, L, XL"
          />

          <CustomInput
            label="Product Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />

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

            <CustomButton
              type="submit"
              disabled={saving}
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