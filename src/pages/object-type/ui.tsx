// src/pages/object-type/ui.tsx
import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Breadcrumbs,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Stack,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { AgGridReact } from "ag-grid-react";

import { CustomTable, FilterDefinition } from "@/widgets/table";
import { useTableStore } from "@/widgets/table/model/store";
import { objectTypeApi } from "@/shared/api/object-type";
import { AddParameterModal } from "@/widgets/add-parameter-modal";
import { EditParameterModal } from "@/widgets/edit-parameter-modal";
import type { ObjectParameter } from "@/widgets/object-type-table/types";
import type { JSX } from "react";

export const ObjectTypePage = (): JSX.Element => {
  const [parameters, setParameters] = useState<ObjectParameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [parameterFilterValue, setParameterFilterValue] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editParam, setEditParam] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { filters, setFilter, resetFilters } = useTableStore();
  const gridRef = useRef<AgGridReact<ObjectParameter>>(null);

  const filterKey = "parameter";

  const fetchParameters = async () => {
    setLoading(true);
    try {
      const res = await objectTypeApi.getObjectTypeParameters();
      setParameters(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  const handleFilterClick = () => {
    if (filters[filterKey]) {
      setFilter(filterKey, "");
      setParameterFilterValue("");
    } else {
      setFilterDialogOpen(true);
    }
  };

  const handleApplyFilter = () => {
    setFilter(filterKey, parameterFilterValue);
    setFilterDialogOpen(false);
  };

  const handleResetFilters = () => {
    resetFilters();
    setParameterFilterValue("");
  };

  const handleEdit = (param: { id: number; parameter: string }) => {
    setEditParam({ id: param.id, name: param.parameter });
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setEditParam(null);
    fetchParameters();
    setSnackbarOpen(true);
  };

  const filterDefinitions: FilterDefinition<ObjectParameter>[] = [
    {
      key: "parameter",
      label: "Параметр проверки",
      icon: <FilterAltIcon />,
    },
  ];

  const columns = [
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      width: 60,
    },
    {
      headerName: "Наименование параметра",
      field: "parameter",
      flex: 1,
    },
    {
      headerName: "Действия",
      field: "actions",
      cellRenderer: (params: any) => (
        <Button size="small" onClick={() => handleEdit(params.data)}>
          ✏️
        </Button>
      ),
      width: 120,
    },
  ];

  return (
    <Box p={3}>
      <Breadcrumbs separator="›" sx={{ mb: 2 }}>
        <Typography color="text.secondary">Главная</Typography>
        <Typography color="text.secondary">Объекты</Typography>
        <Typography color="text.secondary">Типы объектов</Typography>
        <Typography color="text.primary">Тип объекта</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom>
        Тип объекта
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant={filters[filterKey] ? "outlined" : "contained"}
          onClick={handleFilterClick}
          startIcon={<FilterAltIcon />}
        >
          Параметр проверки
        </Button>
        <Button
          onClick={handleResetFilters}
          variant="outlined"
          color="secondary"
        >
          Сбросить фильтры
        </Button>
        <Box flexGrow={1} />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddModalOpen(true)}
        >
          Добавить
        </Button>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <CustomTable<ObjectParameter>
          ref={gridRef}
          rowData={parameters}
          columnDefs={columns}
          getRowId={(row) => row.id.toString()}
          filters={filterDefinitions}
        />
      )}

      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
      >
        <DialogTitle>Фильтрация по параметрам проверки</DialogTitle>
        <DialogContent>
          <TextField
            label="Параметр проверки"
            value={parameterFilterValue}
            onChange={(e) => setParameterFilterValue(e.target.value)}
            fullWidth
            margin="dense"
          />
          <Button
            onClick={handleApplyFilter}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Применить
          </Button>
        </DialogContent>
      </Dialog>

      <AddParameterModal
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          fetchParameters();
        }}
      />

      {editParam && (
        <EditParameterModal
          open={editModalOpen}
          onClose={handleEditClose}
          parameterId={editParam.id}
          parameterName={editParam.name}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Изменения сохранены"
      />
    </Box>
  );
};
