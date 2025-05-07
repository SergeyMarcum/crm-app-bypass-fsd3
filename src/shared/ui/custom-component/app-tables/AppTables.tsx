// src/shared/ui/custom-component/app-tables/AppTables.tsx

import { useCallback, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  IconButton,
  SelectChangeEvent,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  CellValueChangedEvent,
  ICellRendererParams,
} from "ag-grid-community";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { AppButton } from "@shared/ui/custom-component/app-button";
import { Link } from "react-router-dom";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export interface AppTablesProps<T> {
  tableType?: "basic" | "editable" | "with-filters" | "with-tabs";
  columns: ColDef<T>[];
  data?: T[];
  onEdit?: (row: T) => void;
  tabLabels?: string[];
  tabData?: T[][];
  height?: string | number;
  filters?: {
    email?: boolean;
    department?: string[];
    phone?: boolean;
  };
  paginationOptions?: number[];
  sortOptions?: { label: string; value: string }[];
}

// Типизация данных для выпадающих списков
interface TableData {
  id: number; // Изменяем на обязательное поле
  fullName?: string;
  department?: string;
  email?: string;
  phone?: string;
  accessRights?: string;
  status?: string;
  address?: string;
  [key: string]: unknown; // Сигнатура индекса для совместимости с Record<string, unknown>
}

