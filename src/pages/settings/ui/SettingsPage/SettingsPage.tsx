// src/pages/settings/ui/SettingsPage/SettingsPage.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  FormControl,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Divider,
  Link as MuiLink,
  Breadcrumbs,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@features/auth/model/store";
import { userApi } from "@/shared/api/user/client";
import { statusMap } from "@entities/user/model/normalize";
import { toast } from "react-toastify";

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();

  // Local state for avatar image
  const [photoUrl, setPhotoUrl] = useState<string>(
    user?.photo || ""
  );

  // Local state for status field (editable)
  const [selectedStatus, setSelectedStatus] = useState<number>(
    user?.status_id || 1
  );

  // Sync state if user changes
  useEffect(() => {
    if (user) {
      setPhotoUrl(user.photo || "");
      setSelectedStatus(user.status_id || 1);
    }
  }, [user]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    // Reset to original status and photo, then navigate back
    if (user) {
      setSelectedStatus(user.status_id || 1);
      setPhotoUrl(user.photo || "");
    }
    navigate("/dashboard");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("Пользователь не найден");
      return;
    }

    try {
      const editPayload = {
        user_id: user.id,
        full_name: user.full_name || "",
        position: user.position || "",
        company: user.company || "",
        department: user.department || "",
        phone: user.phone || "",
        role_id: user.role_id || 0,
        status_id: selectedStatus,
      };

      const result = await userApi.editUser(editPayload);
      
      if (result.success) {
        // Update local auth store user
        updateUser({
          status_id: selectedStatus,
          photo: photoUrl,
        });
        toast.success("Профиль успешно обновлен");
      } else {
        toast.error("Ошибка при обновлении профиля");
      }
    } catch (error) {
      console.error("Ошибка при сохранении профиля:", error);
      toast.error("Произошла ошибка при обновлении профиля");
    }
  };

  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">Пользователь не авторизован</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: "1150px",
        width: "100%",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Хлебные крошки */}
      <Stack spacing={1}>
        <div>
          <Breadcrumbs
            aria-label="breadcrumb"
            separator=" / "
            sx={{
              fontSize: "var(--mui-typography-subtitle2-fontSize, 0.875rem)",
            }}
          >
            <MuiLink
              component={RouterLink}
              to="/dashboard"
              color="text.secondary"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Главная
            </MuiLink>
            <Typography color="text.primary" variant="subtitle2">
              Мой профиль
            </Typography>
          </Breadcrumbs>
        </div>
        <div>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            Мой профиль
          </Typography>
        </div>
      </Stack>

      <form onSubmit={handleSave}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
            bgcolor: "background.paper",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={4}>
              <Typography variant="h6" fontWeight={600} color="text.primary">
                Информация о сотруднике
              </Typography>

              {/* Блок фотографии */}
              <Stack direction="row" spacing={3} alignItems="center">
                <Box>
                  {photoUrl ? (
                    <Avatar
                      src={photoUrl}
                      sx={{
                        width: 80,
                        height: 80,
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: "action.hover",
                        color: "text.secondary",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="2.2em"
                        height="2.2em"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z" />
                      </svg>
                    </Avatar>
                  )}
                </Box>
                <Stack spacing={1}>
                  {/* Avatar -> ФИО сотрудника */}
                  <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                    {user.full_name || "Не указано"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Min 400x400px, PNG or JPEG
                  </Typography>
                  <Box>
                    <Button
                      variant="outlined"
                      color="secondary"
                      component="label"
                      size="medium"
                      sx={{
                        textTransform: "none",
                        borderColor: "divider",
                        color: "text.primary",
                        "&:hover": {
                          borderColor: "text.primary",
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      Загрузить
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                    </Button>
                  </Box>
                </Stack>
              </Stack>

              {/* Поля сотрудника в виде списка */}
              <Stack
                divider={<Divider />}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  bgcolor: "background.paper",
                }}
              >
                {/* ФИО */}
                <Box sx={{ p: "12px 16px" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    ФИО
                  </Typography>
                  <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                    {user.full_name || "—"}
                  </Typography>
                </Box>

                {/* Эл. почта */}
                <Box sx={{ p: "12px 16px" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Эл. почта
                  </Typography>
                  <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                    {user.email || "—"}
                  </Typography>
                </Box>

                {/* Телефон */}
                <Box sx={{ p: "12px 16px" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Телефон
                  </Typography>
                  <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                    {user.phone || "—"}
                  </Typography>
                </Box>

                {/* Филиал */}
                <Box sx={{ p: "12px 16px" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Филиал
                  </Typography>
                  <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                    {user.company || "—"}
                  </Typography>
                </Box>

                {/* Отдел */}
                <Box sx={{ p: "12px 16px" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Отдел
                  </Typography>
                  <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                    {user.department || "—"}
                  </Typography>
                </Box>
              </Stack>

              {/* Статус */}
              <Box sx={{ mt: 1 }}>
                <FormControl fullWidth>
                  <InputLabel id="status-select-label">Статус</InputLabel>
                  <Select
                    labelId="status-select-label"
                    id="status-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(Number(e.target.value))}
                    label="Статус"
                  >
                    {Object.entries(statusMap).map(([id, label]) => (
                      <MenuItem key={id} value={Number(id)}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end", p: 3, gap: 2 }}>
            <Button
              variant="text"
              color="secondary"
              onClick={handleCancel}
              sx={{
                textTransform: "none",
                color: "text.secondary",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              Отмена
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                textTransform: "none",
                bgcolor: "primary.main",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "primary.dark",
                  boxShadow: "none",
                },
              }}
            >
              Сохранить
            </Button>
          </CardActions>
        </Card>
      </form>
    </Box>
  );
};
