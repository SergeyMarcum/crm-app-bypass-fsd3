// src/features/auth/ui/login-form.tsx
import { ReactElement, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@shared/lib/schemas";
import { useAuth } from "@features/auth/hooks/use-auth";
import { toast } from "react-toastify";
import { z } from "zod";

// Типизация формы
type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm(): ReactElement {
  const { domains, isLoading, error, login, fetchDomains } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      domain: "",
      rememberMe: false,
    },
  });

  // Подставляем сохранённый домен после загрузки списка, если он валидный
  useEffect(() => {
    const saved = localStorage.getItem("auth_domain");
    if (saved && domains.some((d) => d.id === saved)) {
      setValue("domain", saved);
    }
  }, [domains, setValue]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({
        username: data.username,
        password: data.password,
        domain: data.domain,
        rememberMe: data.rememberMe ?? false,
      });
      toast.success("Успешный вход");
    } catch {
      toast.error("Ошибка авторизации");
    }
  };

  const handleRetryDomains = () => fetchDomains();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 400,
        mx: "auto",
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Авторизация
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: "100%" }}
      >
        <FormControl fullWidth margin="normal" error={!!errors.domain}>
          <InputLabel id="domain-label">Домен</InputLabel>
          <Controller
            name="domain"
            control={control}
            render={({ field }) => {
              // Безопасное значение: сбрасываем, если значение не в списке доменов
              const safeValue = domains.find((d) => d.id === field.value)
                ? field.value
                : "";
              return (
                <Select
                  {...field}
                  labelId="domain-label"
                  label="Домен"
                  disabled={isLoading || domains.length === 0}
                  value={safeValue}
                  onChange={(e) => {
                    const selectedDomain = e.target.value;
                    field.onChange(selectedDomain);
                    // Сохраняем выбранный домен в localStorage
                    localStorage.setItem("auth_domain", selectedDomain);
                    console.log("Domain selected and saved:", selectedDomain);
                  }}
                >
                  {isLoading ? (
                    <MenuItem value="" disabled>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CircularProgress size={20} />
                        Загрузка доменов...
                      </Box>
                    </MenuItem>
                  ) : domains.length > 0 ? (
                    domains.map((domain) => (
                      <MenuItem key={domain.id} value={domain.id}>
                        {domain.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      Нет доступных доменов
                    </MenuItem>
                  )}
                </Select>
              );
            }}
          />
          <FormHelperText component="div">
            {errors.domain?.message && (
              <Typography color="error" variant="body2">
                {errors.domain.message}
              </Typography>
            )}
            {error && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
                <Button size="small" onClick={handleRetryDomains}>
                  Попробовать снова
                </Button>
              </Box>
            )}
          </FormHelperText>
        </FormControl>

        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Логин"
              fullWidth
              margin="normal"
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="password"
              label="Пароль"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />

        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="Запомнить меня"
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={isLoading || isSubmitting || domains.length === 0}
        >
          {isSubmitting || isLoading ? <CircularProgress size={24} /> : "Войти"}
        </Button>
      </Box>
    </Box>
  );
}
