import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 3,
        textAlign: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © 2026 AJIO Style E-commerce. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;