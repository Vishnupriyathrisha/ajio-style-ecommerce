import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CustomButton from "../components/common/CustomButton";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const product = location.state?.product;
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Product not found
        </Typography>

        <CustomButton
          fullWidth={false}
          onClick={() => navigate("/products")}
        >
          Back to Products
        </CustomButton>
      </Box>
    );
  }

  const handleAddToBag = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 5 }}>
      <Grid container spacing={5}>
        {/* Product Image */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{
              width: "100%",
              height: { xs: 400, md: 600 },
              objectFit: "cover",
              display: "block",
            }}
          />
        </Grid>

        {/* Product Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              letterSpacing: "1px",
              mb: 1,
            }}
          >
            {product.brand}
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            {product.name}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 4,
            }}
          >
            ₹{product.price.toLocaleString("en-IN")}
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Quantity
          </Typography>

          {/* Quantity */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ddd",
              width: "fit-content",
              mb: 4,
            }}
          >
            <IconButton
              onClick={() =>
                setQuantity((prev) => Math.max(1, prev - 1))
              }
            >
              <RemoveIcon />
            </IconButton>

            <Typography sx={{ px: 2, fontWeight: 600 }}>
              {quantity}
            </Typography>

            <IconButton
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              <AddIcon />
            </IconButton>
          </Box>

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <CustomButton onClick={handleAddToBag}>
              Add to Bag
            </CustomButton>

            <IconButton
  onClick={() => addToWishlist(product)}
  sx={{
    border: "1px solid #ddd",
    borderRadius: "6px",
  }}
>
  <FavoriteBorderIcon
    sx={{
      color: isInWishlist(product.id) ? "red" : "#111",
    }}
  />
</IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetails;