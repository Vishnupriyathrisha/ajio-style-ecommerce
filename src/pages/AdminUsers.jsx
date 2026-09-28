import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

import adminApi from "../services/adminApi";
import { useThemeMode } from "../context/ThemeContext";

const AdminUsers = () => {
  const { isLuxuryMode } = useThemeMode();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminApi.get("/admin/users");

        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Users fetch error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load users"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Theme colors
  const pageBg = isLuxuryMode ? "#111111" : "#F7F5F0";

  const cardBg = isLuxuryMode
    ? "#1B1B1B"
    : "#FFFFFF";

  const textColor = isLuxuryMode
    ? "#FFFFFF"
    : "#171717";

  const secondaryText = isLuxuryMode
    ? "#BDBDBD"
    : "#666666";

  const borderColor = isLuxuryMode
    ? "#333333"
    : "#E5E5E5";

  const tableHeaderBg = isLuxuryMode
    ? "#222222"
    : "#F7F5F0";

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100%",
          p: 3,
          backgroundColor: pageBg,
        }}
      >
        <Typography color={textColor}>
          Loading users...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100%",
          p: 3,
          backgroundColor: pageBg,
        }}
      >
        <Typography color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100%",
        p: {
          xs: 2,
          sm: 3,
        },
        backgroundColor: pageBg,
        color: textColor,
        transition:
          "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            color: textColor,
          }}
        >
          Users
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: secondaryText,
          }}
        >
          Manage registered users
        </Typography>
      </Box>

      {/* Users Count */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: 2,
          color: textColor,
          transition:
            "background-color 0.3s ease, border-color 0.3s ease",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: secondaryText,
          }}
        >
          Total Users
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mt: 0.5,
            color: isLuxuryMode
              ? "#C8A96B"
              : textColor,
          }}
        >
          {users.length}
        </Typography>
      </Paper>

      {/* Users Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          backgroundColor: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: 2,
          overflowX: "auto",
          transition:
            "background-color 0.3s ease, border-color 0.3s ease",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: tableHeaderBg,
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: textColor,
                  borderBottom: `1px solid ${borderColor}`,
                }}
              >
                Name
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  color: textColor,
                  borderBottom: `1px solid ${borderColor}`,
                }}
              >
                Email
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  color: textColor,
                  borderBottom: `1px solid ${borderColor}`,
                }}
              >
                Phone
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  color: textColor,
                  borderBottom: `1px solid ${borderColor}`,
                }}
              >
                Role
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  color: textColor,
                  borderBottom: `1px solid ${borderColor}`,
                }}
              >
                Joined Date
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow
                  key={user._id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: isLuxuryMode
                        ? "rgba(200,169,107,0.08)"
                        : "rgba(182,30,202,0.04)",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      color: textColor,
                      borderBottom: `1px solid ${borderColor}`,
                    }}
                  >
                    {user.name || "-"}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: textColor,
                      borderBottom: `1px solid ${borderColor}`,
                    }}
                  >
                    {user.email || "-"}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: textColor,
                      borderBottom: `1px solid ${borderColor}`,
                    }}
                  >
                    {user.phone || "-"}
                  </TableCell>

                  <TableCell
                    sx={{
                      borderBottom: `1px solid ${borderColor}`,
                    }}
                  >
                    <Chip
                      label={user.role || "user"}
                      size="small"
                      sx={{
                        textTransform: "capitalize",

                        color: isLuxuryMode
                          ? "#C8A96B"
                          : "#B61ECA",

                        border: isLuxuryMode
                          ? "1px solid #C8A96B"
                          : "1px solid #B61ECA",

                        backgroundColor:
                          "transparent",
                      }}
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      color: secondaryText,
                      borderBottom: `1px solid ${borderColor}`,
                    }}
                  >
                    {user.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{
                    borderBottom: "none",
                  }}
                >
                  <Typography
                    sx={{
                      py: 3,
                      color: secondaryText,
                    }}
                  >
                    No users found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminUsers;