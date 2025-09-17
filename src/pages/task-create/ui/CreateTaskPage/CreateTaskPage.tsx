// src/pages/task-create/ui/CreateTaskPage/CreateTaskPage.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  TextField,
  MenuItem,
  Select,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputLabel,
  FormControl,
  FormHelperText,
  Autocomplete,
  Tooltip,
  Badge,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { employeeApi } from "@/shared/api/task/employee";
import { objectApi } from "@/shared/api/task/object";
import { api } from "@/shared/api/axios";
import { nonComplianceApi } from "@/shared/api/task/non-compliance/client";
import type { NonComplianceCase } from "@/shared/api/task/non-compliance/types";
import { taskHistoryApi } from "@/shared/api/task/history";
import type { User } from "@/shared/api/task/employee";
import type {
  ObjectItem,
  GetObjectParametersResponse,
  InspectionParameter,
} from "@/shared/api/task/object/types";
import type { TaskHistoryItem } from "@/shared/api/task/history/types";

import { CustomTable } from "@/widgets/table";
import {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTaskStep1Schema,
  CreateTaskStep1Form,
  addNewTaskPayloadSchema,
  AddNewTaskPayload,
} from "@/features/tasks/task-form/model/task-schemas";
import { taskApi } from "@/features/tasks/task-form/api/task";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/model/store";
import { z } from "zod";

interface CustomTableWithAgGridProps<TData> {
  rowData: TData[];
  columnDefs: ColDef<TData>[];
  getRowId: (data: TData | undefined | null) => string;
  pagination?: boolean;
}

const TypedCustomTable = <TData extends object>({
  rowData,
  columnDefs,
  getRowId,
  pagination = false,
}: CustomTableWithAgGridProps<TData>) => {
  return (
    <CustomTable
      rowData={rowData}
      columnDefs={columnDefs}
      getRowId={getRowId}
      pagination={pagination}
    />
  );
};

