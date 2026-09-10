import TextField from "@mui/material/TextField";

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
  return (
    <TextField
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      variant="outlined"
      size="small"
      slotProps={slotProps}
    />
  );
};

export default CustomInput;