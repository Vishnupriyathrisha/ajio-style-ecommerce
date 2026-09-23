import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";

import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import api from "../services/api";
import { useThemeMode } from "../context/ThemeContext";

const SellerSupport = () => {
  const navigate = useNavigate();

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

  const ticketBackground = isLuxuryMode
    ? "#202020"
    : "#FFFFFF";

  const primaryText = isLuxuryMode
    ? "#FFFFFF"
    : "#171717";

  const secondaryText = isLuxuryMode
    ? "#BDBDBD"
    : "#6B6B6B";

  const mutedText = isLuxuryMode
    ? "#8F8F8F"
    : "#888888";

  const accent = isLuxuryMode
    ? "#C8A96B"
    : "#B61ECA";

  const accentHover = isLuxuryMode
    ? "#E0C080"
    : "#9615A8";

  const border = isLuxuryMode
    ? "#333333"
    : "#E8DCEB";

  const headerGradient = isLuxuryMode
    ? "linear-gradient(135deg, #171717 0%, #292929 100%)"
    : "linear-gradient(135deg, #B61ECA 0%, #8E24AA 100%)";

  const cardShadow = isLuxuryMode
    ? "0 8px 25px rgba(0,0,0,0.30)"
    : "0 8px 25px rgba(182,30,202,0.08)";

  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // FETCH TICKETS
  // =========================

  useEffect(() => {
    fetchTickets();
  }, []);

  const getSellerToken = () => {
    return localStorage.getItem("sellerToken");
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const sellerToken = getSellerToken();

      if (!sellerToken) {
        navigate("/seller/login");
        return;
      }

      const response = await api.get(
        "/seller/support-tickets/my-tickets",
        {
          headers: {
            Authorization: `Bearer ${sellerToken}`,
          },
        }
      );

      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error(
        "GET SELLER SUPPORT ERROR:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("sellerToken");
        localStorage.removeItem("seller");

        navigate("/seller/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load support tickets."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CREATE TICKET
  // =========================

  const handleCreateTicket = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!subject.trim() || !message.trim()) {
      setError(
        "Subject and message are required."
      );
      return;
    }

    try {
      setCreating(true);

      const sellerToken = getSellerToken();

      if (!sellerToken) {
        navigate("/seller/login");
        return;
      }

      const response = await api.post(
        "/seller/support-tickets",
        {
          subject: subject.trim(),
          message: message.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${sellerToken}`,
          },
        }
      );

      setTickets((prevTickets) => [
        response.data.ticket,
        ...prevTickets,
      ]);

      setSubject("");
      setMessage("");

      setSuccess(
        "Support ticket created successfully."
      );
    } catch (error) {
      console.error(
        "CREATE SELLER SUPPORT ERROR:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("sellerToken");
        localStorage.removeItem("seller");

        navigate("/seller/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to create support ticket."
      );
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // STATUS COLOR
  // =========================

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "info";

      case "In Progress":
        return "warning";

      case "Resolved":
        return "success";

      case "Closed":
        return "default";

      default:
        return "default";
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: pageBackground,
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
          maxWidth: 1200,
          mx: "auto",
          px: {
            xs: 2,
            md: 4,
          },
        }}
      >
        {/* =========================
            PAGE HEADER
        ========================= */}

        <Box
          sx={{
            mb: 4,
            p: {
              xs: 3,
              md: 4,
            },
            borderRadius: 4,
            background: headerGradient,
            color: "#FFFFFF",
            boxShadow: isLuxuryMode
              ? "0 10px 30px rgba(0,0,0,0.35)"
              : "0 10px 30px rgba(182,30,202,0.20)",
            transition:
              "background 0.3s ease",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <SupportAgentOutlinedIcon
              sx={{
                fontSize: 42,
                color: isLuxuryMode
                  ? "#C8A96B"
                  : "#FFFFFF",
              }}
            />

            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: {
                    xs: "1.8rem",
                    md: "2.2rem",
                  },
                }}
              >
                Seller Support
              </Typography>

              <Typography
                sx={{
                  opacity: 0.9,
                }}
              >
                Need help? Create a support ticket and
                our team will assist you.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
            }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* =========================
            SUCCESS
        ========================= */}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
            }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* =========================
              CREATE TICKET
          ========================= */}

          <Grid item xs={12} md={5}>
            <Card
              sx={{
                borderRadius: 4,
                backgroundColor: cardBackground,
                border: `1px solid ${border}`,
                boxShadow: cardShadow,
                transition:
                  "background-color 0.3s ease, border-color 0.3s ease",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    mb: 0.5,
                    color: primaryText,
                  }}
                >
                  Create New Ticket
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: secondaryText,
                    mb: 3,
                  }}
                >
                  Describe your issue and our support
                  team will get back to you.
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleCreateTicket}
                >
                  {/* Subject */}

                  <TextField
                    fullWidth
                    label="Subject"
                    value={subject}
                    onChange={(event) =>
                      setSubject(event.target.value)
                    }
                    sx={{
                      mb: 2,

                      "& .MuiInputLabel-root": {
                        color: secondaryText,
                      },

                      "& .MuiInputLabel-root.Mui-focused": {
                        color: accent,
                      },

                      "& .MuiOutlinedInput-root": {
                        color: primaryText,

                        "& fieldset": {
                          borderColor: border,
                        },

                        "&:hover fieldset": {
                          borderColor: accent,
                        },

                        "&.Mui-focused fieldset": {
                          borderColor: accent,
                        },
                      },
                    }}
                  />

                  {/* Message */}

                  <TextField
                    fullWidth
                    multiline
                    minRows={5}
                    label="Message"
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    sx={{
                      mb: 2.5,

                      "& .MuiInputLabel-root": {
                        color: secondaryText,
                      },

                      "& .MuiInputLabel-root.Mui-focused": {
                        color: accent,
                      },

                      "& .MuiOutlinedInput-root": {
                        color: primaryText,

                        "& fieldset": {
                          borderColor: border,
                        },

                        "&:hover fieldset": {
                          borderColor: accent,
                        },

                        "&.Mui-focused fieldset": {
                          borderColor: accent,
                        },
                      },
                    }}
                  />

                  {/* Submit */}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={creating}
                    startIcon={
                      <SendOutlinedIcon />
                    }
                    sx={{
                      backgroundColor: accent,
                      color: isLuxuryMode
                        ? "#171717"
                        : "#FFFFFF",
                      textTransform: "none",
                      fontWeight: 700,
                      py: 1.2,
                      borderRadius: 2,

                      "&:hover": {
                        backgroundColor:
                          accentHover,
                      },

                      "&:disabled": {
                        backgroundColor:
                          isLuxuryMode
                            ? "#5C513B"
                            : "#D9A4DF",
                        color:
                          isLuxuryMode
                            ? "#BDBDBD"
                            : "#FFFFFF",
                      },
                    }}
                  >
                    {creating
                      ? "Creating..."
                      : "Submit Ticket"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* =========================
              MY TICKETS
          ========================= */}

          <Grid item xs={12} md={7}>
            <Card
              sx={{
                borderRadius: 4,
                backgroundColor: cardBackground,
                border: `1px solid ${border}`,
                boxShadow: cardShadow,
                transition:
                  "background-color 0.3s ease, border-color 0.3s ease",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    mb: 0.5,
                    color: primaryText,
                  }}
                >
                  My Support Tickets
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: secondaryText,
                    mb: 3,
                  }}
                >
                  Track your submitted support requests.
                </Typography>

                {/* =========================
                    EMPTY STATE
                ========================= */}

                {tickets.length === 0 ? (
                  <Box
                    sx={{
                      py: 6,
                      textAlign: "center",
                    }}
                  >
                    <SupportAgentOutlinedIcon
                      sx={{
                        fontSize: 50,
                        color: isLuxuryMode
                          ? "#6D6046"
                          : "#D7B5DD",
                        mb: 1,
                      }}
                    />

                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: primaryText,
                      }}
                    >
                      No support tickets yet
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: secondaryText,
                        mt: 0.5,
                      }}
                    >
                      Create a ticket if you need help.
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {tickets.map((ticket) => (
                      <Box
                        key={ticket._id}
                        sx={{
                          p: 2,
                          mb: 2,
                          border: `1px solid ${border}`,
                          borderRadius: 3,
                          backgroundColor:
                            ticketBackground,
                          transition:
                            "background-color 0.3s ease, border-color 0.3s ease",

                          "&:last-child": {
                            mb: 0,
                          },
                        }}
                      >
                        {/* Ticket Header */}

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems: {
                              xs: "flex-start",
                              sm: "center",
                            },
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: primaryText,
                              wordBreak:
                                "break-word",
                            }}
                          >
                            {ticket.subject}
                          </Typography>

                          <Chip
                            label={ticket.status}
                            color={getStatusColor(
                              ticket.status
                            )}
                            size="small"
                            sx={
                              isLuxuryMode
                                ? {
                                    ...(ticket.status ===
                                    "Open"
                                      ? {
                                          color:
                                            "#64B5F6",
                                          backgroundColor:
                                            "rgba(33,150,243,0.15)",
                                        }
                                      : {}),
                                    ...(ticket.status ===
                                    "In Progress"
                                      ? {
                                          color:
                                            "#E0C080",
                                          backgroundColor:
                                            "rgba(200,169,107,0.15)",
                                        }
                                      : {}),
                                    ...(ticket.status ===
                                    "Resolved"
                                      ? {
                                          color:
                                            "#66BB8A",
                                          backgroundColor:
                                            "rgba(76,175,125,0.15)",
                                        }
                                      : {}),
                                    ...(ticket.status ===
                                    "Closed"
                                      ? {
                                          color:
                                            "#BDBDBD",
                                          backgroundColor:
                                            "#333333",
                                        }
                                      : {}),
                                  }
                                : {}
                            }
                          />
                        </Box>

                        {/* Message */}

                        <Typography
                          variant="body2"
                          sx={{
                            color: secondaryText,
                            mb: 1.5,
                            lineHeight: 1.6,
                          }}
                        >
                          {ticket.message}
                        </Typography>

                        {/* Created Date */}

                        <Typography
                          variant="caption"
                          sx={{
                            color: mutedText,
                          }}
                        >
                          Created:{" "}
                          {new Date(
                            ticket.createdAt
                          ).toLocaleDateString()}
                        </Typography>

                        {/* Admin Reply */}

                        {ticket.adminReply && (
                          <>
                            <Divider
                              sx={{
                                my: 2,
                                borderColor: border,
                              }}
                            />

                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                color: accent,
                                mb: 0.5,
                              }}
                            >
                              Admin Reply
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                color: secondaryText,
                                lineHeight: 1.6,
                              }}
                            >
                              {ticket.adminReply}
                            </Typography>
                          </>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SellerSupport;