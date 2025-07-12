// src/pages/help/ui.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Box,
  MenuItem,
  Typography,
} from "@mui/material";
// Обновленный путь импорта
import { helpApi } from "@/shared/api/help"; // Теперь импортируем из нового местоположения

// Схема валидации с Zod
const schema = z.object({
  subject: z.string().min(1, "Тема письма обязательна"),
  type: z.enum(["Проблемы и предложения по работе приложения", "Другое"], {
    errorMap: () => ({ message: "Выберите тип запроса" }),
  }),
  name: z.string().min(1, "Имя отправителя обязательно"),
  email: z.string().email("Введите корректный email").min(1, "Email отправителя обязателен"),
  message: z.string().min(10, "Сообщение должно содержать минимум 10 символов"),
});

type FormData = z.infer<typeof schema>;

const HelpPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await helpApi.sendSupportRequest(data);
      alert("Запрос успешно отправлен!");
      reset();
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      alert("Ошибка при отправке запроса. Попробуйте позже.");
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        minWidth: "1300px",
        mx: "auto",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ maxWidth: 600, width: "100%" }}>
        <CardHeader title="Нужна помощь?" />
        <CardContent>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            У вас есть вопросы по работе данной системы? Заполните форму, и наш
            сотрудник свяжется с вами в ближайшее время.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Тема письма"
              {...register("subject")}
              error={!!errors.subject}
              helperText={errors.subject?.message}
              fullWidth
            />
            <TextField
              label="Тип запроса"
              {...register("type")}
              error={!!errors.type}
              helperText={errors.type?.message}
              select
              fullWidth
              defaultValue=""
            >
              <MenuItem value="Проблемы и предложения по работе приложения">
                Проблемы и предложения по работе приложения
              </MenuItem>
              <MenuItem value="Другое">
                Другое
              </MenuItem>
            </TextField>
            <TextField
              label="Имя отправителя"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
            <TextField
              label="Email отправителя"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />
            <TextField
              label="Текст сообщения"
              {...register("message")}
              error={!!errors.message}
              helperText={errors.message?.message}
              multiline
              rows={4}
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary">
              Отправить
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HelpPage;