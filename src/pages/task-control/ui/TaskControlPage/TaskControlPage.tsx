// src/pages/tasks/ui/TaskControlPage/TaskControlPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  TextField,
  IconButton,
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
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

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



export const TaskControlPage = (): JSX.Element => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  const [objectFilter, setObjectFilter] = useState<string>("");
  const [operatorFilter, setOperatorFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<dayjs.Dayjs | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    setPage(0);
  }, [allTasks, objectFilter, operatorFilter, dateFilter]);

  const paginatedTasks = filteredTasks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={3} sx={{ backgroundColor: "#FCFDFD", minHeight: "100vh" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#101828", mb: 0.5 }}>
          Контроль заданий по проверке объекта
        </Typography>
        <Typography variant="body1" sx={{ color: "#475467", mb: 3 }}>
          Список заданий по проверке объектов филиала
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
                  Вид проверки
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
                  <TableCell colSpan={9} align="center" sx={{ py: 6, color: "text.secondary" }}>
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
                        {task.checkDate ? dayjs(task.checkDate).format("DD.MM.YYYY") : "—"}
                      </TableCell>

                      {/* Вид проверки */}
                      <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400 }}>
                        {task.checkType || "—"}
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

                      {/* Действие */}
                      <TableCell align="right" sx={{ borderBottom: "1px solid #EAECF0", pr: 3 }}>
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
      </Box>
    </LocalizationProvider>
  );
};