export function CreateTaskPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [taskId, setTaskId] = useState<number | null>(null);
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
  const [historyItems, setHistoryItems] = useState<TaskHistoryItem[]>([]);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
    //getValues,
  } = useForm<CreateTaskStep1Form>({
    resolver: zodResolver(createTaskStep1Schema),
    mode: "onChange",
    defaultValues: {
      objectId: "",
      checkDate: null,
      checkTime: null,
      isRepeatInspection: false,
      lastCheckDate: null,
      periodic: 0,
      operatorId: "",
      comment: "",
    },
  });

  const isRepeatInspection = watch("isRepeatInspection");
  const objectId = watch("objectId");
  const checkTime = watch("checkTime");
  const shiftText = useMemo(() => {
    if (!checkTime) return "";
    const hour = dayjs(checkTime).hour();
    return hour >= 8 && hour < 22 ? "Дневная смена" : "Ночная смена";
  }, [checkTime]);

  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [operators, setOperators] = useState<User[]>([]);
  const [allParameters, setAllParameters] = useState<InspectionParameter[]>([]);
  const [selectedInspectionParameters, setSelectedInspectionParameters] =
    useState<InspectionParameter[]>([]);
  const [parameterEditModalOpen, setParameterEditModalOpen] = useState(false);
  const [currentParameterInModal, setCurrentParameterInModal] =
    useState<InspectionParameter | null>(null);
  const [
    nonCompliancesForCurrentParameter,
    setNonCompliancesForCurrentParameter,
  ] = useState<NonComplianceCase[]>([]);
  const [selectedNonCompliances, setSelectedNonCompliances] = useState<
    NonComplianceCase[]
  >([]);
  const [addParameterModalOpen, setAddParameterModalOpen] = useState(false);
  const [newParameter, setNewParameter] = useState<InspectionParameter | null>(
    null
  );
  const [pendingNonCompliances, setPendingNonCompliances] = useState<
    NonComplianceCase[]
  >([]);

  const createTaskMutation = taskApi.useCreateTask();

  const fetchObjects = useCallback(async () => {
    try {
      const fetchedObjects = await objectApi.getAllObjects();
      setObjects(fetchedObjects);
    } catch (error) {
      console.error("Ошибка при загрузке объектов:", error);
      try {
        const searchedObjects = await objectApi.searchObjects("");
        setObjects(searchedObjects);
      } catch (searchError) {
        console.error("Ошибка при поиске объектов:", searchError);
      }
    }
  }, []);

  const fetchOperators = useCallback(async () => {
    try {
      const fetchedOperators = await employeeApi.getAllOperators();
      setOperators(fetchedOperators as User[]);
    } catch (error) {
      console.error("Ошибка при загрузке операторов:", error);
      try {
        const searchedUsers = await employeeApi.searchUsers("");
        const filteredOperators = searchedUsers.filter(
          (user) => user.role_id === 4
        );
        setOperators(filteredOperators as User[]);
      } catch (searchError) {
        console.error(
          "Ошибка при поиске пользователей/операторов:",
          searchError
        );
      }
    }
  }, []);

  const fetchInspectionParameters = useCallback(
    async (currentObjectId: string) => {
      if (!currentObjectId) {
        setSelectedInspectionParameters([]);
        return;
      }
      try {
        const response: GetObjectParametersResponse =
          await objectApi.getParametersAndObjectType(currentObjectId);
        const normalizedParameters: InspectionParameter[] = response.parameters
          .map((param) => {
            const id = parseInt(Object.keys(param)[0], 10);
            const nonCompliances = (Object.values(param)[0] || []) as
              | NonComplianceCase[]
              | null;
            const name =
              allParameters.find((p) => p.id === id)?.name ||
              "Неизвестный параметр";

            if (!nonCompliances) {
              return null;
            }

            const nonCompliancesArray = Array.isArray(nonCompliances)
              ? nonCompliances
              : [];

            return {
              id,
              name,
              type: "unknown",
              nonCompliances: nonCompliancesArray.map((nc) => ({
                ...nc,
                parameter_id: id,
              })),
            };
          })
          .filter(Boolean) as InspectionParameter[];
        setSelectedInspectionParameters(normalizedParameters);
      } catch (error) {
        console.error(
          `Ошибка при загрузке параметров для объекта ${currentObjectId}:`,
          error
        );
        setSelectedInspectionParameters([]);
      }
    },
    [allParameters]
  );

  const fetchTaskHistory = useCallback(async (currentObjectId: string) => {
    if (!currentObjectId) {
      setHistoryItems([]);
      return;
    }
    try {
      const history = await taskHistoryApi.getObjectTasks(currentObjectId);
      setHistoryItems(history);
    } catch (error) {
      console.error(
        `Ошибка при загрузке истории для объекта ${currentObjectId}:`,
        error
      );
      setHistoryItems([]);
    }
  }, []);

  const fetchAllParameters = useCallback(async () => {
    try {
      const parameters = await objectApi.getAllParameters();
      const normalizedParameters: InspectionParameter[] = parameters.map(
        (param: { id?: number; name: string; type?: string }) => ({
          id: param.id || Math.random(),
          name: param.name || "Без названия",
          type: param.type || "unknown",
        })
      );
      setAllParameters(normalizedParameters);
    } catch (error) {
      console.error("Ошибка при загрузке всех параметров:", error);
      setAllParameters([]);
    }
  }, []);

  const fetchNonCompliancesForParameter = useCallback(
    async (parameterId: number) => {
      try {
        const nonCompliances =
          await nonComplianceApi.getAllCasesOfParameterNonCompliance(
            parameterId.toString()
          );
        setNonCompliancesForCurrentParameter(nonCompliances);
      } catch (error) {
        console.error(
          `Ошибка при загрузке несоответствий для параметра ${parameterId}:`,
          error
        );
        setNonCompliancesForCurrentParameter([]);
      }
    },
    []
  );

  useEffect(() => {
    fetchObjects();
    fetchOperators();
    fetchAllParameters();
  }, [fetchObjects, fetchOperators, fetchAllParameters]);

  useEffect(() => {
    if (objectId) {
      fetchInspectionParameters(objectId);
      fetchTaskHistory(objectId);
      setSelectedInspectionParameters([]);
      setSelectedNonCompliances([]);
    }
  }, [objectId, fetchInspectionParameters, fetchTaskHistory]);

  useEffect(() => {
    if (parameterEditModalOpen && currentParameterInModal) {
      fetchNonCompliancesForParameter(currentParameterInModal.id);
      setPendingNonCompliances(
        selectedNonCompliances.filter(
          (nc) => nc.parameter_id === currentParameterInModal.id
        )
      );
    } else {
      setNonCompliancesForCurrentParameter([]);
      setPendingNonCompliances([]);
    }
  }, [
    parameterEditModalOpen,
    currentParameterInModal,
    fetchNonCompliancesForParameter,
    selectedNonCompliances,
  ]);

  useEffect(() => {
    if (addParameterModalOpen && newParameter) {
      fetchNonCompliancesForParameter(newParameter.id);
      setPendingNonCompliances(
        selectedNonCompliances.filter(
          (nc) => nc.parameter_id === newParameter.id
        )
      );
    } else if (addParameterModalOpen && !newParameter) {
      setNonCompliancesForCurrentParameter([]);
      setPendingNonCompliances([]);
    }
  }, [
    addParameterModalOpen,
    newParameter,
    fetchNonCompliancesForParameter,
    selectedNonCompliances,
  ]);

  const { user } = useAuthStore();

  const handleCreateTaskAndNext = async (data: CreateTaskStep1Form) => {
    if (!user || !user.id) {
      toast.error(
        "Ошибка: Данные пользователя не найдены. Пожалуйста, войдите в систему заново."
      );
      return;
    }

    try {
      const manager_id = user.id;
      if (isNaN(manager_id)) {
        toast.error("Ошибка: Неверный ID менеджера.");
        return;
      }

      const checkHour = dayjs(data.checkTime).hour();
      const shift_id = checkHour >= 8 && checkHour < 22 ? 1 : 2;

      const combinedDateTime = dayjs(data.checkDate)
        .hour(dayjs(data.checkTime).hour())
        .minute(dayjs(data.checkTime).minute())
        .second(0);

      const payload: AddNewTaskPayload = {
        user_id: parseInt(data.operatorId, 10),
        manager_id,
        object_id: parseInt(data.objectId, 10),
        shift_id,
        checking_type_id: data.isRepeatInspection ? 1 : 0,
        date_time: combinedDateTime.format("YYYY-MM-DD HH:mm:ss"),
        comment: data.comment || "",
        periodic: data.periodic ?? 0,
      };

      if (data.isRepeatInspection && data.lastCheckDate) {
        payload.date_previous_check = dayjs(data.lastCheckDate).format(
          "YYYY-MM-DD"
        );
      }

      console.log("Payload to be sent (Step 1):", payload);

      const validatedPayload = addNewTaskPayloadSchema.parse(payload);
      const response = await createTaskMutation.mutateAsync(validatedPayload);

      console.log("API call successful, response:", response);

      setTaskId(response.new_task_id);

      // Отправка начального сообщения в чат
      const domain = localStorage.getItem("auth_domain") || "";
      const username = localStorage.getItem("username") || "";
      const sessionCode = localStorage.getItem("session_code") || "";
      const userId = localStorage.getItem("user_id") || "";
      const BASE_URL = import.meta.env.VITE_API_URL || "/api";
      const selectedObject = objects.find(
        (obj) => obj.id.toString() === data.objectId
      );

      if (domain && username && sessionCode && userId && selectedObject) {
        const chatUrl = `${BASE_URL}/chat/add-message?domain=${domain}&username=${username}&session_code=${sessionCode}`;
        const messageText = `Новое задание по проверке объекта ${selectedObject.name}.\n Дата и время проверки: ${combinedDateTime.format("DD.MM.YYYY HH:mm")}`;

        const formData = new FormData();
        formData.append("task_id", String(response.new_task_id));
        formData.append("user_id", userId);
        formData.append("second_user_id", data.operatorId);
        formData.append("message", messageText);

        try {
          await fetch(chatUrl, {
            method: "POST",
            body: formData,
          });
          console.log("Начальное сообщение отправлено");
        } catch (error) {
          console.error("Ошибка отправки начального сообщения:", error);
        }
      }

      setActiveStep((prev) => prev + 1);
      toast.success("Задание успешно создано. Переход на следующий шаг...");
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(
            `Ошибка валидации: ${err.message} (${err.path.join(".")})`
          );
        });
        console.error("Zod Validation Error:", error.errors);
      } else {
        console.error("Caught an error during task creation:", error);
        toast.error("Произошла ошибка при создании задания.");
      }
    }
  };

  const handleNext = async () => {
    console.log("handleNext called. Текущее состояние формы::", {
      isValid,
      errors,
    });
    if (activeStep === 0) {
      await handleSubmit(handleCreateTaskAndNext)();
    } else if (activeStep === 1) {
      if (selectedInspectionParameters.length === 0) {
        toast.error("Выберите хотя бы один параметр проверки.");
        return;
      }
      setActiveStep((prev) => prev + 1);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSaveTask = async () => {
    if (!taskId) {
      toast.error(
        "ID задания не найден. Пожалуйста, создайте задание сначала."
      );
      return;
    }
    navigate(`/task/${taskId}`);
    reset();
    setSelectedInspectionParameters([]);
    setSelectedNonCompliances([]);
    setParameterEditModalOpen(false);
    setCurrentParameterInModal(null);
    setNonCompliancesForCurrentParameter([]);
    setAddParameterModalOpen(false);
    setTaskId(null);
  };

  const handleOpenParameterEditModal = (parameter: InspectionParameter) => {
    setCurrentParameterInModal(parameter);
    setParameterEditModalOpen(true);
    setPendingNonCompliances(
      selectedNonCompliances.filter((nc) => nc.parameter_id === parameter.id)
    );
  };

  const handleCloseParameterEditModal = () => {
    setParameterEditModalOpen(false);
    setCurrentParameterInModal(null);
    setPendingNonCompliances([]);
  };

  const handleSaveParameterChanges = async () => {
    if (!currentParameterInModal || !taskId) {
      toast.error("ID задания или параметра не найден.");
      return;
    }

    try {
      const nonCompIds = pendingNonCompliances
        .filter((nc) => nc.parameter_id === currentParameterInModal.id)
        .map((nc) => nc.incongruity_id);

      const storage = (await import("@/shared/lib/storage")).storage;
      const domain = storage.get("auth_domain");
      const username = storage.get("username");
      const session_token = storage.get("session_token");

      if (!domain || !username || !session_token) {
        toast.error("Недостаточно данных для аутентификации");
        return;
      }

      const nonComplianceIds = pendingNonCompliances
        .filter((nc) => nc.parameter_id === currentParameterInModal.id)
        .map((nc) => nc.incongruity_id);

      const paramsNonComps = {
        [currentParameterInModal.id]: nonComplianceIds,
      };

      console.log("Отправка в /task/update-parameters-and-non-compliances:", {
        id: taskId,
        params_noncomps: paramsNonComps,
      });

      await api.put(
        "/task/update-parameters-and-non-compliances",
        {
          id: taskId,
          params_noncomps: paramsNonComps,
        },
        {
          params: {
            domain,
            username,
            session_code: session_token,
          },
        }
      );

      const newSelectedNonCompliances = selectedNonCompliances.filter(
        (nc) => nc.parameter_id !== currentParameterInModal.id
      );

      setSelectedNonCompliances([
        ...newSelectedNonCompliances,
        ...pendingNonCompliances.map((nc) => ({
          ...nc,
          parameter_id: currentParameterInModal.id,
        })),
      ]);

      const updatedParameters = selectedInspectionParameters.map((param) =>
        param.id === currentParameterInModal.id
          ? { ...param, nonCompliances: pendingNonCompliances }
          : param
      );

      setSelectedInspectionParameters(updatedParameters);

      toast.success("Несоответствия параметра обновлены.");
      handleCloseParameterEditModal();
      console.log("Обновлены несоответствия параметра:", {
        taskId,
        parameterId: currentParameterInModal.id,
        nonComplianceIds,
      });
    } catch (error) {
      console.error("Ошибка при сохранении изменений параметра:", error);
      toast.error("Ошибка при сохранении изменений параметра.");
    }
  };

  const handleOpenAddParameterModal = () => {
    setAddParameterModalOpen(true);
    setNewParameter(null);
    setNonCompliancesForCurrentParameter([]);
    setPendingNonCompliances([]);
  };

  const handleCloseAddParameterModal = () => {
    setAddParameterModalOpen(false);
    setNewParameter(null);
  };

  const handleSaveNewParameter = async () => {
    if (!newParameter || !taskId) {
      toast.error("Параметр или ID задания не найден.");
      return;
    }

    try {
      const storage = (await import("@/shared/lib/storage")).storage;
      const domain = storage.get("auth_domain");
      const username = storage.get("username");
      const session_token = storage.get("session_token");

      if (!domain || !username || !session_token) {
        toast.error("Недостаточно данных для аутентификации");
        return;
      }

      const nonComplianceIds = pendingNonCompliances.map(
        (nc) => nc.incongruity_id
      );

      const paramsNonComps = {
        [newParameter.id]: nonComplianceIds,
      };

      console.log("Отправка в /task/update-parameters-and-non-compliances:", {
        id: taskId,
        params_noncomps: paramsNonComps,
      });

      await api.put(
        "/task/update-parameters-and-non-compliances",
        {
          id: taskId,
          params_noncomps: paramsNonComps,
        },
        {
          params: {
            domain,
            username,
            session_code: session_token,
          },
        }
      );

      const newParamWithNonCompliances = {
        ...newParameter,
        nonCompliances: pendingNonCompliances,
      };

      setSelectedInspectionParameters((prev) => {
        const existingParam = prev.find((p) => p.id === newParameter.id);
        if (existingParam) {
          return prev.map((p) =>
            p.id === newParameter.id ? newParamWithNonCompliances : p
          );
        }
        return [...prev, newParamWithNonCompliances as InspectionParameter];
      });

      const nonCompliancesToKeep = selectedNonCompliances.filter(
        (nc) => nc.parameter_id !== newParameter.id
      );

      setSelectedNonCompliances([
        ...nonCompliancesToKeep,
        ...pendingNonCompliances.map((nc) => ({
          ...nc,
          parameter_id: newParameter.id,
        })),
      ]);

      toast.success("Новый параметр добавлен.");
      handleCloseAddParameterModal();
      console.log("Добавлен новый параметр:", {
        taskId,
        parameterId: newParameter.id,
        nonComplianceIds,
      });
    } catch (error) {
      console.error("Ошибка при добавлении параметра:", error);
      toast.error("Ошибка при добавлении параметра.");
    }
  };

  const handleDeleteParameter = async (parameterId: number) => {
    if (!taskId) {
      toast.error("ID задания не найден.");
      return;
    }
    try {
      await nonComplianceApi.addParameterNonCompliance(taskId, {
        [parameterId]: [],
      });
      setSelectedInspectionParameters((prev) =>
        prev.filter((param) => param.id !== parameterId)
      );
      setSelectedNonCompliances((prev) =>
        prev.filter((nc) => nc.parameter_id !== parameterId)
      );
      toast.success("Параметр и связанные несоответствия удалены.");
    } catch (error) {
      console.error("Ошибка при удалении параметра:", error);
      toast.error("Ошибка при удалении параметра.");
    }
  };

  const handleTogglePendingNonCompliance = (nonComp: NonComplianceCase) => {
    const isSelected = pendingNonCompliances.some((nc) => nc.id === nonComp.id);
    console.log(
      `Toggling non-compliance: id=${nonComp.id}, selected=${!isSelected}`
    );

    if (isSelected) {
      setPendingNonCompliances((prev) =>
        prev.filter((nc) => nc.id !== nonComp.id)
      );
    } else {
      setPendingNonCompliances((prev) => [
        ...prev,
        {
          ...nonComp,
          parameter_id: currentParameterInModal?.id || newParameter?.id || -1,
          incongruity_id: nonComp.incongruity_id || nonComp.id, // добавляем обязательное incongruity_id
        } as NonComplianceCase,
      ]);
    }
  };

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

  const getNonComplianceCount = (parameterId: number) => {
    const parameter = selectedInspectionParameters.find(
      (p) => p.id === parameterId
    );
    return parameter?.nonCompliances?.length ?? null;
  };

  const parameterColumnDefs: ColDef<InspectionParameter>[] = useMemo(
    () => [
      {
        headerName: "№",
        valueGetter: (params: ValueGetterParams<InspectionParameter>) =>
          params.node?.rowIndex != null ? params.node.rowIndex + 1 : "",
        width: 60,
      },
      {
        headerName: "Наименование параметра проверки объекта",
        field: "name",
        flex: 1,
        minWidth: 200,
        valueFormatter: (params: ValueFormatterParams<InspectionParameter>) =>
          params.value || "N/A",
        cellRenderer: (params: ICellRendererParams<InspectionParameter>) => {
          return (
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
              <Typography variant="body2">{params.data?.name}</Typography>
              <Badge
                badgeContent={getNonComplianceCount(params.data?.id ?? 0)}
                color="success"
                sx={{ ml: 2 }}
              />
            </Box>
          );
        },
      },
      {
        headerName: "Действия",
        field: undefined,
        width: 120,
        cellRenderer: (params: ICellRendererParams<InspectionParameter>) => {
          const isSelected = selectedInspectionParameters.some(
            (p) => p.id === params.data?.id
          );
          if (!isSelected) {
            return null;
          }
          return (
            <Box>
              <Tooltip title="Редактировать">
                <IconButton
                  size="small"
                  onClick={() =>
                    params.data && handleOpenParameterEditModal(params.data)
                  }
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Удалить">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() =>
                    params.data && handleDeleteParameter(params.data.id)
                  }
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    [selectedInspectionParameters]
  );

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

  const getInspectionParameterRowId = useCallback(
    (data: InspectionParameter | undefined | null) =>
      data?.id?.toString() ||
      `temp-id-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  const getHistoryRowId = useCallback(
    (data: TaskHistoryItem | undefined | null) =>
      data?.id?.toString() ||
      `temp-id-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  const steps = useMemo(() => {
    const selectedObject = objects.find(
      (obj) => obj.id.toString() === watch("objectId")
    );
    const selectedOperator = operators.find(
      (op) => op.id.toString() === watch("operatorId")
    );

    return [
      {
        label: "Основная форма задания",
        title: "Основная информация",
        content: (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ mt: 2, mb: 2 }}>
              <Controller
                name="objectId"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                    error={!!errors.objectId}
                  >
                    <InputLabel id="object-select-label">
                      Выбор объекта для проверки
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="object-select-label"
                      label="Выбор объекта для проверки"
                      displayEmpty
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      {objects.map((obj) => (
                        <MenuItem key={obj.id} value={obj.id.toString()}>
                          {obj.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.objectId && (
                      <FormHelperText>{errors.objectId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Controller
                  name="checkDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Дата проверки"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => {
                        field.onChange(date ? date.toDate() : null);
                      }}
                      sx={{ flex: 1 }}
                      slotProps={{
                        textField: {
                          required: true,
                          fullWidth: true,
                          error: !!errors.checkDate,
                          helperText: errors.checkDate?.message,
                        },
                      }}
                      format="DD.MM.YYYY"
                    />
                  )}
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flex: 1,
                  }}
                >
                  <Controller
                    name="checkTime"
                    control={control}
                    render={({ field }) => (
                      <TimePicker
                        label="Время начала проверки"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(time) => {
                          field.onChange(time ? time.toDate() : null);
                        }}
                        ampm={false}
                        sx={{ width: "100%" }}
                        slotProps={{
                          textField: {
                            required: true,
                            fullWidth: true,
                            error: !!errors.checkTime,
                            helperText: errors.checkTime?.message,
                          },
                        }}
                      />
                    )}
                  />
                  {shiftText && <Typography>{shiftText}</Typography>}
                </Box>
              </Box>
              <Controller
                name="isRepeatInspection"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                          if (!e.target.checked) {
                            setValue("lastCheckDate", null);
                          }
                        }}
                      />
                    }
                    label="Повторная проверка"
                    sx={{ mb: 2 }}
                  />
                )}
              />
              {isRepeatInspection && (
                <Controller
                  name="lastCheckDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Дата последней проверки"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => {
                        field.onChange(date ? date.toDate() : null);
                      }}
                      sx={{ mb: 2, width: "100%" }}
                      slotProps={{
                        textField: {
                          required: isRepeatInspection,
                          fullWidth: true,
                          error: !!errors.lastCheckDate,
                          helperText: errors.lastCheckDate?.message,
                        },
                      }}
                      format="DD.MM.YYYY"
                    />
                  )}
                />
              )}
              <Controller
                name="periodic"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    sx={{ mb: 2 }}
                    error={!!errors.periodic}
                  >
                    <InputLabel id="periodic-select-label">
                      Периодическая проверка
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="periodic-select-label"
                      label="Периодическая проверка"
                      value={field.value?.toString() ?? "0"}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    >
                      <MenuItem value="0">Не выбрана</MenuItem>
                      <MenuItem value="1">Каждая неделя</MenuItem>
                      <MenuItem value="2">Каждый месяц</MenuItem>
                    </Select>
                    {errors.periodic && (
                      <FormHelperText>{errors.periodic.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="operatorId"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                    error={!!errors.operatorId}
                  >
                    <InputLabel id="operator-select-label">
                      Выбор оператора
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="operator-select-label"
                      label="Выбор оператора"
                      displayEmpty
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      {operators.map((op) => (
                        <MenuItem key={op.id} value={op.id.toString()}>
                          {op.full_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.operatorId && (
                      <FormHelperText>
                        {errors.operatorId.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Комментарий к заданию"
                    multiline
                    rows={4}
                    fullWidth
                    sx={{ mb: 2 }}
                    error={!!errors.comment}
                    helperText={errors.comment?.message}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                )}
              />
            </Box>
          </LocalizationProvider>
        ),
      },
      {
        label: "Параметры проверки",
        title: "Параметры проверки",
        subtitle: "Список параметров по проверке объекта филиала",
        content: (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">Выбор параметров</Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpenAddParameterModal}
              >
                Добавить параметр
              </Button>
            </Box>
            <TypedCustomTable<InspectionParameter>
              rowData={selectedInspectionParameters}
              columnDefs={parameterColumnDefs}
              getRowId={getInspectionParameterRowId}
              pagination={true}
            />
          </Box>
        ),
      },
      {
        label: "Краткий отчет",
        title: "Краткий отчет",
        subtitle: "Сводная информация по заданию",
        content: (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Информация по заданию
              </Typography>
              <Typography variant="body1">
                **Дата проведения проверки:**{" "}
                {watch("checkDate")
                  ? dayjs(watch("checkDate")).format("DD.MM.YYYY")
                  : "N/A"}
              </Typography>
              <Typography variant="body1">
                **Наименование объекта:** {selectedObject?.name || "N/A"}
              </Typography>
              {selectedObject && (
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2">
                    **Полное наименование:** {selectedObject.full_name || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    **Адрес объекта:** {selectedObject.address || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    **Характеристика объекта:**{" "}
                    {selectedObject.characteristics || "N/A"}
                  </Typography>
                </Box>
              )}
              <Typography variant="body1">
                **Оператор (сотрудник):** {selectedOperator?.full_name || "N/A"}
              </Typography>
              <Typography variant="body1">
                **Комментарий:** {watch("comment") || "N/A"}
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom>
              Список параметров проверки
            </Typography>
            <TypedCustomTable<InspectionParameter>
              rowData={selectedInspectionParameters}
              columnDefs={[
                {
                  headerName: "№",
                  valueGetter: (
                    params: ValueGetterParams<InspectionParameter>
                  ) =>
                    params.node?.rowIndex != null
                      ? params.node.rowIndex + 1
                      : "",
                  width: 60,
                },
                {
                  headerName: "Наименование параметра проверки объекта",
                  field: "name",
                  flex: 1,
                },
                {
                  headerName: "Несоответствия",
                  field: "nonCompliances",
                  valueFormatter: (
                    params: ValueFormatterParams<InspectionParameter>
                  ) =>
                    params.data?.nonCompliances
                      ?.map((nc) => nc.name)
                      .join(", ") || "Нет",
                  flex: 1,
                },
              ]}
              getRowId={getInspectionParameterRowId}
              pagination={true}
            />
          </Box>
        ),
      },
    ];
  }, [
    control,
    errors,
    isRepeatInspection,
    shiftText,
    objects,
    operators,
    watch,
    selectedInspectionParameters,
    parameterColumnDefs,
    getInspectionParameterRowId,
  ]);

  return (
    <Box sx={{ width: "100%", p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Создание задания
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Добавление нового задания по проверке объекта филиала
      </Typography>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>
              <Typography variant="h6">{step.title}</Typography>
              {step.subtitle && (
                <Typography variant="subtitle1" color="text.secondary">
                  {step.subtitle}
                </Typography>
              )}
            </StepLabel>
            <StepContent>
              <Paper elevation={1} sx={{ p: 2 }}>
                {step.content}
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={
                        activeStep === steps.length - 1
                          ? handleSaveTask
                          : handleNext
                      }
                      sx={{ mt: 1, mr: 1 }}
                      disabled={
                        (activeStep === 0 && !isValid) ||
                        (activeStep === 1 &&
                          selectedInspectionParameters.length === 0)
                      }
                    >
                      {activeStep === steps.length - 1 ? "Сохранить" : "Далее"}
                    </Button>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Назад
                    </Button>
                  </div>
                </Box>
              </Paper>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>
            Все шаги завершены - вы можете сохранить задание.
          </Typography>
          <Button onClick={handleSaveTask} sx={{ mt: 1, mr: 1 }}>
            Сохранить
          </Button>
          <Button onClick={() => setActiveStep(0)} sx={{ mt: 1 }}>
            Создать новое задание
          </Button>
        </Paper>
      )}

      {/* Parameter Edit Modal */}
      <Dialog
        open={parameterEditModalOpen}
        onClose={handleCloseParameterEditModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Редактировать несоответствия для:{" "}
          {currentParameterInModal?.name || "Параметр"}
          <IconButton
            onClick={handleCloseParameterEditModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Список несоответствий
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>Название несоответствия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nonCompliancesForCurrentParameter.map((nonComp) => (
                  <TableRow key={nonComp.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={pendingNonCompliances.some(
                          (nc) => nc.id === nonComp.id
                        )}
                        onChange={() =>
                          handleTogglePendingNonCompliance(nonComp)
                        }
                      />
                    </TableCell>
                    <TableCell>{nonComp.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseParameterEditModal}>Отмена</Button>
          <Button onClick={handleSaveParameterChanges} variant="contained">
            Применить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Parameter Modal */}
      <Dialog
        open={addParameterModalOpen}
        onClose={handleCloseAddParameterModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Добавить новый параметр
          <IconButton
            onClick={handleCloseAddParameterModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Autocomplete
            options={allParameters}
            getOptionLabel={(option) => option.name}
            onChange={(e, value) => {
              setNewParameter(value);
              setPendingNonCompliances(
                selectedNonCompliances.filter(
                  (nc) => nc.parameter_id === value?.id
                )
              );
              if (value) {
                fetchNonCompliancesForParameter(value.id);
              } else {
                setNonCompliancesForCurrentParameter([]);
                setPendingNonCompliances([]);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Выберите параметр" />
            )}
            sx={{ mb: 2 }}
          />

          {newParameter && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Несоответствия для: {newParameter.name}
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox"></TableCell>
                      <TableCell>Название несоответствия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {nonCompliancesForCurrentParameter.map((nonComp) => (
                      <TableRow key={nonComp.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={pendingNonCompliances.some(
                              (nc) => nc.id === nonComp.id
                            )}
                            onChange={() =>
                              handleTogglePendingNonCompliance(nonComp)
                            }
                          />
                        </TableCell>
                        <TableCell>{nonComp.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddParameterModal}>Отмена</Button>
          <Button
            onClick={handleSaveNewParameter}
            variant="contained"
            disabled={!newParameter}
          >
            Применить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Modals */}
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
          <Button onClick={() => handleResetFilter("dateFilter")}>Сброс</Button>
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

      {/* Image Modal */}
      <Dialog open={imageModalOpen} onClose={handleCloseImageModal}>
        <DialogTitle>
          Фото
          <IconButton
            onClick={handleCloseImageModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {currentImage ? (
            <img
              src={currentImage}
              alt="Несоответствие"
              style={{ maxWidth: "100%" }}
            />
          ) : (
            <Typography>Изображение не найдено.</Typography>
          )}
        </DialogContent>
      </Dialog>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          История проверки объекта
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
        <TypedCustomTable<TaskHistoryItem>
          rowData={filteredHistoryItems}
          columnDefs={historyColumnDefs}
          getRowId={getHistoryRowId}
          pagination={true}
        />
      </Box>
    </Box>
  );
}
