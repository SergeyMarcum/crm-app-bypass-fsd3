// src/pages/task/ui/TaskPage.tsx
import { Typography, Breadcrumbs, Link } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";

const TaskPage = () => {
  const { taskId } = useParams();
  const location = useLocation();

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/">
          Главная
        </Link>
        <Link color="inherit" href="/tasks">
          Просмотр заданий
        </Link>
        <Typography color="text.primary">Задание</Typography>
      </Breadcrumbs>
      <Typography variant="h4" component="h1" gutterBottom>
        Задание по проверке объекта
      </Typography>
      <Typography
        variant="h6"
        component="h2"
        color="text.secondary"
        gutterBottom
      >
        Просмотр задания по проверке объекта филиала
      </Typography>
      {/* Остальное содержимое страницы */}
    </div>
  );
};

export default TaskPage;
