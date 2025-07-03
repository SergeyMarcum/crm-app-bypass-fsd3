// src/pages/objects/ui.tsx
import { Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { CustomTable, FilterDefinition } from "@/widgets/table";
import { objectApi } from "@/shared/api/object";
import { ObjectModal } from "@/widgets/object-modal";
import type { JSX } from "react";

import type { DomainObject } from "@/entities/object/types";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const fetchObjects = async () => {
    try {
      const data: DomainObject[] = await objectApi.getAllDomainObjects();

      const transformed: ObjectData[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        address: item.address,
        object_type: item.type_name || "—",
        characteristic: item.characteristic || "—",
      }));

      setObjects(transformed);
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
      cellRenderer: (_params: { data: ObjectData }) => (
        <Button onClick={() => navigate(`/objects/${_params.data.id}`)}>
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

      <Box display="flex" justifyContent="end" my={2}>
        <Button variant="contained" onClick={() => setAddOpen(true)}>
          Добавить объект
        </Button>
      </Box>

      <CustomTable<ObjectData>
        rowData={objects}
        columnDefs={columns}
        getRowId={(row) => row.id.toString()}
        filters={filterDefinitions}
        pageSize={20}
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
