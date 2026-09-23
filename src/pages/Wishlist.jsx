import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useThemeMode } from "../context/ThemeContext";

import CustomButton from "../components/common/CustomButton";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } =
    useWishlist();

  const { addToCart } = useCart();

  const { isLuxuryMode } = useThemeMode();

  // =========================
  // THEME COLORS
  // =========================

  const pageBackground = isLuxuryMode
    ? "#0F0F0F"
    : "#F9F2FA";

  const cardBackground = isLuxuryMode
    ? "#1A1A1A"
    : "#FFFFFF";

  const imageBackground = isLuxuryMode
    ? "#242424"
    : "#F3E3F6";

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

  // =========================
  // EMPTY WISHLIST
  // =========================

  if (wishlistItems.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "75vh",
          backgroundColor: pageBackground,
          textAlign: "center",
          py: 10,
          px: 2,
          transition:
            "background-color 0.3s ease",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: primaryText,
          }}
        >
          My Wishlist
        </Typography>

        <Typography
          sx={{
            color: secondaryText,
          }}
        >
          Your wishlist is empty.
        </Typography>
      </Box>
    );
  }

  // =========================
  // WISHLIST
  // =========================

  return (
    <Box
      sx={{
        minHeight: "75vh",
        backgroundColor: pageBackground,
        px: {
          xs: 2,
          md: 6,
        },
        py: {
          xs: 4,
          md: 5,
        },
        transition:
          "background-color 0.3s ease",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 4,
          color: primaryText,
        }}
      >
        My Wishlist
      </Typography>

      <Grid container spacing={3}>
        {wishlistItems.map((product) => (
          <Grid
            key={product.id}
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Box
              sx={{
                border: `1px solid ${border}`,
                backgroundColor: cardBackground,
                borderRadius: "8px",
                overflow: "hidden",
                transition:
                  "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.3s ease",

                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: isLuxuryMode
                    ? "0 10px 25px rgba(0,0,0,0.35)"
                    : "0 10px 25px rgba(182,30,202,0.10)",
                },
              }}
            >
              {/* Product Image */}

              <Box
                sx={{
                  backgroundColor: imageBackground,
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  sx={{
                    width: "100%",
                    height: {
                      xs: 340,
                      sm: 300,
                      md: 320,
                    },
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>

              {/* Product Details */}

              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    mb: 0.5,
                    color: accent,
                  }}
                >
                  {product.brand}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    mb: 1,
                    color: primaryText,
                    minHeight: 24,
                  }}
                >
                  {product.name}
                </Typography>

                {/* Price + Delete */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: primaryText,
                    }}
                  >
                    ₹
                    {product.price.toLocaleString(
                      "en-IN"
                    )}
                  </Typography>

                  <IconButton
                    onClick={() =>
                      removeFromWishlist(
                        product.id
                      )
                    }
                    aria-label="Remove from wishlist"
                    sx={{
                      color: isLuxuryMode
                        ? "#BDBDBD"
                        : "#6B6B6B",

                      "&:hover": {
                        color: "#D32F2F",
                        backgroundColor:
                          "rgba(211,47,47,0.08)",
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                {/* Add To Bag */}

                <CustomButton
                  onClick={() => {
                    addToCart(product, 1);
                    removeFromWishlist(
                      product.id
                    );
                  }}
                  sx={{
                    backgroundColor: accent,
                    color: isLuxuryMode
                      ? "#171717"
                      : "#FFFFFF",

                    "&:hover": {
                      backgroundColor:
                        accentHover,
                    },
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