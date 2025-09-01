// src/pages/task/ui/TaskPage/TaskPage.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Paper,
  Container,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom"; // Исправлено здесь
import dayjs from "dayjs";
import { CustomTable } from "@/widgets/table";
import type {
  ICellRendererParams,
  ValueFormatterParams,
} from "ag-grid-community";
import Chat from "@/features/tasks/components/Chat";
import VisibilityIcon from "@mui/icons-material/Visibility";

// --- New Interfaces for Parameters API ---
interface BackendTaskParameter {
  parameter_id: number;
  text: string;
  id: number;
  task_id: number;
}

interface BackendNonCompliance {
  id: number;
  task_id: number;
  parameter_id: number;
  text: string;
  photo_path: string | null;
  // Добавляем другие поля, если они будут в реальном ответе
}

interface BackendParametersResponse {
  parameters: BackendTaskParameter[];
  non_compliances: BackendNonCompliance[];
}

// --- Interfaces for Backend Task Data ---
interface BackendTaskData {
  id: number;
  date_time: string;
  user_email: string;
  manager_email: string | null;
  manager_phone: string | null;
  date_time_report_loading: string | null;
  manager_department: string;
  date_previous_check: string | null;
  user_position: string;
  user_phone: string | null;
  object_id: number;
  object_name: string;
  user_department: string;
  object_full_name: string | null;
  manager_id: number;
  shift_id: number;
  object_address: string;
  user_id: number;
  user_name: string;
  checking_type_id: number;
  checking_type_text: string;
  object_characteristic: string | null;
  manager_name: string;
  manager_position: string;
  domain: string;
  date_for_search: string;
}

// Интерфейс для полного ответа от API /task/get
interface BackendTaskResponse {
  task: BackendTaskData;
  status: {
    status_id: number;
    status_text: string;
  };
}

// --- Interfaces for UI Task Data (Derived from Backend) ---
interface TaskObject {
  id: number;
  name: string;
  fullName: string | null;
  address: string;
  characteristics: string | null;
}

interface TaskOperator {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string | null;
}

interface TaskParameter {
  id: number;
  name: string;
  isCompliant: boolean; // Соответствует или нет
  nonCompliance: BackendNonCompliance | null; // Замечание, если есть
}

interface TaskDetail {
  id: number;
  startDate: string;
  reportDate: string | null;
  isRecheck: boolean;
  lastCheckDate: string | null;
  status: string;
  object: TaskObject;
  operator: TaskOperator;
  parameters: TaskParameter[];
}

// --- Local useTask hook ---
const BASE_URL = "http://192.168.1.240:82";

