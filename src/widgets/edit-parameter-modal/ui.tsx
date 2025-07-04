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
import { objectTypeApi } from "@/shared/api/object-type";
import { useEditIncongruityStore } from "./model/store";
import type { Incongruity, ParamEditModalProps } from "./types";
import type { JSX } from "react";
import type { IncongruityCase } from "@/shared/api/object-type/types";

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
      objectTypeApi.getAllCasesOfParameterNonCompliance(parameterId),
      objectTypeApi.getAllIncongruities(),
    ]).then(([current, all]: [IncongruityCase[], Incongruity[]]) => {
      const enriched = current.map((curr: IncongruityCase) => {
        const match = all.find(
          (i: Incongruity) => i.id === curr.incongruity_id
        );
        return {
          id: curr.incongruity_id,
          name: match?.name ?? curr.name ?? "(неизвестное несоответствие)",
        };
      });
      setAllIncongruities(all);
      set(enriched);
    });
  }, [open]);

  const availableIncs = allIncongruities.filter(
    (i) => !list.some((l) => l.id === i.id)
  );

  const handleSave = async () => {
    try {
      await objectTypeApi.editParameter({ id: parameterId, name });

      const current =
        await objectTypeApi.getAllCasesOfParameterNonCompliance(parameterId);
      const currentIds = new Set(
        current.map((i: IncongruityCase) => i.incongruity_id)
      );

      const added = list.filter((i) => !currentIds.has(i.id));
      const removed = current.filter(
        (i: IncongruityCase) => !list.find((l) => l.id === i.incongruity_id)
      );

      await Promise.all([
        ...(added.length
          ? [
              objectTypeApi.addParameterIncongruity({
                parameter_id: parameterId,
                incongruity_ids: added.map((i) => i.id),
              }),
            ]
          : []),
        ...removed.map((i: IncongruityCase) =>
          objectTypeApi.deleteParameterIncongruity({
            id: i.id,
            parameter_id: parameterId,
            incongruity_ids: i.incongruity_id,
          })
        ),
      ]);

      onClose();
    } catch (err) {
      console.error("Ошибка при сохранении параметра:", err);
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
