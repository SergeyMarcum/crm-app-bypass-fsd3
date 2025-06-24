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
} from "@mui/material";
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
  filters?: FilterDefinition<TRow>[];
};

function CustomTableInner<T extends object>(
  { rowData, columnDefs, getRowId, pagination = true, filters = [] }: Props<T>,
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
    <div className="ag-theme-alpine" style={{ height: 600 }}>
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
        <DialogTitle>Фильтрация</DialogTitle>
        <DialogContent>
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
        rowSelection="multiple"
        animateRows
        domLayout="autoHeight"
        getRowId={({ data }) => getRowId(data)}
      />
    </div>
  );
}

// ✅ Типизированный экспорт с generic <T>
export const CustomTable = forwardRef(CustomTableInner) as <T extends object>(
  props: Props<T> & { ref?: ForwardedRef<AgGridReact> }
) => JSX.Element;
