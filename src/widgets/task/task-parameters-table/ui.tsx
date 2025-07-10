// src/widgets/task/task-parameters-table/ui.tsx
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useMemo } from "react";

interface Parameter {
  id: number;
  name: string;
  status: string | null;
}

interface TaskParametersTableProps {
  parameters: Parameter[];
}

const TaskParametersTable = ({ parameters }: TaskParametersTableProps) => {
  const columnDefs = useMemo(
    () => [
      { headerName: "№", valueGetter: "node.rowIndex + 1", width: 50 },
      { headerName: "Наименование параметра проверки", field: "name", flex: 1 },
      { headerName: "Статус", field: "status", width: 150 },
    ],
    []
  );

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={parameters}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        // ... другие опции ag-grid
      />
    </div>
  );
};

export default TaskParametersTable;
