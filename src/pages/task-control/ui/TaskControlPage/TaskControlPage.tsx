// src/pages/tasks/ui/TaskControlPage/TaskControlPage.tsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  IconButton,
  Paper,
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

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

import { CustomTable } from "@/widgets/table";
import type { JSX } from "react";
import { getControlTasks } from "@/shared/api/task/control";

interface Task {
  id: number;
  checkDate: string;
  checkType: string;
  objectName: string | null;
  masterName: string | null;
  operatorName: string | null;
  status: string;
  comment: string | null;
}

const mapApiToTask = (apiTask: any): Task => ({
  id: apiTask.id,
  checkDate: apiTask.date_time,
  checkType: apiTask.checking_type_text,
  objectName: apiTask.object_name,
  masterName: apiTask.manager_name,
  operatorName: apiTask.user_name,
  status: apiTask.status_text,
  comment: apiTask.comment,
});

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

export const TaskControlPage = (): JSX.Element => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  const [objectFilter, setObjectFilter] = useState<string>("");
  const [operatorFilter, setOperatorFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<Dayjs | null>(null);

  const [showObjectModal, setShowObjectModal] = useState(false);
  const [showOperatorModal, setShowOperatorModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  const gridRef = useRef<AgGridReact<Task>>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        console.log("Загрузка заданий...");
        const apiTasks = await getControlTasks();
        console.log("Получены задания:", apiTasks);
        const tasks: Task[] = apiTasks.map(mapApiToTask);
        console.log("Задания преобразованы:", tasks);
        setAllTasks(tasks);
        setFilteredTasks(tasks);
      } catch (error) {
        console.error("Ошибка при загрузке заданий:", error);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    let currentFiltered = [...allTasks];

    if (objectFilter) {
      currentFiltered = currentFiltered.filter(
        (task) =>
          task.objectName?.toLowerCase().includes(objectFilter.toLowerCase()) ??
          false
      );
    }
    if (operatorFilter) {
      currentFiltered = currentFiltered.filter(
        (task) =>
          task.operatorName
            ?.toLowerCase()
            .includes(operatorFilter.toLowerCase()) ?? false
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
        return params.value ? dayjs(params.value).format("DD.MM.YYYY") : "";
      },
      width: 120,
    },
    { headerName: "Вид проверки", field: "checkType", width: 150 },
    {
      headerName: "Объект",
      field: "objectName",
      flex: 1,
      minWidth: 150,
      valueFormatter: (params: ValueFormatterParams<Task, string | null>) =>
        params.value || "—",
    },
    {
      headerName: "Мастер",
      field: "masterName",
      width: 150,
      valueFormatter: (params: ValueFormatterParams<Task, string | null>) =>
        params.value || "—",
    },
    {
      headerName: "Оператор",
      field: "operatorName",
      width: 150,
      valueFormatter: (params: ValueFormatterParams<Task, string | null>) =>
        params.value || "—",
    },
    { headerName: "Статус", field: "status", width: 120 },
    {
      headerName: "Комментарий",
      field: "comment",
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: ICellRendererParams<Task>) => params.value || "—",
    },
    {
      headerName: "",
      width: 70,
      cellRenderer: (params: ICellRendererParams<Task>) =>
        params.data ? (
          <IconButton
            color="primary"
            size="small"
            onClick={() => params.data && navigate(`/task/${params.data.id}`)}
            title="Открыть"
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        ) : null,
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Контроль заданий по проверке объекта
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Список заданий по проверке объектов филиала
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
            onClick={resetAllFilters}
            disabled={!objectFilter && !operatorFilter && !dateFilter}
          >
            Сбросить фильтры
          </Button>
        </Box>

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
