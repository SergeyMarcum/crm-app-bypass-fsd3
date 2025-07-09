// src/widgets/add-parameter-modal/ui.tsx
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
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState, JSX } from "react";

import { parameterApi } from "@/shared/api/parameter";
import { objectTypeApi } from "@/shared/api/object-type";
import type { Incongruity } from "@/shared/api/parameter/types";
import { AxiosError } from "axios";

// Интерфейс для пропсов модального окна
interface AddParameterModalProps {
  open: boolean;
  onClose: () => void;
  objectTypeId: number;
}

// Интерфейс для ошибок бэкенда
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

export const AddParameterModal = ({
  open,
  onClose,
  objectTypeId,
}: AddParameterModalProps): JSX.Element => {
  const [objectTypeName, setObjectTypeName] = useState<string>("");
  const [newParameterName, setNewParameterName] = useState<string>("");
  const [allParameters, setAllParameters] = useState<
    { id: number; name: string }[]
  >([]);
  // selectedParameter теперь строго типизирован как объект или null,
  // typed text будет храниться в newParameterName
  const [selectedParameter, setSelectedParameter] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [allIncongruities, setAllIncongruities] = useState<Incongruity[]>([]);
  const [currentIncongruities, setCurrentIncongruities] = useState<
    Incongruity[]
  >([]);
  const [newIncongruityToAdd, setNewIncongruityToAdd] =
    useState<Incongruity | null>(null);

  // Загрузка данных и сброс состояния при открытии/закрытии модального окна
  useEffect(() => {
    if (!open) {
      // Сброс всех состояний при закрытии модального окна
      setObjectTypeName("");
      setNewParameterName("");
      setAllParameters([]);
      setSelectedParameter(null);
      setAllIncongruities([]);
      setCurrentIncongruities([]);
      setNewIncongruityToAdd(null);
      return;
    }

    const fetchData = async () => {
      try {
        // Загрузка имени типа объекта
        const objectType = await objectTypeApi.getObjectTypeById(objectTypeId);
        if (objectType) {
          setObjectTypeName(objectType.name);
        }

        // Загрузка всех параметров
        const allParams = await parameterApi.getAllParameters();
        setAllParameters(allParams);

        // Загрузка всех несоответствий
        const allIncs = await parameterApi.getAllIncongruities();
        setAllIncongruities(allIncs);
      } catch (error) {
        console.error("Ошибка при загрузке данных для модального окна:", error);
        alert("Не удалось загрузить данные. Пожалуйста, попробуйте еще раз.");
      }
    };
    fetchData();
  }, [open, objectTypeId]);

  // Загрузка несоответствий для выбранного параметра
  useEffect(() => {
    if (selectedParameter) {
      const fetchParameterIncongruities = async () => {
        try {
          const res = await parameterApi.getParameterIncongruities(
            selectedParameter.id
          );
          const enrichedIncs = res.map((incCase) => {
            const match = allIncongruities.find((inc) => inc.id === incCase.id);
            return {
              id: incCase.id,
              name:
                match?.name ?? incCase.name ?? "(неизвестное несоответствие)",
            };
          });
          setCurrentIncongruities(enrichedIncs);
        } catch (error) {
          console.error(
            "Ошибка при загрузке несоответствий для выбранного параметра:",
            error
          );
          setCurrentIncongruities([]);
        }
      };
      fetchParameterIncongruities();
    } else {
      setCurrentIncongruities([]);
    }
    setNewIncongruityToAdd(null);
  }, [selectedParameter, allIncongruities]);

  const availableIncongruities = allIncongruities.filter(
    (inc) => !currentIncongruities.some((currInc) => currInc.id === inc.id)
  );

  const handleSave = async () => {
    if (!newParameterName.trim()) {
      alert("Пожалуйста, введите наименование параметра.");
      return;
    }

    let paramIdToUse: number;

    try {
      if (selectedParameter) {
        // 1. Выбран существующий параметр
        paramIdToUse = selectedParameter.id;
        // Обновляем его имя, если оно было изменено
        if (newParameterName !== selectedParameter.name) {
          await parameterApi.editParameter({
            id: paramIdToUse,
            name: newParameterName,
          });
        }
      } else {
        // 2. Введено новое имя параметра (создаем новый параметр)
        const addParamRes = await parameterApi.addNewParameter(
          newParameterName,
          [] // Несоответствия будут привязаны на следующем шаге
        );
        paramIdToUse = addParamRes.id; // Получаем ID нового параметра
      }

      // 3. Связываем параметр (новый или существующий) с типом объекта
      await objectTypeApi.addParameterToObjectType({
        object_type_id: objectTypeId,
        parameter_id: paramIdToUse,
      });

      // 4. Обрабатываем несоответствия для этого параметра
      const backendIncongruities =
        await parameterApi.getParameterIncongruities(paramIdToUse);
      const backendIncongruityIds = new Set(
        backendIncongruities.map((inc) => inc.id)
      );

      const incongruitiesToAdd = currentIncongruities.filter(
        (inc) => !backendIncongruityIds.has(inc.id)
      );
      const incongruitiesToRemove = backendIncongruities.filter(
        (inc) => !currentIncongruities.some((currInc) => currInc.id === inc.id)
      );

      await Promise.all([
        ...(incongruitiesToAdd.length > 0
          ? [
              parameterApi.addParameterIncongruity({
                parameter_id: paramIdToUse,
                incongruity_ids: incongruitiesToAdd.map((inc) => inc.id),
              }),
            ]
          : []),
        ...incongruitiesToRemove.map((inc) =>
          parameterApi.deleteParameterIncongruity({
            parameter_id: paramIdToUse,
            incongruity_ids: [inc.id],
          })
        ),
      ]);

      alert("Параметр и его несоответствия успешно сохранены!");
      onClose(); // Закрываем модальное окно
    } catch (err) {
      console.error("Ошибка при сохранении параметра и несоответствий:", err);
      let errorMessage =
        "Произошла ошибка при сохранении. Пожалуйста, попробуйте еще раз.";

      if (err instanceof AxiosError) {
        if (err.response && isBackendErrorResponse(err.response.data)) {
          errorMessage = `Ошибка: ${err.response.data.detail}`;
        } else if (err.response && err.response.status === 500) {
          errorMessage = "Ошибка сервера (500): Произошла внутренняя ошибка.";
        } else if (err.message) {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      alert(errorMessage);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Добавление параметра проверки объекта для типа объекта
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="subtitle1">
            Название типа объекта: **{objectTypeName}**
          </Typography>

          <Autocomplete
            options={allParameters}
            getOptionLabel={(option) => {
              // Возвращаем строку, если опция - это строка (введенный текст), иначе - имя объекта
              if (typeof option === "string") {
                return option;
              }
              return option.name;
            }}
            value={selectedParameter} // selectedParameter - это выбранный объект {id, name} или null
            onChange={(_, newValue) => {
              if (typeof newValue === "string") {
                // Пользователь ввел новое имя параметра, не выбрав существующий
                setSelectedParameter(null); // Сбрасываем выбранный параметр
                setNewParameterName(newValue); // Устанавливаем введенную строку как имя нового параметра
                setCurrentIncongruities([]); // У нового параметра пока нет несоответствий
              } else if (newValue) {
                // Пользователь выбрал существующий параметр из списка
                setSelectedParameter(newValue);
                setNewParameterName(newValue.name); // Устанавливаем имя из выбранного объекта
                // useEffect fetchParameterIncongruities загрузит несоответствия
              } else {
                // Выбор сброшен (newValue == null)
                setSelectedParameter(null);
                setNewParameterName("");
                setCurrentIncongruities([]);
              }
            }}
            // isOptionEqualToValue помогает Autocomplete правильно сравнивать объекты
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Выберите или создайте новый параметр"
                variant="outlined"
              />
            )}
            freeSolo // Разрешить ввод значений, которых нет в опциях
          />

          {(selectedParameter || newParameterName) && ( // Отображаем поле только если что-то выбрано или введено
            <TextField
              label="Наименование параметра (редактируемое)"
              value={newParameterName}
              onChange={(e) => setNewParameterName(e.target.value)}
              fullWidth
            />
          )}

          <Typography variant="subtitle1">Список несоответствий</Typography>
          {currentIncongruities.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              Нет добавленных несоответствий.
            </Typography>
          ) : (
            <Box>
              {currentIncongruities.map((inc, idx) => (
                <Stack
                  key={inc.id}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mt: 1 }}
                >
                  <Typography>{idx + 1}.</Typography>
                  <Typography sx={{ flexGrow: 1 }}>{inc.name}</Typography>
                  <IconButton
                    onClick={() =>
                      setCurrentIncongruities((prev) =>
                        prev.filter((item) => item.id !== inc.id)
                      )
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
            </Box>
          )}

          <Stack direction="row" spacing={1} alignItems="center">
            <Autocomplete
              options={availableIncongruities}
              getOptionLabel={(option) => option.name}
              value={newIncongruityToAdd}
              onChange={(_, newValue) => setNewIncongruityToAdd(newValue)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              sx={{ flex: 1 }}
              renderInput={(params) => (
                <TextField {...params} label="Добавить несоответствие" />
              )}
            />
            <IconButton
              onClick={() => {
                if (newIncongruityToAdd) {
                  setCurrentIncongruities((prev) => [
                    ...prev,
                    newIncongruityToAdd,
                  ]);
                  setNewIncongruityToAdd(null);
                }
              }}
              color="primary"
              disabled={!newIncongruityToAdd}
            >
              <AddIcon />
            </IconButton>
          </Stack>

          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!newParameterName.trim()}
          >
            Сохранить
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
