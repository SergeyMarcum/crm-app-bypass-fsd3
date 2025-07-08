// src/pages/object-type/ui.tsx
import { useEffect, useState, useRef, useCallback } from "react"; // Импортируем useCallback
import { Box, Typography, Select, MenuItem, Button } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { AgGridReact } from "ag-grid-react";

import { objectTypeApi } from "@/shared/api/object-type";
import { ObjectTypeTable } from "@/widgets/object-type-table";
//import { AddParameterModal } from "@/widgets/add-parameter-modal";
import { EditParameterModal } from "@/widgets/edit-parameter-modal";
import { AddObjectTypeModal } from "@/widgets/add-object-type-modal";

import type { ObjectParameter } from "@/widgets/object-type-table/types";
import type { FilterDefinition } from "@/widgets/table";

export function ObjectTypePage() {
  const [parameters, setParameters] = useState<ObjectParameter[]>([]);
  const [types, setTypes] = useState<{ id: number; name: string }[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | "">("");
  const [addParameterModalOpen, setAddParameterModalOpen] = useState(false); // Переименовано для ясности
  const [addObjectTypeModalOpen, setAddObjectTypeModalOpen] = useState(false); // Новое состояние для новой модалки
  const [editOpen, setEditOpen] = useState(false);
  const [editParam, setEditParam] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const gridRef = useRef<AgGridReact<ObjectParameter>>(null);

  // --- Начало изменений с useCallback ---

  const fetchTypes = useCallback(async () => {
    try {
      const res = await objectTypeApi.getAllObjectTypes();
      setTypes(res);
      // Логика для выбора первого типа или сохранения текущего выбора
      if (res.length > 0) {
        if (
          !selectedTypeId ||
          !res.some((type) => type.id === selectedTypeId)
        ) {
          setSelectedTypeId(res[0].id); // Выбираем первый, если ничего не выбрано или текущий ID отсутствует
        }
      } else {
        setSelectedTypeId(""); // Типов нет, очищаем выбор
      }
    } catch (err) {
      console.error("Ошибка при загрузке типов объектов", err);
    }
  }, [selectedTypeId]); // selectedTypeId является зависимостью, так как используется для проверки валидности текущего ID

  const fetchParameters = useCallback(async () => {
    if (!selectedTypeId || typeof selectedTypeId !== "number") {
      setParameters([]); // Очищаем параметры, если тип не выбран
      return;
    }
    try {
      const res = await objectTypeApi.getObjectTypeParameters(selectedTypeId);
      setParameters(res);
    } catch (err) {
      console.error("Ошибка при загрузке параметров", err);
    }
  }, [selectedTypeId]); // selectedTypeId является зависимостью, так как используется в вызове API

  // --- Конец изменений с useCallback ---

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]); // Теперь fetchTypes стабилен и запускается только при изменении его внутренних зависимостей

  useEffect(() => {
    fetchParameters();
  }, [fetchParameters]); // Теперь fetchParameters стабилен

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

          {/* Существующая кнопка "Добавить параметр" (переименовано состояние для ясности) */}
          <Button
            variant="contained"
            onClick={() => setAddParameterModalOpen(true)}
            disabled={!selectedTypeId}
          >
            + Добавить (Параметр)
          </Button>

          {/* НОВАЯ кнопка "Добавить тип объекта" */}
          <Button
            variant="contained"
            onClick={() => setAddObjectTypeModalOpen(true)}
            color="secondary" // Используем другой цвет для различения
          >
            + Добавить (Тип Объекта)
          </Button>
        </Box>
      </Box>

      <ObjectTypeTable
        parameters={parameters}
        onEdit={handleEdit}
        filters={filterDefinitions}
        ref={gridRef}
      />

      {/* Существующая AddParameterModal */}
      <AddParameterModal
        open={addParameterModalOpen}
        onClose={() => {
          setAddParameterModalOpen(false);
          fetchParameters(); // Вызываем стабильную fetchParameters
        }}
        objectTypeId={Number(selectedTypeId)}
      />

      {/* НОВАЯ AddObjectTypeModal */}
      <AddObjectTypeModal
        open={addObjectTypeModalOpen}
        onClose={() => setAddObjectTypeModalOpen(false)}
        onSaveSuccess={() => {
          fetchTypes(); // Вызываем стабильную fetchTypes для обновления типов
          setAddObjectTypeModalOpen(false);
        }}
      />

      <EditParameterModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          fetchParameters(); // Вызываем стабильную fetchParameters
        }}
        parameterId={editParam?.id ?? 0}
        parameterName={editParam?.name ?? ""}
      />
    </Box>
  );
}
