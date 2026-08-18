import { useEffect, useState, useMemo } from "react";
import { Box, Typography, Button, TextField, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import {
  useMutation,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { AddNewParameterModal } from "@/widgets/parameters/add-new-parameter-modal";
import { EditParameterModal } from "@/widgets/parameters/edit-parameter-modal";
import type { ObjectParameter } from "@/widgets/object-type/object-type-table/types";

import { parameterApi } from "@/shared/api/parameter";
import { ParametersTable } from "@/widgets/parameters/parameters-table";

export const ParametersPage = () => {
  const [parameters, setParameters] = useState<ObjectParameter[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editParam, setEditParam] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [paramFilter, setParamFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchParameters = async () => {
    const all = await parameterApi.getAllParameters();

    setParameters(
      all.map((p: { id: number; name: string }) => ({
        id: p.id,
        parameter: p.name,
      }))
    );
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  const deleteMutation = useMutation({
    mutationFn: parameterApi.deleteParameter,
    onSuccess: () => {
      toast.success("Параметр успешно удален.");
      fetchParameters();
    },
    onError: (error) => {
      console.error("Error deleting parameter:", error);
      toast.error("Не удалось удалить параметр. Попробуйте позже.");
    },
  });

  const handleEdit = (param: ObjectParameter) => {
    setEditParam({ id: param.id, name: param.parameter });
    setEditOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот параметр?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredParameters = useMemo(() => {
    if (!paramFilter) return parameters;
    return parameters.filter((p) =>
      p.parameter.toLowerCase().includes(paramFilter.toLowerCase())
    );
  }, [parameters, paramFilter]);

  const paginatedParameters = filteredParameters.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedParameters.map((p) => p.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = paginatedParameters.map((p) => p.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allOnPageSelected =
    paginatedParameters.length > 0 &&
    paginatedParameters.every((p) => selectedIds.includes(p.id));

  const handleBulkDelete = async () => {
    if (window.confirm(`Вы уверены, что хотите удалить ${selectedIds.length} выбр. параметров?`)) {
      try {
        await Promise.all(selectedIds.map((id) => parameterApi.deleteParameter(id)));
        toast.success("Параметры успешно удалены.");
        setSelectedIds([]);
        fetchParameters();
      } catch (err) {
        console.error("Error in bulk delete:", err);
        toast.error("Не удалось удалить некоторые параметры.");
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: "#FCFDFD", height: "calc(100vh - 112px)", display: "flex", flexDirection: "column", boxSizing: "border-box", p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#101828", mb: 0.5 }}>
            Список параметров
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Главная / Объекты / Список параметров
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setAddOpen(true)}
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
          label="Параметр проверки"
          placeholder="Поиск по параметру..."
          value={paramFilter}
          onChange={(e) => {
            setParamFilter(e.target.value);
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
              endAdornment: paramFilter && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => { setParamFilter(""); setPage(0); }}>
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

      <ParametersTable
        parameters={paginatedParameters}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={page}
        rowsPerPage={rowsPerPage}
        count={filteredParameters.length}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        selectedIds={selectedIds}
        onSelectOne={handleSelectOne}
        onSelectAll={handleSelectAll}
        allOnPageSelected={allOnPageSelected}
      />

      <AddNewParameterModal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          fetchParameters();
        }}
      />
      <EditParameterModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          fetchParameters();
        }}
        parameterId={editParam?.id ?? 0}
        parameterName={editParam?.name ?? ""}
      />
    </Box>
  );
};
