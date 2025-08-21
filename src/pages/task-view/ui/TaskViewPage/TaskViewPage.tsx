// src/pages/tasks/ui/TaskViewPage/TaskViewPage.tsx
import { useEffect, useState, useRef } from "react";
import {
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import type {
  ICellRendererParams,
  ValueFormatterParams,
} from "ag-grid-community";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { CustomTable } from "@/widgets/table";
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

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const TaskViewPage = (): JSX.Element => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [objectFilter, setObjectFilter] = useState("");
  const [operatorFilter, setOperatorFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<Dayjs | null>(null);

  const [showObjectModal, setShowObjectModal] = useState(false);
  const [showOperatorModal, setShowOperatorModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const gridRef = useRef<AgGridReact<Task>>(null);
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
  }, [allTasks, objectFilter, operatorFilter, dateFilter]);

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

  const columns = [
    { headerName: "№", valueGetter: "node.rowIndex + 1", width: 70 },
    {
      headerName: "Дата проверки",
      field: "checkDate",
      valueFormatter: (params: ValueFormatterParams<Task, string>) =>
        params.value ? dayjs(params.value).format("DD.MM.YYYY HH:mm") : "—",
      width: 150,
    },
    { headerName: "Объект", field: "objectName", flex: 1, minWidth: 150 },
    { headerName: "Мастер", field: "masterName", width: 150 },
    { headerName: "Оператор", field: "operatorName", width: 150 },
    { headerName: "Статус", field: "status", width: 120 },
    { headerName: "Комментарий", field: "comment", flex: 1, minWidth: 200 },
    {
      headerName: "Действия",
      width: 120,
      cellRenderer: (params: ICellRendererParams<Task, unknown>) =>
        params.data ? (
          <Box display="flex" gap={1}>
            <IconButton
              color="primary"
              size="small"
              onClick={() => navigate(`/task/${params.data!.id}`)}
              title="Открыть"
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="error"
              size="small"
              onClick={() => confirmDelete(params.data!)}
              title="Удалить"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : null,
    },
  ];

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
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Просмотр заданий
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Просмотр задания по проверке объекта филиала
        </Typography>

        <Box display="flex" gap={2} my={2}>
          <Button
            variant={objectFilter ? "contained" : "outlined"}
            onClick={() =>
              objectFilter ? setObjectFilter("") : setShowObjectModal(true)
            }
            startIcon={<EmailIcon />}
          >
            {objectFilter || "Объекты"}
          </Button>
          <Button
            variant={operatorFilter ? "contained" : "outlined"}
            onClick={() =>
              operatorFilter
                ? setOperatorFilter("")
                : setShowOperatorModal(true)
            }
            startIcon={<PersonIcon />}
          >
            {operatorFilter || "Оператор"}
          </Button>
          <Button
            variant={dateFilter ? "contained" : "outlined"}
            onClick={() =>
              dateFilter ? setDateFilter(null) : setShowDateModal(true)
            }
            startIcon={<CalendarTodayIcon />}
          >
            {dateFilter ? dateFilter.format("DD.MM.YYYY") : "Дата"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setObjectFilter("");
              setOperatorFilter("");
              setDateFilter(null);
            }}
            disabled={!objectFilter && !operatorFilter && !dateFilter}
          >
            Сбросить фильтры
          </Button>
        </Box>

        <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
          <CustomTable<Task>
            ref={gridRef}
            rowData={filteredTasks}
            columnDefs={columns}
            getRowId={(task) => task.id.toString()}
            pagination
            pageSize={10}
          />
        </div>

        {/* Модалки фильтров */}
        <Modal open={showObjectModal} onClose={() => setShowObjectModal(false)}>
          <Paper sx={modalStyle}>
            <Typography variant="h6">Фильтрация по объектам</Typography>
            <TextField
              fullWidth
              label="Поле ввода объекта"
              value={objectFilter}
              onChange={(e) => setObjectFilter(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              onClick={() => setShowObjectModal(false)}
            >
              Применить
            </Button>
          </Paper>
        </Modal>

        <Modal
          open={showOperatorModal}
          onClose={() => setShowOperatorModal(false)}
        >
          <Paper sx={modalStyle}>
            <Typography variant="h6">Фильтрация по оператору</Typography>
            <TextField
              fullWidth
              label="Поле ввода оператора"
              value={operatorFilter}
              onChange={(e) => setOperatorFilter(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              onClick={() => setShowOperatorModal(false)}
            >
              Применить
            </Button>
          </Paper>
        </Modal>

        <Modal open={showDateModal} onClose={() => setShowDateModal(false)}>
          <Paper sx={modalStyle}>
            <Typography variant="h6">Фильтрация по дате</Typography>
            <DatePicker
              label="Выберите дату"
              value={dateFilter}
              onChange={(newValue) => setDateFilter(newValue)}
              slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
              format="DD.MM.YYYY"
            />
            <Button variant="contained" onClick={() => setShowDateModal(false)}>
              Применить
            </Button>
          </Paper>
        </Modal>

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
