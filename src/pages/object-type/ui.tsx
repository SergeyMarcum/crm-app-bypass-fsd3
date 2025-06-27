// src/pages/object-type/ui.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import { objectTypeApi } from "@/shared/api/object-type";
import { ObjectTypeTable } from "@/widgets/object-type-table";
import { AddParameterModal } from "@/widgets/add-parameter-modal";
import { EditParameterModal } from "@/widgets/edit-parameter-modal";
import type { ObjectParameter } from "@/widgets/object-type-table/types";

export function ObjectTypePage() {
  const [parameters, setParameters] = useState<ObjectParameter[]>([]);
  const [types, setTypes] = useState<{ id: number; name: string }[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | "">("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editParam, setEditParam] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterParam, setFilterParam] = useState("");
  const [filterActive, setFilterActive] = useState(false);

  const fetchTypes = async () => {
    try {
      const res = await objectTypeApi.getAllObjectTypes();
      setTypes(res);
      if (res.length > 0) {
        setSelectedTypeId(res[0].id);
      }
    } catch (err) {
      console.error("Ошибка при загрузке типов объектов", err);
    }
  };

  const fetchParameters = async () => {
    if (!selectedTypeId || typeof selectedTypeId !== "number") return;
    try {
      const res = await objectTypeApi.getObjectTypeParameters(selectedTypeId);
      setParameters(res);
    } catch (err) {
      console.error("Ошибка при загрузке параметров", err);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  useEffect(() => {
    fetchParameters();
  }, [selectedTypeId]);

  const handleEdit = (param: ObjectParameter) => {
    setEditParam({ id: param.id, name: param.parameter });
    setEditOpen(true);
  };

  const filtered = filterActive
    ? parameters.filter((p) => p.parameter.includes(filterParam))
    : parameters;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Тип объекта
      </Typography>

      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Главная / Объекты / Типы Объектов / Тип объекта
      </Typography>

      <Box display="flex" gap={2} my={2}>
        <Select
          value={selectedTypeId}
          onChange={(e) => setSelectedTypeId(Number(e.target.value))}
          size="small"
          displayEmpty
        >
          <MenuItem value="">Выберите тип</MenuItem>
          {types.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {t.name}
            </MenuItem>
          ))}
        </Select>

        <Button
          variant={filterActive ? "outlined" : "contained"}
          onClick={() => {
            if (filterActive) {
              setFilterParam("");
              setFilterActive(false);
            } else {
              setFilterModalOpen(true);
            }
          }}
        >
          Параметры проверки
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            setFilterParam("");
            setFilterActive(false);
            if (types.length > 0) setSelectedTypeId(types[0].id);
          }}
        >
          Сбросить фильтры
        </Button>

        <Button
          variant="contained"
          onClick={() => setAddOpen(true)}
          disabled={!selectedTypeId}
        >
          + Добавить
        </Button>
      </Box>

      <ObjectTypeTable parameters={filtered} onEdit={handleEdit} />

      <AddParameterModal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          fetchParameters();
        }}
        objectTypeId={Number(selectedTypeId)}
      />

      <EditParameterModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          fetchParameters();
        }}
        parameterId={editParam?.id ?? 0}
        parameterName={editParam?.name ?? ""}
      />

      <Dialog open={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
        <DialogTitle>Фильтрация по параметрам проверки</DialogTitle>
        <DialogContent>
          <TextField
            label="Параметр проверки"
            fullWidth
            value={filterParam}
            onChange={(e) => setFilterParam(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => {
              setFilterActive(true);
              setFilterModalOpen(false);
            }}
          >
            Применить
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
