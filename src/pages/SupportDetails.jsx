import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import CustomButton from "../components/common/CustomButton";
import api from "../services/api";
import { useThemeMode } from "../context/ThemeContext";

const SupportDetails = () => {
  const { id } = useParams();
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

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH TICKET
  // =========================

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await api.get(
          `/support-tickets/${id}`
        );

        setTicket(response.data.ticket);
      } catch (error) {
        console.error(
          "Failed to fetch support ticket:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  // =========================
  // STATUS COLORS
  // =========================

  const getStatusStyle = (status) => {
    if (isLuxuryMode) {
      switch (status) {
        case "Open":
          return {
            backgroundColor:
              "rgba(33, 150, 243, 0.15)",
            color: "#64B5F6",
          };

        case "In Progress":
          return {
            backgroundColor:
              "rgba(200, 169, 107, 0.15)",
            color: "#E0C080",
          };

        case "Resolved":
          return {
            backgroundColor:
              "rgba(76, 175, 125, 0.15)",
            color: "#66BB8A",
          };

        case "Closed":
          return {
            backgroundColor: "#333333",
            color: "#BDBDBD",
          };

        default:
          return {
            backgroundColor: "#333333",
            color: "#BDBDBD",
          };
      }
    }

    switch (status) {
      case "Open":
        return {
          backgroundColor: "#F3E5F5",
          color: "#8E24AA",
        };

      case "In Progress":
        return {
          backgroundColor: "#FFF3E0",
          color: "#EF6C00",
        };

      case "Resolved":
        return {
          backgroundColor: "#E8F5E9",
          color: "#2E7D32",
        };

      case "Closed":
        return {
          backgroundColor: "#F5F5F5",
          color: "#616161",
        };

      default:
        return {
          backgroundColor: "#F5F5F5",
          color: "#616161",
        };
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "75vh",
          backgroundColor: pageBackground,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition:
            "background-color 0.3s ease",
        }}
      >
        <Stack
          spacing={1.5}
          alignItems="center"
        >
          <CircularProgress
            size={32}
            sx={{
              color: accent,
            }}
          />

          <Typography
            sx={{
              color: secondaryText,
            }}
          >
            Loading ticket...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // =========================
  // TICKET NOT FOUND
  // =========================

  if (!ticket) {
    return (
      <Box
        sx={{
          minHeight: "75vh",
          backgroundColor: pageBackground,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: primaryText,
            fontWeight: 700,
          }}
        >
          Support ticket not found
        </Typography>

        <Box
          sx={{
            maxWidth: 180,
            width: "100%",
          }}
        >
          <CustomButton
            onClick={() =>
              navigate("/support")
            }
            sx={{
              backgroundColor: accent,
              color: isLuxuryMode
                ? "#171717"
                : "#FFFFFF",

              "&:hover": {
                backgroundColor: accentHover,
              },
            }}
          >
            Back to Support
          </CustomButton>
        </Box>
      </Box>
    );
  }

  const statusStyle = getStatusStyle(
    ticket.status
  );

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
          md: 6,
        },
        transition:
          "background-color 0.3s ease",
      }}
    >
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
        }}
      >
        {/* ================= BACK ================= */}

        <Box
          onClick={() =>
            navigate("/support")
          }
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            mb: 3,
            width: "fit-content",
            color: secondaryText,
            transition: "color 0.2s ease",

            "&:hover": {
              color: accent,
            },
          }}
        >
          <ArrowBackIcon
            fontSize="small"
          />

          <Typography
            sx={{
              fontWeight: 600,
            }}
          >
            Back to Support
          </Typography>
        </Box>

        {/* ================= PAGE HEADER ================= */}

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 1,
            color: primaryText,
          }}
        >
          Support Ticket
        </Typography>

        <Typography
          sx={{
            color: secondaryText,
            mb: 4,
          }}
        >
          View your support request and response.
        </Typography>

        {/* ================= TICKET CARD ================= */}

        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${border}`,
            backgroundColor: cardBackground,
            borderRadius: "14px",
            p: {
              xs: 3,
              md: 4,
            },
            transition:
              "background-color 0.3s ease, border-color 0.3s ease",
          }}
        >
          {/* Ticket Header */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              sm: "center",
            }}
            spacing={2}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: primaryText,
                  wordBreak: "break-word",
                }}
              >
                {ticket.subject}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color: secondaryText,
                }}
              >
                Created on{" "}
                {new Date(
                  ticket.createdAt
                ).toLocaleDateString()}
              </Typography>
            </Box>

            <Chip
              label={ticket.status}
              sx={{
                ...statusStyle,
                fontWeight: 700,
                borderRadius: "7px",
              }}
            />
          </Stack>

          <Divider
            sx={{
              my: 3,
              borderColor: border,
            }}
          />

          {/* ================= USER MESSAGE ================= */}

          <Typography
            sx={{
              fontWeight: 700,
              mb: 1,
              color: primaryText,
            }}
          >
            Your Message
          </Typography>

          <Typography
            sx={{
              color: secondaryText,
              whiteSpace: "pre-wrap",
              lineHeight: 1.7,
            }}
          >
            {ticket.message}
          </Typography>

          {/* ================= ADMIN REPLY ================= */}

          {ticket.adminReply && (
            <>
              <Divider
                sx={{
                  my: 3,
                  borderColor: border,
                }}
              />

              <Box
                sx={{
                  p: {
                    xs: 2,
                    md: 2.5,
                  },
                  borderRadius: "10px",
                  backgroundColor:
                    isLuxuryMode
                      ? "#202020"
                      : "#FAF6FB",
                  border: `1px solid ${
                    isLuxuryMode
                      ? "#3A3A3A"
                      : "#E8DCEB"
                  }`,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: accent,
                  }}
                >
                  Support Team Reply
                </Typography>

                <Typography
                  sx={{
                    color: secondaryText,
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.7,
                  }}
                >
                  {ticket.adminReply}
                </Typography>
              </Box>
            </>
          )}

          {/* ================= WAITING FOR REPLY ================= */}

          {!ticket.adminReply && (
            <>
              <Divider
                sx={{
                  my: 3,
                  borderColor: border,
                }}
              />

              <Box
                sx={{
                  p: 2,
                  borderRadius: "10px",
                  backgroundColor:
                    isLuxuryMode
                      ? "#202020"
                      : "#FAF6FB",
                }}
              >
                <Typography
                  sx={{
                    color: secondaryText,
                    fontStyle: "italic",
                  }}
                >
                  Our support team has not replied yet.
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default SupportDetails;