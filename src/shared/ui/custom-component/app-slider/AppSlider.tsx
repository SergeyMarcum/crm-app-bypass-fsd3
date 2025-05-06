// src/shared/ui/custom-component/app-slider/AppSlider.tsx

import { useState } from "react";
import {
  Box,
  Slider,
  SliderProps,
  Typography,
  TextField,
  SxProps,
  Theme,
} from "@mui/material";

export interface AppSliderProps extends Omit<SliderProps, "color"> {
  label?: string;
  color?: "primary" | "secondary";
  inputField?: boolean;
  minDistance?: number;
  sx?: SxProps<Theme>;
}

export const AppSlider: React.FC<AppSliderProps> = ({
  label,
  value: propValue,
  onChange,
  defaultValue,
  step = 1,
  marks,
  min = 0,
  max = 100,
  valueLabelDisplay = "auto",
  size = "medium",
  disabled = false,
  inputField = false,
  minDistance,
  sx,
  color = "primary",
  ...rest
}) => {
  const isRange = Array.isArray(propValue ?? defaultValue);
  const [internalValue, setInternalValue] = useState<number | number[]>(
    propValue ?? defaultValue ?? (isRange ? [min, max] : min)
  );

  const handleChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (minDistance && Array.isArray(newValue)) {
      const [minVal, maxVal] = newValue;
      if (maxVal - minVal < minDistance) {
        const clamped =
          activeThumb === 0
            ? [Math.min(minVal, max - minDistance), minVal + minDistance]
            : [maxVal - minDistance, Math.max(maxVal, min + minDistance)];
        setInternalValue(clamped);
        onChange?.(event, clamped, activeThumb);
        return;
      }
    }

    setInternalValue(newValue);
    onChange?.(event, newValue, activeThumb);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    let val = Number(e.target.value);
    if (Array.isArray(internalValue)) {
      const newRange = [...internalValue] as number[];
      if (index !== undefined) {
        newRange[index] = val;
        setInternalValue(newRange);
        onChange?.(e as unknown as Event, newRange, index);
      }
    } else {
      setInternalValue(val);
      onChange?.(e as unknown as Event, val, 0);
    }
  };

  return (
    <Box sx={{ width: "100%", ...sx }}>
      {label && (
        <Typography variant="subtitle2" gutterBottom>
          {label}
        </Typography>
      )}
      <Slider
        value={internalValue}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        marks={marks}
        valueLabelDisplay={valueLabelDisplay}
        size={size}
        disabled={disabled}
        color={color}
        {...rest}
      />
      {inputField && (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 1,
          }}
        >
          {Array.isArray(internalValue) ? (
            internalValue.map((val, i) => (
              <TextField
                key={i}
                size="small"
                label={i === 0 ? "Min" : "Max"}
                type="number"
                value={val}
                onChange={(e) => handleInputChange(e, i)}
                inputProps={{ min, max }}
              />
            ))
          ) : (
            <TextField
              size="small"
              type="number"
              value={internalValue}
              onChange={(e) => handleInputChange(e)}
              inputProps={{ min, max }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};
