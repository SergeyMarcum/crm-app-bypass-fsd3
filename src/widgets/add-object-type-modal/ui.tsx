// src/widgets/add-object-type-modal/ui.tsx
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
import { objectTypeApi } from "@/shared/api/object-type";
import { AxiosError } from "axios";

// Импортируем тип Parameter из общих типов
import type { Parameter } from "@/shared/api/object-type/types";
import type { AddObjectTypeModalProps } from "./types";
import type { JSX } from "react";

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

export const AddObjectTypeModal = ({
  open,
  onClose,
  onSaveSuccess,
}: AddObjectTypeModalProps): JSX.Element => {
  const [newObjectTypeName, setNewObjectTypeName] = useState<string>("");
  const [allParameters, setAllParameters] = useState<Parameter[]>([]);
  const [selectedParameters, setSelectedParameters] = useState<Parameter[]>([]);
  const [newParameterToAdd, setNewParameterToAdd] = useState<Parameter | null>(
    null
  );

  useEffect(() => {
    if (open) {
      setNewObjectTypeName("");
      setSelectedParameters([]);
      setNewParameterToAdd(null);
      objectTypeApi
        .getAllParameters()
        .then((res: Parameter[]) => {
          // Убедимся, что 'name' всегда имеет строковое значение.
          // Если p.name может быть null/undefined, то String() безопасно преобразует его.
          // Если бэкенд возвращает пустое название, используем ID как запасной вариант для отображения.
          setAllParameters(
            res.map((p: Parameter) => ({
              id: p.id,
              name: p.name || `Параметр ID: ${p.id}`, // Используем p.name
            }))
          );
        })
        .catch((err: unknown) => {
          console.error("Ошибка при загрузке всех параметров:", err);
          alert("Не удалось загрузить список параметров.");
        });
    }
  }, [open]);

  const availableParameters = allParameters.filter(
    (param) => !selectedParameters.some((selected) => selected.id === param.id)
  );

  const handleAddParameter = () => {
    if (newParameterToAdd) {
      setSelectedParameters((prev) => [...prev, newParameterToAdd]);
      setNewParameterToAdd(null);
    }
  };

  const handleRemoveParameter = (id: number) => {
    setSelectedParameters((prev) => prev.filter((param) => param.id !== id));
  };

  const handleSave = async () => {
    if (!newObjectTypeName.trim()) {
      alert("Название нового типа объекта не может быть пустым.");
      return;
    }

    try {
      const parameterIds = selectedParameters.map((p) => p.id);
      await objectTypeApi.addNewObjectType(
        newObjectTypeName.trim(),
        parameterIds
      );

      alert(`Тип объекта "${newObjectTypeName}" успешно добавлен.`);
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error("Ошибка при сохранении типа объекта:", err);
      let errorMessage =
        "Произошла ошибка при сохранении типа объекта. Пожалуйста, попробуйте еще раз.";

      if (err instanceof AxiosError) {
        if (err.response && isBackendErrorResponse(err.response.data)) {
          errorMessage = `Ошибка: ${err.response.data.detail}`;
        } else if (err.message) {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      alert(errorMessage);
    }
  };

  const col1Width = "8.33%";
  const col2Width = "75%";
  const col3Width = "16.67%";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Новый тип объекта
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
            label="Название нового типа объекта"
            value={newObjectTypeName}
            onChange={(e) => setNewObjectTypeName(e.target.value)}
            fullWidth
            variant="outlined"
          />

          <Typography variant="subtitle1">Список параметров</Typography>
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
                Наименование параметра
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
            {selectedParameters.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Нет добавленных параметров.
              </Typography>
            ) : (
              selectedParameters.map((param, idx) => (
                <Box
                  key={param.id}
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
                    <Typography>{param.name}</Typography>
                  </Box>
                  <Box
                    sx={{
                      flexBasis: col3Width,
                      p: 1,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <IconButton
                      onClick={() => handleRemoveParameter(param.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Autocomplete
              options={availableParameters}
              getOptionLabel={(option) => option.name || ""}
              value={newParameterToAdd}
              onChange={(_, newValue) => setNewParameterToAdd(newValue)}
              sx={{ flexGrow: 1 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Добавить параметр"
                  variant="outlined"
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            <Button
              onClick={handleAddParameter}
              variant="contained"
              disabled={!newParameterToAdd}
              startIcon={<AddIcon />}
            >
              Добавить
            </Button>
          </Stack>

          <Button onClick={handleSave} variant="contained" color="primary">
            Сохранить
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
