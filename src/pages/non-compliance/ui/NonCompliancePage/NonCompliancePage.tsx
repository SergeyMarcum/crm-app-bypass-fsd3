// src/pages/non-compliance/ui/NonCompliancePage/NonCompliancePage.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Typography, Button } from "@mui/material";
import { toast } from "sonner";
import RuleIcon from "@mui/icons-material/Rule";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

import { nonComplianceApi } from "@/shared/api/non-compliance";
import { CustomTable } from "@/widgets/table";
import { AddNewNonComplianceModal } from "@/widgets/non-compliance/add-new-non-compliance-modal";
import { EditNonComplianceModal } from "@/widgets/non-compliance/edit-non-compliance-modal";
import { NonComplianceTableItem } from "@/widgets/non-compliance/non-compliance-table/types";
import type { FilterDefinition } from "@/widgets/table";
import { ColDef } from "ag-grid-community";

export const NonCompliancePage = () => {
  const queryClient = useQueryClient();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editNonCompliance, setEditNonCompliance] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Запрос для получения списка несоответствий
  const {
    data: nonCompliances = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["nonCompliances"],
    queryFn: async () => {
      const data = await nonComplianceApi.getAllNonCompliances();
      console.log("Raw response from /cases-of-non-compliance:", data);
      if (!Array.isArray(data)) {
        console.error(
          "Expected array from /cases-of-non-compliance, got:",
          data
        );
        throw new Error("Invalid response format: Expected array");
      }
      return data.map((nc: { id: number; name: string }) => ({
        id: nc.id,
        nonComplianceName: nc.name,
      }));
    },
  });

  // Мутация для удаления несоответствия
  const deleteMutation = useMutation({
    mutationFn: nonComplianceApi.deleteNonCompliance,
    onSuccess: () => {
      toast.success("Несоответствие успешно удалено.");
      queryClient.invalidateQueries({ queryKey: ["nonCompliances"] });
    },
    onError: (error) => {
      console.error("Error deleting non-compliance:", error);
      toast.error("Не удалось удалить несоответствие. Попробуйте позже.");
    },
  });

  const handleEdit = (id: number, name: string) => {
    setEditNonCompliance({ id, name });
    setEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить это несоответствие?")) {
      deleteMutation.mutate(id);
    }
  };

  const columnDefs: ColDef<NonComplianceTableItem>[] = [
    { field: "id", headerName: "№", width: 90 },
    {
      field: "nonComplianceName",
      headerName: "Наименование несоответствия",
      flex: 1,
    },
    {
      headerName: "Действия",
      width: 150,
      cellRenderer: (params: { data: NonComplianceTableItem }) => (
        <Box>
          <IconButton
            aria-label="edit"
            onClick={() =>
              handleEdit(params.data.id, params.data.nonComplianceName)
            }
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(params.data.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const filters: FilterDefinition<NonComplianceTableItem>[] = [
    { key: "nonComplianceName", label: "Несоответствия", icon: <RuleIcon /> },
  ];

  if (error) {
    toast.error(
      "Не удалось загрузить список несоответствий. Попробуйте позже."
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Список несоответствий
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Главная / Объекты / Список несоответствий
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          onClick={() => setAddModalOpen(true)}
          startIcon={<AddIcon />}
        >
          Добавить
        </Button>
      </Box>

      <CustomTable
        rowData={nonCompliances}
        columnDefs={columnDefs}
        getRowId={(row) => String(row.id)}
        filters={filters}
        loading={isLoading}
      />

      <AddNewNonComplianceModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => {
          setAddModalOpen(false);
          toast.success("Несоответствие успешно добавлено.");
          queryClient.invalidateQueries({ queryKey: ["nonCompliances"] });
        }}
      />

      <EditNonComplianceModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => {
          setEditModalOpen(false);
          toast.success("Несоответствие успешно обновлено.");
          queryClient.invalidateQueries({ queryKey: ["nonCompliances"] });
        }}
        nonComplianceId={editNonCompliance?.id ?? 0}
        nonComplianceName={editNonCompliance?.name ?? ""}
      />
    </Box>
  );
};
