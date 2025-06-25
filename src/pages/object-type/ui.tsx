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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { AgGridReact } from "ag-grid-react";
import { CustomTable, FilterDefinition } from "@/widgets/table";
import { useTableStore } from "@/widgets/table/model/store";
import { objectTypeApi } from "@/shared/api/object-type"; // заглушка
import type { ObjectParameter } from "@/widgets/object-type-table/types"; // интерфейс строки
import { AddParameterModal } from "@/widgets/add-parameter-modal"; // пока-заглушка
import type { JSX } from "react";

export const ObjectTypePage = (): JSX.Element => {
  const [parameters, setParameters] = useState<ObjectParameter[]>([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [parameterFilterValue, setParameterFilterValue] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { filters, setFilter, resetFilters } = useTableStore();
  const gridRef = useRef<AgGridReact<ObjectParameter>>(null);

  useEffect(() => {
    // Заглушка под реальный API
    objectTypeApi.getObjectTypeParameters().then((res) => {
      setParameters(res);
    });
  }, []);

  const filterKey = "parameter";

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
      cellRenderer: () => <Button size="small">✏️</Button>, // TODO: modal open
      width: 120,
    },
  ];

  return (
    <Box p={3}>
      {/* Хлебные крошки */}
      <Breadcrumbs separator="›" sx={{ mb: 2 }}>
        <Typography color="text.secondary">Главная</Typography>
        <Typography color="text.secondary">Объекты</Typography>
        <Typography color="text.secondary">Типы объектов</Typography>
        <Typography color="text.primary">Тип объекта</Typography>
      </Breadcrumbs>

      {/* Заголовок */}
      <Typography variant="h4" gutterBottom>
        Тип объекта
      </Typography>

      {/* Блок фильтров и кнопка добавления */}
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

      {/* Таблица */}
      <CustomTable<ObjectParameter>
        ref={gridRef}
        rowData={parameters}
        columnDefs={columns}
        getRowId={(row) => row.id.toString()}
        filters={filterDefinitions}
      />

      {/* Модалка фильтра */}
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

      {/* Модалка добавления (заглушка) */}
      <AddParameterModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </Box>
  );
};
