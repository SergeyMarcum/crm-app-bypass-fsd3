// src/pages/object-type/ui.tsx
import { useEffect, useState, useRef } from "react";
import { Box, Typography, Select, MenuItem, Button } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { AgGridReact } from "ag-grid-react";

import { objectTypeApi } from "@/shared/api/object-type";
import { ObjectTypeTable } from "@/widgets/object-type-table";
import { AddParameterModal } from "@/widgets/add-parameter-modal";
import { EditParameterModal } from "@/widgets/edit-parameter-modal";
//import { useTableStore } from "@/widgets/table/model/store";
import type { ObjectParameter } from "@/widgets/object-type-table/types";
import type { FilterDefinition } from "@/widgets/table";

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
  const gridRef = useRef<AgGridReact<ObjectParameter>>(null);

  //const { resetFilters } = useTableStore();

  const fetchTypes = async () => {
    try {
      const res = await objectTypeApi.getAllObjectTypes();
      setTypes(res);
      if (res.length > 0) setSelectedTypeId(res[0].id);
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

  const filterDefinitions: FilterDefinition<ObjectParameter>[] = [
    {
      key: "parameter",
      label: "Параметры проверки",
      icon: <FilterAltIcon />,
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Тип объекта
      </Typography>

      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Главная / Объекты / Типы Объектов / Тип объекта
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        my={2}
      >
        <Box display="flex" gap={2} alignItems="center">
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
            variant="contained"
            onClick={() => setAddOpen(true)}
            disabled={!selectedTypeId}
          >
            + Добавить
          </Button>
        </Box>
      </Box>

      <ObjectTypeTable
        parameters={parameters}
        onEdit={handleEdit}
        filters={filterDefinitions}
        ref={gridRef}
      />

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
    </Box>
  );
}
