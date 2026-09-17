import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";

import CustomButton from "../components/common/CustomButton";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  const FREE_DELIVERY_TARGET = 2000;

  const deliveryProgress = Math.min(
    (cartTotal / FREE_DELIVERY_TARGET) * 100,
    100
  );

  const remainingAmount = Math.max(
    FREE_DELIVERY_TARGET - cartTotal,
    0
  );

  // Empty Cart
  if (cartItems.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          backgroundColor: "#F9F2FA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 6,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 520,
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8DCEB",
            borderRadius: 3,
            textAlign: "center",
            px: { xs: 3, md: 5 },
            py: 6,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "#F3E3F6",
              color: "#B61ECA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <ShoppingBagOutlinedIcon sx={{ fontSize: 38 }} />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#171717",
              mb: 1.5,
              fontSize: { xs: 27, md: 32 },
            }}
          >
            Your Bag is Empty
          </Typography>

          <Typography
            sx={{
              color: "#6B6B6B",
              fontSize: 14,
              lineHeight: 1.7,
              mb: 3.5,
            }}
          >
            Looks like you haven't added anything to your bag yet.
            Discover something you love and add it to your collection.
          </Typography>

          <CustomButton
            fullWidth={false}
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </CustomButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F9F2FA",
        px: { xs: 2, sm: 3, md: 6 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#B61ECA",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "2px",
                mb: 0.5,
              }}
            >
              YOUR COLLECTION
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#171717",
                fontSize: { xs: 28, md: 34 },
              }}
            >
              My Bag
            </Typography>

            <Typography
              sx={{
                color: "#6B6B6B",
                fontSize: 14,
                mt: 0.5,
              }}
            >
              {cartItems.length}{" "}
              {cartItems.length === 1 ? "item" : "items"} in your bag
            </Typography>
          </Box>

          <Box
            onClick={() => navigate("/products")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              cursor: "pointer",
              color: "#6B6B6B",
              "&:hover": {
                color: "#B61ECA",
              },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 19 }} />

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Continue Shopping
            </Typography>
          </Box>
        </Box>

        {/* Free Delivery Progress */}
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8DCEB",
            borderRadius: 3,
            px: { xs: 2, sm: 3 },
            py: 2.5,
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mb: 1.2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <LocalShippingOutlinedIcon
                sx={{
                  color: "#B61ECA",
                  fontSize: 22,
                }}
              />

              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#171717",
                }}
              >
                {remainingAmount > 0
                  ? `Add ₹${remainingAmount.toLocaleString(
                      "en-IN"
                    )} more for FREE delivery`
                  : "🎉 You unlocked FREE delivery!"}
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: "#B61ECA",
              }}
            >
              ₹2,000
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={deliveryProgress}
            sx={{
              height: 7,
              borderRadius: 10,
              backgroundColor: "#F0E4F2",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#B61ECA",
                borderRadius: 10,
              },
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E8DCEB",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: 2,
                  backgroundColor: "#FAF6FB",
                  borderBottom: "1px solid #E8DCEB",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#171717",
                  }}
                >
                  Bag Items
                </Typography>
              </Box>

              {cartItems.map((item, index) => {
                const productId = item._id || item.id;

                const stock =
                  typeof item.stock === "number"
                    ? item.stock
                    : 10;

                return (
                  <Box
                    key={productId}
                    sx={{
                      p: { xs: 2, sm: 3 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: { xs: 2, sm: 3 },
                        alignItems: "flex-start",
                      }}
                    >
                      {/* Product Image */}
                      <Box
                        sx={{
                          width: { xs: 105, sm: 150 },
                          height: { xs: 135, sm: 190 },
                          flexShrink: 0,
                          overflow: "hidden",
                          borderRadius: 2,
                          backgroundColor: "#F3E3F6",
                        }}
                      >
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </Box>

                      {/* Product Details */}
                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#B61ECA",
                            fontSize: 12,
                            fontWeight: 800,
                            letterSpacing: "0.8px",
                            mb: 0.6,
                          }}
                        >
                          {item.brand}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: { xs: 15, sm: 18 },
                            fontWeight: 700,
                            color: "#171717",
                            lineHeight: 1.4,
                            mb: 1.2,
                          }}
                        >
                          {item.name}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: "#171717",
                            mb: 1.8,
                          }}
                        >
                          ₹{item.price.toLocaleString("en-IN")}
                        </Typography>

                        {typeof item.stock === "number" && (
                          <Chip
                            label={
                              stock > 0
                                ? `${stock} available`
                                : "Out of stock"
                            }
                            size="small"
                            sx={{
                              mb: 1.8,
                              backgroundColor:
                                stock > 0
                                  ? "#EDF7F2"
                                  : "#FDEEEE",
                              color:
                                stock > 0
                                  ? "#2E7D5B"
                                  : "#C94C4C",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          />
                        )}

                        {/* Quantity */}
                        <Box>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#6B6B6B",
                              mb: 0.7,
                            }}
                          >
                            Quantity
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              width: "fit-content",
                              border: "1px solid #D9C7DC",
                              borderRadius: "6px",
                              overflow: "hidden",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                updateQuantity(
                                  productId,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              sx={{
                                borderRadius: 0,
                                color: "#171717",
                                width: 36,
                                height: 36,
                              }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>

                            <Typography
                              sx={{
                                minWidth: 38,
                                textAlign: "center",
                                fontSize: 14,
                                fontWeight: 700,
                              }}
                            >
                              {item.quantity}
                            </Typography>

                            <IconButton
                              size="small"
                              onClick={() =>
                                updateQuantity(
                                  productId,
                                  item.quantity + 1
                                )
                              }
                              disabled={
                                typeof item.stock === "number" &&
                                item.quantity >= item.stock
                              }
                              sx={{
                                borderRadius: 0,
                                color: "#171717",
                                width: 36,
                                height: 36,
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>

                      {/* Remove */}
                      <IconButton
                        onClick={() =>
                          removeFromCart(productId)
                        }
                        sx={{
                          color: "#777",
                          width: 40,
                          height: 40,
                          "&:hover": {
                            color: "#C94C4C",
                            backgroundColor: "#FDEEEE",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    {index < cartItems.length - 1 && (
                      <Divider
                        sx={{
                          mt: 3,
                          borderColor: "#E8DCEB",
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                position: { md: "sticky" },
                top: { md: 20 },
                backgroundColor: "#FFFFFF",
                border: "1px solid #E8DCEB",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  backgroundColor: "#FAF6FB",
                  borderBottom: "1px solid #E8DCEB",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#171717",
                  }}
                >
                  Order Summary
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                {/* Subtotal */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#6B6B6B",
                      fontSize: 14,
                    }}
                  >
                    Subtotal
                  </Typography>

                  <Typography
                    sx={{
                      color: "#171717",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </Typography>
                </Box>

                {/* Delivery */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.8,
                    }}
                  >
                    <LocalShippingOutlinedIcon
                      sx={{
                        fontSize: 18,
                        color: "#B61ECA",
                      }}
                    />

                    <Typography
                      sx={{
                        color: "#6B6B6B",
                        fontSize: 14,
                      }}
                    >
                      Delivery
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      color: "#2E7D5B",
                      fontSize: 13,
                      fontWeight: 800,
                    }}
                  >
                    FREE
                  </Typography>
                </Box>

                {/* Coupon */}
                <Box
                  sx={{
                    backgroundColor: "#FAF6FB",
                    border: "1px solid #E8DCEB",
                    borderRadius: 2,
                    p: 1.5,
                    mb: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.8,
                      mb: 1.2,
                    }}
                  >
                    <LocalOfferOutlinedIcon
                      sx={{
                        fontSize: 19,
                        color: "#B61ECA",
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#171717",
                      }}
                    >
                      Have a coupon?
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <TextField
                      size="small"
                      placeholder="Enter code"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FFFFFF",
                          borderRadius: "6px",
                          fontSize: 13,
                        },
                      }}
                    />

                    <CustomButton
                      fullWidth={false}
                      variant="outlined"
                    >
                      Apply
                    </CustomButton>
                  </Box>
                </Box>

                <Divider
                  sx={{
                    my: 2.5,
                    borderColor: "#E8DCEB",
                  }}
                />

                {/* Total */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: "#171717",
                    }}
                  >
                    Total
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#B61ECA",
                    }}
                  >
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </Typography>
                </Box>

                <CustomButton
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </CustomButton>

                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#888",
                    fontSize: 11,
                    mt: 2,
                  }}
                >
                  Secure checkout • Easy returns • Trusted payments
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Complete Your Look */}
        <Box
          sx={{
            mt: 4,
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8DCEB",
            borderRadius: 3,
            p: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            sx={{
              color: "#B61ECA",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "1.5px",
              mb: 0.5,
            }}
          >
            STYLE SUGGESTIONS
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 21, md: 25 },
              fontWeight: 800,
              color: "#171717",
              mb: 0.5,
            }}
          >
            Complete Your Look ✨
          </Typography>

          <Typography
            sx={{
              color: "#6B6B6B",
              fontSize: 13,
              mb: 3,
            }}
          >
            Discover more styles that pair perfectly with your bag.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            {cartItems.slice(0, 4).map((item) => (
              <Box
                key={`suggestion-${item._id || item.id}`}
                onClick={() =>
                  navigate("/product-details", {
                    state: { product: item },
                  })
                }
                sx={{
                  cursor: "pointer",
                  border: "1px solid #E8DCEB",
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow:
                      "0 8px 20px rgba(182,30,202,0.12)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{
                    width: "100%",
                    height: { xs: 170, sm: 220 },
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                <Box sx={{ p: 1.5 }}>
                  <Typography
                    sx={{
                      color: "#B61ECA",
                      fontSize: 10,
                      fontWeight: 800,
                      mb: 0.3,
                    }}
                  >
                    {item.brand}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#171717",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#171717",
                      mt: 0.7,
                    }}
                  >
                    ₹{item.price.toLocaleString("en-IN")}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;