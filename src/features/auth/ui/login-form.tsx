// src/features/auth/ui/login-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useAuthStore } from "@features/auth/model/store";

const loginSchema = z.object({
  login: z.string().min(1, "Вход в систему обязателен"),
  password: z
    .string()
    .min(6, "Пароль должен состоять не менее чем из 6 символов"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = ({
  onSuccess,
}: {
  onSuccess: () => void;
}): JSX.Element => {
  const { login } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    await login(data);
    onSuccess();
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Login"
          margin="normal"
          {...register("login")}
          error={!!errors.login}
          helperText={errors.login?.message}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Sign In
        </Button>
      </form>
    </Box>
  );
};
