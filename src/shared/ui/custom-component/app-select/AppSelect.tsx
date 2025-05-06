// src/shared/ui/custom-component/app-select/AppSelect.tsx

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  OutlinedInput,
  FilledInput,
  Input,
  Chip,
  FormHelperText,
  SxProps,
  Theme,
} from "@mui/material";

export interface AppSelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface AppSelectProps {
  options?: AppSelectOption[];
  variant?: "outlined" | "filled" | "standard";
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (
    event: SelectChangeEvent<string | string[]>,
    child: React.ReactNode
  ) => void;
  multiple?: boolean;
  native?: boolean;
  size?: "small" | "medium";
  autoWidth?: boolean;
  disabled?: boolean;
  error?: boolean;
  name?: string;
  renderValue?: (selected: string | string[]) => React.ReactNode;
  sx?: SxProps<Theme>;
}

export const AppSelect: React.FC<AppSelectProps> = ({
  options = [],
  variant = "outlined",
  label,
  placeholder,
  helperText,
  value,
  defaultValue,
  onChange,
  multiple = false,
  native = false,
  size = "medium",
  autoWidth = false,
  disabled = false,
  error = false,
  name,
  renderValue,
  sx,
}) => {
  const inputComponent =
    variant === "filled" ? (
      <FilledInput />
    ) : variant === "standard" ? (
      <Input />
    ) : (
      <OutlinedInput />
    );

  const defaultRenderValue = (selected: string | string[]) => {
    if (multiple && Array.isArray(selected)) {
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {selected.map((val) => (
            <Chip
              key={val}
              label={options.find((o) => o.value === val)?.label ?? val}
              size="small"
            />
          ))}
        </div>
      );
    }
    return (
      options.find((o) => o.value === selected)?.label ?? placeholder ?? ""
    );
  };

  return (
    <FormControl
      variant={variant}
      fullWidth
      size={size}
      error={error}
      disabled={disabled}
      sx={sx}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        multiple={multiple}
        native={native}
        value={value ?? (multiple ? [] : "")}
        defaultValue={defaultValue}
        onChange={onChange}
        input={inputComponent}
        label={label}
        name={name}
        autoWidth={autoWidth}
        renderValue={renderValue ?? defaultRenderValue}
      >
        {placeholder && !multiple && !native && (
          <MenuItem disabled value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}

        {native
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))
          : options.map((opt) => (
              <MenuItem
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </MenuItem>
            ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

/*
# Пропсы:

options?: { value: string; label: React.ReactNode; disabled?: boolean }[]

variant?: 'filled' | 'standard' | 'outlined' — тип поля

label?: string

placeholder?: string

helperText?: React.ReactNode

value?: string | string[]

defaultValue?: string | string[]

onChange?: (event: SelectChangeEvent<any>, child: React.ReactNode) => void

multiple?: boolean

native?: boolean

size?: 'small' | 'medium'

autoWidth?: boolean

disabled?: boolean

error?: boolean

name?: string

renderValue?: (selected: any) => React.ReactNode — для кастомного отображения (напр. Chip)

sx?: SxProps<Theme>
*/
