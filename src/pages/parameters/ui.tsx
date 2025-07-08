// src/pages/parameters/ui.tsx
import { useEffect, useState, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";

import type { AgGridReact as AgGridReactType } from "ag-grid-react";

import RuleIcon from "@mui/icons-material/Rule";

import { AddNewParameterModal } from "@/widgets/add-new-parameter-modal";
import { EditParameterModal } from "@/widgets/edit-parameter-modal";
import type { ObjectParameter } from "@/widgets/object-type-table/types";

import { parameterApi } from "@/shared/api/parameter";
import { ParametersTable } from "@/widgets/parameters-table";
import type { FilterDefinition } from "@/widgets/table";

export const ParametersPage = () => {
  const [parameters, setParameters] = useState<ObjectParameter[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editParam, setEditParam] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const gridRef = useRef<AgGridReactType>(null);

  const fetchParameters = async () => {
    const all = await parameterApi.getAllParameters();

    setParameters(
      all.map((p: { id: number; name: string }) => ({
        id: p.id,
        parameter: p.name,
      }))
    );
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  const handleEdit = (param: ObjectParameter) => {
    setEditParam({ id: param.id, name: param.parameter });
    setEditOpen(true);
  };

  const filters: FilterDefinition<ObjectParameter>[] = [
    { key: "parameter", label: "Параметр проверки", icon: <RuleIcon /> },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Список параметров
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Главная / Объекты / Список параметров
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={() => setAddOpen(true)}>
          + Добавить
        </Button>
      </Box>

      <ParametersTable
        ref={gridRef}
        parameters={parameters}
        onEdit={handleEdit}
        filters={filters}
      />

      <AddNewParameterModal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          fetchParameters();
        }}
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
};
