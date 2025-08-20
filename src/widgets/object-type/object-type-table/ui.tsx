// src/widgets/object-type/object-type-table/ui.tsx
import { forwardRef } from "react";
import { Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"; // Добавлен импорт иконки удаления

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
  ({ parameters, onEdit, onDelete, filters = [] }, ref) => {
    // Добавлен onDelete в деструктуризацию
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
          <Box display="flex" gap={1}>
            <IconButton aria-label="edit" onClick={() => onEdit(params.data)}>
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => onDelete(params.data.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ),
        width: 120,
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