const useTask = (taskId?: string) => {
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) {
        setLoading(false);
        setError("Идентификатор задания не предоставлен.");
        return;
      }

      setLoading(true);
      setError(null);

      const domain = localStorage.getItem("auth_domain") || "";
      const username = localStorage.getItem("username") || "";
      const sessionCode = localStorage.getItem("session_token") || "";

      if (!domain || !username || !sessionCode) {
        setLoading(false);
        setError(
          "Отсутствуют необходимые данные для аутентификации (домен, имя пользователя или код сессии) в локальном хранилище. Пожалуйста, войдите в систему."
        );
        return;
      }

      try {
        // Запрос 1: Получение данных о задании
        const taskUrl = `${BASE_URL}/task/get?domain=${domain}&username=${username}&session_code=${sessionCode}&task_id=${taskId}`;
        const taskResponse = await fetch(taskUrl);

        if (!taskResponse.ok) {
          const errorBody = await taskResponse.text();
          throw new Error(
            `Ошибка HTTP при получении задания: ${taskResponse.status} - ${
              errorBody || taskResponse.statusText
            }`
          );
        }

        const backendTaskResponse: BackendTaskResponse =
          await taskResponse.json();
        const backendTaskData = backendTaskResponse.task;

        // Запрос 2: Получение параметров и несоответствий
        const parametersUrl = `${BASE_URL}/task/parameters-and-non-compliances?domain=${domain}&username=${username}&session_code=${sessionCode}&id=${taskId}`;
        const parametersResponse = await fetch(parametersUrl);

        if (!parametersResponse.ok) {
          const errorBody = await parametersResponse.text();
          throw new Error(
            `Ошибка HTTP при получении параметров: ${parametersResponse.status} - ${
              errorBody || parametersResponse.statusText
            }`
          );
        }

        const backendParametersResponse: BackendParametersResponse =
          await parametersResponse.json();

        // Маппинг данных
        const mappedParameters: TaskParameter[] =
          backendParametersResponse.parameters.map((param) => {
            // Ищем несоответствие для текущего параметра
            const nonCompliance =
              backendParametersResponse.non_compliances.find(
                (nc) => nc.parameter_id === param.parameter_id
              );
            return {
              id: param.id,
              name: param.text,
              isCompliant: !nonCompliance, // Если несоответствие найдено, значит, НЕ соответствует
              nonCompliance: nonCompliance || null, // Сохраняем объект несоответствия
            };
          });

        const mappedTask: TaskDetail = {
          id: backendTaskData.id,
          startDate: backendTaskData.date_time,
          reportDate: backendTaskData.date_time_report_loading,
          isRecheck: backendTaskData.checking_type_text === "Повторная",
          lastCheckDate: backendTaskData.date_previous_check,
          status: backendTaskResponse.status.status_text,
          object: {
            id: backendTaskData.object_id,
            name: backendTaskData.object_name,
            fullName: backendTaskData.object_full_name,
            address: backendTaskData.object_address,
            characteristics: backendTaskData.object_characteristic,
          },
          operator: {
            id: backendTaskData.user_id,
            name: backendTaskData.user_name,
            position: backendTaskData.user_position,
            department: backendTaskData.user_department,
            email: backendTaskData.user_email,
            phone: backendTaskData.user_phone,
          },
          parameters: mappedParameters, // Используем реальные данные
        };

        setTask(mappedTask);
      } catch (err: unknown) {
        let errorMessage = "Неизвестная ошибка";
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === "string") {
          errorMessage = err;
        }
        setError(`Не удалось загрузить задание: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  return { task, loading, error };
};

// --- End Local useTask hook ---
// ... (остальной код не менялся)

// Вспомогательный компонент для табов
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const TaskPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { task, loading, error } = useTask(taskId);

  const [currentTab, setCurrentTab] = useState(0);
  const [xmlPassword, setXmlPassword] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleDownloadXmlTask = async () => {
    if (!task || !taskId) {
      alert("Невозможно скачать задание: данные отсутствуют.");
      return;
    }

    const domain = localStorage.getItem("auth_domain") || "";
    const username = localStorage.getItem("username") || "";
    const sessionCode = localStorage.getItem("session_token") || "";

    if (!domain || !username || !sessionCode) {
      alert(
        "Необходимые данные для аутентификации отсутствуют в локальном хранилище."
      );
      return;
    }

    // Преобразуем taskId в число
    const taskIdNum = parseInt(taskId);
    if (isNaN(taskIdNum)) {
      alert("Неверный идентификатор задания");
      return;
    }

    const downloadUrl = `${BASE_URL}/generate-xml-task?domain=${domain}&username=${username}&session_code=${sessionCode}&id=${taskIdNum}`;
    console.log("id task", taskIdNum);
    try {
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Accept: "application/xml",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка сервера ${response.status}: ${errorText}`);
      }

      // Получаем XML как текст
      const xmlString = await response.text();

      // Форматируем XML с переносами строк и отступами
      const formattedXml = formatXml(xmlString);

      // Создаем blob из отформатированного XML
      const blob = new Blob([formattedXml], { type: "application/xml" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `task_${taskId}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Ошибка скачивания XML:", error);
      alert(`Ошибка скачивания XML: ${error.message || "неизвестная ошибка"}`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUploadReportClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveReport = async () => {
    if (!selectedFile) {
      alert("Пожалуйста, выберите XML-файл для загрузки отчета.");
      return;
    }

    const domain = localStorage.getItem("auth_domain") || "";
    const username = localStorage.getItem("username") || "";
    const sessionCode = localStorage.getItem("session_token") || "";

    if (!domain || !username || !sessionCode) {
      alert(
        "Необходимые данные для аутентификации отсутствуют в локальном хранилище."
      );
      return;
    }

    const uploadUrl = `${BASE_URL}/upload-report?domain=${domain}&username=${username}&session_code=${sessionCode}`;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка загрузки отчета: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Отчет успешно загружен", result);
      alert("Отчет успешно загружен!");
      setSelectedFile(null);
    } catch (error: unknown) {
      let errorMessage = "Неизвестная ошибка при загрузке отчета.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      console.error("Ошибка загрузки отчета", error);
      alert(`Ошибка загрузки отчета: ${errorMessage}`);
    }
  };

  // Функция для форматирования XML с отступами
  const formatXml = (xml: string): string => {
    try {
      // Регулярное выражение для разбивки тегов
      const regex = /(>)(<)(\/*)/g;
      // Добавляем переносы строк между тегами
      let formatted = xml.replace(regex, "$1\n$2$3");

      let pad = 0;
      // Разбиваем на строки и обрабатываем каждую
      formatted = formatted
        .split("\n")
        .map((line) => {
          let indent = 0;

          // Уменьшаем отступ для закрывающих тегов
          if (line.match(/^<\/\w/)) {
            pad -= 1;
          }
          // Увеличиваем отступ после открывающих тегов
          else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
          }
          // Самозакрывающиеся теги не меняют отступ
          else {
            indent = 0;
          }

          // Применяем отступ
          const padding = "  ".repeat(Math.max(0, pad));
          pad += indent;

          return padding + line;
        })
        .join("\n");

      return formatted;
    } catch (e) {
      console.error("Ошибка форматирования XML:", e);
      return xml; // Возвращаем исходный XML при ошибке
    }
  };

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
          Загрузка задания...
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

  if (!task) {
    return (
      <Box p={3}>
        <Typography variant="h5">Задание не найдено.</Typography>
      </Box>
    );
  }

  // Обновленные колонки для таблицы с учетом новых данных
  const parameterColumns = [
    {
      headerName: "№",
      valueGetter: "node.rowIndex + 1",
      width: 70,
    },
    {
      headerName: "Наименование параметра проверки",
      field: "name",
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: "Статус",
      field: "isCompliant",
      width: 150,
      valueFormatter: (params: ValueFormatterParams<TaskParameter, boolean>) =>
        params.value ? "Соответствует" : "Не соответствует",
    },
    {
      headerName: "Замечания (Есть/Нет)",
      field: "nonCompliance",
      width: 180,
      cellRenderer: (
        params: ICellRendererParams<TaskParameter, BackendNonCompliance | null>
      ) => (
        <Box display="flex" alignItems="center" height="100%">
          {params.value ? (
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={() => {
                // TODO: Логика для открытия модального окна с фотографией
                console.log(
                  "Просмотр замечания:",
                  params.value?.text,
                  params.value?.photo_path
                );
              }}
            >
              <VisibilityIcon />
            </Button>
          ) : (
            "Нет"
          )}
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper
        elevation={1}
        sx={{ p: { xs: 2, sm: 3, md: 4 }, minWidth: "1300px", mx: "auto" }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box>
            <Typography variant="h4">Проверка {task.object.name}</Typography>
          </Box>
        </Stack>

        <Stack spacing={1} mb={4}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" sx={{ minWidth: "250px" }}>
              Дата и время начала проверки:
            </Typography>
            <Typography variant="body2">
              {dayjs(task.startDate).format("DD.MM.YYYY HH:mm")}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" sx={{ minWidth: "250px" }}>
              Дата загрузки отчета:
            </Typography>
            <Typography variant="body2">
              {task.reportDate
                ? dayjs(task.reportDate).format("DD.MM.YYYY")
                : "Отчет не загружен"}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" sx={{ minWidth: "250px" }}>
              Повторная проверка:
            </Typography>
            <Typography variant="body2">
              {task.isRecheck ? "Да" : "Нет"}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" sx={{ minWidth: "250px" }}>
              Статус по заданию:
            </Typography>
            <Typography variant="body2">{task.status}</Typography>
          </Stack>
        </Stack>

        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle1">Объект</Typography>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" sx={{ minWidth: "150px" }}>
                    Название:
                  </Typography>
                  <Typography variant="body2">{task.object.name}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" sx={{ minWidth: "150px" }}>
                    Полное название:
                  </Typography>
                  <Typography variant="body2">
                    {task.object.fullName || "—"}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" sx={{ minWidth: "150px" }}>
                    Адрес:
                  </Typography>
                  <Typography variant="body2">{task.object.address}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" sx={{ minWidth: "150px" }}>
                    Характеристики:
                  </Typography>
                  <Typography variant="body2">
                    {task.object.characteristics || "—"}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle1">Оператор</Typography>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" sx={{ minWidth: "150px" }}>
                    ФИО:
                  </Typography>
                  <Typography variant="body2">{task.operator.name}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" sx={{ minWidth: "150px" }}>
                    Должность:
                  </Typography>
                  <Typography variant="body2">
                    {task.operator.position}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" sx={{ minWidth: "150px" }}>
                    Отдел:
                  </Typography>
                  <Typography variant="body2">
                    {task.operator.department}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" sx={{ minWidth: "150px" }}>
                    Email:
                  </Typography>
                  <Typography variant="body2">{task.operator.email}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" sx={{ minWidth: "150px" }}>
                    Телефон:
                  </Typography>
                  <Typography variant="body2">
                    {task.operator.phone || "—"}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="task details tabs"
          >
            <Tab label="Список параметров" {...a11yProps(0)} />
            <Tab label="Управление" {...a11yProps(1)} />
            <Tab label="История проверки" {...a11yProps(2)} />
            <Tab label="Чат" {...a11yProps(3)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={currentTab} index={0}>
          <Typography variant="h6" mb={2}>
            Список параметров
          </Typography>
          <Box>
            <CustomTable<TaskParameter>
              rowData={task.parameters}
              columnDefs={parameterColumns}
              getRowId={(param) => param.id.toString()}
            />
          </Box>
        </CustomTabPanel>

        <CustomTabPanel value={currentTab} index={1}>
          <Typography variant="h6" mb={2}>
            Управление
          </Typography>
          <Stack spacing={3} sx={{ maxWidth: "600px" }}>
            {/* Поле пароля удалено как неиспользуемое */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadXmlTask}
              fullWidth
            >
              Скачать задание в XML
            </Button>

            <input
              type="file"
              accept=".xml"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleUploadReportClick}
              fullWidth
            >
              Загрузка отчета {selectedFile ? `(${selectedFile.name})` : ""}
            </Button>

            <Button
              variant="contained"
              color="success"
              onClick={handleSaveReport}
              fullWidth
              disabled={!selectedFile}
            >
              Сохранить
            </Button>
            {selectedFile && (
              <Typography variant="caption" sx={{ mt: 1 }}>
                Выбран файл: {selectedFile.name}
              </Typography>
            )}
          </Stack>
        </CustomTabPanel>

        <CustomTabPanel value={currentTab} index={2}>
          <Typography variant="h6" mb={2}>
            История проверки
          </Typography>
          <Typography variant="body1">
            Здесь будет находиться содержимое блока "История проверки".
          </Typography>
        </CustomTabPanel>

        <CustomTabPanel value={currentTab} index={3}>
          <Typography variant="h6" mb={2}>
            Чат
          </Typography>
          <Chat />
        </CustomTabPanel>
      </Paper>
    </Container>
  );
};
