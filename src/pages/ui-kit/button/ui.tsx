// src/pages/ui-kit/button/ui.tsx

import {
  Container,
  Stack,
  Typography,
  Divider,
  Card,
  CardHeader,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  AppButton,
  AppButtonProps,
} from "@/shared/ui/custom-component/app-button";

import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ButtonsPage: React.FC = () => {
  // Данные для демонстрации кнопок
  const buttonVariants: AppButtonProps["variant"][] = [
    "contained",
    "outlined",
    "text",
  ];
  const buttonColors: AppButtonProps["color"][] = ["primary", "secondary"];
  const buttonSizes: AppButtonProps["size"][] = ["small", "medium", "large"];
  const buttonColorsExtended: AppButtonProps["color"][] = [
    "primary",
    "secondary",
    "success",
    "error",
    "info",
    "warning",
  ];

  return (
    <Box sx={{ py: 4, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          {/* Заголовок и навигация */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Link to="/components" style={{ textDecoration: "none" }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Components
                </Typography>
              </Stack>
            </Link>
            <Typography variant="h1">Buttons</Typography>
          </Stack>

          {/* Простые кнопки */}
          <Card variant="outlined">
            <CardHeader title="Simple buttons" />
            <Divider />
            <Stack spacing={2} sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Simple buttons with different variants and colors. Use the
                `type="simple"` prop.
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
                {buttonVariants.map((variant) =>
                  buttonColors.map((color) => (
                    <Stack key={`${variant}-${color}`} spacing={1}>
                      <AppButton
                        type="simple"
                        label="Default"
                        variant={variant}
                        color={color}
                        size="medium"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {`variant="${variant}", color="${color}", size="medium"`}
                      </Typography>
                      <AppButton
                        type="simple"
                        label="Disabled"
                        variant={variant}
                        color={color}
                        size="medium"
                        disabled
                      />
                      <Typography variant="caption" color="text.secondary">
                        {`variant="${variant}", color="${color}", disabled=true`}
                      </Typography>
                    </Stack>
                  ))
                )}
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Different sizes for simple buttons.
              </Typography>
              <Stack direction="row" spacing={2}>
                {buttonSizes.map((size) => (
                  <Stack key={size} spacing={1}>
                    <AppButton
                      type="simple"
                      label="Create"
                      variant="contained"
                      color="primary"
                      size={size}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {`size="${size}"`}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Card>

          {/* Кнопки с иконками */}
          <Card variant="outlined">
            <CardHeader title="Buttons with text and icon" />
            <Divider />
            <Stack spacing={2} sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Buttons with icons using `type="withIcon"`. Use `startIcon` or
                `endIcon` props.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Stack spacing={1}>
                  <AppButton
                    type="withIcon"
                    label="Delete account"
                    variant="contained"
                    color="error"
                    size="medium"
                    startIcon={<DeleteIcon />}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {`type="withIcon", startIcon, color="error"`}
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <AppButton
                    type="withIcon"
                    label="Next page"
                    variant="contained"
                    color="primary"
                    size="medium"
                    endIcon={<ArrowForwardIcon />}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {`type="withIcon", endIcon, color="primary"`}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Card>

          {/* Группы кнопок */}
          <Card variant="outlined">
            <CardHeader title="Button groups" />
            <Divider />
            <Stack spacing={2} sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Button groups using `type="group"`. Pass an array of buttons via
                the `buttons` prop.
              </Typography>
              <Stack spacing={1}>
                <AppButton
                  type="group"
                  variant="contained"
                  color="primary"
                  buttons={[
                    {
                      type: "simple",
                      label: "Create a merge commit",
                      size: "medium",
                    },
                    {
                      type: "iconOnly",
                      icon: <ExpandMoreIcon />,
                      size: "small",
                    },
                  ]}
                />
                <Typography variant="caption" color="text.secondary">
                  {`type="group", buttons=[{type="simple"}, {type="iconOnly"}]`}
                </Typography>
              </Stack>
            </Stack>
          </Card>

          {/* Иконки-кнопки */}
          <Card variant="outlined">
            <CardHeader title="Icon buttons" />
            <Divider />
            <Stack spacing={2} sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Icon-only buttons using `type="iconOnly"`. Use the `icon` prop.
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
                {buttonColorsExtended.map((color) => (
                  <Stack key={color} spacing={1}>
                    <AppButton
                      type="iconOnly"
                      icon={<DeleteIcon />}
                      color={color}
                      size="medium"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {`type="iconOnly", color="${color}", size="medium"`}
                    </Typography>
                  </Stack>
                ))}
                <Stack spacing={1}>
                  <AppButton
                    type="iconOnly"
                    icon={<DeleteIcon />}
                    color="secondary"
                    size="medium"
                    disabled
                  />
                  <Typography variant="caption" color="text.secondary">
                    {`type="iconOnly", color="secondary", disabled=true`}
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Different sizes for icon buttons.
              </Typography>
              <Stack direction="row" spacing={2}>
                {buttonSizes.map((size) => (
                  <Stack key={size} spacing={1}>
                    <AppButton
                      type="iconOnly"
                      icon={<DeleteIcon />}
                      color="secondary"
                      size={size}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {`type="iconOnly", size="${size}"`}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
};

export default ButtonsPage;
