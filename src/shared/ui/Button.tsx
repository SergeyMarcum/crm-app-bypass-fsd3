// src/shared/ui/Button.tsx
import { Button as MuiButton, ButtonProps } from "@mui/material";

export const Button = (props: ButtonProps): JSX.Element => {
  return <MuiButton {...props} />;
};
