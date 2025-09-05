// src/pages/task/ui/TaskPage/TaskPage.tsx
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input,
  IconButton,
  Badge,
  TextField,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { CustomTable } from "@/widgets/table";
import type {
  ICellRendererParams,
  ValueGetterParams,
  ValueFormatterParams,
  ColDef,
} from "ag-grid-community";
import Chat from "@/features/tasks/components/Chat";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "sonner";
import type { TaskHistoryItem } from "@/shared/api/task/history/types";
import { taskHistoryApi } from "@/shared/api/task/history";

interface BackendTaskParameter {
  parameter_id: number;
  text: string;
  id: number;
  task_id: number;
}

interface BackendNonCompliance {
  id: number;
  non_compliance_id: number;
  task_id: number;
  parameter_task_id: number;
  text: string;
  photo_path: string | null;
  uploaded_at?: string | null;
  finding_type_text?: string | null;
  importance_level_text?: string | null;
  comment?: string | null;
}

interface BackendParametersResponse {
  parameters: BackendTaskParameter[];
  non_compliances: BackendNonCompliance[];
}

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
  manager_id?: number; // Добавлено, сделано необязательным
  manager_name?: string; // Добавлено, сделано необязательным
  shift_id: number;
  object_address: string;
  user_id: number;
  user_name: string;
  checking_type_id: number;
  checking_type_text: string;
  object_characteristic: string | null;
  domain: string;
  date_for_search: string;
  report_id?: number;
}

interface BackendTaskResponse {
  task: BackendTaskData;
  status: {
    status_id: number;
    status_text: string;
  };
}

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
  parameter_id: number;
  name: string;
  isCompliant: boolean;
  nonCompliances: BackendNonCompliance[];
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
  manager?: { id: number; name: string }; // Сделано необязательным
  parameters: TaskParameter[];
  report_id?: number;
}

interface SyncNonCompliance {
  finding_type_id: number;
  finding_type_text: string;
  importance_level_id: number;
  repair_date: string | null;
  task_id: number;
  user_id: number;
  parameter_id: number;
  parameter_text: string;
  id: number;
  name: string;
  importance_level_text: string;
  comment: string | null;
  report_id: number;
  photo_url: string | null;
}

