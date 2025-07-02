// src/pages/object/ui.tsx
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
import { ObjectInfoCard } from "@/widgets/object-info-card";
import { ObjectTaskTable } from "@/widgets/object-task-table";

import type {
  ObjectDetail,
  ObjectTask,
  ObjectHistoryRecord,
} from "@/entities/object/types";

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

      const transformed = history.map(
        (task: ObjectTask): ObjectHistoryRecord => ({
          id: task.id,
          check_date: task.check_date,
          is_recheck: task.is_recheck,
          operator_name: task.operator_name,
          upload_date: task.upload_date,
          parameter_summary: task.parameters.map((p) => p.name).join(", "),
          incongruity_summary: task.parameters
            .flatMap((p) => p.incongruities.map((i) => i.name))
            .join(", "),
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

      <ObjectInfoCard objectId={objectId} />

      <Box mt={4}>
        <ObjectTaskTable data={tasks} />
      </Box>
    </Box>
  );
};
