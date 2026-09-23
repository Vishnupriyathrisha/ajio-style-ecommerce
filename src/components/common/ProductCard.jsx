import { useNavigate } from "react-router-dom";
import { memo } from "react";

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useThemeMode } from "../../context/ThemeContext";

const ProductCard = ({
  product,
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
}) => {
  const navigate = useNavigate();

  const { isLuxuryMode } = useThemeMode();

  const productId = product._id || product.id;

  // ================= THEME COLORS =================

  const cardBackground = isLuxuryMode
    ? "#1A1A1A"
    : "#FFFFFF";

  const imageBackground = isLuxuryMode
    ? "#242424"
    : "#F4F4F4";

  const primaryText = isLuxuryMode
    ? "#FFFFFF"
    : "#171717";

  const accent = isLuxuryMode
    ? "#C8A96B"
    : "#B61ECA";

  const accentHover = isLuxuryMode
    ? "#E0C080"
    : "#9615A8";

  const border = isLuxuryMode
    ? "#383838"
    : "#E8DCEB";

  // ================= CARD CLICK =================

  const handleCardClick = () => {
    navigate("/product-details", {
    state: {
    productId: product._id || product.id,
     },
   });
  };

  // ================= ADD TO CART =================

  const handleAddToCart = (event) => {
    event.stopPropagation();

    onAddToCart(product);
  };

  return (
    <Card
      elevation={0}
      onClick={handleCardClick}
      sx={{
        height: "100%",

        minHeight: {
          xs: 520,
          sm: 540,
          md: 560,
        },

        border: `1px solid ${border}`,

        borderRadius: {
          xs: 2,
          md: 2.5,
        },

        overflow: "hidden",

        cursor: "pointer",

        backgroundColor: cardBackground,

        color: primaryText,

        position: "relative",

        display: "flex",

        flexDirection: "column",

        transition:
          "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.25s ease, transform 0.25s ease",

        "@media (hover: hover)": {
          "&:hover": {
            transform:
              "translateY(-5px)",

            boxShadow: isLuxuryMode
              ? "0 12px 30px rgba(200,169,107,0.18)"
              : "0 12px 30px rgba(182,30,202,0.15)",
          },
        },
      }}
    >
      {/* ================= PRODUCT IMAGE ================= */}

      <Box
        sx={{
          position: "relative",

          width: "100%",

          aspectRatio: "4 / 5",

          overflow: "hidden",

          backgroundColor:
            imageBackground,

          transition:
            "background-color 0.3s ease",
        }}
      >
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          loading="lazy"
          sx={{
            width: "100%",

            height: "100%",

            objectFit: "cover",

            display: "block",

            transition:
              "transform 0.3s ease",

            "@media (hover: hover)": {
              "&:hover": {
                transform:
                  "scale(1.04)",
              },
            },
          }}
        />

        {/* ================= TRENDING BADGE ================= */}

        <Box
          sx={{
            position: "absolute",

            top: {
              xs: 10,
              sm: 12,
            },

            left: {
              xs: 10,
              sm: 12,
            },

            backgroundColor: accent,

            color: isLuxuryMode
              ? "#171717"
              : "#FFFFFF",

            px: {
              xs: 1.2,
              sm: 1.5,
            },

            py: 0.5,

            borderRadius: "20px",

            fontSize: {
              xs: 10,
              sm: 11,
            },

            fontWeight: 700,

            letterSpacing: "0.6px",

            transition:
              "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          TRENDING
        </Box>

        {/* ================= WISHLIST ================= */}

        <Box
          role="button"
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          onClick={(event) =>
            onWishlistToggle(
              event,
              product
            )
          }
          sx={{
            position: "absolute",

            top: {
              xs: 10,
              sm: 12,
            },

            right: {
              xs: 10,
              sm: 12,
            },

            width: {
              xs: 44,
              sm: 44,
            },

            height: {
              xs: 44,
              sm: 44,
            },

            borderRadius: "50%",

            backgroundColor:
              isLuxuryMode
                ? "rgba(20,20,20,0.92)"
                : "rgba(255,255,255,0.95)",

            border: isLuxuryMode
              ? "1px solid rgba(200,169,107,0.45)"
              : "1px solid transparent",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            cursor: "pointer",

            transition:
              "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",

            "&:hover": {
              backgroundColor: accent,

              color: isLuxuryMode
                ? "#171717"
                : "#FFFFFF",

              borderColor: accent,
            },

            "&:active": {
              transform:
                "scale(0.96)",
            },
          }}
        >
          {isWishlisted ? (
            <FavoriteIcon
              sx={{
                color: accent,

                fontSize: {
                  xs: 23,
                  sm: 24,
                },
              }}
            />
          ) : (
            <FavoriteBorderIcon
              sx={{
                fontSize: {
                  xs: 23,
                  sm: 24,
                },

                color: isLuxuryMode
                  ? "#FFFFFF"
                  : "#171717",
              }}
            />
          )}
        </Box>
      </Box>

      {/* ================= PRODUCT DETAILS ================= */}

      <CardContent
        sx={{
          p: {
            xs: 1.8,
            sm: 2,
            md: 2.5,
          },

          display: "flex",

          flexDirection: "column",

          flex: 1,

          backgroundColor:
            cardBackground,

          transition:
            "background-color 0.3s ease",
        }}
      >
        {/* Brand */}

        <Typography
          sx={{
            fontWeight: 700,

            color: accent,

            mb: 0.5,

            fontSize: {
              xs: 11,
              sm: 12,
            },

            letterSpacing: "0.5px",

            minHeight: 18,

            transition:
              "color 0.3s ease",
          }}
        >
          {product.brand}
        </Typography>

        {/* Product Name */}

        <Typography
          sx={{
            fontWeight: 600,

            color: primaryText,

            fontSize: {
              xs: 14,
              sm: 15,
              md: 16,
            },

            lineHeight: 1.4,

            mb: {
              xs: 1,
              sm: 1.5,
            },

            display: "-webkit-box",

            WebkitLineClamp: 2,

            WebkitBoxOrient:
              "vertical",

            overflow: "hidden",

            minHeight: {
              xs: "39px",
              sm: "42px",
            },

            transition:
              "color 0.3s ease",
          }}
        >
          {product.name}
        </Typography>

        {/* Price */}

        <Typography
          sx={{
            fontWeight: 800,

            color: primaryText,

            fontSize: {
              xs: 18,
              sm: 19,
              md: 20,
            },

            mb: {
              xs: 1.5,
              sm: 2,
            },

            transition:
              "color 0.3s ease",
          }}
        >
          ₹
          {product.price.toLocaleString(
            "en-IN"
          )}
        </Typography>

        {/* ================= ADD TO BAG ================= */}

        <Button
          fullWidth
          variant="contained"
          onClick={handleAddToCart}
          sx={{
            mt: "auto",

            minHeight: {
              xs: 48,
              sm: 46,
            },

            width: "100%",

            backgroundColor: accent,

            color: isLuxuryMode
              ? "#171717"
              : "#FFFFFF",

            textTransform:
              "none",

            fontWeight: 700,

            fontSize: {
              xs: 14,
              sm: 15,
            },

            borderRadius: "7px",

            boxShadow: "none",

            "&:hover": {
              backgroundColor:
                accentHover,

              color: isLuxuryMode
                ? "#171717"
                : "#FFFFFF",

              boxShadow: "none",
            },

            "&:active": {
              transform:
                "scale(0.98)",
            },

            transition:
              "background-color 0.25s ease, color 0.25s ease",
          }}
        >
          Add to Bag
        </Button>
      </CardContent>
    </Card>
  );
};

export default memo(ProductCard);