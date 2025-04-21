// src/features/auth/ui/login-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, TextField } from "@mui/material";
import { useAuthStore } from "../model/store";

const schema = z.object({
  login: z.string().min(1, "Login is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export const LoginForm = () => {
  const { login } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register("login")}
        label="Login"
        error={!!errors.login}
        helperText={errors.login?.message}
      />
      <TextField
        {...register("password")}
        label="Password"
        type="password"
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button type="submit" variant="contained">
        Login
      </Button>
    </form>
  );
};
