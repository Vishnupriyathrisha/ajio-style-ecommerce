import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Grid,
  Typography,
  IconButton,
  Chip,
  Divider,
  TextField,
  Rating,
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";

import CustomButton from "../components/common/CustomButton";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useThemeMode } from "../context/ThemeContext";
import api from "../services/api";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { isLuxuryMode } = useThemeMode();

  const productId = location.state?.productId;

const [product, setProduct] = useState(null);
const [productLoading, setProductLoading] = useState(true);

useEffect(() => {
  const fetchProduct = async () => {
    try {
      setProductLoading(true);

      const response = await api.get(
        `/products/${productId}`
      );

      setProduct(response.data.product);
    } catch (error) {
      console.error(
        "Failed to fetch product:",
        error.response?.data || error.message
      );
    } finally {
      setProductLoading(false);
    }
  };

  if (productLoading) {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
  if (productId) {
    fetchProduct();
  }
}, [productId]);
  // =========================
  // THEME COLORS
  // =========================

  const pageBackground = isLuxuryMode
    ? "#0F0F0F"
    : "#F9F2FA";

  const cardBackground = isLuxuryMode
    ? "#1A1A1A"
    : "#FFFFFF";

  const softBackground = isLuxuryMode
    ? "#202020"
    : "#FAF6FB";

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

  const softBorder = isLuxuryMode
    ? "#444444"
    : "#D9C7DC";

  const emptyStarColor = isLuxuryMode
    ? "#555555"
    : "#D8C5DB";

  // =========================
  // QUANTITY
  // =========================

  const [quantity, setQuantity] = useState(1);

  // =========================
  // REVIEW STATES
  // =========================

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

  // =========================
  // PRODUCT NOT FOUND
  // =========================

  if (!product) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: pageBackground,
          px: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: primaryText,
            mb: 3,
          }}
        >
          Product not found
        </Typography>

        <CustomButton
          fullWidth={false}
          onClick={() => navigate("/products")}
          sx={{
            backgroundColor: accent,
            color: isLuxuryMode ? "#171717" : "#FFFFFF",
            "&:hover": {
              backgroundColor: accentHover,
              color: isLuxuryMode ? "#171717" : "#FFFFFF",
            },
          }}
        >
          Back to Products
        </CustomButton>
      </Box>
    );
  }


  const wishlisted = isInWishlist(productId);

  const maxStock =
    typeof product.stock === "number"
      ? product.stock
      : 10;

  // =========================
  // FETCH REVIEWS
  // =========================

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);

        const response = await api.get(
          `/reviews/product/${productId}`
        );

        setReviews(response.data.reviews || []);
        setAverageRating(
          response.data.averageRating || 0
        );
        setTotalReviews(
          response.data.totalReviews || 0
        );
      } catch (error) {
        console.error(
          "Failed to fetch reviews:",
          error.response?.data || error.message
        );
      } finally {
        setReviewsLoading(false);
      }
    };

    const checkEligibility = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await api.get(
          `/reviews/eligibility/${productId}`
        );

        setCanReview(
          response.data.canReview || false
        );

        setAlreadyReviewed(
          response.data.alreadyReviewed || false
        );
      } catch (error) {
        console.error(
          "Failed to check review eligibility:",
          error.response?.data || error.message
        );
      }
    };

    fetchReviews();
    checkEligibility();
  }, [productId]);

  // =========================
  // ADD TO BAG
  // =========================

  const handleAddToBag = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  // =========================
  // QUANTITY
  // =========================

  const handleQuantityIncrease = () => {
    setQuantity((prev) =>
      Math.min(prev + 1, maxStock)
    );
  };

  // =========================
  // WISHLIST
  // =========================

  const handleWishlist = () => {
    addToWishlist(product);
  };

  // =========================
  // SUBMIT REVIEW
  // =========================

  const handleSubmitReview = async () => {
    setReviewMessage("");
    setReviewError("");

    if (reviewRating === 0) {
      setReviewError("Please select a rating.");
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError("Please write your review.");
      return;
    }

    if (reviewComment.trim().length < 5) {
      setReviewError(
        "Review must contain at least 5 characters."
      );
      return;
    }

    try {
      setReviewSubmitting(true);

      const response = await api.post("/reviews", {
        productId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      setReviewMessage(
        response.data.message ||
          "Review added successfully!"
      );

      setReviewRating(0);
      setReviewComment("");

      setCanReview(false);
      setAlreadyReviewed(true);

      // Refresh reviews
      const reviewsResponse = await api.get(
        `/reviews/product/${productId}`
      );

      setReviews(
        reviewsResponse.data.reviews || []
      );

      setAverageRating(
        reviewsResponse.data.averageRating || 0
      );

      setTotalReviews(
        reviewsResponse.data.totalReviews || 0
      );
    } catch (error) {
      console.error(
        "Failed to submit review:",
        error.response?.data || error.message
      );

      setReviewError(
        error.response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  // =========================
  // FORMAT REVIEW DATE
  // =========================

  const formatReviewDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================
  // RENDER
  // =========================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: pageBackground,
        px: {
          xs: 2,
          sm: 3,
          md: 6,
        },
        py: {
          xs: 3,
          md: 5,
        },
        transition:
          "background-color 0.3s ease",
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
        }}
      >
        {/* =========================
            BACK BUTTON
        ========================= */}

        <Box
          onClick={() => navigate("/products")}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.7,
            cursor: "pointer",
            color: secondaryText,
            mb: 3,
            transition: "color 0.2s ease",
            "&:hover": {
              color: accent,
            },
          }}
        >
          <ArrowBackIcon
            sx={{ fontSize: 19 }}
          />

          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Back to Products
          </Typography>
        </Box>

        {/* =========================
            MAIN PRODUCT SECTION
        ========================= */}

        <Box
          sx={{
            backgroundColor: cardBackground,
            border: `1px solid ${border}`,
            borderRadius: 3,
            overflow: "hidden",
            transition:
              "background-color 0.3s ease, border-color 0.3s ease",
          }}
        >
          <Grid container>
            {/* =========================
                PRODUCT IMAGE
            ========================= */}

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: "relative",
                  backgroundColor:
                    imageBackground,
                  minHeight: {
                    xs: 380,
                    md: 560,
                  },
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={product.image}
                  alt={product.name}
                  sx={{
                    width: "100%",
                    height: {
                      xs: 380,
                      md: 560,
                    },
                    objectFit: "cover",
                    display: "block",
                    transition:
                      "transform 0.5s ease",
                    "@media (hover: hover)": {
                      "&:hover": {
                        transform:
                          "scale(1.03)",
                      },
                    },
                  }}
                />

                {/* Trending Badge */}

                <Chip
                  label="TRENDING"
                  sx={{
                    position: "absolute",
                    top: 18,
                    left: 18,
                    backgroundColor: accent,
                    color: isLuxuryMode
                      ? "#171717"
                      : "#FFFFFF",
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.8px",
                  }}
                />

                {/* Wishlist */}

                <IconButton
                  onClick={handleWishlist}
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    width: 46,
                    height: 46,
                    backgroundColor:
                      isLuxuryMode
                        ? "rgba(20,20,20,0.92)"
                        : "rgba(255,255,255,0.95)",
                    border: isLuxuryMode
                      ? "1px solid rgba(200,169,107,0.45)"
                      : "1px solid transparent",
                    color: primaryText,
                    "&:hover": {
                      backgroundColor: accent,
                      color: isLuxuryMode
                        ? "#171717"
                        : "#FFFFFF",
                    },
                  }}
                >
                  {wishlisted ? (
                    <FavoriteIcon
                      sx={{
                        color: accent,
                      }}
                    />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              </Box>
            </Grid>

            {/* =========================
                PRODUCT INFORMATION
            ========================= */}

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  p: {
                    xs: 3,
                    md: 4,
                  },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor:
                    cardBackground,
                }}
              >
                {/* Brand */}

                <Typography
                  sx={{
                    color: accent,
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: "1.5px",
                    mb: 1,
                  }}
                >
                  {product.brand}
                </Typography>

                {/* Product Name */}

                <Typography
                  variant="h4"
                  sx={{
                    color: primaryText,
                    fontWeight: 800,
                    lineHeight: 1.25,
                    mb: 2,
                    fontSize: {
                      xs: 27,
                      md: 34,
                    },
                  }}
                >
                  {product.name}
                </Typography>

                {/* Rating */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: accent,
                      color: isLuxuryMode
                        ? "#171717"
                        : "#FFFFFF",
                      px: 1,
                      py: 0.4,
                      borderRadius: "4px",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    ★{" "}
                    {averageRating > 0
                      ? averageRating.toFixed(1)
                      : "0.0"}
                  </Box>

                  <Typography
                    sx={{
                      color: secondaryText,
                      fontSize: 13,
                    }}
                  >
                    {totalReviews}{" "}
                    {totalReviews === 1
                      ? "Rating"
                      : "Ratings"}
                  </Typography>
                </Box>

                <Divider
                  sx={{
                    mb: 2.5,
                    borderColor: border,
                  }}
                />

                {/* Price */}

                <Typography
                  sx={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: primaryText,
                    mb: 0.5,
                  }}
                >
                  ₹
                  {product.price.toLocaleString(
                    "en-IN"
                  )}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: secondaryText,
                    mb: 2,
                  }}
                >
                  Inclusive of all taxes
                </Typography>

                {/* Description */}

                {product.description && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: primaryText,
                        mb: 1,
                      }}
                    >
                      Product Description
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: secondaryText,
                      }}
                    >
                      {product.description}
                    </Typography>
                  </Box>
                )}

                {/* Color */}

                {product.color && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: primaryText,
                        mb: 1,
                      }}
                    >
                      Color
                    </Typography>

                    <Chip
                      label={product.color}
                      variant="outlined"
                      sx={{
                        borderColor: softBorder,
                        color: primaryText,
                      }}
                    />
                  </Box>
                )}

                {/* Sizes */}

                {product.sizes?.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: primaryText,
                        mb: 1,
                      }}
                    >
                      Available Sizes
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      {product.sizes.map(
                        (size) => (
                          <Chip
                            key={size}
                            label={size}
                            variant="outlined"
                            sx={{
                              minWidth: 48,
                              borderColor:
                                softBorder,
                              color:
                                primaryText,
                              fontWeight: 600,
                            }}
                          />
                        )
                      )}
                    </Box>
                  </Box>
                )}

                {/* Stock */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 3,
                    color:
                      maxStock > 0
                        ? "#2E7D5B"
                        : "#C94C4C",
                  }}
                >
                  <Inventory2OutlinedIcon
                    sx={{ fontSize: 20 }}
                  />

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {maxStock > 0
                      ? `${maxStock} items available`
                      : "Out of stock"}
                  </Typography>
                </Box>

                {/* Quantity */}

                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: primaryText,
                    mb: 1,
                  }}
                >
                  Quantity
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "fit-content",
                    border: `1px solid ${softBorder}`,
                    borderRadius: "6px",
                    mb: 3,
                    overflow: "hidden",
                  }}
                >
                  <IconButton
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.max(
                          1,
                          prev - 1
                        )
                      )
                    }
                    disabled={quantity <= 1}
                    sx={{
                      borderRadius: 0,
                      color: primaryText,
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <Typography
                    sx={{
                      minWidth: 45,
                      textAlign: "center",
                      fontWeight: 700,
                      color: primaryText,
                    }}
                  >
                    {quantity}
                  </Typography>

                  <IconButton
                    onClick={
                      handleQuantityIncrease
                    }
                    disabled={
                      quantity >= maxStock
                    }
                    sx={{
                      borderRadius: 0,
                      color: primaryText,
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Action Buttons */}

                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    mb: 4,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <CustomButton
                      onClick={
                        handleAddToBag
                      }
                      disabled={
                        maxStock <= 0
                      }
                      sx={{
                        backgroundColor:
                          accent,
                        color:
                          isLuxuryMode
                            ? "#171717"
                            : "#FFFFFF",
                        "&:hover": {
                          backgroundColor:
                            accentHover,
                          color:
                            isLuxuryMode
                              ? "#171717"
                              : "#FFFFFF",
                        },
                      }}
                    >
                      Add to Bag
                    </CustomButton>
                  </Box>

                  <IconButton
                    onClick={
                      handleWishlist
                    }
                    sx={{
                      width: 48,
                      height: 48,
                      border: `1px solid ${softBorder}`,
                      borderRadius: "6px",
                      color: wishlisted
                        ? accent
                        : primaryText,
                    }}
                  >
                    {wishlisted ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                </Box>

                {/* Delivery Information */}

                <Box
                  sx={{
                    backgroundColor:
                      softBackground,
                    border: `1px solid ${border}`,
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <LocalShippingOutlinedIcon
                      sx={{
                        color: accent,
                      }}
                    />

                    <Box>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 700,
                          color:
                            primaryText,
                        }}
                      >
                        Easy Delivery
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 12,
                          color:
                            secondaryText,
                        }}
                      >
                        Delivery available to
                        your location
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <VerifiedOutlinedIcon
                      sx={{
                        color: accent,
                      }}
                    />

                    <Box>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 700,
                          color:
                            primaryText,
                        }}
                      >
                        Quality Assured
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 12,
                          color:
                            secondaryText,
                        }}
                      >
                        Genuine products with
                        secure packaging
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 12,
                      color: secondaryText,
                    }}
                  >
                    Secure payments • Easy returns
                    • Customer support
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* ==================================================
            REVIEWS & RATINGS SECTION
        ================================================== */}

        <Box
          sx={{
            mt: 4,
            backgroundColor: cardBackground,
            border: `1px solid ${border}`,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Review Header */}

          <Box
            sx={{
              px: {
                xs: 2.5,
                md: 4,
              },
              py: 3,
              background: isLuxuryMode
                ? "linear-gradient(135deg, #151515 0%, #202020 100%)"
                : "linear-gradient(135deg, #FAF6FB 0%, #F3E3F6 100%)",
              borderBottom: `1px solid ${border}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                mb: 0.5,
              }}
            >
              <RateReviewOutlinedIcon
                sx={{
                  color: accent,
                  fontSize: 25,
                }}
              />

              <Typography
                sx={{
                  color: primaryText,
                  fontSize: {
                    xs: 21,
                    md: 25,
                  },
                  fontWeight: 800,
                }}
              >
                Reviews & Ratings
              </Typography>
            </Box>

            <Typography
              sx={{
                color: secondaryText,
                fontSize: 13,
              }}
            >
              See what our customers say about
              this product.
            </Typography>
          </Box>

          <Box
            sx={{
              p: {
                xs: 2.5,
                md: 4,
              },
              backgroundColor:
                cardBackground,
            }}
          >
            {/* =========================
                RATING SUMMARY
            ========================= */}

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    height: "100%",
                    minHeight: 180,
                    border: `1px solid ${border}`,
                    borderRadius: 2,
                    backgroundColor:
                      softBackground,
                    display: "flex",
                    flexDirection:
                      "column",
                    alignItems: "center",
                    justifyContent:
                      "center",
                    p: 3,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 46,
                      lineHeight: 1,
                      fontWeight: 800,
                      color: primaryText,
                    }}
                  >
                    {averageRating > 0
                      ? averageRating.toFixed(
                          1
                        )
                      : "0.0"}
                  </Typography>

                  <Rating
                    value={averageRating}
                    precision={0.1}
                    readOnly
                    icon={
                      <StarIcon
                        sx={{
                          color: accent,
                        }}
                      />
                    }
                    emptyIcon={
                      <StarBorderIcon
                        sx={{
                          color:
                            emptyStarColor,
                        }}
                      />
                    }
                    sx={{ my: 1 }}
                  />

                  <Typography
                    sx={{
                      fontSize: 12,
                      color: secondaryText,
                    }}
                  >
                    Based on {totalReviews}{" "}
                    {totalReviews === 1
                      ? "review"
                      : "reviews"}
                  </Typography>
                </Box>
              </Grid>

              {/* =========================
                  REVIEW FORM
              ========================= */}

              <Grid size={{ xs: 12, md: 8 }}>
                <Box
                  sx={{
                    border: `1px solid ${border}`,
                    borderRadius: 2,
                    p: {
                      xs: 2,
                      md: 3,
                    },
                    height: "100%",
                    backgroundColor:
                      cardBackground,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: primaryText,
                      mb: 0.5,
                    }}
                  >
                    Share your experience
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                      color: secondaryText,
                      mb: 2,
                    }}
                  >
                    Reviews can be submitted after
                    your order has been delivered.
                  </Typography>

                  {reviewMessage && (
                    <Alert
                      severity="success"
                      sx={{
                        mb: 2,
                        fontSize: 13,
                      }}
                    >
                      {reviewMessage}
                    </Alert>
                  )}

                  {reviewError && (
                    <Alert
                      severity="error"
                      sx={{
                        mb: 2,
                        fontSize: 13,
                      }}
                    >
                      {reviewError}
                    </Alert>
                  )}

                  {canReview ? (
                    <>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: primaryText,
                          mb: 0.8,
                        }}
                      >
                        Your Rating
                      </Typography>

                      <Rating
                        value={reviewRating}
                        onChange={(
                          event,
                          newValue
                        ) => {
                          setReviewRating(
                            newValue || 0
                          );
                          setReviewError("");
                        }}
                        icon={
                          <StarIcon
                            sx={{
                              color: accent,
                              fontSize: 29,
                            }}
                          />
                        }
                        emptyIcon={
                          <StarBorderIcon
                            sx={{
                              color:
                                emptyStarColor,
                              fontSize: 29,
                            }}
                          />
                        }
                        sx={{ mb: 2 }}
                      />

                      <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        label="Your Review"
                        placeholder="Write about your experience with this product..."
                        value={reviewComment}
                        onChange={(event) => {
                          setReviewComment(
                            event.target.value
                          );
                          setReviewError("");
                        }}
                        inputProps={{
                          maxLength: 500,
                        }}
                        helperText={`${reviewComment.length}/500`}
                        sx={{
                          mb: 2,

                          "& .MuiInputLabel-root":
                            {
                              color:
                                secondaryText,
                            },

                          "& .MuiInputLabel-root.Mui-focused":
                            {
                              color: accent,
                            },

                          "& .MuiOutlinedInput-root":
                            {
                              borderRadius: 2,
                              color: primaryText,

                              "& fieldset": {
                                borderColor:
                                  softBorder,
                              },

                              "&:hover fieldset":
                                {
                                  borderColor:
                                    accent,
                                },

                              "&.Mui-focused fieldset":
                                {
                                  borderColor:
                                    accent,
                                },
                            },

                          "& .MuiFormHelperText-root":
                            {
                              color:
                                secondaryText,
                            },
                        }}
                      />

                      <Button
                        variant="contained"
                        onClick={
                          handleSubmitReview
                        }
                        disabled={
                          reviewSubmitting
                        }
                        sx={{
                          backgroundColor:
                            accent,
                          color:
                            isLuxuryMode
                              ? "#171717"
                              : "#FFFFFF",
                          textTransform:
                            "none",
                          fontWeight: 700,
                          borderRadius: "6px",
                          px: 3,
                          py: 1.1,
                          "&:hover": {
                            backgroundColor:
                              accentHover,
                            color:
                              isLuxuryMode
                                ? "#171717"
                                : "#FFFFFF",
                          },
                        }}
                      >
                        {reviewSubmitting ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems:
                                "center",
                              gap: 1,
                            }}
                          >
                            <CircularProgress
                              size={18}
                              sx={{
                                color:
                                  isLuxuryMode
                                    ? "#171717"
                                    : "#FFFFFF",
                              }}
                            />

                            Submitting...
                          </Box>
                        ) : (
                          "Submit Review"
                        )}
                      </Button>
                    </>
                  ) : alreadyReviewed ? (
                    <Box
                      sx={{
                        backgroundColor:
                          "#F3FAF6",
                        border:
                          "1px solid #CBE9DA",
                        borderRadius: 2,
                        p: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#2E7D5B",
                          fontSize: 14,
                          fontWeight: 800,
                          mb: 0.4,
                        }}
                      >
                        ✓ Thank you for your
                        review!
                      </Typography>

                      <Typography
                        sx={{
                          color: "#5F7769",
                          fontSize: 12,
                        }}
                      >
                        You have already reviewed
                        this product.
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        backgroundColor:
                          softBackground,
                        border: `1px solid ${border}`,
                        borderRadius: 2,
                        p: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          color: primaryText,
                          fontSize: 14,
                          fontWeight: 800,
                          mb: 0.5,
                        }}
                      >
                        Purchase this product to
                        review
                      </Typography>

                      <Typography
                        sx={{
                          color: secondaryText,
                          fontSize: 12,
                          lineHeight: 1.6,
                        }}
                      >
                        Only customers who have
                        received this product can
                        submit a review.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>

            <Divider
              sx={{
                my: 4,
                borderColor: border,
              }}
            />

            {/* =========================
                CUSTOMER REVIEWS
            ========================= */}

            <Typography
              sx={{
                fontSize: 17,
                fontWeight: 800,
                color: primaryText,
                mb: 2,
              }}
            >
              Customer Reviews
            </Typography>

            {reviewsLoading ? (
              <Box
                sx={{
                  py: 5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <CircularProgress
                  size={30}
                  sx={{
                    color: accent,
                  }}
                />

                <Typography
                  sx={{
                    color: secondaryText,
                    fontSize: 13,
                  }}
                >
                  Loading reviews...
                </Typography>
              </Box>
            ) : reviews.length === 0 ? (
              <Box
                sx={{
                  py: 5,
                  px: 2,
                  textAlign: "center",
                  backgroundColor:
                    softBackground,
                  border: `1px solid ${border}`,
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor:
                      isLuxuryMode
                        ? "#2A2418"
                        : "#F3E3F6",
                    color: accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                    mx: "auto",
                    mb: 1.5,
                  }}
                >
                  <StarBorderIcon
                    sx={{ fontSize: 31 }}
                  />
                </Box>

                <Typography
                  sx={{
                    color: primaryText,
                    fontSize: 15,
                    fontWeight: 800,
                    mb: 0.5,
                  }}
                >
                  No reviews yet
                </Typography>

                <Typography
                  sx={{
                    color: secondaryText,
                    fontSize: 12,
                  }}
                >
                  Be the first customer to review
                  this product.
                </Typography>
              </Box>
            ) : (
              <Box>
                {reviews.map((review) => (
                  <Box
                    key={review._id}
                    sx={{
                      p: {
                        xs: 2,
                        md: 2.5,
                      },
                      mb: 2,
                      border: `1px solid ${border}`,
                      borderRadius: 2,
                      backgroundColor:
                        cardBackground,
                      "&:last-child": {
                        mb: 0,
                      },
                    }}
                  >
                    {/* Reviewer Header */}

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: {
                          xs: "flex-start",
                          sm: "center",
                        },
                        gap: 2,
                        mb: 1.2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: 1.2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius:
                              "50%",
                            backgroundColor:
                              isLuxuryMode
                                ? "#2A2418"
                                : "#F3E3F6",
                            color: accent,
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            fontWeight: 800,
                            fontSize: 15,
                          }}
                        >
                          {review.user?.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}
                        </Box>

                        <Box>
                          <Typography
                            sx={{
                              color:
                                primaryText,
                              fontSize: 14,
                              fontWeight: 800,
                            }}
                          >
                            {review.user
                              ?.name ||
                              "Customer"}
                          </Typography>

                          <Typography
                            sx={{
                              color:
                                isLuxuryMode
                                  ? "#888888"
                                  : "#999999",
                              fontSize: 10,
                              mt: 0.2,
                            }}
                          >
                            {formatReviewDate(
                              review.createdAt
                            )}
                          </Typography>
                        </Box>
                      </Box>

                      <Rating
                        value={
                          review.rating
                        }
                        readOnly
                        size="small"
                        icon={
                          <StarIcon
                            sx={{
                              color: accent,
                              fontSize: 18,
                            }}
                          />
                        }
                        emptyIcon={
                          <StarBorderIcon
                            sx={{
                              color:
                                emptyStarColor,
                              fontSize: 18,
                            }}
                          />
                        }
                      />
                    </Box>

                    {/* Review Comment */}

                    <Typography
                      sx={{
                        color: isLuxuryMode
                          ? "#CCCCCC"
                          : "#5F5F5F",
                        fontSize: 13,
                        lineHeight: 1.7,
                        pl: {
                          xs: 0,
                          sm: 6.2,
                        },
                      }}
                    >
                      {review.comment}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetails;