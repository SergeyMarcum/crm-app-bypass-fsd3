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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { SelectChangeEvent } from "@mui/material/Select";

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

export function TaskCreatePage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    object: "",
    inspectionDate: null as Date | null,
    inspectionTime: null as Date | null,
    isRepeatInspection: false,
    lastInspectionDate: null as Date | null,
    operator: "",
    comment: "",
  });

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

  const fetchInspectionParameters = useCallback(async (objectId: string) => {
    if (!objectId) {
      setInspectionParameters([]);
      return;
    }
    try {
      const response: GetObjectParametersResponse =
        await objectApi.getParametersAndObjectType(objectId);
      // Фильтруем null/undefined элементы и проверяем наличие id
      const filteredParameters =
        response.parameters?.filter(
          (param): param is InspectionParameter =>
            param != null && param.id != null
        ) || [];
      setInspectionParameters(filteredParameters);
      console.log("Параметры проверки загружены:", filteredParameters);
    } catch (error) {
      console.error(
        `Ошибка при загрузке параметров для объекта ${objectId}:`,
        error
      );
      setInspectionParameters([]);
    }
  }, []);

  const fetchNonCompliancesForParameter = useCallback(
    async (parameterId: string) => {
      try {
        const nonCompliances =
          await nonComplianceApi.getAllCasesOfParameterNonCompliance(
            parameterId
          );
        setNonCompliancesForCurrentParameter(nonCompliances);
        console.log(
          `Несоответствия для параметра ${parameterId} загружены:`,
          nonCompliances
        );
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
    if (formData.object) {
      fetchInspectionParameters(formData.object);
      setSelectedInspectionParameters([]);
    }
  }, [formData.object, fetchInspectionParameters]);

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

  // --- Handlers for Form Data ---

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      const { checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === "date") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? new Date(value) : null,
      }));
    } else if (type === "time") {
      if (value) {
        const [hours, minutes] = value.split(":").map(Number);
        const now = new Date();
        now.setHours(hours, minutes, 0, 0);
        setFormData((prev) => ({
          ...prev,
          [name]: now,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: null,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // --- Handlers for Stepper and Modals ---

  const isStep1Valid = () => {
    return (
      formData.object !== "" &&
      formData.inspectionDate !== null &&
      formData.inspectionTime !== null &&
      formData.operator !== "" &&
      (!formData.isRepeatInspection || formData.lastInspectionDate !== null)
    );
  };

  const handleNext = () => {
    if (activeStep === 0 && !isStep1Valid()) {
      alert("Пожалуйста, заполните все обязательные поля в Шаге 1.");
      return;
    }
    if (activeStep === 1 && selectedInspectionParameters.length === 0) {
      alert("Пожалуйста, выберите хотя бы один параметр проверки на Шаге 2.");
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSaveTask = () => {
    console.log("Сохранение задания:", {
      formData,
      selectedInspectionParameters,
    });
    alert("Задание сохранено!");
    setActiveStep(0);
    setFormData({
      object: "",
      inspectionDate: null,
      inspectionTime: null,
      isRepeatInspection: false,
      lastInspectionDate: null,
      operator: "",
      comment: "",
    });
    setObjects([]);
    setOperators([]);
    setInspectionParameters([]);
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
      // Удален столбец "Порядковый номер."
      {
        headerName: "Наименование параметра проверки объекта.",
        field: "name",
        flex: 1,
        minWidth: 200,
        // Добавим valueFormatter для отображения "N/A" если имя пустое/null
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

  // Defensive getRowId to prevent TypeError
  const getInspectionParameterRowId = useCallback(
    (data: InspectionParameter | undefined | null) => {
      if (data && data.id) {
        return data.id.toString();
      }
      // Fallback for undefined/null data or missing id
      console.warn(
        "getRowId received undefined/null data or missing ID. Generating random ID."
      );
      return `temp-id-${Math.random().toString(36).substr(2, 9)}`;
    },
    []
  );

  // --- Stepper Steps Definition ---

  const steps = [
    {
      label: "Основная форма задания",
      title: "Основная информация",
      content: (
        <Box sx={{ mt: 2, mb: 2 }}>
          <Select
            name="object"
            value={formData.object}
            onChange={handleSelectChange}
            displayEmpty
            fullWidth
            required
            sx={{ mb: 2 }}
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

          <TextField
            label="Дата проверки (placeholder)"
            type="date"
            fullWidth
            required
            sx={{ mb: 2 }}
            onChange={handleDateInputChange}
            name="inspectionDate"
            InputLabelProps={{ shrink: true }}
            value={
              formData.inspectionDate
                ? formData.inspectionDate.toISOString().split("T")[0]
                : ""
            }
          />

          <TextField
            label="Время начала проверки (placeholder)"
            type="time"
            fullWidth
            required
            sx={{ mb: 2 }}
            onChange={handleDateInputChange}
            name="inspectionTime"
            InputLabelProps={{ shrink: true }}
            value={
              formData.inspectionTime
                ? `${String(formData.inspectionTime.getHours()).padStart(2, "0")}:${String(formData.inspectionTime.getMinutes()).padStart(2, "0")}`
                : ""
            }
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isRepeatInspection}
                onChange={handleChange}
                name="isRepeatInspection"
              />
            }
            label="Повторная проверка"
            sx={{ mb: 2 }}
          />
          {formData.isRepeatInspection && (
            <TextField
              label="Дата последней проверки (placeholder)"
              type="date"
              fullWidth
              required
              sx={{ mb: 2 }}
              onChange={handleDateInputChange}
              name="lastInspectionDate"
              InputLabelProps={{ shrink: true }}
              value={
                formData.lastInspectionDate
                  ? formData.lastInspectionDate.toISOString().split("T")[0]
                  : ""
              }
            />
          )}

          <Select
            name="operator"
            value={formData.operator}
            onChange={handleSelectChange}
            displayEmpty
            fullWidth
            required
            sx={{ mb: 2 }}
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

          <TextField
            name="comment"
            label="Комментарий к заданию"
            multiline
            rows={4}
            fullWidth
            value={formData.comment}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
        </Box>
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
              {formData.object
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
                        <TableCell>Порядковый номер.</TableCell>
                        <TableCell>Наименование несоответствия.</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {nonCompliancesForCurrentParameter.map((nc, index) => (
                        <TableRow key={nc.id}>
                          <TableCell padding="checkbox">
                            <Checkbox />
                          </TableCell>
                          <TableCell>{index + 1}</TableCell>
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
            {formData.inspectionDate
              ? formData.inspectionDate.toLocaleDateString()
              : "Не указана"}
          </Typography>
          <Typography>
            Наименование объекта:{" "}
            {objects.find((o) => o.id.toString() === formData.object)?.name ||
              "Не выбрано"}
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Информация по объекту:
          </Typography>
          <Typography>
            Полное наименование:{" "}
            {objects.find((o) => o.id.toString() === formData.object)
              ?.full_name || "N/A"}
          </Typography>
          <Typography>
            Адрес объекта:{" "}
            {objects.find((o) => o.id.toString() === formData.object)
              ?.address || "N/A"}
          </Typography>
          <Typography>
            Характеристика объекта:{" "}
            {objects.find((o) => o.id.toString() === formData.object)
              ?.characteristics || "N/A"}
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Оператор:
          </Typography>
          <Typography>
            ФИО:{" "}
            {operators.find((o) => o.id.toString() === formData.operator)
              ?.full_name || "Не выбрано"}
          </Typography>
          <Typography>
            Должность:{" "}
            {operators.find((o) => o.id.toString() === formData.operator)
              ?.position || "N/A"}
          </Typography>
          <Typography>
            Отдел:{" "}
            {operators.find((o) => o.id.toString() === formData.operator)
              ?.department || "N/A"}
          </Typography>
          <Typography>
            Телефон:{" "}
            {operators.find((o) => o.id.toString() === formData.operator)
              ?.phone || "N/A"}
          </Typography>
          <Typography>
            Email:{" "}
            {operators.find((o) => o.id.toString() === formData.operator)
              ?.email || "N/A"}
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Комментарий:
          </Typography>
          <Typography>{formData.comment || "Нет"}</Typography>

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
                      (activeStep === 0 && !isStep1Valid()) ||
                      (activeStep === 1 &&
                        selectedInspectionParameters.length === 0)
                    }
                  >
                    {index === steps.length - 1 ? "Сохранить" : "Далее"}
                  </Button>
                  <Button
                    disabled={index === 0}
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
