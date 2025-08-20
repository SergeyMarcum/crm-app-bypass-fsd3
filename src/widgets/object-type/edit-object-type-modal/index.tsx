import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";
import { objectTypeApi } from "@/shared/api/object-type";
import { parameterApi } from "@/shared/api/parameter";

interface EditObjectTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  objectType: { id: number; name: string; parameter_ids: number[] };
}

export const EditObjectTypeModal = ({
  open,
  onClose,
  onSave,
  objectType,
}: EditObjectTypeModalProps) => {
  const [name, setName] = useState(objectType.name);
  const [parameters, setParameters] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedParameters, setSelectedParameters] = useState<number[]>(
    objectType.parameter_ids
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const res = await parameterApi.getAllParameters();
        setParameters(res);
      } catch (err) {
        console.error("Ошибка при загрузке параметров", err);
      } finally {
        setLoading(false);
      }
    };
    fetchParameters();
  }, []);

  const handleSave = async () => {
    try {
      await objectTypeApi.saveObjectTypeParam({
        id: objectType.id,
        name,
        parameter_ids: selectedParameters,
      });
      onSave();
      onClose();
    } catch (err) {
      console.error("Ошибка при сохранении типа объекта", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Редактирование типа объекта</DialogTitle>
      <DialogContent>
        <Box mt={2}>
          <TextField
            label="Название типа"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Autocomplete
            multiple
            options={parameters}
            getOptionLabel={(option) => option.name}
            value={parameters.filter((p) => selectedParameters.includes(p.id))}
            onChange={(_, newValue) => {
              setSelectedParameters(newValue.map((v) => v.id));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Параметры"
                placeholder="Выберите параметры"
                margin="normal"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.name}
                  {...getTagProps({ index })}
                  key={option.id}
                />
              ))
            }
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
