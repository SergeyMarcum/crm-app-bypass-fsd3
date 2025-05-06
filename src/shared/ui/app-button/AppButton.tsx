// src/shared/ui/app-button/AppButton.tsx

import {
  Button,
  IconButton,
  ButtonGroup,
  ButtonProps as MUIButtonProps,
} from "@mui/material";

type ButtonVariant = "text" | "outlined" | "contained";
type ButtonSize = "small" | "medium" | "large";
type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning";
type ButtonType = "simple" | "withIcon" | "iconOnly" | "group";

export interface AppButtonProps {
  type: ButtonType;
  label?: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  icon?: React.ReactNode; // for iconOnly
  buttons?: AppButtonProps[]; // for group
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  sx?: MUIButtonProps["sx"];
  className?: string;
}

export const AppButton: React.FC<AppButtonProps> = (props) => {
  const {
    type,
    label,
    variant = "contained",
    color = "primary",
    size = "medium",
    startIcon,
    endIcon,
    icon,
    buttons = [],
    onClick,
    disabled = false,
    fullWidth = false,
    sx,
    className,
  } = props;

  switch (type) {
    case "simple":
      return (
        <Button
          variant={variant}
          color={color}
          size={size}
          onClick={onClick}
          disabled={disabled}
          fullWidth={fullWidth}
          sx={sx}
          className={className}
        >
          {label}
        </Button>
      );

    case "withIcon":
      return (
        <Button
          variant={variant}
          color={color}
          size={size}
          onClick={onClick}
          disabled={disabled}
          fullWidth={fullWidth}
          startIcon={startIcon}
          endIcon={endIcon}
          sx={sx}
          className={className}
        >
          {label}
        </Button>
      );

    case "iconOnly":
      return (
        <IconButton
          color={color}
          size={size}
          onClick={onClick}
          disabled={disabled}
          sx={sx}
          className={className}
        >
          {icon}
        </IconButton>
      );

    case "group":
      return (
        <ButtonGroup
          variant={variant}
          color={color}
          size={size}
          fullWidth={fullWidth}
          sx={sx}
          className={className}
        >
          {buttons.map((btn, idx) => (
            <AppButton key={idx} {...btn} />
          ))}
        </ButtonGroup>
      );

    default:
      return null;
  }
};
