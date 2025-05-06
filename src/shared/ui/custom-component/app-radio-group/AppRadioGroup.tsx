// src/shared/ui/custom-component/app-radio-group/AppRadioGroup.tsx
// src/shared/ui/custom-component/app-radio-group/AppRadioGroup.tsx

import {
  RadioGroup,
  Radio,
  RadioProps,
  FormControl,
  FormControlLabel,
  FormHelperText,
  SxProps,
  Theme,
} from "@mui/material";

export interface AppRadioGroupOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface AppRadioGroupProps {
  options?: AppRadioGroupOption[];
  controlled?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => void;
  direction?: "row" | "column";
  size?: RadioProps["size"];
  color?: RadioProps["color"];
  labelPlacement?: "end" | "start" | "top" | "bottom";
  error?: boolean;
  helperText?: React.ReactNode;
  name?: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}

export const AppRadioGroup: React.FC<AppRadioGroupProps> = ({
  options,
  controlled = false,
  value,
  defaultValue,
  onChange,
  direction = "column",
  size = "medium",
  color = "primary",
  labelPlacement = "end",
  error = false,
  helperText,
  name,
  sx,
  children,
}) => {
  const renderRadioOptions = () => {
    return options?.map((option) => (
      <FormControlLabel
        key={option.value}
        value={option.value}
        control={<Radio size={size} color={color} />}
        label={option.label}
        labelPlacement={labelPlacement}
        disabled={option.disabled}
      />
    ));
  };

  return (
    <FormControl error={error} sx={sx}>
      <RadioGroup
        row={direction === "row"}
        name={name}
        value={controlled ? value : undefined}
        defaultValue={!controlled ? defaultValue : undefined}
        onChange={onChange}
      >
        {children ? children : renderRadioOptions()}
      </RadioGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

/*
# Пропсы:

options?: { value: string; label: React.ReactNode; disabled?: boolean }[] — если передан список опций, рендерим их

controlled?: boolean — управляемая модель

value?: string — текущее значение (controlled)

defaultValue?: string — значение по умолчанию (uncontrolled)

onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void — обработчик

direction?: "row" | "column" — размещение радио-кнопок

size?: "small" | "medium" — размер кнопок

color?: RadioProps["color"] — цвет кнопок

labelPlacement?: FormControlLabelProps["labelPlacement"]

error?: boolean — признак ошибки

helperText?: React.ReactNode — текст ошибки/пояснение

name?: string

sx?: SxProps<Theme>

children?: React.ReactNode — поддержка ручного рендеринга радио-кнопок (standalone mode)
*/
