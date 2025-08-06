// src/pages/parameters/ui/ParametersPage/ParametersPage.tsx
import { useEffect, useState, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import type { AgGridReact as AgGridReactType } from "ag-grid-react";

import RuleIcon from "@mui/icons-material/Rule";
import AddIcon from "@mui/icons-material/Add";

import {
  useMutation,
  // useQueryClient
} from "@tanstack/react-query";
import { toast } from "sonner";

import { AddNewParameterModal } from "@/widgets/parameters/add-new-parameter-modal";
import { EditParameterModal } from "@/widgets/parameters/edit-parameter-modal";
import type { ObjectParameter } from "@/widgets/object-type/object-type-table/types";

import { parameterApi } from "@/shared/api/parameter";
import { ParametersTable } from "@/widgets/parameters/parameters-table";
import type { FilterDefinition } from "@/widgets/table";

export const ParametersPage = () => {
  // const queryClient = useQueryClient();
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
  }, []); // Мутация для удаления параметра

  const deleteMutation = useMutation({
    mutationFn: parameterApi.deleteParameter,
    onSuccess: () => {
      toast.success("Параметр успешно удален."); // После удаления, обновляем данные, вызывая повторно fetch
      fetchParameters();
    },
    onError: (error) => {
      console.error("Error deleting parameter:", error);
      toast.error("Не удалось удалить параметр. Попробуйте позже.");
    },
  });

  const handleEdit = (param: ObjectParameter) => {
    setEditParam({ id: param.id, name: param.parameter });
    setEditOpen(true);
  }; // Новая функция для удаления

  const handleDelete = (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот параметр?")) {
      deleteMutation.mutate(id);
    }
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
        <Button
          variant="contained"
          onClick={() => setAddOpen(true)}
          startIcon={<AddIcon />}
        >
          Добавить
        </Button>
      </Box>
      <ParametersTable
        ref={gridRef}
        parameters={parameters}
        onEdit={handleEdit}
        onDelete={handleDelete} // Передаем новую функцию удаления
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
