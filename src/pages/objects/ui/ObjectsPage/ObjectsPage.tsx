// src/pages/objects/ui/ObjectsPage/ObjectsPage.tsx
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CustomTable, FilterDefinition } from "@/widgets/table";
import { objectApi } from "@/shared/api/object";
import { ObjectModal } from "@/widgets/object/object-modal";
import { useNavigate } from "react-router-dom";
import DomainIcon from "@mui/icons-material/Domain";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import DeleteIcon from "@mui/icons-material/Delete";

import type { JSX } from "react";

// Существующий интерфейс для состояния компонента
interface ObjectData {
  id: number;
  name: string;
  address: string;
  object_type: string;
  characteristic: string;
}

// Новый интерфейс, точно отражающий структуру данных из Postman,
// чтобы избежать ошибки компилятора. Мы будем использовать его для преобразования.
interface DomainObjectApiResponse {
  full_name: string | null;
  name: string;
  address: string;
  object_type_text: string | null;
  id: number;
  characteristic: string | null;
  object_type_id: number | null;
  domain: string;
}

const filterDefinitions: FilterDefinition<ObjectData>[] = [
  { key: "name", label: "Объекты", icon: <DomainIcon /> },
  { key: "object_type", label: "Тип объекта", icon: <HolidayVillageIcon /> },
];

export function ObjectsPage(): JSX.Element {
  const [objects, setObjects] = useState<ObjectData[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [objectToDelete, setObjectToDelete] = useState<ObjectData | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const fetchObjects = async () => {
    try {
      // Убрано явное типизирование, чтобы избежать ошибки компилятора.
      // TypeScript выведет тип автоматически, а мы будем полагаться
      // на структуру, которую мы знаем из Postman.
      const data = await objectApi.getAllDomainObjects();

      if (!Array.isArray(data)) {
        if (
          typeof data === "object" &&
          data !== null &&
          "status" in data &&
          "message" in data
        ) {
          console.error(
            "Ошибка API при загрузке объектов:",
            (data as { message: string }).message
          );
        } else {
          console.error(
            "API /all-domain-objects вернул не массив или непредвиденный формат:",
            data
          );
        }
        setObjects([]);
        return;
      }

      // Явно приводим каждый элемент к нашему новому интерфейсу,
      // чтобы получить доступ к полю object_type_text
      const transformed: ObjectData[] = (data as DomainObjectApiResponse[]).map(
        (item) => ({
          id: item.id,
          name: item.name,
          address: item.address,
          object_type: item.object_type_text || "—",
          characteristic: item.characteristic || "—",
        })
      );

      setObjects(transformed);
    } catch (err) {
      console.error("Ошибка при загрузке объектов", err);
      setObjects([]);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, []);

  const handleDelete = async () => {
    if (!objectToDelete) return;

    setDeleteLoading(true);
    try {
      await objectApi.deleteObject(objectToDelete.id);
      setObjects((prev) => prev.filter((obj) => obj.id !== objectToDelete.id));
    } catch (err) {
      console.error("Ошибка при удалении объекта", err);
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setObjectToDelete(null);
    }
  };

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
        <Button onClick={() => navigate(`/objects/${params.data.id}`)}>
          →
        </Button>
      ),
    },
    {
      headerName: "Удалить",
      width: 100,
      cellRenderer: (params: { data: ObjectData }) => (
        <IconButton
          color="error"
          size="small"
          onClick={() => {
            setObjectToDelete(params.data);
            setDeleteDialogOpen(true);
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
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

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Подтвердите удаление</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {objectToDelete ? `Удалить объект "${objectToDelete.name}"?` : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteLoading}
          >
            Отмена
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? "Удаление..." : "Удалить"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