export function AppTables<T extends TableData>({
  tableType = "basic",
  columns,
  data = [],
  onEdit,
  tabLabels = [],
  tabData = [],
  height = 500,
  filters = {},
  paginationOptions = [10, 25, 50],
  sortOptions = [
    { label: "Сначала новые", value: "newest" },
    { label: "Сначала старые", value: "oldest" },
  ],
}: AppTablesProps<T>) {
  const [activeTab, setActiveTab] = useState(0);
  const [filterModal, setFilterModal] = useState<
    "email" | "department" | "phone" | null
  >(null);
  const [filterValues, setFilterValues] = useState<{
    email: string;
    department: string;
    phone: string;
  }>({ email: "", department: "", phone: "" });
  const [sortValue, setSortValue] = useState(sortOptions[0]?.value || "newest");
  const [pageSize, setPageSize] = useState(paginationOptions[0] || 10);
  const [editingRow, setEditingRow] = useState<number | null>(null);

  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, newValue: number) => {
      setActiveTab(newValue);
    },
    []
  );

  const handleFilterOpen = (type: "email" | "department" | "phone") => {
    setFilterModal(type);
  };

  const handleFilterClose = () => {
    setFilterModal(null);
  };

  const handleFilterApply = useCallback(() => {
    handleFilterClose();
  }, [filterValues]);

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortValue(event.target.value);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    setPageSize(Number(event.target.value));
  };

  const onCellValueChanged = useCallback(
    (event: CellValueChangedEvent<T>) => {
      if (onEdit) {
        onEdit(event.data);
      }
    },
    [onEdit]
  );

  const handleEditRow = (rowId: number) => {
    setEditingRow(rowId);
  };

  const handleSaveRow = (row: T) => {
    if (onEdit) {
      onEdit(row);
    }
    setEditingRow(null);
  };

  const actionColumn: ColDef<T> = {
    headerName: "Действия",
    cellRenderer: (params: ICellRendererParams<T>) => {
      const rowId = params.data?.id;
      const isEditing = editingRow === rowId;
      return (
        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={() => handleEditRow(rowId!)}
            disabled={isEditing}
            size="small"
          >
            <EditIcon />
          </IconButton>
          {isEditing && (
            <IconButton
              onClick={() => handleSaveRow(params.data!)}
              size="small"
            >
              <SaveIcon />
            </IconButton>
          )}
        </Stack>
      );
    },
    editable: false,
    filter: false,
    sortable: false,
    width: 120,
  };

  const modifiedColumns = useMemo(() => {
    const enhancedColumns = columns.map((col: ColDef<T>) => {
      if (col.field === "department" && filters.department) {
        return {
          ...col,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: filters.department,
          },
          editable:
            editingRow !== null
              ? (params: ICellRendererParams<T>) =>
                  params.data?.id === editingRow
              : false,
        } as ColDef<T>;
      }
      if (col.field === "accessRights") {
        return {
          ...col,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: [
              "Администратор ИТЦ",
              "Администратор Филиала",
              "Мастер",
              "Оператор",
              "Наблюдатель Филиала",
              "Гость",
              "Уволенные",
              "Администратор Общества",
            ],
          },
          editable:
            editingRow !== null
              ? (params: ICellRendererParams<T>) =>
                  params.data?.id === editingRow
              : false,
        } as ColDef<T>;
      }
      if (col.field === "status") {
        return {
          ...col,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: [
              "Работает",
              "Уволен(а)",
              "Отпуск",
              "Командировка",
              "Больничный",
            ],
          },
          editable:
            editingRow !== null
              ? (params: ICellRendererParams<T>) =>
                  params.data?.id === editingRow
              : false,
        } as ColDef<T>;
      }
      if (col.field === "fullName") {
        return {
          ...col,
          cellRenderer: (params: ICellRendererParams<T>) => (
            <Link to={`/profile/${params.data?.id}`}>{params.value}</Link>
          ),
          editable:
            editingRow !== null
              ? (params: ICellRendererParams<T>) =>
                  params.data?.id === editingRow
              : false,
        } as ColDef<T>;
      }
      return {
        ...col,
        editable:
          editingRow !== null
            ? (params: ICellRendererParams<T>) => params.data?.id === editingRow
            : false,
      } as ColDef<T>;
    });
    return tableType === "editable"
      ? [...enhancedColumns, actionColumn as ColDef<T>]
      : enhancedColumns;
  }, [columns, tableType, editingRow, filters.department]);

  const currentData = useMemo(() => {
    let result = tableType === "with-tabs" ? tabData[activeTab] || [] : data;

    if (filterValues.email) {
      result = result.filter((row) =>
        row.email
          ?.toString()
          .toLowerCase()
          .includes(filterValues.email.toLowerCase())
      );
    }
    if (filterValues.department) {
      result = result.filter(
        (row) => row.department === filterValues.department
      );
    }
    if (filterValues.phone) {
      result = result.filter((row) =>
        row.phone
          ?.toString()
          .toLowerCase()
          .includes(filterValues.phone.toLowerCase())
      );
    }

    if (sortValue === "newest") {
      result = [...result].sort((a, b) => (b.id || 0) - (a.id || 0));
    } else if (sortValue === "oldest") {
      result = [...result].sort((a, b) => (a.id || 0) - (b.id || 0));
    }

    return result;
  }, [data, tabData, activeTab, tableType, filterValues, sortValue]);

  return (
    <Box>
      {tableType === "with-filters" && (
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          {filters.email && (
            <AppButton
              type="simple"
              label="Email"
              variant="outlined"
              onClick={() => handleFilterOpen("email")}
            />
          )}
          {filters.department && (
            <AppButton
              type="simple"
              label="Отдел"
              variant="outlined"
              onClick={() => handleFilterOpen("department")}
            />
          )}
          {filters.phone && (
            <AppButton
              type="simple"
              label="Телефон"
              variant="outlined"
              onClick={() => handleFilterOpen("phone")}
            />
          )}
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Сортировка</InputLabel>
            <Select
              value={sortValue}
              onChange={handleSortChange}
              label="Сортировка"
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      )}

      {tableType === "with-tabs" && tabLabels.length > 0 && (
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          {tabLabels.map((label, idx) => (
            <Tab key={idx} label={label} />
          ))}
        </Tabs>
      )}

      <Box
        className="ag-theme-alpine"
        sx={{
          height: typeof height === "number" ? `${height}px` : height,
          width: "100%",
        }}
      >
        <AgGridReact<T>
          columnDefs={modifiedColumns}
          rowData={currentData}
          animateRows
          pagination
          paginationPageSize={pageSize}
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            resizable: true,
            filter: tableType === "with-filters",
          }}
          onCellValueChanged={onEdit ? onCellValueChanged : undefined}
          onGridReady={(params: GridReadyEvent) => {
            params.api.sizeColumnsToFit();
          }}
        />
      </Box>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Всего записей: {currentData.length}
        </Typography>
        <FormControl sx={{ minWidth: 100 }}>
          <InputLabel>Записей на странице</InputLabel>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            label="Записей на странице"
          >
            {paginationOptions.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {currentData.length === 0 && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Нет данных для отображения.
        </Typography>
      )}

      <Modal open={filterModal === "email"} onClose={handleFilterClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            minWidth: 300,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Фильтр по Email
          </Typography>
          <TextField
            label="Email"
            value={filterValues.email}
            onChange={(e) =>
              setFilterValues({ ...filterValues, email: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <AppButton
            type="simple"
            label="Применить"
            variant="contained"
            onClick={handleFilterApply}
            fullWidth
          />
        </Box>
      </Modal>

      <Modal open={filterModal === "department"} onClose={handleFilterClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            minWidth: 300,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Фильтр по отделу
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Отдел</InputLabel>
            <Select
              value={filterValues.department}
              onChange={(e) =>
                setFilterValues({ ...filterValues, department: e.target.value })
              }
              label="Отдел"
            >
              {filters.department?.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <AppButton
            type="simple"
            label="Применить"
            variant="contained"
            onClick={handleFilterApply}
            fullWidth
          />
        </Box>
      </Modal>

      <Modal open={filterModal === "phone"} onClose={handleFilterClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            minWidth: 300,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Фильтр по телефону
          </Typography>
          <TextField
            label="Телефон"
            value={filterValues.phone}
            onChange={(e) =>
              setFilterValues({ ...filterValues, phone: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <AppButton
            type="simple"
            label="Применить"
            variant="contained"
            onClick={handleFilterApply}
            fullWidth
          />
        </Box>
      </Modal>
    </Box>
  );
}
