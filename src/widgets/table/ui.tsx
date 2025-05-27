// src/widgets/table/ui.tsx
import { forwardRef, useMemo, useState, ForwardedRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { AgGridReactProps } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  PaginationModule,
  RowSelectionModule,
} from "ag-grid-community";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTableStore } from "./model/store";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
  PaginationModule,
]);

export type FilterDefinition = {
  key: string;
  label: string;
  icon?: React.ReactNode;
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
  filters?: FilterDefinition[];
};

export const CustomTable = forwardRef<AgGridReact, Props>(
  ({ rowData, columnDefs, pagination = true, filters = [] }, ref) => {
    const { filters: globalFilters, resetFilters, setFilter } = useTableStore();

    const schemaShape = filters.reduce(
      (acc, f) => {
        acc[f.key] = z.string().optional();
        return acc;
      },
      {} as Record<string, z.ZodTypeAny>
    );

    const formSchema = z.object(schemaShape);
    const { register, handleSubmit, reset } = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: globalFilters,
    });

    const [filterField, setFilterField] = useState<string | null>(null);

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

    const handleFilterClick = (key: string) => {
      const isActive = !!globalFilters[key];
      if (isActive) {
        setFilter(key, "");
      } else {
        setFilterField(key);
      }
    };

    const filteredData = useMemo(() => {
      return rowData.filter((row) => {
        return Object.entries(globalFilters).every(([field, value]) => {
          return (
            !value ||
            String(row[field as keyof RowData] ?? "")
              .toLowerCase()
              .includes(value.toLowerCase())
          );
        });
      });
    }, [globalFilters, rowData]);

    return (
      <div className="ag-theme-alpine" style={{ height: 600 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {filters.map((filter) => {
            const isActive = !!globalFilters[filter.key];
            return (
              <Button
                key={filter.key}
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

        <Dialog
          open={filterField !== null}
          onClose={() => setFilterField(null)}
        >
          <DialogTitle>Фильтрация</DialogTitle>
          <DialogContent>
            <form onSubmit={onApplyFilters}>
              {filterField && (
                <TextField
                  label={
                    filters.find((f) => f.key === filterField)?.label || ""
                  }
                  {...register(filterField)}
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
          ref={ref as ForwardedRef<AgGridReact>}
          rowData={filteredData}
          columnDefs={columnDefs}
          pagination={pagination}
          rowSelection="multiple"
          animateRows
          domLayout="autoHeight"
          getRowId={(params) => params.data.id.toString()}
        />
      </div>
    );
  }
);
