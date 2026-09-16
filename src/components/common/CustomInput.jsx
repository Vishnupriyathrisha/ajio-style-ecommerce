import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const CustomInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  error = false,
  helperText = "",
  fullWidth = true,
  slotProps,
}) => {
  const isPassword = type === "password";

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <TextField
      label={label}
      name={name}
      type={isPassword ? (showPassword ? "text" : "password") : type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      variant="outlined"
      size="small"
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps?.input,
          endAdornment: isPassword ? (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : (
            slotProps?.input?.endAdornment
          ),
        },
      }}
    />
  );
};

export default CustomInput;