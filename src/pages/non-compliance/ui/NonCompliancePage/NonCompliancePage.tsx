import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
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
import { toast } from "sonner";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import { nonComplianceApi } from "@/shared/api/non-compliance";
import { AddNewNonComplianceModal } from "@/widgets/non-compliance/add-new-non-compliance-modal";
import { EditNonComplianceModal } from "@/widgets/non-compliance/edit-non-compliance-modal";

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

const EditPencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" style={{ color: "#475467" }}>
    <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
  </svg>
);

export const NonCompliancePage = () => {
  const queryClient = useQueryClient();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editNonCompliance, setEditNonCompliance] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Запрос для получения списка несоответствий
  const {
    data: nonCompliances = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["nonCompliances"],
    queryFn: async () => {
      const data = await nonComplianceApi.getAllNonCompliances();
      console.log("Raw response from /cases-of-non-compliance:", data);
      if (!Array.isArray(data)) {
        console.error(
          "Expected array from /cases-of-non-compliance, got:",
          data
        );
        throw new Error("Invalid response format: Expected array");
      }
      return data.map((nc: { id: number; name: string }) => ({
        id: nc.id,
        nonComplianceName: nc.name,
      }));
    },
  });

  // Мутация для удаления несоответствия
  const deleteMutation = useMutation({
    mutationFn: nonComplianceApi.deleteNonCompliance,
    onSuccess: () => {
      toast.success("Несоответствие успешно удалено.");
      queryClient.invalidateQueries({ queryKey: ["nonCompliances"] });
    },
    onError: (error) => {
      console.error("Error deleting non-compliance:", error);
      toast.error("Не удалось удалить несоответствие. Попробуйте позже.");
    },
  });

  const handleEdit = (id: number, name: string) => {
    setEditNonCompliance({ id, name });
    setEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить это несоответствие?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredNonCompliances = useMemo(() => {
    if (!filterText) return nonCompliances;
    return nonCompliances.filter((nc) =>
      nc.nonComplianceName.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [nonCompliances, filterText]);

  const paginatedNonCompliances = filteredNonCompliances.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedNonCompliances.map((nc) => nc.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = paginatedNonCompliances.map((nc) => nc.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allOnPageSelected =
    paginatedNonCompliances.length > 0 &&
    paginatedNonCompliances.every((nc) => selectedIds.includes(nc.id));

  const handleBulkDelete = async () => {
    if (window.confirm(`Вы уверены, что хотите удалить ${selectedIds.length} выбр. несоответствий?`)) {
      try {
        await Promise.all(selectedIds.map((id) => nonComplianceApi.deleteNonCompliance(id)));
        toast.success("Несоответствия успешно удалены.");
        setSelectedIds([]);
        queryClient.invalidateQueries({ queryKey: ["nonCompliances"] });
      } catch (err) {
        console.error("Error in bulk delete:", err);
        toast.error("Не удалось удалить некоторые несоответствия.");
      }
    }
  };

  if (error) {
    toast.error(
      "Не удалось загрузить список несоответствий. Попробуйте позже."
    );
  }

  return (
    <Box sx={{ backgroundColor: "#FCFDFD", height: "calc(100vh - 112px)", display: "flex", flexDirection: "column", boxSizing: "border-box", p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#101828", mb: 0.5 }}>
            Список несоответствий
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Главная / Объекты / Список несоответствий
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setAddModalOpen(true)}
          startIcon={<AddIcon />}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
            px: 2,
            py: 1,
            boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
          }}
        >
          Добавить
        </Button>
      </Box>

      {/* Inline Filters */}
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
          label="Несоответствие"
          placeholder="Поиск по наименованию..."
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setPage(0);
          }}
          sx={{
            minWidth: 280,
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
              endAdornment: filterText && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => { setFilterText(""); setPage(0); }}>
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
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
          <Table stickyHeader sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#F9FAFB", borderBottom: "1px solid #EAECF0", pl: 3, pr: 0, py: 2, width: "50px" }}>
                  <Checkbox
                    icon={<UncheckedCheckboxIcon />}
                    checkedIcon={<CheckedCheckboxIcon />}
                    indeterminate={selectedIds.length > 0 && !allOnPageSelected}
                    checked={allOnPageSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
                <TableCell sx={{ backgroundColor: "#F9FAFB", borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2, pl: 1, width: "80px" }}>
                  №
                </TableCell>
                <TableCell sx={{ backgroundColor: "#F9FAFB", borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2 }}>
                  Наименование несоответствия
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: "#F9FAFB", borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2, pr: 3, width: "150px" }}>
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    Загрузка...
                  </TableCell>
                </TableRow>
              ) : paginatedNonCompliances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    Несоответствия не найдены
                  </TableCell>
                </TableRow>
              ) : (
                paginatedNonCompliances.map((nc, index) => {
                  const serialNumber = page * rowsPerPage + index + 1;
                  const isSelected = selectedIds.includes(nc.id);
                  return (
                    <TableRow
                      key={nc.id}
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
                          onChange={() => handleSelectOne(nc.id)}
                        />
                      </TableCell>

                      {/* # */}
                      <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400, pl: 1 }}>
                        {serialNumber}
                      </TableCell>

                      {/* Наименование несоответствия */}
                      <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400 }}>
                        {nc.nonComplianceName || "—"}
                      </TableCell>

                      {/* Действия */}
                      <TableCell align="right" sx={{ borderBottom: "1px solid #EAECF0", pr: 3 }}>
                        <Box display="flex" gap={1} justifyContent="flex-end">
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleEdit(nc.id, nc.nonComplianceName)}
                            sx={{
                              "&:hover": { backgroundColor: "#F2F4F7" },
                              borderRadius: "8px",
                              p: 1,
                            }}
                          >
                            <EditPencilIcon />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDelete(nc.id)}
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
        </Box>

        {/* Table Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredNonCompliances.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => {
            setPage(newPage);
          }}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Несоответствий на странице:"
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

      <AddNewNonComplianceModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => {
          setAddModalOpen(false);
          toast.success("Несоответствие успешно добавлено.");
          queryClient.invalidateQueries({ queryKey: ["nonCompliances"] });
        }}
      />

      <EditNonComplianceModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => {
          setEditModalOpen(false);
          toast.success("Несоответствие успешно обновлено.");
          queryClient.invalidateQueries({ queryKey: ["nonCompliances"] });
        }}
        nonComplianceId={editNonCompliance?.id ?? 0}
        nonComplianceName={editNonCompliance?.name ?? ""}
      />
    </Box>
  );
};
