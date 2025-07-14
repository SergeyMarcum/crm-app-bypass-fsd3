// src/widgets/parameters/parameters-table/ui.tsx
import { CustomTable } from "@/widgets/table";
import type { ObjectParameter } from "@/widgets/object-type/object-type-table/types";
import type { FilterDefinition } from "@/widgets/table";
import type { AgGridReact } from "ag-grid-react";
import { forwardRef } from "react";

type Props = {
  parameters: ObjectParameter[];
  onEdit: (param: ObjectParameter) => void;
  filters?: FilterDefinition<ObjectParameter>[];
};

export const ParametersTable = forwardRef<AgGridReact, Props>(
  ({ parameters, onEdit, filters = [] }, ref) => {
    const columns = [
      { headerName: "#", valueGetter: "node.rowIndex + 1", width: 60 },
      { headerName: "Параметр проверки", field: "parameter", flex: 1 },
      {
        headerName: "Действия",
        field: "actions",
        cellRenderer: (params: { data: ObjectParameter }) => (
          <button onClick={() => onEdit(params.data)}>✏️</button>
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