interface ReportIdResponse {
  status: string;
  report_id: number;
}

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const useTask = (taskId?: string) => {
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      // Получение данных задания
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

      // Получение параметров и несоответствий
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

      const mappedParameters: TaskParameter[] =
        backendParametersResponse.parameters.map((param) => {
          const nonCompliances =
            backendParametersResponse.non_compliances.filter(
              (nc) => nc.parameter_task_id === param.id
            );
          return {
            id: param.id,
            parameter_id: param.parameter_id,
            name: param.text,
            isCompliant: nonCompliances.length === 0,
            nonCompliances: nonCompliances,
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
        ...(backendTaskData.manager_id && backendTaskData.manager_name
          ? {
              manager: {
                id: backendTaskData.manager_id,
                name: backendTaskData.manager_name,
              },
            }
          : {}),
        parameters: mappedParameters,
        report_id: backendTaskData.report_id,
      };

      // Проверка наличия отчета
      let reportId = backendTaskData.report_id;
      if (!reportId) {
        const reportIdUrl = `${BASE_URL}/report/get-by-task-id?domain=${domain}&username=${username}&session_code=${sessionCode}&task_id=${taskId}`;
        const reportIdResponse = await fetch(reportIdUrl, {
          method: "GET",
        });

        if (reportIdResponse.ok) {
          const reportIdData: ReportIdResponse = await reportIdResponse.json();
          if (reportIdData.status === "OK" && reportIdData.report_id) {
            reportId = reportIdData.report_id;
            mappedTask.report_id = reportId;
            mappedTask.reportDate = new Date().toISOString();
          }
        }
      }

      setTask(mappedTask);

      // Автоматическая синхронизация, если report_id существует
      if (reportId) {
        const syncUrl = `${BASE_URL}/report/non-comp-exemplar/get-all-by-report-id?domain=${domain}&username=${username}&session_code=${sessionCode}&report_id=${reportId}`;
        try {
          const syncResponse = await fetch(syncUrl, {
            method: "GET",
          });

          if (!syncResponse.ok) {
            const errorText = await syncResponse.text();
            throw new Error(
              `Ошибка автоматической синхронизации несоответствий: ${syncResponse.status} - ${errorText}`
            );
          }

          const syncData: SyncNonCompliance[] = await syncResponse.json();
          console.log("Auto syncData:", JSON.stringify(syncData, null, 2));

          setTask((prevTask) => {
            if (!prevTask) return prevTask;

            const updatedParameters = prevTask.parameters.map((param) => {
              const syncEntries = syncData.filter((snc) => {
                const isIdMatch = snc.parameter_id === param.parameter_id;
                const normalizedParamText = snc.parameter_text
                  ?.trim()
                  .toLowerCase()
                  .replace(/\s+/g, " ");
                const normalizedParamName = param.name
                  ?.trim()
                  .toLowerCase()
                  .replace(/\s+/g, " ");
                const isTextMatch = normalizedParamText === normalizedParamName;
                return isIdMatch && isTextMatch;
              });

              const updatedNonCompliances = param.nonCompliances.map((nc) => {
                const syncNc = syncEntries.find((snc) => {
                  const normalizedSyncName = snc.name
                    ?.trim()
                    .toLowerCase()
                    .replace(/\s+/g, " ");
                  const normalizedNcText = nc.text
                    ?.trim()
                    .toLowerCase()
                    .replace(/\s+/g, " ");
                  const isNameMatch = normalizedSyncName === normalizedNcText;
                  return isNameMatch;
                });

                if (syncNc) {
                  return {
                    ...nc,
                    id: syncNc.id,
                    non_compliance_id: syncNc.id,
                    finding_type_text: syncNc.finding_type_text,
                    importance_level_text: syncNc.importance_level_text,
                    comment: syncNc.comment,
                    photo_path: syncNc.photo_url
                      ? `${BASE_URL}/${syncNc.photo_url}`
                      : null,
                  };
                }
                return nc;
              });

              return {
                ...param,
                nonCompliances: updatedNonCompliances,
                isCompliant: updatedNonCompliances.length === 0,
              };
            });

            return { ...prevTask, parameters: updatedParameters };
          });
        } catch (syncError: unknown) {
          let errorMessage =
            "Неизвестная ошибка при автоматической синхронизации несоответствий.";
          if (syncError instanceof Error) {
            errorMessage = syncError.message;
          } else if (typeof syncError === "string") {
            errorMessage = syncError;
          }
          console.error("Ошибка автоматической синхронизации", syncError);
        }
      }
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

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  return { task, loading, error, refetch: fetchTask };
};

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
  const { task: initialTask, loading, error, refetch } = useTask(taskId);
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [currentTab, setCurrentTab] = useState(0);

  // Синхронизируем session_token с session_code и устанавливаем user_id
  useEffect(() => {
    const sessionToken = localStorage.getItem("session_token");
    if (sessionToken) {
      localStorage.setItem("session_code", sessionToken);
    }

    // Устанавливаем user_id из данных задачи, если отсутствует в localStorage
    if (initialTask && !localStorage.getItem("user_id")) {
      localStorage.setItem("user_id", String(initialTask.operator.id));
    }
  }, [initialTask]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
  const [selectedNonCompliance, setSelectedNonCompliance] =
    useState<BackendNonCompliance | null>(null);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  type ParameterTableRow = TaskParameter & {
    nonCompliance: BackendNonCompliance | null;
  };

  const rowData = useMemo(() => {
    if (!task) {
      return [];
    }
    return task.parameters.flatMap((param): ParameterTableRow[] => {
      if (param.nonCompliances.length > 0) {
        return param.nonCompliances.map((nc) => ({
          ...param,
          nonCompliance: nc,
        }));
      } else {
        return [{ ...param, nonCompliance: null }];
      }
    });
  }, [task]);

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

    const taskIdNum = parseInt(taskId);
    if (isNaN(taskIdNum)) {
      alert("Неверный идентификатор задания");
      return;
    }

    const downloadUrl = `${BASE_URL}/generate-xml-task?domain=${domain}&username=${username}&session_code=${sessionCode}&id=${taskIdNum}`;
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

      const xmlString = await response.text();
      const formattedXml = formatXml(xmlString);
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
    if (!selectedFile || !taskId) {
      alert(
        "Пожалуйста, выберите XML-файл для загрузки отчета или проверьте идентификатор задания."
      );
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

    const uploadUrl = `${BASE_URL}/report/upload?domain=${domain}&username=${username}&session_code=${sessionCode}`;

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

      const reportIdUrl = `${BASE_URL}/report/get-by-task-id?domain=${domain}&username=${username}&session_code=${sessionCode}&task_id=${taskId}`;
      const reportIdResponse = await fetch(reportIdUrl, {
        method: "GET",
      });

      if (!reportIdResponse.ok) {
        const errorText = await reportIdResponse.text();
        throw new Error(
          `Ошибка получения report_id: ${reportIdResponse.status} - ${errorText}`
        );
      }

      const reportIdData: ReportIdResponse = await reportIdResponse.json();
      if (reportIdData.status === "OK" && reportIdData.report_id) {
        setTask((prevTask) =>
          prevTask
            ? {
                ...prevTask,
                report_id: reportIdData.report_id,
                reportDate: new Date().toISOString(),
              }
            : prevTask
        );

        // Автоматическая синхронизация после загрузки отчета
        const syncUrl = `${BASE_URL}/report/non-comp-exemplar/get-all-by-report-id?domain=${domain}&username=${username}&session_code=${sessionCode}&report_id=${reportIdData.report_id}`;
        try {
          const syncResponse = await fetch(syncUrl, {
            method: "GET",
          });

          if (!syncResponse.ok) {
            const errorText = await syncResponse.text();
            throw new Error(
              `Ошибка автоматической синхронизации несоответствий после загрузки отчета: ${syncResponse.status} - ${errorText}`
            );
          }

          const syncData: SyncNonCompliance[] = await syncResponse.json();
          console.log(
            "Auto syncData after report upload:",
            JSON.stringify(syncData, null, 2)
          );

          setTask((prevTask) => {
            if (!prevTask) return prevTask;

            const updatedParameters = prevTask.parameters.map((param) => {
              const syncEntries = syncData.filter((snc) => {
                const isIdMatch = snc.parameter_id === param.parameter_id;
                const normalizedParamText = snc.parameter_text
                  ?.trim()
                  .toLowerCase()
                  .replace(/\s+/g, " ");
                const normalizedParamName = param.name
                  ?.trim()
                  .toLowerCase()
                  .replace(/\s+/g, " ");
                const isTextMatch = normalizedParamText === normalizedParamName;
                return isIdMatch && isTextMatch;
              });

              const updatedNonCompliances = param.nonCompliances.map((nc) => {
                const syncNc = syncEntries.find((snc) => {
                  const normalizedSyncName = snc.name
                    ?.trim()
                    .toLowerCase()
                    .replace(/\s+/g, " ");
                  const normalizedNcText = nc.text
                    ?.trim()
                    .toLowerCase()
                    .replace(/\s+/g, " ");
                  const isNameMatch = normalizedSyncName === normalizedNcText;
                  return isNameMatch;
                });

                if (syncNc) {
                  return {
                    ...nc,
                    id: syncNc.id,
                    non_compliance_id: syncNc.id,
                    finding_type_text: syncNc.finding_type_text,
                    importance_level_text: syncNc.importance_level_text,
                    comment: syncNc.comment,
                    photo_path: syncNc.photo_url
                      ? `${BASE_URL}/${syncNc.photo_url}`
                      : null,
                  };
                }
                return nc;
              });

              return {
                ...param,
                nonCompliances: updatedNonCompliances,
                isCompliant: updatedNonCompliances.length === 0,
              };
            });

            return { ...prevTask, parameters: updatedParameters };
          });
        } catch (syncError: unknown) {
          let errorMessage =
            "Неизвестная ошибка при автоматической синхронизации несоответствий после загрузки отчета.";
          if (syncError instanceof Error) {
            errorMessage = syncError.message;
          } else if (typeof syncError === "string") {
            errorMessage = syncError;
          }
          console.error(
            "Ошибка автоматической синхронизации после загрузки отчета",
            syncError
          );
        }
      } else {
        console.warn(
          "report_id not found in /report/get-by-task-id response. Refetching task data."
        );
        await refetch();
      }

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

  const handleDeleteReport = async () => {
    if (!task?.report_id) {
      alert("Отчет не загружен. Нечего удалять.");
      return;
    }

    if (!window.confirm("Вы уверены, что хотите удалить отчет?")) {
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

    const deleteUrl = `${BASE_URL}/report/delete?domain=${domain}&username=${username}&session_code=${sessionCode}&report_id=${task.report_id}`;

    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка удаления отчета: ${response.status} - ${errorText}`
        );
      }

      setTask((prevTask) =>
        prevTask
          ? {
              ...prevTask,
              report_id: undefined,
              reportDate: null,
              parameters: prevTask.parameters.map((param) => ({
                ...param,
                nonCompliances: param.nonCompliances.map((nc) => ({
                  ...nc,
                  finding_type_text: null,
                  importance_level_text: null,
                  comment: null,
                  photo_path: null,
                  uploaded_at: null,
                })),
              })),
            }
          : prevTask
      );
      alert("Отчет успешно удален!");
    } catch (error: unknown) {
      let errorMessage = "Неизвестная ошибка при удалении отчета.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      console.error("Ошибка удаления отчета", error);
      alert(`Ошибка удаления отчета: ${errorMessage}`);
    }
  };

  const handlePhotoDialogOpen = (
    nonCompliance: BackendNonCompliance | null
  ) => {
    setSelectedNonCompliance(nonCompliance);
    setOpenPhotoDialog(true);
  };

  const handlePhotoDialogClose = () => {
    setOpenPhotoDialog(false);
    setSelectedNonCompliance(null);
    setNewPhoto(null);
  };

  const handlePhotoUploadClick = () => {
    photoInputRef.current?.click();
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewPhoto(event.target.files[0]);
    }
  };

  const handlePhotoSave = async () => {
    if (!selectedNonCompliance || !newPhoto) {
      alert("Пожалуйста, выберите фотографию для загрузки.");
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

    const method = selectedNonCompliance.photo_path ? "PUT" : "POST";
    const endpoint = selectedNonCompliance.photo_path
      ? "edit-image"
      : "upload-image";
    const nonCompId = selectedNonCompliance.id;
    const uploadUrl = `${BASE_URL}/report/non-comp-exemplar/${endpoint}?domain=${domain}&username=${username}&session_code=${sessionCode}&non_comp_id=${nonCompId}`;

    console.log("handlePhotoSave - uploadUrl:", uploadUrl);
    console.log("handlePhotoSave - method:", method);
    console.log(
      "handlePhotoSave - file:",
      newPhoto.name,
      newPhoto.type,
      newPhoto.size
    );
    console.log("handlePhotoSave - auth params:", {
      domain,
      username,
      sessionCode,
    });
    console.log(
      "handlePhotoSave - selectedNonCompliance:",
      JSON.stringify(selectedNonCompliance, null, 2)
    );
    console.log("task.parameters:", JSON.stringify(task?.parameters, null, 2));

    const formData = new FormData();
    formData.append("file", newPhoto);

    try {
      const response = await fetch(uploadUrl, {
        method,
        body: formData,
      });

      const responseText = await response.text();
      console.log("handlePhotoSave - raw response:", responseText);

      if (!response.ok) {
        console.error("handlePhotoSave - error response:", responseText);
        throw new Error(
          `Ошибка ${method === "POST" ? "загрузки" : "обновления"} фотографии: ${response.status} - ${responseText || response.statusText}`
        );
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("handlePhotoSave - JSON parse error:", parseError);
        throw new Error("Некорректный формат ответа сервера");
      }
      console.log(
        "handlePhotoSave - parsed response:",
        JSON.stringify(result, null, 2)
      );

      if (result.status !== "OK" || !result.image_path) {
        throw new Error("Некорректный ответ сервера: отсутствует image_path");
      }

      const newPhotoPath = `${BASE_URL}/${result.image_path}`;
      const newUploadedAt = new Date().toISOString();

      setTask((prevTask) => {
        if (!prevTask) return prevTask;
        const updatedParameters = prevTask.parameters.map((param) => {
          const updatedNonCompliances = param.nonCompliances.map((nc) => {
            if (nc.id === selectedNonCompliance.id) {
              return {
                ...nc,
                photo_path: newPhotoPath,
                uploaded_at: newUploadedAt,
              };
            }
            return nc;
          });
          return { ...param, nonCompliances: updatedNonCompliances };
        });
        return { ...prevTask, parameters: updatedParameters };
      });

      alert("Фотография успешно сохранена!");
      handlePhotoDialogClose();
    } catch (error: unknown) {
      let errorMessage = `Неизвестная ошибка при ${method === "POST" ? "загрузке" : "обновлении"} фотографии.`;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      console.error(
        `Ошибка ${method === "POST" ? "загрузки" : "обновлении"} фотографии`,
        error
      );
      alert(
        `Ошибка ${method === "POST" ? "загрузки" : "обновления"} фотографии: ${errorMessage}`
      );
    }
  };

  const handlePhotoDownload = () => {
    if (!selectedNonCompliance?.photo_path) {
      alert("Фотография отсутствует.");
      return;
    }

    const a = document.createElement("a");
    a.href = selectedNonCompliance.photo_path;
    a.download = `photo_${selectedNonCompliance.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePhotoClear = async () => {
    if (!selectedNonCompliance) {
      alert("Несоответствие не выбрано.");
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

    const deleteUrl = `${BASE_URL}/report/non-comp-exemplar/delete-image?domain=${domain}&username=${username}&session_code=${sessionCode}&non_comp_id=${selectedNonCompliance.id}`;

    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка удаления фотографии: ${response.status} - ${errorText}`
        );
      }

      setTask((prevTask) => {
        if (!prevTask) return prevTask;
        const updatedParameters = prevTask.parameters.map((param) => {
          const updatedNonCompliances = param.nonCompliances.map((nc) => {
            if (nc.id === selectedNonCompliance.id) {
              return { ...nc, photo_path: null, uploaded_at: null };
            }
            return nc;
          });
          return { ...param, nonCompliances: updatedNonCompliances };
        });
        return { ...prevTask, parameters: updatedParameters };
      });

      alert("Фотография успешно удалена!");
      handlePhotoDialogClose();
    } catch (error: unknown) {
      let errorMessage = "Неизвестная ошибка при удалении фотографии.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      console.error("Ошибка удаления фотографии", error);
      alert(`Ошибка удаления фотографии: ${errorMessage}`);
    }
  };

  // История проверок
  const [historyItems, setHistoryItems] = useState<TaskHistoryItem[]>([]);
  const [filterModalOpen, setFilterModalOpen] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<
    Record<
      "dateFilter" | "reportDateFilter" | "parameterFilter" | "operatorFilter",
      string | undefined
    >
  >({
    dateFilter: undefined,
    reportDateFilter: undefined,
    parameterFilter: undefined,
    operatorFilter: undefined,
  });

  const fetchTaskHistory = useCallback(async (objectId: number) => {
    if (!objectId) {
      setHistoryItems([]);
      return;
    }
    try {
      const history = await taskHistoryApi.getObjectTasks(objectId.toString());
      setHistoryItems(history);
    } catch (error) {
      console.error("Ошибка загрузки истории проверок объекта:", error);
      setHistoryItems([]);
    }
  }, []);

  useEffect(() => {
    if (task?.object.id) {
      fetchTaskHistory(task.object.id);
    }
  }, [task?.object.id, fetchTaskHistory]);

  const handleOpenFilterModal = (filterKey: string) => {
    setFilterModalOpen(filterKey);
  };

  const handleCloseFilterModal = () => {
    setFilterModalOpen(null);
  };

  const handleApplyFilter = (
    filterKey: keyof typeof filterValues,
    value: string
  ) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
    handleCloseFilterModal();
  };

  const handleResetFilter = (filterKey: keyof typeof filterValues) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterKey]: undefined,
    }));
  };

  const handleResetAllFilters = () => {
    setFilterValues({
      dateFilter: undefined,
      reportDateFilter: undefined,
      parameterFilter: undefined,
      operatorFilter: undefined,
    });
  };

  const filteredHistoryItems = useMemo(() => {
    return historyItems.filter((item) => {
      if (filterValues.dateFilter) {
        const date = dayjs(item.date_time).format("DD.MM.YYYY");
        if (date !== filterValues.dateFilter) return false;
      }
      if (filterValues.reportDateFilter) {
        const reportDate = item.date_time_report_loading
          ? dayjs(item.date_time_report_loading).format("DD.MM.YYYY")
          : null;
        if (reportDate !== filterValues.reportDateFilter) return false;
      }
      if (filterValues.operatorFilter) {
        if (
          !item.user_name
            ?.toLowerCase()
            .includes(filterValues.operatorFilter.toLowerCase())
        )
          return false;
      }
      if (filterValues.parameterFilter) {
        const params = Object.keys(item.parameters || {});
        if (
          !params.some((p) =>
            p
              .toLowerCase()
              .includes(filterValues.parameterFilter!.toLowerCase())
          )
        )
          return false;
      }
      return true;
    });
  }, [historyItems, filterValues]);

  const historyColumnDefs: ColDef<TaskHistoryItem>[] = useMemo(
    () => [
      {
        headerName: "№",
        valueGetter: (params: ValueGetterParams<TaskHistoryItem>) =>
          params.node?.rowIndex != null ? params.node.rowIndex + 1 : "",
        width: 60,
      },
      {
        headerName: "Дата проверки",
        field: "date_time",
        valueFormatter: (params: ValueFormatterParams<TaskHistoryItem>) =>
          params.value ? dayjs(params.value).format("DD.MM.YYYY") : "N/A",
        width: 120,
      },
      {
        headerName: "Повторная проверка",
        field: "is_repeat_inspection",
        valueFormatter: (params: ValueFormatterParams<TaskHistoryItem>) =>
          params.value ? "Да" : "Нет",
        width: 120,
      },
      {
        headerName: "ФИО оператора",
        field: "user_name",
        valueFormatter: (params: ValueFormatterParams<TaskHistoryItem>) =>
          params.value ?? "N/A",
        flex: 1,
      },
      {
        headerName: "Дата загрузки отчета",
        field: "date_time_report_loading",
        valueFormatter: (params: ValueFormatterParams<TaskHistoryItem>) =>
          params.value ? dayjs(params.value).format("DD.MM.YYYY") : "N/A",
        width: 120,
      },
      {
        headerName: "Список параметров",
        field: "parameters",
        valueFormatter: (params: ValueFormatterParams<TaskHistoryItem>) =>
          params.value
            ? Object.keys(params.value)
                .filter((key) => params.value[key] !== null)
                .join(", ")
            : "N/A",
        flex: 1,
      },
      {
        headerName: "Список несоответствий",
        field: "parameters",
        valueFormatter: (params: ValueFormatterParams<TaskHistoryItem>) =>
          params.value
            ? Object.values(params.value)
                .filter((val): val is string[] => val !== null)
                .flat()
                .join(", ")
            : "N/A",
        flex: 1,
      },
      {
        headerName: "Фото",
        field: undefined,
        width: 80,
        cellRenderer: (params: ICellRendererParams<TaskHistoryItem>) => (
          <IconButton
            onClick={() =>
              params.data && handleOpenImageModal(params.data.id.toString())
            }
          >
            <VisibilityIcon />
          </IconButton>
        ),
      },
    ],
    []
  );

  const getHistoryRowId = useCallback(
    (data: TaskHistoryItem | undefined | null) =>
      data?.id?.toString() ||
      `temp-id-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  const handleOpenImageModal = async (nonCompId: string) => {
    try {
      const image = await taskHistoryApi.getNonComplianceImage(nonCompId);
      setCurrentImage(image);
      setImageModalOpen(true);
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
      toast.error("Ошибка при загрузке изображения.");
    }
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setCurrentImage(null);
  };

  const handleSyncNonCompliances = async () => {
    if (!task?.report_id) {
      alert(
        "Отчет не загружен. Пожалуйста, загрузите отчет перед синхронизацией."
      );
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

    const syncUrl = `${BASE_URL}/report/non-comp-exemplar/get-all-by-report-id?domain=${domain}&username=${username}&session_code=${sessionCode}&report_id=${task.report_id}`;

    setIsSyncing(true);
    try {
      const response = await fetch(syncUrl, {
        method: "GET",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка синхронизации несоответствий: ${response.status} - ${errorText}`
        );
      }

      const syncData: SyncNonCompliance[] = await response.json();
      console.log("syncData:", JSON.stringify(syncData, null, 2));
      console.log(
        "task.parameters:",
        JSON.stringify(task?.parameters, null, 2)
      );

      setTask((prevTask) => {
        if (!prevTask) return prevTask;

        const updatedParameters = prevTask.parameters.map((param) => {
          const syncEntries = syncData.filter((snc) => {
            const isIdMatch = snc.parameter_id === param.parameter_id;
            const normalizedParamText = snc.parameter_text
              ?.trim()
              .toLowerCase()
              .replace(/\s+/g, " ");
            const normalizedParamName = param.name
              ?.trim()
              .toLowerCase()
              .replace(/\s+/g, " ");
            const isTextMatch = normalizedParamText === normalizedParamName;
            return isIdMatch && isTextMatch;
          });

          console.log(
            `syncEntries for param ${param.id} (parameter_id: ${param.parameter_id}):`,
            JSON.stringify(syncEntries, null, 2)
          );

          const updatedNonCompliances = param.nonCompliances.map((nc) => {
            const syncNc = syncEntries.find((snc) => {
              const normalizedSyncName = snc.name
                ?.trim()
                .toLowerCase()
                .replace(/\s+/g, " ");
              const normalizedNcText = nc.text
                ?.trim()
                .toLowerCase()
                .replace(/\s+/g, " ");
              const isNameMatch = normalizedSyncName === normalizedNcText;
              return isNameMatch;
            });

            if (syncNc) {
              return {
                ...nc,
                id: syncNc.id,
                non_compliance_id: syncNc.id,
                finding_type_text: syncNc.finding_type_text,
                importance_level_text: syncNc.importance_level_text,
                comment: syncNc.comment,
                photo_path: syncNc.photo_url
                  ? `${BASE_URL}/${syncNc.photo_url}`
                  : null,
              };
            }
            return nc;
          });

          console.log(
            `Updated nonCompliances for param ${param.id}:`,
            JSON.stringify(updatedNonCompliances, null, 2)
          );

          return {
            ...param,
            nonCompliances: updatedNonCompliances,
            isCompliant: updatedNonCompliances.length === 0,
          };
        });

        console.log(
          "Updated parameters:",
          JSON.stringify(updatedParameters, null, 2)
        );
        return {
          ...prevTask,
          parameters: updatedParameters,
          reportDate: prevTask.reportDate || new Date().toISOString(),
        };
      });

      alert("Несоответствия успешно синхронизированы!");
    } catch (error: unknown) {
      let errorMessage = "Неизвестная ошибка при синхронизации несоответствий.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      console.error("Ошибка синхронизации", error);
      alert(`Ошибка синхронизации: ${errorMessage}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const formatXml = (xml: string): string => {
    try {
      const regex = /(>)(<)(\/*)/g;
      let formatted = xml.replace(regex, "$1\n$2$3");

      let pad = 0;
      formatted = formatted
        .split("\n")
        .map((line) => {
          let indent = 0;

          if (line.match(/^<\/\w/)) {
            pad -= 1;
          } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
          } else {
            indent = 0;
          }

          const padding = "  ".repeat(Math.max(0, pad));
          pad += indent;

          return padding + line;
        })
        .join("\n");

      return formatted;
    } catch (e) {
      console.error("Ошибка форматирования XML:", e);
      return xml;
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

  const parameterColumns = [
    {
      headerName: "№",
      valueGetter: "node.rowIndex + 1",
      width: 70,
    },
    {
      headerName: "Параметры проверки объекта",
      field: "name",
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: "Несоответствия",
      valueGetter: (params: ValueGetterParams<ParameterTableRow>) =>
        params.data?.nonCompliance?.text || "Нет несоответствий",
      width: 200,
    },
    {
      headerName: "Замечания",
      valueGetter: (params: ValueGetterParams<ParameterTableRow>) => {
        const nonCompliance = params.data?.nonCompliance;
        if (
          nonCompliance &&
          nonCompliance.finding_type_text?.trim() &&
          nonCompliance.importance_level_text?.trim()
        ) {
          return "Есть";
        }
        return "Нет";
      },
      width: 150,
    },
    {
      headerName: "Тип обнаружения",
      valueGetter: (params: ValueGetterParams<ParameterTableRow>) =>
        params.data?.nonCompliance?.finding_type_text || "",
      width: 150,
    },
    {
      headerName: "Уровень важности",
      valueGetter: (params: ValueGetterParams<ParameterTableRow>) =>
        params.data?.nonCompliance?.importance_level_text || "",
      width: 150,
    },
    {
      headerName: "Комментарий",
      valueGetter: (params: ValueGetterParams<ParameterTableRow>) =>
        params.data?.nonCompliance?.comment || "",
      width: 150,
    },
    {
      headerName: "Фото",
      valueGetter: () => "",
      cellRenderer: (params: ICellRendererParams<ParameterTableRow>) => {
        const nonCompliance = params.data?.nonCompliance;
        const hasRemark =
          nonCompliance &&
          nonCompliance.finding_type_text?.trim() &&
          nonCompliance.importance_level_text?.trim();
        const hasPhoto = nonCompliance && nonCompliance.photo_path?.trim();

        return (
          <Box display="flex" alignItems="center" height="100%">
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={() =>
                handlePhotoDialogOpen(params.data?.nonCompliance || null)
              }
              data-testid={`photo-button-${params.data?.nonCompliance?.id || params.data?.id}`}
            >
              {hasRemark && hasPhoto ? (
                <RemoveRedEyeIcon />
              ) : (
                <VisibilityOffIcon />
              )}
            </Button>
          </Box>
        );
      },
      width: 100,
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
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Typography variant="h6">Список параметров</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AutorenewIcon />}
              onClick={handleSyncNonCompliances}
              disabled={isSyncing || !task.report_id}
              data-testid="sync-button"
              title="Синхронизировать данные несоответствий из отчета"
            >
              {isSyncing ? "Синхронизация..." : "Синхронизировать"}
            </Button>
          </Stack>
          <Box>
            {rowData.length > 0 ? (
              <CustomTable<ParameterTableRow>
                rowData={rowData}
                columnDefs={parameterColumns}
                getRowId={(row: ParameterTableRow) =>
                  row.id.toString() +
                  (row.nonCompliance ? `_${row.nonCompliance.id}` : "")
                }
              />
            ) : (
              <Typography>Нет данных для отображения</Typography>
            )}
          </Box>
        </CustomTabPanel>

        <CustomTabPanel value={currentTab} index={1}>
          <Typography variant="h6" mb={2}>
            Управление
          </Typography>
          <Stack spacing={3} sx={{ maxWidth: "600px" }}>
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

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleUploadReportClick}
                fullWidth
                title="Выберите XML-файл для загрузки отчета"
              >
                Загрузка отчета {selectedFile ? `(${selectedFile.name})` : ""}
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteReport}
                disabled={!task.report_id}
                fullWidth
                data-testid="delete-report-button"
                title="Удалить загруженный отчет"
              >
                Удалить отчет
              </Button>
            </Stack>

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => handleOpenFilterModal("dateFilter")}
              color={filterValues.dateFilter ? "primary" : "inherit"}
            >
              {filterValues.dateFilter || "Дата проверки"}
              {filterValues.dateFilter && (
                <Badge
                  badgeContent=""
                  color="primary"
                  variant="dot"
                  sx={{ ml: 1 }}
                />
              )}
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleOpenFilterModal("reportDateFilter")}
              color={filterValues.reportDateFilter ? "primary" : "inherit"}
            >
              {filterValues.reportDateFilter || "Дата отчета"}
              {filterValues.reportDateFilter && (
                <Badge
                  badgeContent=""
                  color="primary"
                  variant="dot"
                  sx={{ ml: 1 }}
                />
              )}
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleOpenFilterModal("parameterFilter")}
              color={filterValues.parameterFilter ? "primary" : "inherit"}
            >
              {filterValues.parameterFilter || "Параметр проверки"}
              {filterValues.parameterFilter && (
                <Badge
                  badgeContent=""
                  color="primary"
                  variant="dot"
                  sx={{ ml: 1 }}
                />
              )}
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleOpenFilterModal("operatorFilter")}
              color={filterValues.operatorFilter ? "primary" : "inherit"}
            >
              {filterValues.operatorFilter || "Оператор"}
              {filterValues.operatorFilter && (
                <Badge
                  badgeContent=""
                  color="primary"
                  variant="dot"
                  sx={{ ml: 1 }}
                />
              )}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleResetAllFilters}
            >
              Сбросить фильтры
            </Button>
          </Box>
          <CustomTable<TaskHistoryItem>
            rowData={filteredHistoryItems}
            columnDefs={historyColumnDefs}
            getRowId={getHistoryRowId}
            pagination={true}
          />
        </CustomTabPanel>

        <CustomTabPanel value={currentTab} index={3}>
          <Typography variant="h6" mb={2}>
            Чат (Сообщения)
          </Typography>
          {task.manager ? (
            <Chat
              taskId={taskId || ""}
              currentUserId={Number(localStorage.getItem("user_id")) || 0}
              operatorId={task.operator.id}
              managerId={task.manager.id}
              operatorName={task.operator.name}
              managerName={task.manager.name}
              baseUrl={BASE_URL}
            />
          ) : (
            <Typography>
              Информация о мастере недоступна. Чат невозможен.
            </Typography>
          )}
        </CustomTabPanel>

        {/* Модальные окна фильтров */}
        <Dialog
          open={filterModalOpen === "dateFilter"}
          onClose={handleCloseFilterModal}
        >
          <DialogTitle>Фильтр по дате</DialogTitle>
          <DialogContent>
            <DatePicker
              label="Дата проверки (DD.MM.YYYY)"
              value={
                filterValues.dateFilter
                  ? dayjs(filterValues.dateFilter, "DD.MM.YYYY")
                  : null
              }
              onChange={(date) =>
                handleApplyFilter(
                  "dateFilter",
                  date ? date.format("DD.MM.YYYY") : ""
                )
              }
              slotProps={{
                textField: { fullWidth: true },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleResetFilter("dateFilter")}>
              Сброс
            </Button>
            <Button onClick={handleCloseFilterModal}>Закрыть</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={filterModalOpen === "reportDateFilter"}
          onClose={handleCloseFilterModal}
        >
          <DialogTitle>Фильтр по дате отчета</DialogTitle>
          <DialogContent>
            <DatePicker
              label="Дата загрузки отчета (DD.MM.YYYY)"
              value={
                filterValues.reportDateFilter
                  ? dayjs(filterValues.reportDateFilter, "DD.MM.YYYY")
                  : null
              }
              onChange={(date) =>
                handleApplyFilter(
                  "reportDateFilter",
                  date ? date.format("DD.MM.YYYY") : ""
                )
              }
              slotProps={{
                textField: { fullWidth: true },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleResetFilter("reportDateFilter")}>
              Сброс
            </Button>
            <Button onClick={handleCloseFilterModal}>Закрыть</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={filterModalOpen === "parameterFilter"}
          onClose={handleCloseFilterModal}
        >
          <DialogTitle>Фильтр по параметру</DialogTitle>
          <DialogContent>
            <TextField
              label="Наименование параметра"
              value={filterValues.parameterFilter || ""}
              onChange={(e) =>
                handleApplyFilter("parameterFilter", e.target.value)
              }
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleResetFilter("parameterFilter")}>
              Сброс
            </Button>
            <Button onClick={handleCloseFilterModal}>Закрыть</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={filterModalOpen === "operatorFilter"}
          onClose={handleCloseFilterModal}
        >
          <DialogTitle>Фильтр по оператору</DialogTitle>
          <DialogContent>
            <TextField
              label="Имя оператора"
              value={filterValues.operatorFilter || ""}
              onChange={(e) =>
                handleApplyFilter("operatorFilter", e.target.value)
              }
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleResetFilter("operatorFilter")}>
              Сброс
            </Button>
            <Button onClick={handleCloseFilterModal}>Закрыть</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openPhotoDialog}
          onClose={handlePhotoDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Загрузка фотографии несоответствия</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              {newPhoto ||
              (selectedNonCompliance?.photo_path &&
                selectedNonCompliance.photo_path !== "null") ? (
                <Box
                  component="img"
                  src={
                    newPhoto
                      ? URL.createObjectURL(newPhoto)
                      : selectedNonCompliance?.photo_path?.startsWith("http")
                        ? selectedNonCompliance.photo_path
                        : `${BASE_URL}/${selectedNonCompliance?.photo_path}`
                  }
                  alt="Фото несоответствия"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Typography>Фотография не загружена</Typography>
              )}
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle2">Название файла:</Typography>
                <Typography variant="body2">
                  {newPhoto
                    ? newPhoto.name
                    : selectedNonCompliance?.photo_path
                      ? selectedNonCompliance.photo_path.split("/").pop()
                      : "—"}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle2">Дата загрузки:</Typography>
                <Typography variant="body2">
                  {selectedNonCompliance?.uploaded_at
                    ? dayjs(selectedNonCompliance.uploaded_at).format(
                        "DD.MM.YYYY HH:mm"
                      )
                    : newPhoto
                      ? "Новая фотография"
                      : "—"}
                </Typography>
              </Stack>
              <input
                type="file"
                accept="image/*"
                ref={photoInputRef}
                onChange={handlePhotoChange}
                style={{ display: "none" }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handlePhotoUploadClick}
              >
                {selectedNonCompliance?.photo_path ? "Изменить" : "Загрузить"}
              </Button>
              {selectedNonCompliance?.photo_path && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handlePhotoDownload}
                >
                  Скачать
                </Button>
              )}
              {selectedNonCompliance?.photo_path && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handlePhotoClear}
                >
                  Очистить
                </Button>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePhotoDialogClose}>Закрыть</Button>
            {(newPhoto || selectedNonCompliance?.photo_path) && (
              <Button onClick={handlePhotoSave} color="success">
                Сохранить
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};
