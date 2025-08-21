import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
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
  const [allParameters, setAllParameters] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedParameters, setSelectedParameters] = useState<
    { id: number; name: string }[]
  >([]);
  const [newParameterToAdd, setNewParameterToAdd] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const res = await parameterApi.getAllParameters();
        setAllParameters(res);

        // Преобразуем IDs параметров в объекты
        const selected = res.filter((param) =>
          objectType.parameter_ids.includes(param.id)
        );
        setSelectedParameters(selected);
      } catch (err) {
        console.error("Ошибка при загрузке параметров", err);
      } finally {
        setLoading(false);
      }
    };
    fetchParameters();
  }, [objectType]);

  const handleSave = async () => {
    try {
      const parameterIds = selectedParameters.map((p) => p.id);
      await objectTypeApi.saveObjectTypeParam({
        id: objectType.id,
        name,
        parameter_ids: parameterIds,
      });
      onSave();
      onClose();
    } catch (err) {
      console.error("Ошибка при сохранении типа объекта", err);
    }
  };

  const handleAddParameter = () => {
    if (newParameterToAdd) {
      setSelectedParameters((prev) => [...prev, newParameterToAdd]);
      setNewParameterToAdd(null);
    }
  };

  const handleRemoveParameter = (id: number) => {
    setSelectedParameters((prev) => prev.filter((param) => param.id !== id));
  };

  const availableParameters = allParameters.filter(
    (param) => !selectedParameters.some((selected) => selected.id === param.id)
  );

  const col1Width = "8.33%";
  const col2Width = "75%";
  const col3Width = "16.67%";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Редактирование типа объекта
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
            label="Название типа"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            >
              Добавить
            </Button>
          </Stack>
        </Stack>
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
