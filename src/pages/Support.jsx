import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import AddIcon from "@mui/icons-material/Add";
import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import api from "../services/api";

const Support = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchTickets = async () => {
    try {
      const response = await api.get("/support-tickets/my-tickets");
      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error(
        "Failed to fetch support tickets:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!subject.trim()) {
      alert("Please enter a subject");
      return;
    }

    if (!message.trim()) {
      alert("Please enter your message");
      return;
    }

    try {
      setCreating(true);

      await api.post("/support-tickets", {
        subject,
        message,
      });

      alert("Support ticket created successfully!");

      setSubject("");
      setMessage("");

      fetchTickets();
    } catch (error) {
      console.error(
        "Failed to create support ticket:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to create support ticket"
      );
    } finally {
      setCreating(false);
    }
  };

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

  return (
    <Box
      sx={{
        minHeight: "75vh",
        backgroundColor: "#fafafa",
        px: { xs: 2, md: 6 },
        py: { xs: 4, md: 6 },
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <SupportAgentOutlinedIcon sx={{ fontSize: 32 }} />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              Customer Support
            </Typography>
          </Stack>

          <Typography color="text.secondary">
            Need help? Create a support ticket and our team will assist you.
          </Typography>
        </Box>

        {/* Create Ticket */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e2e2e2",
            backgroundColor: "#fff",
            p: { xs: 3, md: 4 },
            mb: 4,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <AddIcon />

            <Typography
              variant="h6"
              sx={{ fontWeight: 700 }}
            >
              Create Support Ticket
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <CustomInput
                label="Subject"
                name="subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Enter your issue"
                required
              />

              <CustomInput
                label="Message"
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Describe your issue"
                required
                multiline
                minRows={4}
              />

              <Box sx={{ maxWidth: 220 }}>
                <CustomButton
                  type="submit"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Ticket"}
                </CustomButton>
              </Box>
            </Stack>
          </Box>
        </Paper>

        {/* My Tickets */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e2e2e2",
            backgroundColor: "#fff",
            p: { xs: 3, md: 4 },
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 3 }}
          >
            My Support Tickets
          </Typography>

          {loading ? (
            <Typography color="text.secondary">
              Loading tickets...
            </Typography>
          ) : tickets.length === 0 ? (
            <Typography color="text.secondary">
              You haven't created any support tickets yet.
            </Typography>
          ) : (
            <Stack divider={<Divider />} spacing={0}>
              {tickets.map((ticket) => (
                <Box
                  key={ticket._id}
                  onClick={() =>
                    navigate(`/support/${ticket._id}`)
                  }
                  sx={{
                    py: 2.5,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#fafafa",
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
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        {ticket.subject}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {new Date(
                          ticket.createdAt
                        ).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Chip
                      label={ticket.status}
                      color={getStatusColor(ticket.status)}
                      size="small"
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Support;