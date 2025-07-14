// src/widgets/parameters/add-new-parameter-modal/ui.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Button,
  Autocomplete,
  TextField,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
// ИЗМЕНЕНИЕ: Импортируем parameterApi вместо objectTypeApi
import { parameterApi } from "@/shared/api/parameter";
// ИЗМЕНЕНИЕ: Обновляем импорт стора
import { useAddNewParameterStore } from "./model/store";
// ИЗМЕНЕНИЕ: Обновляем импорт типов
import type { Incongruity, AddNewParameterModalProps } from "./types";
import type { JSX } from "react";
import { AxiosError } from "axios";

// Определяем интерфейс для ожидаемого объекта ошибки API с полем 'detail'
interface BackendErrorResponse {
  detail: string;
}

// Защитник типа для проверки, является ли объект ошибкой API с полем 'detail'
const isBackendErrorResponse = (
  data: unknown
): data is BackendErrorResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as Record<string, unknown>).detail === "string"
  );
};

// ИЗМЕНЕНИЕ: Обновляем имя компонента и тип пропсов
export const AddNewParameterModal = ({
  open,
  onClose,
}: AddNewParameterModalProps): JSX.Element => {
  const [incongruities, setIncongruities] = useState<Incongruity[]>([]);
  const [newParameterName, setNewParameterName] = useState<string>("");
  const [newInc, setNewInc] = useState<Incongruity | null>(null);
  // ИЗМЕНЕНИЕ: Обновляем имя стора
  const { list, add, remove, reset } = useAddNewParameterStore();

  useEffect(() => {
    if (!open) return;
    reset();
    setNewParameterName("");
    setNewInc(null);
    // ИЗМЕНЕНИЕ: Вызываем метод из parameterApi
    parameterApi.getAllIncongruities().then(setIncongruities);
  }, [open, reset]); // Добавлены зависимости для useEffect

  const handleSave = async () => {
    if (!newParameterName.trim()) {
      alert("Название параметра не может быть пустым.");
      return;
    }

    try {
      const selectedIncongruityIds = list.map((i) => i.id);

      // Вызываем API, теперь оно возвращает AddNewParameterSuccessResponse
      // ИЗМЕНЕНИЕ: Вызываем метод из parameterApi
      const response = await parameterApi.addNewParameter(
        newParameterName.trim(),
        selectedIncongruityIds
      );

      // Используем сообщение из успешного ответа, если оно есть
      alert(
        response.message || `Параметр "${newParameterName}" успешно добавлен.`
      );
      onClose(); // Закрываем модальное окно после успешного сохранения

      // Если в будущем вам потребуется ID добавленного параметра,
      // и бэкенд начнет его возвращать в 'response.parameter.id',
      // то вы сможете получить его здесь. На данный момент 'parameter' пустой.
      // Например, если бы бэкенд возвращал ID:
      // if (response.parameter && response.parameter.id) {
      //   console.log(`Добавлен новый параметр с ID: ${response.parameter.id}`);
      // }
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

      alert(errorMessage);
    }
  };

  const availableIncs = incongruities.filter(
    (i) => !list.some((l) => l.id === i.id)
  );

  const col1Width = "8.33%";
  const col2Width = "75%";
  const col3Width = "16.67%";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Новый Параметр проверки объекта
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
            label="Название нового параметра проверки"
            value={newParameterName}
            onChange={(e) => setNewParameterName(e.target.value)}
            fullWidth
          />

          <Typography variant="subtitle1">Список несоответствий</Typography>
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                fontWeight: "bold",
                mb: 1,
                alignItems: "center",
              }}
            >
              <Box sx={{ flexBasis: col1Width, p: 1 }}>№</Box>
              <Box sx={{ flexBasis: col2Width, p: 1 }}>
                Наименование несоответствия
              </Box>
              <Box
                sx={{
                  flexBasis: col3Width,
                  p: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              ></Box>
            </Box>
            {list.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Нет добавленных несоответствий.
              </Typography>
            ) : (
              list.map((i, idx) => (
                <Box
                  key={i.id}
                  sx={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  <Box sx={{ flexBasis: col1Width, p: 1 }}>
                    <Typography>{idx + 1}.</Typography>
                  </Box>
                  <Box sx={{ flexBasis: col2Width, p: 1 }}>
                    <Typography>{i.name}</Typography>
                  </Box>
                  <Box
                    sx={{
                      flexBasis: col3Width,
                      p: 1,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <IconButton onClick={() => remove(i.id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))
            )}
          </Box>

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
              disabled={!newInc}
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
