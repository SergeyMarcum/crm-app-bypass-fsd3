// src/features/auth/ui/login-form.tsx
import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/shared/lib/schemas";
import { useAuth } from "../hooks/use-auth";

type FormData = {
  username: string;
  password: string;
  domain: string;
  rememberMe: boolean;
};

export const LoginForm = (): React.ReactNode => {
  const { handleLogin, fetchDomains } = useAuth();
  const [domains, setDomains] = useState<Record<string, string>>({});
  const [isLoadingDomains, setIsLoadingDomains] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      domain: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    console.log("Starting fetchDomains");
    setIsLoadingDomains(true);
    fetchDomains()
      .then((data) => {
        console.log("Fetched domains:", data);
        setDomains(data);
        setError(null);
      })
      .catch((err: unknown) => {
        console.error("Failed to fetch domains:", err);
        setError("Не удалось загрузить список доменов. Попробуйте снова.");
      })
      .finally(() => {
        console.log("fetchDomains completed, isLoadingDomains: false");
        setIsLoadingDomains(false);
      });
  }, [fetchDomains]);

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      console.log("Submitting login form with data:", data);
      await handleLogin({
        username: data.username,
        password: data.password,
        domain: data.domain,
      });
      setError(null);
    } catch (error: unknown) {
      console.error("Login error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message === "Invalid login response format"
            ? "Ошибка сервера. Пожалуйста, попробуйте позже."
            : error.message
          : "Ошибка авторизации. Проверьте данные и попробуйте снова.";
      setError(errorMessage);
    }
  };

  console.log("Rendering LoginForm, state:", {
    isLoadingDomains,
    domains,
    error,
  });

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 16 }}>
      {isLoadingDomains ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h5" gutterBottom>
            Авторизация
          </Typography>

          <FormControl fullWidth margin="normal" error={!!errors.domain}>
            <InputLabel>Домен</InputLabel>
            <Select
              {...register("domain")}
              label="Домен"
              defaultValue=""
              disabled={Object.keys(domains).length === 0}
            >
              {Object.keys(domains).length === 0 ? (
                <MenuItem value="" disabled>
                  Доменов нет
                </MenuItem>
              ) : (
                Object.entries(domains).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.domain && (
              <Typography color="error">{errors.domain.message}</Typography>
            )}
          </FormControl>

          <TextField
            {...register("username")}
            label="Логин"
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <TextField
            {...register("password")}
            label="Пароль"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <FormControlLabel
            control={<Checkbox {...register("rememberMe")} />}
            label="Запомни меня"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isSubmitting || Object.keys(domains).length === 0}
          >
            {isSubmitting ? "Вход..." : "Войти"}
          </Button>
        </form>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};
