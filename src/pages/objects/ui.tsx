// src/pages/objects/ui.tsx
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  Stack,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CustomTable, FilterDefinition } from "@/widgets/table";
import { objectApi } from "@/shared/api/object";
import { ObjectModal } from "@/widgets/object-modal";
import type { JSX } from "react";
import type { AgGridReact } from "ag-grid-react";
import { useTableStore } from "@/widgets/table/model/store";

interface ObjectData {
  id: number;
  name: string;
  address: string;
  object_type: string;
  characteristic: string;
}

const filterDefinitions: FilterDefinition<ObjectData>[] = [
  { key: "name", label: "Объекты" },
  { key: "object_type", label: "Тип объекта" },
];

export function ObjectsPage(): JSX.Element {
  const [objects, setObjects] = useState<ObjectData[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const { resetFilters } = useTableStore();

  const fetchObjects = async () => {
    try {
      const data = await objectApi.getAllDomainObjects();
      setObjects(data);
    } catch (err) {
      console.error("Ошибка при загрузке объектов", err);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, []);

  const columns = [
    { headerName: "#", valueGetter: "node.rowIndex + 1", width: 60 },
    { headerName: "Название", field: "name", flex: 1 },
    { headerName: "Тип объекта", field: "object_type", flex: 1 },
    { headerName: "Адрес", field: "address", flex: 1.5 },
    { headerName: "Характеристики", field: "characteristic", flex: 1.5 },
    {
      headerName: "Детали",
      field: "actions",
      width: 80,
      cellRenderer: (params: { data: ObjectData }) => (
        <Button
          onClick={() => {
            // handle navigation to object view
          }}
        >
          →
        </Button>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Объекты
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Список объектов указанного филиала
      </Typography>

      <Box display="flex" justifyContent="space-between" my={2}>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={() => {
              // Фильтрация через table
            }}
          >
            Объекты
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              // Фильтрация через table
            }}
          >
            Тип объекта
          </Button>

          <Button variant="outlined" onClick={() => resetFilters()}>
            Сбросить фильтры
          </Button>
        </Box>

        <Button variant="contained" onClick={() => setAddOpen(true)}>
          Добавить объект
        </Button>
      </Box>

      <CustomTable<ObjectData>
        rowData={objects}
        columnDefs={columns}
        getRowId={(row) => row.id.toString()}
        filters={filterDefinitions}
        pageSize={15}
      />

      <ObjectModal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          fetchObjects();
        }}
      />
    </Box>
  );
}
