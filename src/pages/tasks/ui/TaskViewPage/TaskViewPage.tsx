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
  CircularProgress, // For loading indicator
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
import { useNavigate } from "react-router-dom";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

import { CustomTable } from "@/widgets/table";
import type { JSX } from "react";

// --- Interfaces for Task Data (Updated to match backend response) ---
interface BackendTask {
  id: number;
  date_time: string; // "2025-07-12T10:04:51"
  user_email: string; // "frontend@test.ru"
  manager_email: string; // "operator1@test.com"
  manager_phone: string | null;
  date_time_report_loading: string | null;
  manager_department: string; // "ПТО"
  date_time_previous_check: string | null;
  user_position: string; // "Разработчик"
  user_phone: string | null;
  object_id: number;
  object_name: string; // "2ТСН"
  user_department: string; // "ОСЭиРЛИУС"
  object_full_name: string | null;
  manager_id: number;
  shift_id: number;
  object_address: string; // "ОРУ-110 кВ ГПП-1"
  user_id: number;
  user_name: string; // "frontend" (operator name)
  checking_type_id: number;
  checking_type_text: string; // "Первичная" (can be used for check type/status)
  object_characteristic: string | null;
  manager_name: string; // "sharin" (master name)
  manager_position: string; // "Инженер"
  domain: string;
  date_for_search: string; // "2025-07-12"
}

// Our internal Task interface for the UI, derived from BackendTask
interface Task {
  id: number;
  checkDate: string; // maps to date_time or date_for_search
  objectName: string; // maps to object_name
  masterName: string; // maps to manager_name
  operatorName: string; // maps to user_name
  status: string; // To be derived or mocked, as not directly in API example
  comment: string | null; // To be derived or mocked, as not directly in API example
  // Additional fields from backend if needed for other purposes, e.g., for task detail page
  originalBackendData: BackendTask; // Store original data for full detail or debugging
}

// --- API Calls ---
const BASE_URL = "http://192.168.1.240:82";

const getDomainTasks = async (
  domain: string,
  username: string,
  sessionCode: string
): Promise<Task[]> => {
  try {
    const url = `${BASE_URL}/domain-tasks?domain=${domain}&username=${username}&session_code=${sessionCode}`;
    const response = await fetch(url);

    if (!response.ok) {
      // Attempt to read error message from response body if available
      const errorBody = await response.text();
      throw new Error(
        `Ошибка HTTP: ${response.status} - ${errorBody || response.statusText}`
      );
    }

    const backendTasks: BackendTask[] = await response.json();

    // Map backend response to our Task interface
    const tasks: Task[] = backendTasks.map((bt) => ({
      id: bt.id,
      checkDate: bt.date_time, // Or bt.date_for_search if that's the intended display date
      objectName: bt.object_name,
      masterName: bt.manager_name,
      operatorName: bt.user_name,
      // Status and comment are not explicitly in the provided backend example for domain-tasks.
      // You'll need to adjust this logic if they are provided by another API or derived.
      status: "Неизвестен", // Placeholder/mock status
      comment: bt.object_characteristic || "Нет комментария", // Using object_characteristic as a placeholder for comment if available
      originalBackendData: bt, // Keep original data for future use
    }));

    return tasks;
  } catch (err: unknown) {
    // Changed 'any' to 'unknown'
    let errorMessage = "Неизвестная ошибка";
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === "string") {
      errorMessage = err;
    } else {
      errorMessage = JSON.stringify(err);
    }
    console.error("Ошибка при получении заданий из бэкенда:", err);
    throw new Error(`Не удалось загрузить задания: ${errorMessage}`); // Re-throw with a structured error
  }
};
// --- End API Calls ---

