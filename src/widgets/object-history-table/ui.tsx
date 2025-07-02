// src/widgets/object-history-table/ui.tsx
import { forwardRef } from "react";
import { CustomTable, FilterDefinition } from "@/widgets/table";
import type { AgGridReact } from "ag-grid-react";
import type { ObjectHistoryRecord } from "./types";

import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import RuleIcon from "@mui/icons-material/Rule";

import type { JSX } from "react";

const filters: FilterDefinition<ObjectHistoryRecord>[] = [
  { key: "check_date", label: "Дата проверки", icon: <CalendarMonthIcon /> },
  { key: "upload_date", label: "Дата загрузки", icon: <CalendarMonthIcon /> },
  { key: "parameter", label: "Параметр проверки", icon: <RuleIcon /> },
  { key: "operator", label: "Оператор", icon: <PersonIcon /> },
];

type Props = {
  data: ObjectHistoryRecord[];
  onViewPhoto: (url: string) => void;
};

export const ObjectHistoryTable = forwardRef<AgGridReact, Props>(
  ({ data, onViewPhoto }, ref): JSX.Element => {
    const columns = [
      { headerName: "#", valueGetter: "node.rowIndex + 1", width: 60 },
      { headerName: "Дата проверки", field: "check_date" },
      {
        headerName: "Повторная проверка",
        field: "is_repeat",
        valueFormatter: (params: { value: boolean }) =>
          params.value ? "Да" : "Нет",
      },
      { headerName: "Оператор", field: "operator" },
      { headerName: "Дата загрузки", field: "upload_date" },
      { headerName: "Параметр", field: "parameter" },
      { headerName: "Несоответствия", field: "incongruity" },
      {
        headerName: "Фото",
        field: "photo_url",
        cellRenderer: (params: { value: string }) =>
          params.value ? (
            <VisibilityIcon
              sx={{ cursor: "pointer" }}
              onClick={() => onViewPhoto(params.value)}
            />
          ) : null,
        width: 80,
      },
    ];

    return (
      <CustomTable<ObjectHistoryRecord>
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
