// src/widgets/add-parameter-modal/ui.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Button,
  MenuItem,
  Typography,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { objectTypeApi } from "@/shared/api/object-type"; // заглушка
import { Incongruity, ParameterOption } from "./types";
import { useIncongruityStore } from "./model/store";
import type { JSX } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const AddParameterModal = ({ open, onClose }: Props): JSX.Element => {
  const [parameters, setParameters] = useState<ParameterOption[]>([]);
  const [incongruities, setIncongruities] = useState<Incongruity[]>([]);
  const [selectedParamId, setSelectedParamId] = useState<number | "">("");
  const [newIncongruityId, setNewIncongruityId] = useState<number | "">("");
  const { selected, add, remove, reset } = useIncongruityStore();

  useEffect(() => {
    if (open) {
      objectTypeApi.getAllParameters().then(setParameters);
      objectTypeApi.getAllIncongruities().then(setIncongruities);
      reset();
      setSelectedParamId("");
    }
  }, [open]);

  const availableIncongruities = incongruities.filter(
    (inc) => !selected.find((sel) => sel.id === inc.id)
  );

  const handleAddRow = () => {
    if (newIncongruityId === "") return;
    const inc = incongruities.find((i) => i.id === newIncongruityId);
    if (inc) {
      add(inc);
      setNewIncongruityId("");
    }
  };

  const handleSave = async () => {
    if (typeof selectedParamId !== "number") return;
    await objectTypeApi.saveObjectTypeParam({
      name: "",
      id: 0,
      parameter_ids: [selectedParamId],
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Параметр проверки объекта
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            select
            fullWidth
            label="Выберите параметр"
            value={selectedParamId}
            onChange={(e) => setSelectedParamId(Number(e.target.value))}
          >
            <MenuItem value="">Не выбрано</MenuItem>
            {parameters.map((param) => (
              <MenuItem key={param.id} value={param.id}>
                {param.name}
              </MenuItem>
            ))}
          </TextField>

          <Typography variant="subtitle1">Список несоответствий</Typography>
          {selected.map((row, i) => (
            <Stack key={row.id} direction="row" spacing={1} alignItems="center">
              <Typography>{i + 1}.</Typography>
              <Typography sx={{ flex: 1 }}>{row.name}</Typography>
              <IconButton onClick={() => remove(row.id)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}

          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <TextField
              select
              label="Добавить несоответствие"
              value={newIncongruityId}
              onChange={(e) => setNewIncongruityId(Number(e.target.value))}
              sx={{ flex: 1 }}
            >
              <MenuItem value="">Не выбрано</MenuItem>
              {availableIncongruities.map((inc) => (
                <MenuItem key={inc.id} value={inc.id}>
                  {inc.name}
                </MenuItem>
              ))}
            </TextField>
            <IconButton onClick={handleAddRow} color="primary">
              <AddIcon />
            </IconButton>
          </Stack>

          <Button variant="contained" onClick={handleSave}>
            Сохранить
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
