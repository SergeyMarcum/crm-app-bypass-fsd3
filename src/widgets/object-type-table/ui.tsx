// src/widgets/object-type-table/ui.tsx
import { CustomTable, FilterDefinition } from "@/widgets/table";
import type { ObjectParameter } from "./types";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@mui/material";
import { FilterAlt } from "@mui/icons-material";
import { useRef } from "react";
import type { JSX } from "react";

type Props = {
  data: ObjectParameter[];
  onEdit: (param: ObjectParameter) => void;
};

export const ObjectTypeTable = ({ data, onEdit }: Props): JSX.Element => {
  const ref = useRef<AgGridReact<ObjectParameter>>(null);

  const filterDefinitions: FilterDefinition<ObjectParameter>[] = [
    { key: "parameter", label: "Параметр проверки", icon: <FilterAlt /> },
  ];

  const columns = [
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      width: 60,
    },
    {
      headerName: "Наименование параметра",
      field: "parameter",
      flex: 1,
    },
    {
      headerName: "Действия",
      field: "actions",
      cellRenderer: (params: { data: ObjectParameter }) => (
        <Button size="small" onClick={() => onEdit(params.data)}>
          ✏️
        </Button>
      ),
      width: 120,
    },
  ];

  return (
    <CustomTable<ObjectParameter>
      ref={ref}
      rowData={data}
      columnDefs={columns}
      getRowId={(row) => row.id.toString()}
      filters={filterDefinitions}
    />
  );
};
