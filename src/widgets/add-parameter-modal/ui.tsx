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
  const [parameters, setParameters] = useState<ParameterOption[]>([]);
  const [incongruities, setIncongruities] = useState<Incongruity[]>([]);
  const [selectedParam, setSelectedParam] = useState<ParameterOption | null>(
    null
  );
  const [newInc, setNewInc] = useState<Incongruity | null>(null);
  const { list, add, remove, reset } = useAddParameterStore();

  useEffect(() => {
    if (!open) return;
    reset();
    setSelectedParam(null);
    setNewInc(null);
    objectTypeApi.getAllParameters().then(setParameters);
    objectTypeApi.getAllIncongruities().then(setIncongruities);
  }, [open]);

  const handleSave = async () => {
    if (!selectedParam) return;
    const parameterId = selectedParam.id;

    try {
      await objectTypeApi.saveObjectTypeParam({
        id: objectTypeId,
        name: selectedParam.name,
        parameter_ids: [parameterId],
      });

      if (list.length) {
        await objectTypeApi.addParameterIncongruity({
          parameter_id: parameterId,
          incongruity_ids: list.map((i) => i.id),
        });
      }

      onClose();
    } catch (err) {
      console.error("Ошибка при сохранении параметра:", err);
    }
  };

  const availableIncs = incongruities.filter(
    (i) => !list.some((l) => l.id === i.id)
  );

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
          <Autocomplete
            options={parameters}
            getOptionLabel={(o) => o.name}
            value={selectedParam}
            onChange={(_, val) => setSelectedParam(val)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Выберите параметр проверки"
                fullWidth
              />
            )}
          />

          <Typography variant="subtitle1">Список несоответствий</Typography>
          {list.map((i, idx) => (
            <Stack key={i.id} direction="row" alignItems="center" spacing={1}>
              <Typography>{idx + 1}.</Typography>
              <Typography sx={{ flex: 1 }}>{i.name}</Typography>
              <IconButton onClick={() => remove(i.id)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}

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