const modalStyle = {
  position: "absolute" as "absolute",
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

  // Filter states
  const [objectFilter, setObjectFilter] = useState<string>("");
  const [operatorFilter, setOperatorFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<Dayjs | null>(null);

  // Modal visibility states
  const [showObjectModal, setShowObjectModal] = useState(false);
  const [showOperatorModal, setShowOperatorModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  const gridRef = useRef<AgGridReact<Task>>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      setError(null);
      // !!! IMPORTANT: Replace these with actual dynamic values from your auth system !!!
      const domain = "orenburg";
      const username = "frontend";
      const sessionCode = "IwzhCkoA1QLRpH2fHuOMo0wRyhUk0xe-ZDf8aQrE-lw"; // Example session code

      try {
        const tasksData = await getDomainTasks(domain, username, sessionCode);
        setAllTasks(tasksData);
        setFilteredTasks(tasksData);
      } catch (err: unknown) {
        // Changed 'any' to 'unknown'
        setError(String(err)); // Use String(err) for simplicity in displaying error message
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    let currentFiltered = [...allTasks];

    if (objectFilter) {
      currentFiltered = currentFiltered.filter((task) =>
        task.objectName.toLowerCase().includes(objectFilter.toLowerCase())
      );
    }
    if (operatorFilter) {
      currentFiltered = currentFiltered.filter((task) =>
        task.operatorName.toLowerCase().includes(operatorFilter.toLowerCase())
      );
    }
    if (dateFilter) {
      currentFiltered = currentFiltered.filter((task) =>
        dayjs(task.checkDate).isSame(dateFilter, "day")
      );
    }

    setFilteredTasks(currentFiltered);
  }, [allTasks, objectFilter, operatorFilter, dateFilter]);

  const handleObjectFilterApply = () => {
    setShowObjectModal(false);
  };
  const handleOperatorFilterApply = () => {
    setShowOperatorModal(false);
  };
  const handleDateFilterApply = () => {
    setShowDateModal(false);
  };

  const resetAllFilters = () => {
    setObjectFilter("");
    setOperatorFilter("");
    setDateFilter(null);
  };

  const columns = [
    {
      headerName: "Порядковый номер",
      valueGetter: "node.rowIndex + 1",
      width: 100,
    },
    {
      headerName: "Дата проверки",
      field: "checkDate",
      valueFormatter: (params: ValueFormatterParams<Task, string>) => {
        return params.value
          ? dayjs(params.value).format("DD.MM.YYYY HH:mm")
          : "";
      },
      width: 150,
    },
    { headerName: "Объект", field: "objectName", flex: 1, minWidth: 150 },
    { headerName: "Мастер", field: "masterName", width: 150 },
    { headerName: "Оператор", field: "operatorName", width: 150 },
    { headerName: "Статус", field: "status", width: 120 }, // This will currently show "Неизвестен"
    {
      headerName: "Комментарий",
      field: "comment",
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: ICellRendererParams<Task>) => params.value || "—",
    },
    {
      headerName: "", // Action column for navigation
      width: 70,
      cellRenderer: (params: ICellRendererParams<Task>) => (
        <IconButton
          color="primary"
          size="small"
          onClick={() => {
            if (params.data?.id) {
              navigate(`/task/${params.data.id}`); // Navigate to the Task detail page
            }
          }}
        >
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      ),
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
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Повторить попытку
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

        {/* Filter Block (Same as TaskControlPage) */}
        <Box display="flex" gap={2} my={2}>
          <Button
            variant="outlined"
            onClick={() => {
              if (objectFilter) {
                setObjectFilter("");
              } else {
                setShowObjectModal(true);
              }
            }}
            startIcon={<EmailIcon />}
            disabled={!!objectFilter}
          >
            Объекты
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              if (operatorFilter) {
                setOperatorFilter("");
              } else {
                setShowOperatorModal(true);
              }
            }}
            startIcon={<PersonIcon />}
            disabled={!!operatorFilter}
          >
            Оператор
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              if (dateFilter) {
                setDateFilter(null);
              } else {
                setShowDateModal(true);
              }
            }}
            startIcon={<CalendarTodayIcon />}
            disabled={!!dateFilter}
          >
            Дата
          </Button>
          <Button
            variant="outlined"
            onClick={resetAllFilters}
            disabled={!objectFilter && !operatorFilter && !dateFilter}
          >
            Сбросить фильтры
          </Button>
        </Box>

        {/* Object Filter Modal */}
        <Modal open={showObjectModal} onClose={() => setShowObjectModal(false)}>
          <Paper sx={modalStyle}>
            <Typography variant="h6" component="h2">
              Фильтрация по объектам
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setShowObjectModal(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              X
            </IconButton>
            <TextField
              fullWidth
              label="Поле ввода объекта"
              value={objectFilter}
              onChange={(e) => setObjectFilter(e.target.value)}
              margin="normal"
            />
            <Button variant="contained" onClick={handleObjectFilterApply}>
              Применить
            </Button>
          </Paper>
        </Modal>

        {/* Operator Filter Modal */}
        <Modal
          open={showOperatorModal}
          onClose={() => setShowOperatorModal(false)}
        >
          <Paper sx={modalStyle}>
            <Typography variant="h6" component="h2">
              Фильтрация по оператору
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setShowOperatorModal(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              X
            </IconButton>
            <TextField
              fullWidth
              label="Поле ввода оператора"
              value={operatorFilter}
              onChange={(e) => setOperatorFilter(e.target.value)}
              margin="normal"
            />
            <Button variant="contained" onClick={handleOperatorFilterApply}>
              Применить
            </Button>
          </Paper>
        </Modal>

        {/* Date Filter Modal */}
        <Modal open={showDateModal} onClose={() => setShowDateModal(false)}>
          <Paper sx={modalStyle}>
            <Typography variant="h6" component="h2">
              Фильтрация по дате создания задания
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setShowDateModal(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              X
            </IconButton>
            <DatePicker
              label="Выберите дату"
              value={dateFilter}
              onChange={(newValue) => setDateFilter(newValue)}
              slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
            />
            <Button variant="contained" onClick={handleDateFilterApply}>
              Применить
            </Button>
          </Paper>
        </Modal>

        {/* Table Block */}
        <CustomTable<Task>
          ref={gridRef}
          rowData={filteredTasks}
          columnDefs={columns}
          getRowId={(row) => row.id.toString()}
        />
      </Box>
    </LocalizationProvider>
  );
};
