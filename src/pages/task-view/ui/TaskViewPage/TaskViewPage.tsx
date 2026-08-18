// src/pages/tasks/ui/TaskViewPage/TaskViewPage.tsx
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TablePagination,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { api } from "@/shared/api/axios";
import { getAuthParams } from "@/shared/lib/auth";
import type { JSX } from "react";

interface BackendTask {
  id: number;
  date_time: string;
  object_name: string | null;
  manager_name: string | null;
  user_name: string | null;
  checking_type_text: string;
  comment: string | null;
  object_characteristic: string | null;
}

interface Task {
  id: number;
  checkDate: string;
  objectName: string;
  masterName: string;
  operatorName: string;
  status: string;
  comment: string | null;
}

const getDomainTasks = async (): Promise<Task[]> => {
  const params = getAuthParams();
  const { data } = await api.get<BackendTask[]>("/domain-tasks", { params });

  return data.map((bt) => ({
    id: bt.id,
    checkDate: bt.date_time,
    objectName: bt.object_name ?? "Неизвестен",
    masterName: bt.manager_name ?? "Неизвестен",
    operatorName: bt.user_name ?? "Неизвестен",
    status: bt.checking_type_text || "Неизвестен",
    comment: bt.comment ?? bt.object_characteristic ?? "Нет комментария",
  }));
};

const deleteTaskApi = async (id: number): Promise<void> => {
  const params = getAuthParams();
  await api.delete("/delete-task", {
    params,
    data: { id },
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const renderStatusChip = (statusText: string | null) => {
  if (!statusText) {
    return <Chip label="—" variant="outlined" size="small" />;
  }

  const text = statusText.trim().toLowerCase();

  if (text.includes("выполнено") || text.includes("завершено") || text.includes("проверено") || text.includes("успешно")) {
    return (
      <Chip
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#10B981" viewBox="0 0 256 256" style={{ marginLeft: 8 }}>
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        }
        label={statusText}
        variant="outlined"
        size="small"
        sx={{
          borderColor: "#A7F3D0",
          color: "#047857",
          backgroundColor: "#ECFDF5",
          fontWeight: 500,
          "& .MuiChip-label": { paddingLeft: "6px" },
        }}
      />
    );
  }

  if (text.includes("просрочено") || text.includes("отменено") || text.includes("ошибка") || text.includes("замечания")) {
    return (
      <Chip
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#EF4444" viewBox="0 0 256 256" style={{ marginLeft: 8 }}>
            <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"></path>
          </svg>
        }
        label={statusText}
        variant="outlined"
        size="small"
        sx={{
          borderColor: "#FCA5A5",
          color: "#B91C1C",
          backgroundColor: "#FEF2F2",
          fontWeight: 500,
          "& .MuiChip-label": { paddingLeft: "6px" },
        }}
      />
    );
  }

  return (
    <Chip
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#F59E0B" viewBox="0 0 256 256" style={{ marginLeft: 8 }}>
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z"></path>
        </svg>
      }
      label={statusText}
      variant="outlined"
      size="small"
      sx={{
        borderColor: "#FDE68A",
        color: "#B45309",
        backgroundColor: "#FFFBEB",
        fontWeight: 500,
        "& .MuiChip-label": { paddingLeft: "6px" },
      }}
    />
  );
};

