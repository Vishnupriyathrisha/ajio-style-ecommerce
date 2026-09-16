import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import CustomButton from "../components/common/CustomButton";
import api from "../services/api";

const SupportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await api.get(`/support-tickets/${id}`);
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

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography>Loading ticket...</Typography>
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Support ticket not found
        </Typography>

        <Box sx={{ maxWidth: 180, mx: "auto" }}>
          <CustomButton onClick={() => navigate("/support")}>
            Back to Support
          </CustomButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "75vh",
        backgroundColor: "#fafafa",
        px: { xs: 2, md: 6 },
        py: { xs: 4, md: 6 },
      }}
    >
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        {/* Back */}
        <Box
          onClick={() => navigate("/support")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            mb: 3,
            width: "fit-content",
          }}
        >
          <ArrowBackIcon fontSize="small" />

          <Typography sx={{ fontWeight: 600 }}>
            Back to Support
          </Typography>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Support Ticket
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          View your support request and response.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e2e2e2",
            backgroundColor: "#fff",
            p: { xs: 3, md: 4 },
          }}
        >
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
                sx={{ fontWeight: 700 }}
              >
                {ticket.subject}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Created on{" "}
                {new Date(
                  ticket.createdAt
                ).toLocaleDateString()}
              </Typography>
            </Box>

            <Chip
              label={ticket.status}
              color={getStatusColor(ticket.status)}
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            Your Message
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.7,
            }}
          >
            {ticket.message}
          </Typography>

          {ticket.adminReply && (
            <>
              <Divider sx={{ my: 3 }} />

              <Typography
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Support Team Reply
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.7,
                }}
              >
                {ticket.adminReply}
              </Typography>
            </>
          )}

          {!ticket.adminReply && (
            <>
              <Divider sx={{ my: 3 }} />

              <Typography
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                Our support team has not replied yet.
              </Typography>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default SupportDetails;