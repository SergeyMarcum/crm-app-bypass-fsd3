import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { useMemo, useRef } from "react";
import { AgGridReactProps } from "ag-grid-react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";

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

type RowData = {
  id: string;
  full_name: string;
  company: string;
  email: string;
  role_id: number;
  status_id: number;
  domain: string;
  name: string;
  position: string;
  department: string;
  phone: string;
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

  const onApplyFilters = handleSubmit((values) => {
    Object.entries(values).forEach(([key, value]) => {
      if (value) setFilter(key as keyof typeof filters, value);
    });
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
        <Button onClick={onResetFilters}>Сбросить фильтры</Button>
        <Dialog open={true}>
          <DialogTitle>Фильтры</DialogTitle>
          <DialogContent>
            <form onSubmit={onApplyFilters}>
              <TextField
                label="Email"
                {...register("email")}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Телефон"
                {...register("phone")}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Отдел"
                {...register("department")}
                fullWidth
                margin="dense"
              />
              <Button type="submit" variant="contained">
                Применить
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <AgGridReact
        ref={gridRef}
        rowData={filteredData}
        columnDefs={columnDefs}
        pagination={pagination}
        rowSelection="multiple"
      />
    </div>
  );
};
