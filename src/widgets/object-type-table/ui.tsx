// src/widgets/object-type-table/ui.tsx
import { CustomTable } from "@/widgets/table";
import type { ObjectParameter } from "./types";

type Props = {
  parameters: ObjectParameter[];
  onEdit: (param: ObjectParameter) => void;
};

export function ObjectTypeTable({ parameters, onEdit }: Props) {
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
        <button onClick={() => onEdit(params.data)}>✏️</button>
      ),
      width: 100,
    },
  ];

  return (
    <CustomTable<ObjectParameter>
      rowData={parameters}
      columnDefs={columns}
      getRowId={(row) => row.id.toString()}
      filters={[]}
    />
  );
}
