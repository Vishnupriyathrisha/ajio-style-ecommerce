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
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

import adminApi from "../services/adminApi";
import { useThemeMode } from "../context/ThemeContext";

const AdminSellers = () => {
  const { isLuxuryMode } = useThemeMode();

  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await adminApi.get("/admin/sellers");

        setSellers(response.data.sellers || []);
      } catch (error) {
        console.error("Sellers fetch error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load sellers"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  // ========================================
  // UPDATE SELLER STATUS
  // ========================================

  const handleStatusChange = async (sellerId, status) => {
    try {
      await adminApi.patch(
        `/admin/sellers/${sellerId}/status`,
        {
          status,
        }
      );

      setSellers((prevSellers) =>
        prevSellers.map((seller) =>
          seller._id === sellerId
            ? {
                ...seller,
                status,
              }
            : seller
        )
      );
    } catch (error) {
      console.error(
        "Seller status update error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update seller status"
      );
    }
  };

  // ========================================
  // STATUS COLOR
  // ========================================

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "#2E7D32";

      case "Rejected":
        return "#D32F2F";

      case "Blocked":
        return "#616161";

      case "Pending":
      default:
        return isLuxuryMode
          ? "#C8A96B"
          : "#B61ECA";
    }
  };

  // ========================================
  // THEME COLORS
  // ========================================

  const pageBg = isLuxuryMode
    ? "#111111"
    : "#F7F5F0";

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

  // ========================================
  // LOADING
  // ========================================

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
          Loading sellers...
        </Typography>
      </Box>
    );
  }

  // ========================================
  // ERROR
  // ========================================

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

  // ========================================
  // MAIN UI
  // ========================================

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
      {/* PAGE HEADER */}

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            color: textColor,
          }}
        >
          Sellers
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: secondaryText,
          }}
        >
          Manage registered sellers
        </Typography>
      </Box>

      {/* TOTAL SELLERS */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: 2,
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
          Total Sellers
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
          {sellers.length}
        </Typography>
      </Paper>

      {/* SELLERS TABLE */}

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
          {/* TABLE HEADER */}

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
                  borderBottom:
                    `1px solid ${borderColor}`,
                }}
              >
                Business Name
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  color: textColor,
                  borderBottom:
                    `1px solid ${borderColor}`,
                }}
              >
                Seller Name
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  color: textColor,
                  borderBottom:
                    `1px solid ${borderColor}`,
                }}
              >
                Email
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  color: textColor,
                  borderBottom:
                    `1px solid ${borderColor}`,
                }}
              >
                Phone
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  color: textColor,
                  borderBottom:
                    `1px solid ${borderColor}`,
                }}
              >
                Location
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  color: textColor,
                  borderBottom:
                    `1px solid ${borderColor}`,
                }}
              >
                Status
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  color: textColor,
                  borderBottom:
                    `1px solid ${borderColor}`,
                }}
              >
                Joined Date
              </TableCell>
            </TableRow>
          </TableHead>

          {/* TABLE BODY */}

          <TableBody>
            {sellers.length > 0 ? (
              sellers.map((seller) => (
                <TableRow
                  key={seller._id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor:
                        isLuxuryMode
                          ? "rgba(200,169,107,0.08)"
                          : "rgba(182,30,202,0.04)",
                    },
                  }}
                >
                  {/* BUSINESS NAME */}

                  <TableCell
                    sx={{
                      color: textColor,
                      borderBottom:
                        `1px solid ${borderColor}`,
                    }}
                  >
                    {seller.businessName || "-"}
                  </TableCell>

                  {/* SELLER NAME */}

                  <TableCell
                    sx={{
                      color: textColor,
                      borderBottom:
                        `1px solid ${borderColor}`,
                    }}
                  >
                    {seller.sellerName || "-"}
                  </TableCell>

                  {/* EMAIL */}

                  <TableCell
                    sx={{
                      color: textColor,
                      borderBottom:
                        `1px solid ${borderColor}`,
                    }}
                  >
                    {seller.email || "-"}
                  </TableCell>

                  {/* PHONE */}

                  <TableCell
                    sx={{
                      color: textColor,
                      borderBottom:
                        `1px solid ${borderColor}`,
                    }}
                  >
                    {seller.phone || "-"}
                  </TableCell>

                  {/* LOCATION */}

                  <TableCell
                    sx={{
                      color: secondaryText,
                      borderBottom:
                        `1px solid ${borderColor}`,
                    }}
                  >
                    {seller.city || "-"},{" "}
                    {seller.state || "-"}
                  </TableCell>

                  {/* STATUS */}

                  <TableCell
                    sx={{
                      borderBottom:
                        `1px solid ${borderColor}`,
                    }}
                  >
                    <FormControl size="small">
                      <Select
                        value={
                          seller.status ||
                          "Pending"
                        }
                        onChange={(event) =>
                          handleStatusChange(
                            seller._id,
                            event.target.value
                          )
                        }
                        sx={{
                          minWidth: 120,
                          color:
                            getStatusColor(
                              seller.status
                            ),

                          "& .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor:
                                getStatusColor(
                                  seller.status
                                ),
                            },

                          "&:hover .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor:
                                getStatusColor(
                                  seller.status
                                ),
                            },

                          "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor:
                                getStatusColor(
                                  seller.status
                                ),
                            },
                        }}
                      >
                        <MenuItem value="Pending">
                          Pending
                        </MenuItem>

                        <MenuItem value="Approved">
                          Approved
                        </MenuItem>

                        <MenuItem value="Rejected">
                          Rejected
                        </MenuItem>

                        <MenuItem value="Blocked">
                          Blocked
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>

                  {/* JOINED DATE */}

                  <TableCell
                    sx={{
                      color: secondaryText,
                      borderBottom:
                        `1px solid ${borderColor}`,
                    }}
                  >
                    {seller.createdAt
                      ? new Date(
                          seller.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
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
                    No sellers found.
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

export default AdminSellers;