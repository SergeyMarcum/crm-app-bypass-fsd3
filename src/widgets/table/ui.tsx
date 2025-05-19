// src/widgets/table/ui.tsx
import { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AgGridReactProps } from "ag-grid-react";

import {
  ModuleRegistry,
  ClientSideRowModelModule,
  RowSelectionModule,
  PaginationModule,
} from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTableStore } from "./model/store";

// ✅ Регистрируем необходимые модули
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
  PaginationModule,
]);

type TableFilterState = {
  email?: string;
  department?: string;
  phone?: string;
};

export type RowData = {
  id: number;
  full_name: string | null;
  email: string | null;
  department: string | null;
  phone: string | null;
  role_id: number;
  status_id: number | null;
  company: string | null;
  domain: string | null;
  name: string | null;
  position: string | null;
};

type Props = {
  rowData: RowData[];
  columnDefs: AgGridReactProps["columnDefs"];
  pagination?: boolean;
};

const filterSchema = z.object({
  email: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
});

export const CustomTable = ({
  rowData,
  columnDefs,
  pagination = true,
}: Props) => {
  const gridRef = useRef<AgGridReact>(null);
  const { filters, resetFilters, setFilter } = useTableStore();

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: filters,
  });

  const [filterField, setFilterField] = useState<keyof TableFilterState | null>(
    null
  );

  const onApplyFilters = handleSubmit((values) => {
    Object.entries(values).forEach(([key, value]) => {
      if (value) setFilter(key as keyof TableFilterState, value);
    });
    setFilterField(null);
  });

  const onResetFilters = () => {
    reset();
    resetFilters();
  };

  const filteredData = useMemo(() => {
    return rowData.filter((row) => {
      return Object.entries(filters).every(([field, value]) => {
        return (
          !value ||
          String(row[field as keyof RowData] ?? "")
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      });
    });
  }, [filters, rowData]);

  return (
    <div className="ag-theme-alpine" style={{ height: 600 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Button onClick={() => setFilterField("email")} variant="outlined">
          Фильтр по Email
        </Button>
        <Button onClick={() => setFilterField("phone")} variant="outlined">
          Фильтр по Телефону
        </Button>
        <Button onClick={() => setFilterField("department")} variant="outlined">
          Фильтр по Отделу
        </Button>
        <Button onClick={onResetFilters} variant="outlined" color="secondary">
          Сбросить фильтры
        </Button>
      </div>

      <Dialog open={filterField !== null} onClose={() => setFilterField(null)}>
        <DialogTitle>Фильтрация</DialogTitle>
        <DialogContent>
          <form onSubmit={onApplyFilters}>
            {filterField === "email" && (
              <TextField
                label="Email"
                {...register("email")}
                fullWidth
                margin="dense"
              />
            )}
            {filterField === "phone" && (
              <TextField
                label="Телефон"
                {...register("phone")}
                fullWidth
                margin="dense"
              />
            )}
            {filterField === "department" && (
              <TextField
                label="Отдел"
                {...register("department")}
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
        ref={gridRef}
        rowData={filteredData}
        columnDefs={columnDefs}
        pagination={pagination}
        rowSelection="multiple"
        animateRows
        domLayout="autoHeight"
      />
    </div>
  );
};
