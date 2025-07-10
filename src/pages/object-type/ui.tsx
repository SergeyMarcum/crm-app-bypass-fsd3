// src/pages/object-type/ui.tsx
import { useEffect, useState, useRef, useCallback } from "react";
import { Box, Typography, Select, MenuItem, Button } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { AgGridReact } from "ag-grid-react";

import { objectTypeApi } from "@/shared/api/object-type";
import { ObjectTypeTable } from "@/widgets/object-type/object-type-table";
import { AddParameterModal } from "@/widgets/parameters/add-parameter-modal";
import { EditParameterModal } from "@/widgets/parameters/edit-parameter-modal";
import { AddObjectTypeModal } from "@/widgets/object-type/add-object-type-modal";

import type { ObjectParameter } from "@/widgets/object-type/object-type-table/types"; // Предполагается { id: number; parameter: string; }
import type { FilterDefinition } from "@/widgets/table";

export function ObjectTypePage() {
  const [parameters, setParameters] = useState<ObjectParameter[]>([]);
  const [types, setTypes] = useState<{ id: number; name: string }[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | "">("");
  const [addParameterModalOpen, setAddParameterModalOpen] = useState(false);
  const [addObjectTypeModalOpen, setAddObjectTypeModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editParam, setEditParam] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const gridRef = useRef<AgGridReact<ObjectParameter>>(null);

  const fetchTypes = useCallback(async () => {
    try {
      const res = await objectTypeApi.getAllObjectTypes();
      setTypes(res);

      if (res.length > 0) {
        if (
          !selectedTypeId ||
          !res.some((type) => type.id === selectedTypeId)
        ) {
          setSelectedTypeId(res[0].id);
        }
      } else {
        setSelectedTypeId("");
      }
    } catch (err) {
      console.error("Ошибка при загрузке типов объектов", err);
    }
  }, [selectedTypeId]);

  const fetchParameters = useCallback(async () => {
    if (!selectedTypeId || typeof selectedTypeId !== "number") {
      setParameters([]); // Очищаем параметры, если тип не выбран
      return;
    }
    try {
      // Получаем данные с API, которые будут иметь поле 'name'
      const res = await objectTypeApi.getObjectTypeParameters(selectedTypeId); // Преобразуем поле 'name' в 'parameter' для соответствия типу ObjectParameter
      const transformedParameters: ObjectParameter[] = res.map((p) => ({
        id: p.id,
        parameter: p.name,
      }));
      setParameters(transformedParameters);
    } catch (err) {
      console.error("Ошибка при загрузке параметров", err);
    }
  }, [selectedTypeId]);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  useEffect(() => {
    fetchParameters();
  }, [fetchParameters]);

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
      {" "}
      <Typography variant="h4" gutterBottom>
        Тип объекта{" "}
      </Typography>{" "}
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Главная / Объекты / Типы Объектов / Тип объекта{" "}
      </Typography>{" "}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        my={2}
      >
        {" "}
        <Box display="flex" gap={2} alignItems="center">
          {" "}
          <Select
            value={selectedTypeId}
            onChange={(e) => setSelectedTypeId(Number(e.target.value))}
            size="small"
            displayEmpty
          >
            <MenuItem value="">Выберите тип</MenuItem>{" "}
            {types.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}{" "}
              </MenuItem>
            ))}{" "}
          </Select>{" "}
          <Button
            variant="contained"
            onClick={() => setAddObjectTypeModalOpen(true)}
            color="secondary"
          >
            + Добавить (Тип Объекта){" "}
          </Button>{" "}
        </Box>{" "}
      </Box>{" "}
      <ObjectTypeTable
        parameters={parameters}
        onEdit={handleEdit}
        filters={filterDefinitions}
        ref={gridRef}
      />{" "}
      <AddParameterModal
        open={addParameterModalOpen}
        onClose={() => {
          setAddParameterModalOpen(false);
          fetchParameters();
        }}
        objectTypeId={Number(selectedTypeId)}
      />{" "}
      <AddObjectTypeModal
        open={addObjectTypeModalOpen}
        onClose={() => setAddObjectTypeModalOpen(false)}
        onSaveSuccess={() => {
          fetchTypes();
          setAddObjectTypeModalOpen(false);
        }}
      />{" "}
      <EditParameterModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          fetchParameters();
        }}
        parameterId={editParam?.id ?? 0}
        parameterName={editParam?.name ?? ""}
      />{" "}
    </Box>
  );
}
