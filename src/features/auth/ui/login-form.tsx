// src/features/auth/ui/login-form.tsx
import { ReactElement, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
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
import { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm(): ReactElement {
  const { domains, isLoading, error, login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    resetField,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      domain: "",
      rememberMe: false,
      isTestMode: false,
    },
  });

  // Синхронизация начального значения domain после загрузки доменов
  useEffect(() => {
    if (domains.length > 0) {
      console.log("Resetting domain to:", domains[0].id);
      resetField("domain", { defaultValue: domains[0].id });
    }
  }, [domains, resetField]);

  const onSubmit = async (data: LoginFormData) => {
    console.log("Form submitted:", data);
    await login({
      username: data.username,
      password: data.password,
      domain: data.domain,
      rememberMe: data.rememberMe ?? false,
    });
  };

  console.log("LoginForm render:", {
    domains,
    isLoading,
    error,
    formErrors: errors,
  });

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
            render={({ field }) => (
              <Select
                {...field}
                labelId="domain-label"
                label="Домен"
                disabled={isLoading || domains.length === 0}
                value={field.value || ""}
                onChange={(e) => {
                  console.log("Domain selected:", e.target.value);
                  field.onChange(e.target.value);
                }}
              >
                {isLoading ? (
                  <MenuItem value="" disabled>
                    Загрузка доменов...
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
            )}
          />
          <FormHelperText>
            {errors.domain?.message || (error && "Не удалось загрузить домены")}
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
              onChange={(e) => {
                console.log("Username changed:", e.target.value);
                field.onChange(e.target.value);
              }}
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
              onChange={(e) => {
                console.log("Password changed:", e.target.value);
                field.onChange(e.target.value);
              }}
            />
          )}
        />

        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => {
                    console.log("RememberMe changed:", e.target.checked);
                    field.onChange(e.target.checked);
                  }}
                />
              }
              label="Запомни меня"
            />
          )}
        />

        <Controller
          name="isTestMode"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => {
                    console.log("TestMode changed:", e.target.checked);
                    field.onChange(e.target.checked);
                  }}
                />
              }
              label="Для тестирования"
            />
          )}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error === "Ошибка авторизации"
              ? "Не удалось войти. Проверьте логин, пароль или настройки сервера."
              : error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={isLoading || isSubmitting || domains.length === 0}
        >
          Войти
        </Button>
      </Box>
    </Box>
  );
}
