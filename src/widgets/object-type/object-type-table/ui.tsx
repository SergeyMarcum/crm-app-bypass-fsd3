// src/widgets/object-type/object-type-table/ui.tsx
import { forwardRef } from "react";
import { Box, IconButton } from "@mui/material"; // Добавлены импорты
import EditIcon from "@mui/icons-material/Edit"; // Добавлен импорт

import { CustomTable } from "@/widgets/table";
import type { ObjectParameter } from "./types";
import type { FilterDefinition } from "@/widgets/table";
import type { AgGridReact } from "ag-grid-react";

type Props = {
  parameters: ObjectParameter[];
  onEdit: (param: ObjectParameter) => void;
  onDelete: (paramId: number) => void; // Добавлен проп для удаления
  filters?: FilterDefinition<ObjectParameter>[];
};

export const ObjectTypeTable = forwardRef<AgGridReact, Props>(
  ({ parameters, onEdit, filters = [] }, ref) => {
    // Обновлен деструктуризация пропсов
    const columns = [
      {
        headerName: "#",
        valueGetter: "node.rowIndex + 1",
        width: 60,
      },
      {
        headerName: "Параметр",
        field: "parameter",
        flex: 1,
      },
      {
        headerName: "Действия",
        field: "actions",
        cellRenderer: (params: { data: ObjectParameter }) => (
          <Box>
            <IconButton aria-label="edit" onClick={() => onEdit(params.data)}>
              <EditIcon />
            </IconButton>
          </Box>
        ),
        width: 100,
      },
    ];

    return (
      <CustomTable<ObjectParameter>
        ref={ref}
        rowData={parameters}
        columnDefs={columns}
        getRowId={(row) => row.id.toString()}
        filters={filters}
        pageSize={20}
      />
    );
  }
);
