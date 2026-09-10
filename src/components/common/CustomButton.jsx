import Button from "@mui/material/Button";

const CustomButton = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  fullWidth = true,
  variant = "contained",
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        borderRadius: "6px",
        padding: "10px 20px",
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;