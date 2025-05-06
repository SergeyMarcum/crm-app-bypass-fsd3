// src/shared/ui/custom-component/app-checkbox/AppCheckbox.tsx

import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormControlLabelProps,
  SxProps,
  Theme,
} from "@mui/material";

export interface AppCheckboxProps
  extends Omit<CheckboxProps, "icon" | "checkedIcon"> {
  label?: React.ReactNode;
  labelPlacement?: FormControlLabelProps["labelPlacement"];
  controlled?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  icon?: React.ReactNode;
  checkedIcon?: React.ReactNode;
  indeterminate?: boolean;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

export const AppCheckbox: React.FC<AppCheckboxProps> = ({
  label,
  labelPlacement = "end",
  size = "medium",
  color = "primary",
  controlled = false,
  checked,
  defaultChecked,
  icon,
  checkedIcon,
  indeterminate = false,
  onChange,
  disabled = false,
  sx,
  ...rest
}) => {
  const checkboxElement = (
    <Checkbox
      size={size}
      color={color}
      icon={icon}
      checkedIcon={checkedIcon}
      indeterminate={indeterminate}
      checked={controlled ? checked : undefined}
      defaultChecked={!controlled ? defaultChecked : undefined}
      onChange={onChange}
      disabled={disabled}
      sx={sx}
      {...rest}
    />
  );

  if (label) {
    return (
      <FormControlLabel
        control={checkboxElement}
        label={label}
        labelPlacement={labelPlacement}
        disabled={disabled}
      />
    );
  }

  return checkboxElement;
};
/*
Пропсы:

label?: React.ReactNode — подпись рядом с чекбоксом

size?: "small" | "medium" — размер чекбокса

color?: CheckboxProps['color'] — цвет чекбокса

icon?: React.ReactNode — иконка, когда чекбокс неактивен

checkedIcon?: React.ReactNode — иконка, когда чекбокс активен

indeterminate?: boolean — промежуточное состояние

controlled?: boolean — управляемый/неуправляемый режим

checked?: boolean — значение чекбокса (для controlled)

defaultChecked?: boolean — начальное значение (для uncontrolled)

onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void — обработчик

disabled?: boolean — отключение чекбокса

labelPlacement?: "end" | "start" | "top" | "bottom" — позиция лейбла

sx?: SxProps — кастомизация через sx
*/
