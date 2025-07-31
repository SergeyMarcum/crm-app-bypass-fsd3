// src/widgets/table/ui.tsx
import { forwardRef, useMemo, useState, ReactNode, ForwardedRef } from "react";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  PaginationModule,
  RowSelectionModule,
} from "ag-grid-community";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTableStore } from "./model/store";
import type { JSX } from "react";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
  PaginationModule,
]);

export type FilterDefinition<TRow extends object> = {
  key: keyof TRow;
  label: string;
  icon?: ReactNode;
};

type Props<TRow extends object> = {
  rowData: TRow[];
  columnDefs: AgGridReactProps["columnDefs"];
  getRowId: (row: TRow) => string;
  pagination?: boolean;
  pageSize?: number;
  filters?: FilterDefinition<TRow>[];
  onSelectionChanged?: AgGridReactProps["onSelectionChanged"];
  loading?: boolean; // Добавляем пропс loading
};

function CustomTableInner<T extends object>(
  {
    rowData,
    columnDefs,
    getRowId,
    pagination = true,
    filters = [],
    pageSize = 20,
    onSelectionChanged,
    loading = false, // Значение по умолчанию
  }: Props<T>,
  ref: ForwardedRef<AgGridReact>
): JSX.Element {
  const { filters: globalFilters, setFilter, resetFilters } = useTableStore();
  const [filterField, setFilterField] = useState<keyof T | null>(null);

  const schemaShape = filters.reduce(
    (acc, filter) => {
      acc[filter.key as string] = z.string().optional();
      return acc;
    },
    {} as Record<string, z.ZodTypeAny>
  );

  const formSchema = z.object(schemaShape);
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: globalFilters,
  });

  const onApplyFilters = handleSubmit((values) => {
    Object.entries(values).forEach(([key, value]) => {
      if (value) setFilter(key, value);
    });
    setFilterField(null);
  });

  const onResetFilters = () => {
    reset();
    resetFilters();
  };

  const handleFilterClick = (key: keyof T) => {
    const isActive = !!globalFilters[key as string];
    if (isActive) {
      setFilter(key as string, "");
    } else {
      setFilterField(key);
    }
  };

  const filteredData = useMemo(() => {
    if (!Array.isArray(rowData)) return [];
    return rowData.filter((row) =>
      Object.entries(globalFilters).every(([field, value]) =>
        !value
          ? true
          : String(row[field as keyof T] ?? "")
              .toLowerCase()
              .includes(value.toLowerCase())
      )
    );
  }, [rowData, globalFilters]);

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: 600, position: "relative" }}
    >
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {filters.map((filter) => {
          const isActive = !!globalFilters[filter.key as string];
          return (
            <Button
              key={String(filter.key)}
              onClick={() => handleFilterClick(filter.key)}
              variant={isActive ? "outlined" : "contained"}
              size="medium"
              startIcon={filter.icon}
            >
              {filter.label}
            </Button>
          );
        })}
        <Button
          onClick={onResetFilters}
          variant="outlined"
          color="secondary"
          size="medium"
        >
          Сбросить фильтры
        </Button>
      </div>

      <Dialog open={filterField !== null} onClose={() => setFilterField(null)}>
        <DialogTitle>
          Фильтрация
          <IconButton
            aria-label="close"
            onClick={() => setFilterField(null)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={onApplyFilters}>
            {filterField && (
              <TextField
                label={filters.find((f) => f.key === filterField)?.label || ""}
                {...register(filterField as string)}
                fullWidth
                margin="dense"
              />
            )}
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Применить
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AgGridReact
        ref={ref}
        rowData={filteredData}
        columnDefs={columnDefs}
        pagination={pagination}
        paginationPageSize={pageSize}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        rowSelection="multiple"
        animateRows
        domLayout="normal"
        getRowId={({ data }) => getRowId(data)}
        onSelectionChanged={onSelectionChanged}
        loadingOverlayComponent={loading ? "loadingOverlay" : undefined} // Поддержка индикатора загрузки
      />
    </div>
  );
}

export const CustomTable = forwardRef(CustomTableInner) as <T extends object>(
  props: Props<T> & { ref?: ForwardedRef<AgGridReact> }
) => JSX.Element;
