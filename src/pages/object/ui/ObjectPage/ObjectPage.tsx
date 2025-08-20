// src/pages/object/ui/ObjectPage/ObjectPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  CircularProgress,
} from "@mui/material";

import { objectApi } from "@/shared/api/object";
import { ObjectInfoCard } from "@/widgets/object/object-info-card";
import { ObjectTaskTable } from "@/widgets/task/object-task-table";

import type { ObjectDetail, ObjectTask } from "@/entities/object/types";
import type { ObjectHistoryRecord } from "@/widgets/task/object-task-table/types";

export const ObjectPage = () => {
  const { id } = useParams();
  const objectId = Number(id);

  const [loading, setLoading] = useState(true);
  const [objectInfo, setObjectInfo] = useState<ObjectDetail | null>(null);
  const [tasks, setTasks] = useState<ObjectHistoryRecord[]>([]);

  const fetchData = async () => {
    try {
      const [info, history] = await Promise.all([
        objectApi.getById(objectId),
        objectApi.getObjectTasks(objectId),
      ]);

      setObjectInfo(info);

      const transformed: ObjectHistoryRecord[] = history.map(
        (task: ObjectTask) => ({
          id: task.id,
          inspection_date: task.date_time, // Используем date_time
          is_reinspection: task.checking_type_text !== "Первичная", // Логика для is_reinspection
          operator_full_name: task.user_name, // Используем user_name
          upload_date: task.date_time_report_loading || "—", // Используем date_time_report_loading
          parameter: "—", // В ответе API нет данных о параметрах
          incongruity: "—", // В ответе API нет данных о несоответствиях
        })
      );

      setTasks(transformed);
    } catch (err) {
      console.error("Ошибка загрузки объекта:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!objectId) return;
    fetchData();
  }, [objectId]);

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!objectInfo) {
    return (
      <Box p={4}>
        <Typography variant="h6">Объект не найден</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Объект: {objectInfo.name}
      </Typography>

      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Объект указанного филиала
      </Typography>

      <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/dashboard">
          Главная
        </Link>
        <Link underline="hover" color="inherit" href="/objects">
          Объекты
        </Link>
        <Typography color="text.primary">{objectInfo.name}</Typography>
      </Breadcrumbs>

      <ObjectInfoCard
        objectId={objectId}
        objectInfo={objectInfo}
        onSave={fetchData}
      />

      <Box mt={4}>
        <ObjectTaskTable
          data={tasks}
          onViewPhoto={(url) => {
            window.open(url, "_blank");
          }}
        />
      </Box>
    </Box>
  );
};