export const TaskViewPage = (): JSX.Element => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [objectFilter, setObjectFilter] = useState("");
  const [operatorFilter, setOperatorFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<dayjs.Dayjs | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const navigate = useNavigate();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await getDomainTasks();
        setAllTasks(tasksData);
        setFilteredTasks(tasksData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ошибка загрузки заданий"
        );
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    let currentFiltered = [...allTasks];
    if (objectFilter) {
      currentFiltered = currentFiltered.filter((t) =>
        t.objectName.toLowerCase().includes(objectFilter.toLowerCase())
      );
    }
    if (operatorFilter) {
      currentFiltered = currentFiltered.filter((t) =>
        t.operatorName.toLowerCase().includes(operatorFilter.toLowerCase())
      );
    }
    if (dateFilter) {
      currentFiltered = currentFiltered.filter((t) =>
        dayjs(t.checkDate).isSame(dateFilter, "day")
      );
    }
    setFilteredTasks(currentFiltered);
    setPage(0);
  }, [allTasks, objectFilter, operatorFilter, dateFilter]);

  const paginatedTasks = filteredTasks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const confirmDelete = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    if (deleteLoading) return;
    setTaskToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handlePerformDelete = async () => {
    if (!taskToDelete || deleteLoading) return;

    setDeleteLoading(true);
    const taskId = taskToDelete.id;

    try {
      // Оптимистичное обновление
      setAllTasks((prev) => prev.filter((t) => t.id !== taskId));
      setFilteredTasks((prev) => prev.filter((t) => t.id !== taskId));

      await deleteTaskApi(taskId);

      setSnackbarMessage(`Задание #${taskId} успешно удалено`);
      setSnackbarSeverity("success");
    } catch (err) {
      // Откат оптимистичного обновления
      setAllTasks((prev) => [...prev, taskToDelete]);
      setFilteredTasks((prev) => [...prev, taskToDelete]);

      const errorMessage =
        err instanceof Error
          ? `Ошибка удаления: ${err.message}`
          : "Неизвестная ошибка при удалении задания";

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } finally {
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
      setDeleteLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);



  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
        <Typography variant="h6" ml={2}>
          Загрузка заданий...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography variant="h5" color="error">
          Ошибка: {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Повторить
        </Button>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={3} sx={{ backgroundColor: "#FCFDFD", minHeight: "100vh" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#101828", mb: 0.5 }}>
          Просмотр заданий
        </Typography>
        <Typography variant="body1" sx={{ color: "#475467", mb: 3 }}>
          Просмотр задания по проверке объекта филиала
        </Typography>

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
            placeholder="Поиск по объекту..."
            value={objectFilter}
            onChange={(e) => setObjectFilter(e.target.value)}
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
                endAdornment: objectFilter && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setObjectFilter("")}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            size="small"
            label="Оператор"
            placeholder="Поиск по оператору..."
            value={operatorFilter}
            onChange={(e) => setOperatorFilter(e.target.value)}
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
                endAdornment: operatorFilter && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setOperatorFilter("")}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <DatePicker
            label="Дата"
            value={dateFilter}
            onChange={(newValue) => setDateFilter(newValue)}
            format="DD.MM.YYYY"
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  minWidth: 220,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                },
                placeholder: "Выберите дату...",
              },
            }}
          />
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
                <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2, pl: 3 }}>
                  №
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2 }}>
                  Дата проверки
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2 }}>
                  Объект
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2 }}>
                  Мастер
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2 }}>
                  Оператор
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2 }}>
                  Статус
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2 }}>
                  Комментарий
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2, pr: 3 }}>
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    Задания не найдены
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTasks.map((task, index) => {
                  const serialNumber = page * rowsPerPage + index + 1;
                  return (
                    <TableRow
                      key={task.id}
                      hover
                      sx={{
                        height: "72px",
                        "&:hover": {
                          backgroundColor: "#F9FAFB",
                        },
                      }}
                    >
                      {/* № */}
                      <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400, pl: 3 }}>
                        {serialNumber}
                      </TableCell>

                      {/* Дата проверки */}
                      <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400 }}>
                        {task.checkDate ? dayjs(task.checkDate).format("DD.MM.YYYY HH:mm") : "—"}
                      </TableCell>

                      {/* Объект */}
                      <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400 }}>
                        {task.objectName || "—"}
                      </TableCell>

                      {/* Мастер */}
                      <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400 }}>
                        {task.masterName || "—"}
                      </TableCell>

                      {/* Оператор */}
                      <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400 }}>
                        {task.operatorName || "—"}
                      </TableCell>

                      {/* Статус */}
                      <TableCell sx={{ borderBottom: "1px solid #EAECF0" }}>
                        {renderStatusChip(task.status)}
                      </TableCell>

                      {/* Комментарий */}
                      <TableCell
                        sx={{
                          borderBottom: "1px solid #EAECF0",
                          color: "#475467",
                          fontWeight: 400,
                          maxWidth: "300px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={task.comment || ""}
                      >
                        {task.comment || "—"}
                      </TableCell>

                      {/* Действия */}
                      <TableCell align="right" sx={{ borderBottom: "1px solid #EAECF0", pr: 3 }}>
                        <Box display="flex" gap={1} justifyContent="flex-end">
                          <IconButton
                            color="primary"
                            size="medium"
                            onClick={() => navigate(`/task/${task.id}`)}
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
                            color="error"
                            size="medium"
                            onClick={() => confirmDelete(task)}
                            title="Удалить"
                            sx={{
                              "&:hover": { backgroundColor: "#F2F4F7" },
                              borderRadius: "8px",
                              p: 1,
                            }}
                          >
                            <DeleteIcon fontSize="small" />
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
            count={filteredTasks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Заданий на странице:"
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} из ${count}`}
            sx={{ borderTop: "1px solid #EAECF0" }}
          />
        </TableContainer>

        {/* Диалог удаления */}
        <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
          <DialogTitle>Подтвердите удаление</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {taskToDelete
                ? `Удалить задание #${taskToDelete.id} — "${taskToDelete.objectName}"?`
                : ""}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} disabled={deleteLoading}>
              Отмена
            </Button>
            <Button
              onClick={handlePerformDelete}
              color="error"
              variant="contained"
              disabled={deleteLoading}
              startIcon={
                deleteLoading ? <CircularProgress size={20} /> : undefined
              }
            >
              {deleteLoading ? "Удаление..." : "Удалить"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};
