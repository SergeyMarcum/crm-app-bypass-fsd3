// src/widgets/add-parameter-modal/ui.tsx
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
  // Grid, // Grid больше не импортируется для этого файла
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { objectTypeApi } from "@/shared/api/object-type";
import { useAddParameterStore } from "./model/store";
import type {
  ParameterOption,
  Incongruity,
  AddParameterModalProps,
} from "./types";

import type { JSX } from "react";

export const AddParameterModal = ({
  open,
  onClose,
  objectTypeId,
}: AddParameterModalProps): JSX.Element => {
  const [incongruities, setIncongruities] = useState<Incongruity[]>([]);
  const [newParameterName, setNewParameterName] = useState<string>("");
  const [newInc, setNewInc] = useState<Incongruity | null>(null);
  const { list, add, remove, reset } = useAddParameterStore();

  useEffect(() => {
    if (!open) return;
    reset();
    setNewParameterName("");
    setNewInc(null);
    objectTypeApi.getAllIncongruities().then(setIncongruities);
  }, [open]);

  const handleSave = async () => {
    if (!newParameterName.trim()) {
      alert("Название параметра не может быть пустым.");
      return;
    }

    try {
      const newParam = await objectTypeApi.addNewParameter(newParameterName.trim());
      const newParameterId = newParam.id;

      if (list.length > 0) {
        await objectTypeApi.addParameterIncongruity({
          parameter_id: newParameterId,
          incongruity_ids: list.map((i) => i.id),
        });
      }

      onClose();
    } catch (err) {
      console.error("Ошибка при сохранении параметра:", err);
      alert("Произошла ошибка при сохранении параметра. Пожалуйста, попробуйте еще раз.");
    }
  };

  const availableIncs = incongruities.filter(
    (i) => !list.some((l) => l.id === i.id)
  );

  // Определяем ширину колонок для flexbox
  // Соответствует xs={1}, xs={9}, xs={2} => 1/12, 9/12, 2/12 от общей ширины
  const col1Width = '8.33%'; // 1/12
  const col2Width = '75%';    // 9/12
  const col3Width = '16.67%'; // 2/12

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
          <Box sx={{ width: '100%' }}>
            {/* Заголовки таблицы: Использование Box с flexbox */}
            <Box sx={{ display: 'flex', width: '100%', fontWeight: 'bold', mb: 1, alignItems: 'center' }}>
                <Box sx={{ flexBasis: col1Width, p: 1 }}>№</Box>
                <Box sx={{ flexBasis: col2Width, p: 1 }}>Наименование несоответствия</Box>
                <Box sx={{ flexBasis: col3Width, p: 1, display: 'flex', justifyContent: 'flex-end' }}></Box>
            </Box>
            {/* Строки таблицы: Использование Box с flexbox */}
            {list.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ml:1}}>
                    Нет добавленных несоответствий.
                </Typography>
            ) : (
                list.map((i, idx) => (
                    <Box key={i.id} sx={{ display: 'flex', width: '100%', alignItems: 'center', mb: 0.5 }}>
                        <Box sx={{ flexBasis: col1Width, p: 1 }}>
                            <Typography>{idx + 1}.</Typography>
                        </Box>
                        <Box sx={{ flexBasis: col2Width, p: 1 }}>
                            <Typography>{i.name}</Typography>
                        </Box>
                        <Box sx={{ flexBasis: col3Width, p: 1, display: 'flex', justifyContent: 'flex-end' }}>
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