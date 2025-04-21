// src/pages/login/ui.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useAuthStore } from "@features/auth/model/store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const loginSchema = z.object({
  login: z.string().min(1, "Login is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

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
