// src/shared/ui/custom-component/app-text-field/AppTextField.tsx

import {
  TextField,
  TextFieldProps,
  InputAdornment,
  MenuItem,
  SxProps,
  Theme,
} from "@mui/material";

export interface AppTextFieldOption {
  label: string;
  value: string | number;
}

export interface AppTextFieldProps extends Omit<TextFieldProps, "variant"> {
  variant?: "outlined" | "filled" | "standard";
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  options?: AppTextFieldOption[];
  multiline?: boolean;
  rows?: number;
  maxRows?: number;
  minRows?: number;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

export const AppTextField: React.FC<AppTextFieldProps> = ({
  variant = "outlined",
  iconStart,
  iconEnd,
  options,
  select = false,
  multiline = false,
  rows,
  minRows,
  maxRows,
  fullWidth = true,
  sx,
  ...props
}) => {
  return (
    <TextField
      {...props}
      variant={variant}
      select={select}
      multiline={multiline}
      rows={rows}
      minRows={minRows}
      maxRows={maxRows}
      fullWidth={fullWidth}
      InputProps={{
        startAdornment: iconStart && (
          <InputAdornment position="start">{iconStart}</InputAdornment>
        ),
        endAdornment: iconEnd && (
          <InputAdornment position="end">{iconEnd}</InputAdornment>
        ),
        ...props.InputProps,
      }}
      sx={sx}
    >
      {select &&
        options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
    </TextField>
  );
};

/*
# Поддерживает:
✅ outlined, filled, standard варианты

✅ select с опциями

✅ multiline, rows, minRows, maxRows

✅ startAdornment, endAdornment (иконки или контент)

✅ Полная совместимость с валидацией (error, helperText)

✅ fullWidth, size, margin, color

✅ sx кастомизация
*/
