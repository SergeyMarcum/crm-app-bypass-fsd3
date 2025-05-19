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

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm(): ReactElement {
  const { domains, isLoading, login } = useAuth();

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

  // 🧠 Восстановление домена из localStorage
  useEffect(() => {
    const savedDomain = localStorage.getItem("auth_domain");
    if (savedDomain && domains.some((d) => d.id === savedDomain)) {
      setValue("domain", savedDomain);
    }
  }, [domains, setValue]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      // 🔐 Вызов логина
      const response = await login(data);

      // ✅ Сохраняем ключевые данные (предотвращает ошибки на protected pages)
      localStorage.setItem("auth_domain", data.domain);
      localStorage.setItem("username", data.username);
      //localStorage.setItem("session_token", response.session_token);

      if (data.rememberMe) {
        // можно добавить куку или персистентное хранилище
      }

      toast.success("Успешный вход");
    } catch {
      toast.error("Ошибка авторизации");
    }
  };

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
        {/* DOMAIN SELECT */}
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
                value={
                  domains.find((d) => d.id === field.value) ? field.value : ""
                }
                onChange={(e) => {
                  const domainId = e.target.value;
                  field.onChange(domainId);
                  localStorage.setItem("auth_domain", domainId);
                }}
              >
                {isLoading ? (
                  <MenuItem value="" disabled>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={20} /> Загрузка...
                    </Box>
                  </MenuItem>
                ) : domains.length > 0 ? (
                  domains.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.name}
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
          <FormHelperText>{errors.domain?.message}</FormHelperText>
        </FormControl>

        {/* USERNAME */}
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

        {/* PASSWORD */}
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

        {/* REMEMBER */}
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

        {/* SUBMIT */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? <CircularProgress size={24} /> : "Войти"}
        </Button>
      </Box>
    </Box>
  );
}
