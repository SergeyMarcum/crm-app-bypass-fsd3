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
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { objectApi } from "@/shared/api/object";
import { ObjectModal } from "@/widgets/object/object-modal";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "sonner";

import type { JSX } from "react";

// Custom SVG Icons matching the users page precisely
const UncheckedCheckboxIcon = () => (
  <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" style={{ color: "#98A2B3" }}>
    <path clipRule="evenodd" d="M8 2C4.68629 2 2 4.68629 2 8V16C2 19.3137 4.68629 22 8 22H16C19.3137 22 22 19.3137 22 16V8C22 4.68629 19.3137 2 16 2H8ZM8 4C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20H16C18.2091 20 20 18.2091 20 16V8C20 5.79086 18.2091 4 16 4H8Z" fill="currentColor" fillRule="evenodd"></path>
  </svg>
);

const CheckedCheckboxIcon = () => (
  <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" style={{ color: "#0079c2" }}>
    <rect width="20" height="20" x="2" y="2" rx="6" fill="currentColor" />
    <path d="M7 12L10 15L17 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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



export function ObjectsPage(): JSX.Element {
  const [objects, setObjects] = useState<ObjectData[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [objectToDelete, setObjectToDelete] = useState<ObjectData | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchObjects = async () => {
    try {
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

  const filteredObjects = useMemo(() => {
    let currentFiltered = [...objects];
    if (nameFilter) {
      currentFiltered = currentFiltered.filter((obj) =>
        obj.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (typeFilter) {
      currentFiltered = currentFiltered.filter((obj) =>
        obj.object_type.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }
    return currentFiltered;
  }, [objects, nameFilter, typeFilter]);

  const paginatedObjects = filteredObjects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedObjects.map((obj) => obj.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = paginatedObjects.map((obj) => obj.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allOnPageSelected =
    paginatedObjects.length > 0 &&
    paginatedObjects.every((obj) => selectedIds.includes(obj.id));

  const handleBulkDelete = async () => {
    if (window.confirm(`Вы уверены, что хотите удалить ${selectedIds.length} выбр. объектов?`)) {
      try {
        await Promise.all(selectedIds.map((id) => objectApi.deleteObject(id)));
        toast.success("Объекты успешно удалены.");
        setSelectedIds([]);
        fetchObjects();
      } catch (err) {
        console.error("Error in bulk delete:", err);
        toast.error("Не удалось удалить некоторые объекты.");
      }
    }
  };

  return (
    <Box p={3} sx={{ backgroundColor: "#FCFDFD", minHeight: "100vh" }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#101828", mb: 0.5 }}>
            Объекты
          </Typography>
          <Typography variant="body1" sx={{ color: "#475467" }}>
            Список объектов указанного филиала
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setAddOpen(true)}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
            px: 2,
            py: 1,
            boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
          }}
        >
          Добавить объект
        </Button>
      </Box>

      {/* Filter inputs */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          alignItems: "center",
          flexWrap: "wrap",
          p: 2,
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          border: "1px solid #EAECF0",
        }}
      >
        <TextField
          size="small"
          label="Объект"
          placeholder="Поиск по названию..."
          value={nameFilter}
          onChange={(e) => {
            setNameFilter(e.target.value);
            setPage(0);
          }}
          sx={{
            minWidth: 220,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              endAdornment: nameFilter && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => { setNameFilter(""); setPage(0); }}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          size="small"
          label="Тип объекта"
          placeholder="Поиск по типу..."
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(0);
          }}
          sx={{
            minWidth: 220,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              endAdornment: typeFilter && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => { setTypeFilter(""); setPage(0); }}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {selectedIds.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="bulk-action-select-label">Действие</InputLabel>
            <Select
              labelId="bulk-action-select-label"
              value=""
              label="Действие"
              displayEmpty
              onChange={(e) => {
                if (e.target.value === "delete") {
                  handleBulkDelete();
                }
              }}
              sx={{
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                  borderWidth: "1.5px",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.dark",
                },
              }}
            >
              <MenuItem value="delete">Удалить записи</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "12px",
          border: "1px solid #EAECF0",
          boxShadow: "0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#F9FAFB" }}>
            <TableRow>
              <TableCell sx={{ borderBottom: "1px solid #EAECF0", pl: 3, pr: 0, py: 2, width: "50px" }}>
                <Checkbox
                  icon={<UncheckedCheckboxIcon />}
                  checkedIcon={<CheckedCheckboxIcon />}
                  indeterminate={selectedIds.length > 0 && !allOnPageSelected}
                  checked={allOnPageSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2, pl: 1, width: "80px" }}>
                №
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2 }}>
                Название
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2 }}>
                Тип объекта
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2 }}>
                Адрес
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2 }}>
                Характеристики
              </TableCell>
              <TableCell align="right" sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2, pr: 3 }}>
                Действия
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedObjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  Объекты не найдены
                </TableCell>
              </TableRow>
            ) : (
              paginatedObjects.map((obj, index) => {
                const serialNumber = page * rowsPerPage + index + 1;
                const isSelected = selectedIds.includes(obj.id);
                return (
                  <TableRow
                    key={obj.id}
                    hover
                    selected={isSelected}
                    sx={{
                      height: "72px",
                      "&.Mui-selected": {
                        backgroundColor: "#F9FAFB",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "#F3F4F6",
                      },
                    }}
                  >
                    {/* Checkbox */}
                    <TableCell sx={{ borderBottom: "1px solid #EAECF0", pl: 3, pr: 0 }}>
                      <Checkbox
                        icon={<UncheckedCheckboxIcon />}
                        checkedIcon={<CheckedCheckboxIcon />}
                        checked={isSelected}
                        onChange={() => handleSelectOne(obj.id)}
                      />
                    </TableCell>

                    {/* № */}
                    <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400, pl: 1 }}>
                      {serialNumber}
                    </TableCell>

                    {/* Название */}
                    <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400 }}>
                      {obj.name || "—"}
                    </TableCell>

                    {/* Тип объекта */}
                    <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400 }}>
                      {obj.object_type || "—"}
                    </TableCell>

                    {/* Адрес */}
                    <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400 }}>
                      {obj.address || "—"}
                    </TableCell>

                    {/* Характеристики */}
                    <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400 }}>
                      {obj.characteristic || "—"}
                    </TableCell>

                    {/* Действия */}
                    <TableCell align="right" sx={{ borderBottom: "1px solid #EAECF0", pr: 3 }}>
                      <Box display="flex" gap={1} justifyContent="flex-end">
                        <IconButton
                          color="primary"
                          size="medium"
                          onClick={() => navigate(`/objects/${obj.id}`)}
                          title="Открыть"
                          sx={{
                            "&:hover": { backgroundColor: "#F2F4F7" },
                            borderRadius: "8px",
                            p: 1,
                          }}
                        >
                          <ArrowForwardIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="medium"
                          onClick={() => {
                            setObjectToDelete(obj);
                            setDeleteDialogOpen(true);
                          }}
                          title="Удалить"
                          sx={{
                            "&:hover": { backgroundColor: "#FFF1F2" },
                            borderRadius: "8px",
                            p: 1,
                          }}
                        >
                          <DeleteIcon fontSize="small" sx={{ color: "#D92D20" }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Table Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredObjects.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Объектов на странице:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} из ${count}`}
          sx={{
            borderTop: "1px solid #EAECF0",
            color: "#475467",
            fontSize: "14px",
            "& .MuiTablePagination-selectLabel": {
              color: "#475467",
            },
            "& .MuiTablePagination-displayedRows": {
              color: "#475467",
            },
          }}
        />
      </TableContainer>

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
