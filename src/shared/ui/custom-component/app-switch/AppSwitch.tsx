// src/shared/ui/custom-component/app-switch/AppSwitch.tsx

import {
  Switch,
  SwitchProps,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormControl,
  SxProps,
  Theme,
} from "@mui/material";

export interface AppSwitchProps extends Omit<SwitchProps, "color"> {
  label?: string;
  labelPlacement?: "end" | "start" | "top" | "bottom";
  color?: "primary" | "secondary";
  error?: boolean;
  helperText?: string;
  group?: boolean;
  sx?: SxProps<Theme>;
}

export const AppSwitch: React.FC<AppSwitchProps> = ({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  size = "medium",
  color = "primary",
  labelPlacement = "end",
  error = false,
  helperText,
  group = false,
  sx,
  ...rest
}) => {
  const switchElement = (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          size={size}
          color={color}
          disabled={disabled}
          {...rest}
        />
      }
      label={label}
      labelPlacement={labelPlacement}
      disabled={disabled}
    />
  );

  const content = group ? (
    <FormGroup>{switchElement}</FormGroup>
  ) : (
    switchElement
  );

  return (
    <FormControl error={error} component="fieldset" sx={{ ...sx }}>
      {content}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

/*
# Поддерживает:
✅ Контролируемый и неконтролируемый режим (checked, defaultChecked)

✅ Отображение с FormGroup (group пропс)

✅ Размещение метки (labelPlacement)

✅ Цвета primary | secondary

✅ Размер small | medium

✅ Состояние disabled

✅ Валидация + helperText
*/
