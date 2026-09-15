import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import CustomButton from "../components/common/CustomButton";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 10,
          px: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          My Wishlist
        </Typography>

        <Typography color="text.secondary">
          Your wishlist is empty.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 5 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 4,
        }}
      >
        My Wishlist
      </Typography>

      <Grid container spacing={3}>
        {wishlistItems.map((product) => (
          <Grid
            key={product.id}
            size={{ xs: 12, sm: 6, md: 3 }}
          >
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                backgroundColor: "#fff",
              }}
            >
              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{
                  width: "100%",
                  height: 320,
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    mb: 0.5,
                  }}
                >
                  {product.brand}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {product.name}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>
                    ₹{product.price.toLocaleString("en-IN")}
                  </Typography>

                  <IconButton
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label="Remove from wishlist"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <CustomButton
                  onClick={() => {
                    addToCart(product, 1);
                    removeFromWishlist(product.id);
                  }}
                >
                  Add to Bag
                </CustomButton>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Wishlist;