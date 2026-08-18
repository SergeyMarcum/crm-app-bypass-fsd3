// src/widgets/object-type/object-type-table/ui.tsx
import { forwardRef, useState, useMemo, useEffect } from "react";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  InputAdornment,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "sonner";

import type { ObjectParameter } from "./types";
import type { AgGridReact } from "ag-grid-react";
import { objectTypeApi } from "@/shared/api/object-type";

type Props = {
  parameters: ObjectParameter[];
  onEdit: (param: ObjectParameter) => void;
  onDelete: (paramId: number) => void;
  objectTypeId: number;
  onRefresh: () => void;
};

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

export const ObjectTypeTable = forwardRef<AgGridReact, Props>(
  ({ parameters, onEdit, onDelete, objectTypeId, onRefresh }, _ref) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Reset page and selection when parameters change (e.g. when changing selected object type)
    useEffect(() => {
      setPage(0);
      setSelectedIds([]);
    }, [parameters]);

    // Local search filter
    const filtered = useMemo(() => {
      if (!searchQuery) return parameters;
      return parameters.filter((p) =>
        (p.parameter || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [parameters, searchQuery]);

    // Local pagination
    const paginated = useMemo(() => {
      return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [filtered, page, rowsPerPage]);

    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        const pageIds = paginated.map((p) => p.id);
        setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
      } else {
        const pageIds = paginated.map((p) => p.id);
        setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
      }
    };

    const handleSelectOne = (id: number) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    };

    const allOnPageSelected =
      paginated.length > 0 &&
      paginated.every((p) => selectedIds.includes(p.id));

    const handleBulkDelete = async () => {
      if (!objectTypeId) return;
      if (window.confirm(`Вы уверены, что хотите удалить ${selectedIds.length} выбр. параметров?`)) {
        try {
          await Promise.all(
            selectedIds.map((id) =>
              objectTypeApi.deleteObjectTypeParameter(objectTypeId, id)
            )
          );
          toast.success("Параметры успешно удалены.");
          setSelectedIds([]);
          onRefresh();
        } catch (err) {
          console.error("Error in bulk delete parameters:", err);
          toast.error("Не удалось удалить некоторые параметры.");
        }
      }
    };

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}>
        {/* Inline Filters */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
            p: 2,
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            border: "1px solid #EAECF0",
            mb: 3,
          }}
        >
          <TextField
            size="small"
            label="Параметр проверки"
            placeholder="Поиск по параметру..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            sx={{
              minWidth: 260,
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
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => { setSearchQuery(""); setPage(0); }}>
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
                  Параметр проверки
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2, pr: 3, width: "150px" }}>
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    Параметры не найдены
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((param, index) => {
                  const serialNumber = page * rowsPerPage + index + 1;
                  const isSelected = selectedIds.includes(param.id);
                  return (
                    <TableRow
                      key={param.id}
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
                          onChange={() => handleSelectOne(param.id)}
                        />
                      </TableCell>

                      {/* № */}
                      <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400, pl: 1 }}>
                        {serialNumber}
                      </TableCell>

                      {/* Параметр проверки */}
                      <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400 }}>
                        {param.parameter || "—"}
                      </TableCell>

                      {/* Действия */}
                      <TableCell align="right" sx={{ borderBottom: "1px solid #EAECF0", pr: 3 }}>
                        <Box display="flex" gap={1} justifyContent="flex-end">
                          <IconButton
                            aria-label="edit"
                            onClick={() => onEdit(param)}
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
                            onClick={() => onDelete(param.id)}
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Параметров на странице:"
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
      </Box>
    );
  }
);
