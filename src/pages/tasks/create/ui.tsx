// src/pages/tasks/create/ui.tsx
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
  Tooltip,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import { SelectChangeEvent } from "@mui/material/Select"; // Эта строка не нужна, если SelectChangeEvent не используется явно

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import * as dayjs from "dayjs";
type Dayjs = dayjs.Dayjs;

import { employeeApi } from "@/shared/api/task/employee";
import {
  objectApi,
  InspectionParameter,
  GetObjectParametersResponse,
} from "@/shared/api/task/object";
import {
  nonComplianceApi,
  NonComplianceCase,
} from "@/shared/api/task/non-compliance";
import type { User } from "@/shared/api/task/employee";
import type { ObjectItem } from "@/shared/api/task/object";

import { CustomTable, FilterDefinition } from "@/widgets/table";
import {
  ColDef,
  ICellRendererParams,
  SelectionChangedEvent,
  ValueFormatterParams,
} from "ag-grid-community";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTaskStep1Schema,
  CreateTaskStep1Form,
} from "@/features/tasks/task-form/model/task-schemas";
import { taskApi } from "@/features/tasks/task-form/api/task";
import { toast } from "sonner";

export function TaskCreatePage() {
  const [activeStep, setActiveStep] = useState(0);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateTaskStep1Form>({
    resolver: zodResolver(createTaskStep1Schema),
    mode: "onChange",
    defaultValues: {
      objectId: "",
      checkDate: null,
      checkTime: null,
      isRepeatInspection: false,
      lastCheckDate: null,
      operatorId: "",
      comment: "",
    },
  });

  const isRepeatInspection = watch("isRepeatInspection");
  const objectId = watch("objectId");

  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [operators, setOperators] = useState<User[]>([]);

  const [inspectionParameters, setInspectionParameters] = useState<
    InspectionParameter[]
  >([]);
  const [selectedInspectionParameters, setSelectedInspectionParameters] =
    useState<InspectionParameter[]>([]);
  const [parameterEditModalOpen, setParameterEditModalOpen] = useState(false);
  const [currentParameterInModal, setCurrentParameterInModal] =
    useState<InspectionParameter | null>(null);
  const [
    nonCompliancesForCurrentParameter,
    setNonCompliancesForCurrentParameter,
  ] = useState<NonComplianceCase[]>([]);

  const [addParameterModalOpen, setAddParameterModalOpen] = useState(false);

  const createTaskMutation = taskApi.useCreateTask();

  // --- API Fetching Logic ---

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
      setOperators(fetchedOperators);
    } catch (error) {
      console.error("Ошибка при загрузке операторов:", error);
      try {
        const searchedUsers = await employeeApi.searchUsers("");
        const filteredOperators = searchedUsers.filter(
          (user) => user.role_id === 4
        );
        setOperators(filteredOperators);
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
        setInspectionParameters([]);
        return;
      }
      try {
        const response: GetObjectParametersResponse =
          await objectApi.getParametersAndObjectType(currentObjectId);
        const transformedParameters: InspectionParameter[] =
          response.parameters
            ?.map((param: Record<string, string>) => {
              const id = Object.keys(param)[0];
              const name = param[id];
              return {
                id: parseInt(id, 10),
                name: name,
                type: "N/A",
              };
            })
            .filter(
              (param): param is InspectionParameter =>
                param != null && param.id != null
            ) || [];
        setInspectionParameters(transformedParameters);
      } catch (error) {
        console.error(
          `Ошибка при загрузке параметров для объекта ${currentObjectId}:`,
          error
        );
        setInspectionParameters([]);
      }
    },
    []
  );

  const fetchNonCompliancesForParameter = useCallback(
    async (parameterId: string) => {
      try {
        const nonCompliances =
          await nonComplianceApi.getAllCasesOfParameterNonCompliance(
            parameterId
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
  }, [fetchObjects, fetchOperators]);

  useEffect(() => {
    if (objectId) {
      fetchInspectionParameters(objectId);
      setSelectedInspectionParameters([]);
    }
  }, [objectId, fetchInspectionParameters]);

  useEffect(() => {
    if (parameterEditModalOpen && currentParameterInModal) {
      fetchNonCompliancesForParameter(currentParameterInModal.id.toString());
    } else {
      setNonCompliancesForCurrentParameter([]);
    }
  }, [
    parameterEditModalOpen,
    currentParameterInModal,
    fetchNonCompliancesForParameter,
  ]);

  // --- Handlers for Stepper and Modals ---

  const handleNextStep1 = handleSubmit(async (data: CreateTaskStep1Form) => {
    console.log("Данные формы Шага 1:", data);
    try {
      if (!data.checkDate || !data.checkTime) {
        toast.error("Дата и время проверки должны быть указаны.");
        return;
      }

      const payload = {
        user_id: parseInt(data.operatorId, 10),
        manager_id: 1,
        object_id: parseInt(data.objectId, 10),
        shift_id: 1,
        checking_type_id: data.isRepeatInspection ? 2 : 1,
        date_time: dayjs(data.checkDate) // Это место, где возникала ошибка
          .set("hour", dayjs(data.checkTime).hour())
          .set("minute", dayjs(data.checkTime).minute())
          .toISOString(),
      };
      await createTaskMutation.mutateAsync(payload);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (error) {
      console.error("Ошибка при отправке данных Шага 1:", error);
    }
  });

  const handleNext = () => {
    if (activeStep === 0) {
      handleNextStep1();
    } else if (activeStep === 1) {
      if (selectedInspectionParameters.length === 0) {
        alert("Пожалуйста, выберите хотя бы один параметр проверки на Шаге 2.");
        return;
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSaveTask = () => {
    console.log("Сохранение задания:", {
      formData: watch(),
      selectedInspectionParameters,
    });
    alert("Задание сохранено!");
    reset();
    setActiveStep(0);
    setSelectedInspectionParameters([]);
    setParameterEditModalOpen(false);
    setCurrentParameterInModal(null);
    setNonCompliancesForCurrentParameter([]);
    setAddParameterModalOpen(false);
  };

  // --- Handlers for Parameter Modals ---

  const handleOpenParameterEditModal = (parameter: InspectionParameter) => {
    setCurrentParameterInModal(parameter);
    setParameterEditModalOpen(true);
  };

  const handleCloseParameterEditModal = () => {
    setParameterEditModalOpen(false);
    setCurrentParameterInModal(null);
    setNonCompliancesForCurrentParameter([]);
  };

  const handleSaveParameterChanges = () => {
    console.log(
      "Сохранение изменений параметра:",
      currentParameterInModal,
      nonCompliancesForCurrentParameter
    );
    alert("Изменения параметра сохранены (TODO: Реализовать сохранение в БД)!");
    handleCloseParameterEditModal();
  };

  const handleOpenAddParameterModal = () => {
    setAddParameterModalOpen(true);
  };

  const handleCloseAddParameterModal = () => {
    setAddParameterModalOpen(false);
  };

  const handleSaveNewParameter = () => {
    console.log(
      "Сохранение нового параметра (TODO: Реализовать сохранение в БД)"
    );
    handleCloseAddParameterModal();
  };

  // --- CustomTable Configuration ---

  const parameterFilters: FilterDefinition<InspectionParameter>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Параметр проверки",
        icon: <CheckBoxIcon />,
      },
    ],
    []
  );

  const parameterColumnDefs: ColDef<InspectionParameter>[] = useMemo(
    () => [
      {
        headerName: "",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 50,
        resizable: false,
      },
      {
        headerName: "Наименование параметра проверки объекта.",
        field: "name",
        flex: 1,
        minWidth: 200,
        valueFormatter: (params: ValueFormatterParams) => {
          if (
            params.value === null ||
            params.value === undefined ||
            params.value.trim() === ""
          ) {
            return "N/A";
          }
          return params.value;
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
          if (isSelected) {
            return (
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  params.data && handleOpenParameterEditModal(params.data)
                }
              >
                Редактировать
              </Button>
            );
          }
          return null;
        },
      },
    ],
    [selectedInspectionParameters]
  );

  const onSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows() as InspectionParameter[];
    setSelectedInspectionParameters(selectedRows);
  }, []);

  const getInspectionParameterRowId = useCallback(
    (data: InspectionParameter | undefined | null) => {
      if (data && data.id) {
        return data.id.toString();
      }
      console.warn(
        "getRowId received undefined/null data or missing ID. Generating random ID."
      );
      return `temp-id-${Math.random().toString(36).substr(2, 9)}`;
    },
    []
  );

  const steps = [
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
                  >
                    <MenuItem value="" disabled>
                      Выбор объекта для проверки
                    </MenuItem>
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

            <Controller
              name="checkDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Дата проверки"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date: Dayjs | null) =>
                    field.onChange(date ? date.toDate() : null)
                  }
                  sx={{ mb: 2, width: "100%" }}
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                      error: !!errors.checkDate,
                      helperText: errors.checkDate?.message,
                    },
                  }}
                />
              )}
            />

            <Controller
              name="checkTime"
              control={control}
              render={({ field }) => (
                <TimePicker
                  label="Время начала проверки"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(time: Dayjs | null) =>
                    field.onChange(time ? time.toDate() : null)
                  }
                  ampm={false}
                  sx={{ mb: 2, width: "100%" }}
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
                    onChange={(date: Dayjs | null) =>
                      field.onChange(date ? date.toDate() : null)
                    }
                    sx={{ mb: 2, width: "100%" }}
                    slotProps={{
                      textField: {
                        required: isRepeatInspection,
                        fullWidth: true,
                        error: !!errors.lastCheckDate,
                        helperText: errors.lastCheckDate?.message,
                      },
                    }}
                  />
                )}
              />
            )}

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
                  >
                    <MenuItem value="" disabled>
                      Выбор оператора
                    </MenuItem>
                    {operators.map((op) => (
                      <MenuItem key={op.id} value={op.id.toString()}>
                        {op.full_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.operatorId && (
                    <FormHelperText>{errors.operatorId.message}</FormHelperText>
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
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Tooltip title="Добавить новый параметр проверки">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAddParameterModal}
              >
                Добавить параметр
              </Button>
            </Tooltip>
          </Box>

          {inspectionParameters.length > 0 ? (
            <div
              className="ag-theme-alpine"
              style={{ height: 400, width: "100%" }}
            >
              <CustomTable<InspectionParameter>
                rowData={inspectionParameters}
                columnDefs={parameterColumnDefs}
                getRowId={getInspectionParameterRowId}
                pagination={true}
                pageSize={10}
                filters={parameterFilters}
                onSelectionChanged={onSelectionChanged}
              />
            </div>
          ) : (
            <Typography>
              {objectId
                ? "Параметры проверки для выбранного объекта не найдены."
                : "Выберите объект на Шаге 1, чтобы загрузить параметры проверки."}
            </Typography>
          )}

          <Dialog
            open={parameterEditModalOpen}
            onClose={handleCloseParameterEditModal}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>
              Параметр проверки объекта
              <IconButton
                aria-label="close"
                onClick={handleCloseParameterEditModal}
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
            <DialogContent dividers>
              <Typography variant="subtitle1" gutterBottom>
                Наименование параметра проверки объекта:{" "}
                <strong>{currentParameterInModal?.name}</strong>
              </Typography>

              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Список несоответствий
              </Typography>
              {nonCompliancesForCurrentParameter.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox />
                        </TableCell>
                        <TableCell>Наименование несоответствия.</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {nonCompliancesForCurrentParameter.map((nc) => (
                        <TableRow key={nc.id}>
                          <TableCell padding="checkbox">
                            <Checkbox />
                          </TableCell>
                          <TableCell>{nc.name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>
                  Несоответствия для этого параметра не найдены.
                </Typography>
              )}
              <Button sx={{ mt: 2 }} variant="outlined" startIcon={<AddIcon />}>
                Добавить
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseParameterEditModal}>Отмена</Button>
              <Button onClick={handleSaveParameterChanges} variant="contained">
                Сохранить
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={addParameterModalOpen}
            onClose={handleCloseAddParameterModal}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>
              Добавить новый параметр проверки объекта
              <IconButton
                aria-label="close"
                onClick={handleCloseAddParameterModal}
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
            <DialogContent dividers>
              <Typography variant="subtitle1" gutterBottom>
                Выпадающий список наименований параметров проверки объекта
                (TODO: с поиском)
              </Typography>
              <TextField
                select
                fullWidth
                label="Наименование параметра"
                sx={{ mb: 2 }}
              >
                <MenuItem value="">Выбрать параметр</MenuItem>
              </TextField>

              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Список несоответствий
              </Typography>
              <Typography>
                Таблица несоответствий для нового параметра (TODO: с
                добавлением/удалением и поиском)
              </Typography>
              <Button sx={{ mt: 2 }} variant="outlined" startIcon={<AddIcon />}>
                Добавить несоответствие
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddParameterModal}>Отмена</Button>
              <Button onClick={handleSaveNewParameter} variant="contained">
                Сохранить
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ),
    },
    {
      label: "Краткий отчет",
      content: (
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Краткий отчет по заданию
          </Typography>
          <Typography>
            Дата проведения проверки:{" "}
            {watch("checkDate")
              ? dayjs(watch("checkDate")).format("DD.MM.YYYY")
              : "Не указана"}
          </Typography>
          <Typography>
            Наименование объекта:{" "}
            {objects.find((o) => o.id.toString() === objectId)?.name ||
              "Не выбрано"}
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Информация по объекту:
          </Typography>
          <Typography>
            Полное наименование:{" "}
            {objects.find((o) => o.id.toString() === objectId)?.full_name ||
              "N/A"}
          </Typography>
          <Typography>
            Адрес объекта:{" "}
            {objects.find((o) => o.id.toString() === objectId)?.address ||
              "N/A"}
          </Typography>
          <Typography>
            Характеристика объекта:{" "}
            {objects.find((o) => o.id.toString() === objectId)
              ?.characteristics || "N/A"}
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Оператор:
          </Typography>
          <Typography>
            ФИО:{" "}
            {operators.find((o) => o.id.toString() === watch("operatorId"))
              ?.full_name || "Не выбрано"}
          </Typography>
          <Typography>
            Должность:{" "}
            {operators.find((o) => o.id.toString() === watch("operatorId"))
              ?.position || "N/A"}
          </Typography>
          <Typography>
            Отдел:{" "}
            {operators.find((o) => o.id.toString() === watch("operatorId"))
              ?.department || "N/A"}
          </Typography>
          <Typography>
            Телефон:{" "}
            {operators.find((o) => o.id.toString() === watch("operatorId"))
              ?.phone || "N/A"}
          </Typography>
          <Typography>
            Email:{" "}
            {operators.find((o) => o.id.toString() === watch("operatorId"))
              ?.email || "N/A"}
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Комментарий:
          </Typography>
          <Typography>{watch("comment") || "Нет"}</Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Выбранные параметры проверки:
          </Typography>
          {selectedInspectionParameters.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Параметр</TableCell>
                    <TableCell>Тип</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedInspectionParameters.map((param, index) => (
                    <TableRow key={param.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{param.name}</TableCell>
                      <TableCell>{param.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>Параметры проверки не выбраны.</Typography>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Создание задания
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Добавление нового задания по проверке объекта филиала
      </Typography>

      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Typography variant="h6" gutterBottom>
                {step.title}
              </Typography>
              {step.subtitle && (
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  {step.subtitle}
                </Typography>
              )}
              {step.content}
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    disabled={
                      (activeStep === 0 && !isValid) ||
                      (activeStep === 0 && createTaskMutation.isPending) ||
                      (activeStep === 1 &&
                        selectedInspectionParameters.length === 0)
                    }
                  >
                    {index === steps.length - 1 ? "Сохранить" : "Далее"}
                  </Button>
                  <Button
                    disabled={index === 0 || createTaskMutation.isPending}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Назад
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>Все шаги выполнены - Задание готово!</Typography>
          <Button
            onClick={handleSaveTask}
            variant="contained"
            sx={{ mt: 1, mr: 1 }}
          >
            Сохранить задание
          </Button>
          <Button onClick={() => setActiveStep(0)} sx={{ mt: 1, mr: 1 }}>
            Создать новое задание
          </Button>
        </Paper>
      )}
    </Box>
  );
}
