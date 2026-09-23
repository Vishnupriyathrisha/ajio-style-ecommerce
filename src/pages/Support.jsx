import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import AddIcon from "@mui/icons-material/Add";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import api from "../services/api";
import { useThemeMode } from "../context/ThemeContext";

const Support = () => {
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

  const softBackground = isLuxuryMode
    ? "#202020"
    : "#F9F2FA";

  const emptyBackground = isLuxuryMode
    ? "#181818"
    : "#FCF8FD";

  const primaryText = isLuxuryMode
    ? "#FFFFFF"
    : "#171717";

  const secondaryText = isLuxuryMode
    ? "#BDBDBD"
    : "#6B6B6B";

  const mutedText = isLuxuryMode
    ? "#8F8F8F"
    : "#777777";

  const accent = isLuxuryMode
    ? "#C8A96B"
    : "#B61ECA";

  const accentHover = isLuxuryMode
    ? "#E0C080"
    : "#9615A8";

  const border = isLuxuryMode
    ? "#333333"
    : "#E8DCEB";

  const emptyBorder = isLuxuryMode
    ? "#444444"
    : "#DCC9E0";

  const iconMuted = isLuxuryMode
    ? "#6D6046"
    : "#C99BD1";

  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });

  // =========================
  // FETCH TICKETS
  // =========================

  const fetchTickets = async () => {
    try {
      const response = await api.get(
        "/support-tickets/my-tickets"
      );

      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error(
        "Failed to fetch support tickets:",
        error.response?.data || error.message
      );

      setAlert({
        show: true,
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to load support tickets",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // =========================
  // CREATE TICKET
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setAlert({
      show: false,
      type: "success",
      message: "",
    });

    if (!subject.trim()) {
      setAlert({
        show: true,
        type: "error",
        message: "Please enter a subject",
      });
      return;
    }

    if (!message.trim()) {
      setAlert({
        show: true,
        type: "error",
        message: "Please enter your message",
      });
      return;
    }

    try {
      setCreating(true);

      await api.post("/support-tickets", {
        subject,
        message,
      });

      setSubject("");
      setMessage("");

      setAlert({
        show: true,
        type: "success",
        message:
          "Support ticket created successfully!",
      });

      await fetchTickets();
    } catch (error) {
      console.error(
        "Failed to create support ticket:",
        error.response?.data || error.message
      );

      setAlert({
        show: true,
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to create support ticket",
      });
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // STATUS COLORS
  // =========================

  const getStatusColor = (status) => {
    if (isLuxuryMode) {
      switch (status) {
        case "Open":
          return {
            background:
              "rgba(33, 150, 243, 0.15)",
            color: "#64B5F6",
          };

        case "In Progress":
          return {
            background:
              "rgba(200, 169, 107, 0.15)",
            color: "#E0C080",
          };

        case "Resolved":
          return {
            background:
              "rgba(76, 175, 125, 0.15)",
            color: "#66BB8A",
          };

        case "Closed":
          return {
            background: "#333333",
            color: "#BDBDBD",
          };

        default:
          return {
            background: "#333333",
            color: "#BDBDBD",
          };
      }
    }

    switch (status) {
      case "Open":
        return {
          background: "#F3E5F5",
          color: "#8E24AA",
        };

      case "In Progress":
        return {
          background: "#FFF3E0",
          color: "#EF6C00",
        };

      case "Resolved":
        return {
          background: "#E8F5E9",
          color: "#2E7D32",
        };

      case "Closed":
        return {
          background: "#F5F5F5",
          color: "#616161",
        };

      default:
        return {
          background: "#F5F5F5",
          color: "#616161",
        };
    }
  };

  return (
    <Box
      sx={{
        minHeight: "75vh",
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
          maxWidth: 1100,
          mx: "auto",
        }}
      >
        {/* ================= HEADER ================= */}

        <Box sx={{ mb: 4 }}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                backgroundColor: accent,
                color: isLuxuryMode
                  ? "#171717"
                  : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SupportAgentOutlinedIcon
                sx={{
                  fontSize: 28,
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: 27,
                    md: 34,
                  },
                  fontWeight: 800,
                  color: primaryText,
                  letterSpacing: "-0.5px",
                }}
              >
                Customer Support
              </Typography>

              <Typography
                sx={{
                  color: secondaryText,
                  fontSize: 14,
                }}
              >
                We're here to help with your shopping experience
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* ================= ALERT ================= */}

        {alert.show && (
          <Alert
            severity={alert.type}
            onClose={() =>
              setAlert({
                show: false,
                type: "success",
                message: "",
              })
            }
            sx={{
              mb: 3,
              borderRadius: "10px",
            }}
          >
            {alert.message}
          </Alert>
        )}

        {/* ================= CREATE TICKET ================= */}

        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${border}`,
            backgroundColor: cardBackground,
            borderRadius: "14px",
            p: {
              xs: 2.5,
              sm: 3.5,
              md: 4,
            },
            mb: 4,
            transition:
              "background-color 0.3s ease, border-color 0.3s ease",
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "10px",
                backgroundColor: softBackground,
                color: accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AddIcon />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 19,
                  color: primaryText,
                }}
              >
                Create Support Ticket
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: secondaryText,
                  mt: 0.3,
                }}
              >
                Tell us what you need help with
              </Typography>
            </Box>
          </Stack>

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <Stack spacing={2.5}>
              <CustomInput
                label="Subject"
                name="subject"
                value={subject}
                onChange={(event) =>
                  setSubject(event.target.value)
                }
                placeholder="Enter your issue"
                required
              />

              <CustomInput
                label="Message"
                name="message"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="Describe your issue in detail"
                required
                multiline
                minRows={5}
              />

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: 210,
                  },
                }}
              >
                <CustomButton
                  type="submit"
                  disabled={creating}
                  sx={{
                    backgroundColor: accent,
                    color: isLuxuryMode
                      ? "#171717"
                      : "#FFFFFF",

                    "&:hover": {
                      backgroundColor:
                        accentHover,
                    },

                    "&:disabled": {
                      backgroundColor:
                        isLuxuryMode
                          ? "#5C513B"
                          : "#D9A4DF",
                      color: isLuxuryMode
                        ? "#BDBDBD"
                        : "#FFFFFF",
                    },
                  }}
                >
                  {creating
                    ? "Creating..."
                    : "Create Ticket"}
                </CustomButton>
              </Box>
            </Stack>
          </Box>
        </Paper>

        {/* ================= MY TICKETS ================= */}

        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${border}`,
            backgroundColor: cardBackground,
            borderRadius: "14px",
            p: {
              xs: 2.5,
              sm: 3.5,
              md: 4,
            },
            transition:
              "background-color 0.3s ease, border-color 0.3s ease",
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "10px",
                backgroundColor: softBackground,
                color: accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ConfirmationNumberOutlinedIcon />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 19,
                  color: primaryText,
                }}
              >
                My Support Tickets
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: secondaryText,
                  mt: 0.3,
                }}
              >
                Track your support requests
              </Typography>
            </Box>
          </Stack>

          {/* ================= LOADING ================= */}

          {loading ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={1.5}
              sx={{ py: 6 }}
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
                  fontSize: 14,
                }}
              >
                Loading tickets...
              </Typography>
            </Stack>
          ) : tickets.length === 0 ? (
            /* ================= EMPTY STATE ================= */

            <Box
              sx={{
                textAlign: "center",
                py: 6,
                px: 2,
                border: `1px dashed ${emptyBorder}`,
                borderRadius: "12px",
                backgroundColor: emptyBackground,
              }}
            >
              <ConfirmationNumberOutlinedIcon
                sx={{
                  fontSize: 42,
                  color: iconMuted,
                  mb: 1,
                }}
              />

              <Typography
                sx={{
                  fontWeight: 700,
                  color: primaryText,
                  mb: 0.5,
                }}
              >
                No support tickets yet
              </Typography>

              <Typography
                sx={{
                  color: mutedText,
                  fontSize: 13,
                }}
              >
                Create a ticket if you need help with your order.
              </Typography>
            </Box>
          ) : (
            /* ================= TICKET LIST ================= */

            <Stack
              divider={
                <Divider
                  sx={{
                    borderColor: border,
                  }}
                />
              }
              spacing={0}
            >
              {tickets.map((ticket) => {
                const statusStyle =
                  getStatusColor(ticket.status);

                return (
                  <Box
                    key={ticket._id}
                    onClick={() =>
                      navigate(
                        `/support/${ticket._id}`
                      )
                    }
                    sx={{
                      py: 2.5,
                      px: {
                        xs: 1,
                        sm: 1.5,
                      },
                      cursor: "pointer",
                      borderRadius: "10px",
                      transition:
                        "all 0.2s ease",

                      "&:hover": {
                        backgroundColor:
                          isLuxuryMode
                            ? "#222222"
                            : "#FCF7FD",
                        transform:
                          "translateX(3px)",
                      },
                    }}
                  >
                    <Stack
                      direction={{
                        xs: "column",
                        sm: "row",
                      }}
                      spacing={1.5}
                      justifyContent="space-between"
                      alignItems={{
                        xs: "flex-start",
                        sm: "center",
                      }}
                    >
                      {/* Ticket Info */}

                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            flexShrink: 0,
                            borderRadius: "9px",
                            backgroundColor:
                              softBackground,
                            color: accent,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ConfirmationNumberOutlinedIcon
                            sx={{
                              fontSize: 20,
                            }}
                          />
                        </Box>

                        <Box
                          sx={{
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: primaryText,
                              mb: 0.5,
                              wordBreak:
                                "break-word",
                            }}
                          >
                            {ticket.subject}
                          </Typography>

                          <Typography
                            sx={{
                              color: mutedText,
                              fontSize: 12.5,
                            }}
                          >
                            Created on{" "}
                            {new Date(
                              ticket.createdAt
                            ).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Status + Arrow */}

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <Chip
                          label={ticket.status}
                          size="small"
                          sx={{
                            backgroundColor:
                              statusStyle.background,
                            color:
                              statusStyle.color,
                            fontWeight: 700,
                            fontSize: 12,
                            borderRadius: "6px",
                          }}
                        />

                        <ArrowForwardIosIcon
                          sx={{
                            fontSize: 14,
                            color: isLuxuryMode
                              ? "#777777"
                              : "#A0A0A0",
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Support;