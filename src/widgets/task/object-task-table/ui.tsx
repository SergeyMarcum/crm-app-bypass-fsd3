// src/widgets/task/object-task-table/ui.tsx
import { forwardRef } from "react";
import { CustomTable } from "@/widgets/table";
import type { FilterDefinition } from "@/widgets/table";
import type { ObjectHistoryRecord } from "./types";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { AgGridReact } from "ag-grid-react";

type Props = {
  data: (ObjectHistoryRecord & { photo_url?: string })[];
  onViewPhoto: (url: string) => void;
};

export const ObjectTaskTable = forwardRef<AgGridReact, Props>(
  ({ data, onViewPhoto }, ref) => {
    const filters: FilterDefinition<ObjectHistoryRecord>[] = [
      { key: "inspection_date", label: "Дата проверки" },
      { key: "upload_date", label: "Дата загрузки" },
      { key: "parameter", label: "Параметр проверки" },
      { key: "operator_full_name", label: "Оператор" },
    ];

    const columns = [
      { headerName: "#", valueGetter: "node.rowIndex + 1", width: 60 },
      {
        headerName: "Дата проверки",
        field: "inspection_date",
        flex: 1.2,
      },
      {
        headerName: "Повторная?",
        field: "is_reinspection",
        width: 120,
        cellRenderer: (params: { data: ObjectHistoryRecord }) =>
          params.data.is_reinspection ? "Да" : "Нет",
      },
      {
        headerName: "Оператор",
        field: "operator_full_name",
        flex: 1.5,
      },
      {
        headerName: "Дата загрузки отчёта",
        field: "upload_date",
        flex: 1.5,
      },
      {
        headerName: "Параметры",
        field: "parameter",
        flex: 2,
      },
      {
        headerName: "Несоответствия",
        field: "incongruity",
        flex: 2,
      },
      {
        headerName: "Фото",
        field: "photo",
        width: 100,
        cellRenderer: (params: {
          data: ObjectHistoryRecord & { photo_url?: string };
        }) => {
          const url = params.data.photo_url;
          return url ? (
            <IconButton
              size="small"
              onClick={() => onViewPhoto(url)}
              title="Посмотреть фото"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          ) : null;
        },
      },
    ];

    return (
      <CustomTable<ObjectHistoryRecord & { photo_url?: string }>
        ref={ref}
        rowData={data}
        columnDefs={columns}
        getRowId={(row) => row.id.toString()}
        filters={filters}
        pageSize={15}
      />
    );
  }
);
