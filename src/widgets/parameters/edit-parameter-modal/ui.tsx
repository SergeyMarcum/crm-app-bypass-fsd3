// src/widgets/edit-parameter-modal/ui.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Typography,
  Stack,
  Button,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";

import { parameterApi } from "@/shared/api/parameter";
import { useEditIncongruityStore } from "./model/store";
import type { Incongruity, ParamEditModalProps } from "./types";
import type { JSX } from "react";

import type { IncongruityCase } from "@/shared/api/parameter/types";
import { AxiosError } from "axios";
// Добавляем интерфейс и защитник типа для обработки ошибок бэкенда
interface BackendErrorResponse {
  detail: string;
}

const isBackendErrorResponse = (
  data: unknown
): data is BackendErrorResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as Record<string, unknown>).detail === "string"
  );
};

export const EditParameterModal = ({
  open,
  onClose,
  parameterId,
  parameterName,
}: ParamEditModalProps): JSX.Element => {
  const [name, setName] = useState(parameterName);
  const [allIncongruities, setAllIncongruities] = useState<Incongruity[]>([]);
  const [newInc, setNewInc] = useState<Incongruity | null>(null);
  const { list, set, add, remove, reset } = useEditIncongruityStore();

  useEffect(() => {
    if (!open) return;
    reset();
    setName(parameterName);

    Promise.all([
      parameterApi.getParameterIncongruities(parameterId),

      parameterApi.getAllIncongruities(),
    ])
      .then(([current, all]: [IncongruityCase[], Incongruity[]]) => {
        const enriched = current.map((curr: IncongruityCase) => {
          const match = all.find((i: Incongruity) => i.id === curr.id);
          return {
            id: curr.id,
            name: match?.name ?? curr.name ?? "(неизвестное несоответствие)",
          };
        });
        setAllIncongruities(all);
        set(enriched);
      })
      .catch((error) => {
        console.error(
          "Ошибка при загрузке данных о параметре или несоответствиях:",
          error
        );
        alert("Не удалось загрузить данные для редактирования параметра.");
      });
  }, [open, parameterId, parameterName, reset, set]);

  const availableIncs = allIncongruities.filter(
    (i) => !list.some((l) => l.id === i.id)
  );

  const handleSave = async () => {
    try {
      await parameterApi.editParameter({ id: parameterId, name });

      const current = await parameterApi.getParameterIncongruities(parameterId);
      const currentIds = new Set(current.map((i: IncongruityCase) => i.id));

      const added = list.filter((i) => !currentIds.has(i.id));
      const removed = current.filter(
        (i: IncongruityCase) => !list.find((l) => l.id === i.id)
      );

      console.log("Added incongruities:", added);
      console.log("Removed incongruities:", removed);

      await Promise.all([
        ...(added.length
          ? [
              parameterApi.addParameterIncongruity({
                parameter_id: parameterId,
                incongruity_ids: added.map((i) => i.id),
              }),
            ]
          : []),
        ...removed.map((i: IncongruityCase) =>
          parameterApi.deleteParameterIncongruity({
            parameter_id: parameterId,
            incongruity_ids: [i.id],
          })
        ),
      ]);

      onClose();
      alert(`Параметр "${name}" успешно сохранен.`); // Уведомление об успешном сохранении
    } catch (err) {
      console.error("Ошибка при сохранении параметра:", err);
      let errorMessage =
        "Произошла ошибка при сохранении параметра. Пожалуйста, попробуйте еще раз.";

      if (err instanceof AxiosError) {
        // Проверяем, есть ли ответ от сервера и содержит ли он детальные данные об ошибке
        if (err.response && isBackendErrorResponse(err.response.data)) {
          errorMessage = `Ошибка: ${err.response.data.detail}`;
        } else if (err.response && err.response.status === 500) {
          // Общий случай для 500, если нет детального сообщения
          errorMessage = "Ошибка сервера (500): Произошла внутренняя ошибка.";
        } else if (err.message) {
          // Если есть сообщение от Axios (например, "Network Error")
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        // Для других стандартных ошибок JavaScript
        errorMessage = err.message;
      }

      alert(errorMessage); // Показываем сообщение об ошибке пользователю
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Параметр проверки объекта
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="Наименование параметра"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <Typography variant="subtitle1">Список несоответствий</Typography>
          {list.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              Нет добавленных несоответствий.
            </Typography>
          ) : (
            list.map((i, idx) => (
              <Stack key={i.id} direction="row" alignItems="center" spacing={1}>
                <Typography>{idx + 1}.</Typography>
                <Typography sx={{ flex: 1 }}>{i.name}</Typography>
                <IconButton onClick={() => remove(i.id)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))
          )}

          <Stack direction="row" spacing={1} alignItems="center">
            <Autocomplete
              options={availableIncs}
              getOptionLabel={(o) => o.name}
              value={newInc}
              onChange={(_, val) => setNewInc(val)}
              sx={{ flex: 1 }}
              renderInput={(params) => (
                <TextField {...params} label="Добавить несоответствие" />
              )}
            />
            <IconButton
              onClick={() => {
                if (newInc) {
                  add(newInc);
                  setNewInc(null);
                }
              }}
              color="primary"
            >
              <AddIcon />
            </IconButton>
          </Stack>

          <Button onClick={handleSave} variant="contained">
            Сохранить
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
