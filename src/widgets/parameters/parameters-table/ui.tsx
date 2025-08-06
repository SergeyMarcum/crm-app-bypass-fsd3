// src/widgets/parameters/parameters-table/ui.tsx
import { CustomTable } from "@/widgets/table";
import type { ObjectParameter } from "@/widgets/object-type/object-type-table/types";
import type { FilterDefinition } from "@/widgets/table";
import type { AgGridReact } from "ag-grid-react";
import { forwardRef } from "react";

// Импортируем компоненты из MUI
import { Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  parameters: ObjectParameter[];
  onEdit: (param: ObjectParameter) => void;
  // Добавляем новый prop для удаления
  onDelete: (id: number) => void;
  filters?: FilterDefinition<ObjectParameter>[];
};

export const ParametersTable = forwardRef<AgGridReact, Props>(
  ({ parameters, onEdit, onDelete, filters = [] }, ref) => {
    const columns = [
      { headerName: "#", valueGetter: "node.rowIndex + 1", width: 60 },
      { headerName: "Параметр проверки", field: "parameter", flex: 1 },
      {
        headerName: "Действия",
        field: "actions",
        cellRenderer: (params: { data: ObjectParameter }) => (
          <Box>
            {/* Кнопка редактирования */}
            <IconButton aria-label="edit" onClick={() => onEdit(params.data)}>
              <EditIcon />
            </IconButton>
            {/* Новая кнопка удаления */}
            <IconButton
              aria-label="delete"
              onClick={() => onDelete(params.data.id)}
            >
              <DeleteIcon />
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
