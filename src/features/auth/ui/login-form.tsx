// src/features/auth/ui/login-form.tsx
import { ReactElement } from "react";
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
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@shared/lib/schemas";
import { useAuth } from "@features/auth/hooks/use-auth";
import { toast } from "react-toastify";
import { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm(): ReactElement {
  const { domains, isLoading, error, login, fetchDomains } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      domain: localStorage.getItem("auth_domain") || "",
      rememberMe: false,
      isTestMode: false,
    },
  });

  const handleRetryDomains = () => {
    console.log("LoginForm: Retrying fetch domains");
    fetchDomains();
  };

  const onSubmit = async (data: LoginFormData) => {
    console.log("Form submitted:", data);
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
            rules={{ required: "Выберите домен" }}
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
            )}
          />
          <FormHelperText>
            {errors.domain?.message ||
              (error && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {error}
                  <Button size="small" onClick={handleRetryDomains}>
                    Попробовать снова
                  </Button>
                </Box>
              ))}
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

        {error && !errors.domain && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
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
          {isSubmitting || isLoading ? <CircularProgress size={24} /> : "Войти"}
        </Button>
      </Box>
    </Box>
  );
}
