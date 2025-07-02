// src/widgets/object-task-table/ui.tsx
import { forwardRef } from "react";
import { CustomTable, FilterDefinition } from "@/widgets/table";
import type { AgGridReact } from "ag-grid-react";
import type { ObjectHistoryRecord } from "../object-history-table";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Tooltip } from "@mui/material";

const columns = (
  onViewPhoto: (photoUrl: string) => void
): Parameters<typeof CustomTable<ObjectHistoryRecord>>[0]["columnDefs"] => [
  { headerName: "#", valueGetter: "node.rowIndex + 1", width: 60 },
  { headerName: "Дата проверки", field: "check_date", flex: 1 },
  { headerName: "Повторная проверка", field: "is_repeated", flex: 1 },
  { headerName: "Оператор", field: "operator", flex: 1 },
  { headerName: "Дата загрузки отчета", field: "upload_date", flex: 1 },
  { headerName: "Параметр", field: "parameter", flex: 1 },
  { headerName: "Несоответствие", field: "incongruity", flex: 2 },
  {
    headerName: "Фото",
    field: "photo",
    cellRenderer: (params: { data: ObjectHistoryRecord }) =>
      params.data.photo_url ? (
        <Tooltip title="Открыть фото">
          <IconButton onClick={() => onViewPhoto(params.data.photo_url!)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ) : (
        "—"
      ),
    width: 100,
  },
];

const filters: FilterDefinition<ObjectHistoryRecord>[] = [
  { key: "check_date", label: "Дата проверки" },
  { key: "upload_date", label: "Дата загрузки" },
  { key: "parameter", label: "Параметр проверки" },
  { key: "operator_name", label: "Оператор" },
];

type Props = {
  data: ObjectHistoryRecord[];
  onViewPhoto: (url: string) => void;
};

export const ObjectTaskTable = forwardRef<AgGridReact, Props>(
  ({ data, onViewPhoto }, ref) => {
    return (
      <CustomTable<ObjectHistoryRecord>
        ref={ref}
        rowData={data}
        columnDefs={columns(onViewPhoto)}
        getRowId={(row) => row.id.toString()}
        filters={filters}
        pageSize={15}
      />
    );
  }
);
