// src/pages/instructions/ui/InstructionsPage/InstructionsPage.tsx
import React, { useState, useRef, useEffect } from "react"; // Импортируем useEffect
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  Stack,
  Divider,
  Avatar,
  Button,
  Modal,
  TablePagination,
  InputAdornment,
  IconButton,
  Grid, // Убедимся, что Grid импортирован
  CircularProgress, // Добавим для отображения загрузки
  Alert, // Добавим для отображения ошибок
  Dialog, // Для диалоговых окон подтверждения
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close"; // Импортируем CloseIcon
import AddIcon from "@mui/icons-material/Add"; // Импортируем иконку добавления
import EditIcon from "@mui/icons-material/Edit"; // Импортируем иконку редактирования

// Импортируем API и типы
import { instructionApi } from "@/shared/api/instruction";
import {
  InstructionCategory,
  InstructionCategoryPayload,
  UIInstruction,
  InstructionPayload,
  InstructionEditPayload,
} from "@/entities/instruction/types";

// Тип для инструкции
interface Instruction extends UIInstruction {}

export const InstructionsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false); // Для модального окна категорий
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false); // Для модального окна редактирования категории
  const [openDeleteCategoryDialog, setOpenDeleteCategoryDialog] =
    useState(false); // Для диалога подтверждения удаления категории
  const [openEditInstructionModal, setOpenEditInstructionModal] =
    useState(false); // Для модального окна редактирования инструкции
  const [openDeleteInstructionDialog, setOpenDeleteInstructionDialog] =
    useState(false); // Для диалога подтверждения удаления инструкции
  const [selectedInstruction, setSelectedInstruction] =
    useState<Instruction | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<InstructionCategory | null>(null); // Выбранная категория для редактирования/удаления
  const [newInstruction, setNewInstruction] = useState({
    name: "",
    file: null as File | null,
    categoryId: 0,
  });
  const [editInstruction, setEditInstruction] = useState({
    id: 0,
    name: "",
    categoryId: 0,
  });
  const [newCategory, setNewCategory] = useState(""); // Для добавления новой категории
  const [editCategory, setEditCategory] = useState({
    id: 0,
    name: "",
  }); // Для редактирования категории
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [categories, setCategories] = useState<InstructionCategory[]>([]); // Список категорий
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const [error, setError] = useState<string | null>(null); // Состояние ошибки

  const fileInputRef = useRef<HTMLInputElement>(null); // Ref для скрытого input file

  // Загрузка категорий и инструкций при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Загрузка категорий
        const categoriesData = await instructionApi.getCategories();
        setCategories(categoriesData);

        // Если есть категории, загружаем инструкции первой категории
        if (categoriesData.length > 0) {
          const instructionsData =
            await instructionApi.getInstructionsByCategory(
              categoriesData[0].id
            );
          const uiInstructions = instructionsData.map((instruction) => ({
            id: instruction.id,
            name: instruction.name,
            size: "Неизвестно", // Размер файла не возвращается API
            createdAt: new Date(instruction.adding_date).toLocaleDateString(
              "ru-RU"
            ),
            creator: {
              avatar: "/assets/avatar-1.png", // Заглушка для аватара
              fullName: "Неизвестный пользователь", // Заглушка для имени пользователя
            },
            documentUrl: `http://192.168.1.240:82/${instruction.path}`,
            categoryId: instruction.category_id,
          }));
          setInstructions(uiInstructions);
        }
      } catch (err) {
        setError(
          "Ошибка при загрузке данных: " +
            (err instanceof Error ? err.message : "Неизвестная ошибка")
        );
        console.error("Ошибка при загрузке данных:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Загрузка инструкций по выбранной категории
  const loadInstructionsByCategory = async (categoryId: number) => {
    setLoading(true);
    setError(null);
    try {
      const instructionsData =
        await instructionApi.getInstructionsByCategory(categoryId);
      const uiInstructions = instructionsData.map((instruction) => ({
        id: instruction.id,
        name: instruction.name,
        size: "Неизвестно", // Размер файла не возвращается API
        createdAt: new Date(instruction.adding_date).toLocaleDateString(
          "ru-RU"
        ),
        creator: {
          avatar: "/assets/avatar-1.png", // Заглушка для аватара
          fullName: "Неизвестный пользователь", // Заглушка для имени пользователя
        },
        documentUrl: `http://192.168.1.240:82/${instruction.path}`,
        categoryId: instruction.category_id,
      }));
      setInstructions(uiInstructions);
      setPage(0); // Сброс пагинации при смене категории
    } catch (err) {
      setError(
        "Ошибка при загрузке инструкций: " +
          (err instanceof Error ? err.message : "Неизвестная ошибка")
      );
      console.error("Ошибка при загрузке инструкций:", err);
    } finally {
      setLoading(false);
    }
  };

  // Добавление новой категории
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const payload: InstructionCategoryPayload = {
        name: newCategory.trim(),
      };

      const response = await instructionApi.addCategory(payload);
      const newCategoryData = response.instruction_category;

      setCategories((prev) => [...prev, newCategoryData]);
      setNewCategory("");
      setOpenCategoryModal(false);
    } catch (err) {
      setError(
        "Ошибка при добавлении категории: " +
          (err instanceof Error ? err.message : "Неизвестная ошибка")
      );
      console.error("Ошибка при добавлении категории:", err);
    }
  };

  // Открытие модального окна редактирования категории
  const handleOpenEditCategory = (category: InstructionCategory) => {
    setSelectedCategory(category);
    setEditCategory({
      id: category.id,
      name: category.name,
    });
    setOpenEditCategoryModal(true);
  };

  // Редактирование категории
  const handleEditCategory = async () => {
    if (!editCategory.name.trim()) return;

    try {
      const payload: InstructionCategoryPayload = {
        id: editCategory.id,
        name: editCategory.name.trim(),
      };

      const response = await instructionApi.editCategory(payload);
      const updatedCategory = response["instruction category"];

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        )
      );

      setOpenEditCategoryModal(false);
    } catch (err) {
      setError(
        "Ошибка при редактировании категории: " +
          (err instanceof Error ? err.message : "Неизвестная ошибка")
      );
      console.error("Ошибка при редактировании категории:", err);
    }
  };

  // Открытие диалога подтверждения удаления категории
  const handleOpenDeleteCategory = (category: InstructionCategory) => {
    setSelectedCategory(category);
    setOpenDeleteCategoryDialog(true);
  };

  // Удаление категории
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await instructionApi.deleteCategory(selectedCategory.id);

      // Удаляем категорию из списка
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== selectedCategory.id)
      );

      // Если удаленная категория была выбрана, загружаем инструкции первой категории
      const firstCategory = categories.find(
        (cat) => cat.id !== selectedCategory.id
      );
      if (firstCategory) {
        await loadInstructionsByCategory(firstCategory.id);
      } else {
        setInstructions([]); // Если категорий не осталось, очищаем список инструкций
      }

      setOpenDeleteCategoryDialog(false);
    } catch (err) {
      setError(
        "Ошибка при удалении категории: " +
          (err instanceof Error ? err.message : "Неизвестная ошибка")
      );
      console.error("Ошибка при удалении категории:", err);
    }
  };

  // Добавление новой инструкции
  const handleAddInstruction = async () => {
    if (
      !newInstruction.name ||
      !newInstruction.file ||
      !newInstruction.categoryId
    )
      return;

    try {
      const formData = new FormData();
      formData.append("name", newInstruction.name);
      formData.append(
        "instruction_category_id",
        newInstruction.categoryId.toString()
      );
      formData.append("file", newInstruction.file);
      // user_id будет добавлен в API клиенте из параметров аутентификации

      await instructionApi.addInstruction(formData);

      // Перезагрузка инструкций текущей категории
      await loadInstructionsByCategory(newInstruction.categoryId);

      setOpenAddModal(false);
      setNewInstruction({ name: "", file: null, categoryId: 0 });
    } catch (err) {
      setError(
        "Ошибка при добавлении инструкции: " +
          (err instanceof Error ? err.message : "Неизвестная ошибка")
      );
      console.error("Ошибка при добавлении инструкции:", err);
    }
  };

  // Открытие модального окна редактирования инструкции
  const handleOpenEditInstruction = (instruction: Instruction) => {
    setSelectedInstruction(instruction);
    setEditInstruction({
      id: instruction.id,
      name: instruction.name,
      categoryId: instruction.categoryId,
    });
    setOpenEditInstructionModal(true);
  };

  // Редактирование инструкции
  const handleEditInstruction = async () => {
    if (!editInstruction.name || !editInstruction.categoryId) return;

    try {
      const payload: InstructionEditPayload = {
        id: editInstruction.id,
        name: editInstruction.name,
        instruction_category_id: editInstruction.categoryId,
        user_id: null, // В реальной реализации здесь должен быть ID текущего пользователя
      };

      await instructionApi.editInstruction(payload);

      // Перезагрузка инструкций текущей категории
      await loadInstructionsByCategory(editInstruction.categoryId);

      setOpenEditInstructionModal(false);
    } catch (err) {
      setError(
        "Ошибка при редактировании инструкции: " +
          (err instanceof Error ? err.message : "Неизвестная ошибка")
      );
      console.error("Ошибка при редактировании инструкции:", err);
    }
  };

  // Открытие диалога подтверждения удаления инструкции
  const handleOpenDeleteInstruction = (instruction: Instruction) => {
    setSelectedInstruction(instruction);
    setOpenDeleteInstructionDialog(true);
  };

  // Удаление инструкции
  const handleDeleteInstruction = async () => {
    if (!selectedInstruction) return;

    try {
      // В реальной реализации здесь должен быть вызов API для удаления инструкции
      // Поскольку в требованиях нет отдельного эндпоинта для удаления инструкций,
      // реализуем удаление через редактирование с установкой флага удаления
      // await instructionApi.deleteInstruction(selectedInstruction.id);

      // Пока просто удаляем из локального состояния
      setInstructions((prev) =>
        prev.filter((instr) => instr.id !== selectedInstruction.id)
      );

      setOpenDeleteInstructionDialog(false);
      setOpenDetailsModal(false);
    } catch (err) {
      setError(
        "Ошибка при удалении инструкции: " +
          (err instanceof Error ? err.message : "Неизвестная ошибка")
      );
      console.error("Ошибка при удалении инструкции:", err);
    }
  };

  // Фильтрация и сортировка данных
  const filteredInstructions = instructions
    .filter((instruction) =>
      instruction.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  // Пагинация
  const paginatedInstructions = filteredInstructions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDetails = (instruction: Instruction) => {
    setSelectedInstruction(instruction);
    setOpenDetailsModal(true);
  };

  const handleDownload = () => {
    if (selectedInstruction) {
      console.log(`Скачивание инструкции: ${selectedInstruction.name}`);
      // Здесь можно добавить реальную логику скачивания файла
      // Например: window.location.href = selectedInstruction.documentUrl;
    }
  };

  const handleView = () => {
    if (selectedInstruction && selectedInstruction.documentUrl) {
      console.log(`Просмотр инструкции: ${selectedInstruction.name}`);
      // Открываем документ в новой вкладке
      window.open(selectedInstruction.documentUrl, "_blank");
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        minWidth: "1300px",
        mx: "auto",
        minHeight: "100vh",
      }}
    >
      {/* Заголовок */}
      <Typography variant="h4" gutterBottom>
        Инструкции
      </Typography>
      {/* Подзаголовок */}
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Список документов по работе с приложением
      </Typography>

      {/* Отображение ошибок */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Блок поиска, фильтрации и режима отображения */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Поиск"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
        >
          <MenuItem value="desc">Сначала новые</MenuItem>
          <MenuItem value="asc">Сначала старые</MenuItem>
        </Select>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_e, value) => value && setViewMode(value)}
        >
          <ToggleButton value="grid">
            <GridViewIcon />
          </ToggleButton>
          <ToggleButton value="list">
            <ListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Список категорий */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outlined"
            onClick={() => loadInstructionsByCategory(category.id)}
            endIcon={
              <Stack direction="row" spacing={0.5}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEditCategory(category);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDeleteCategory(category);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            }
          >
            {category.name}
          </Button>
        ))}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCategoryModal(true)}
        >
          Добавить категорию
        </Button>
      </Stack>

      {/* Отображение загрузки */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Список инструкций */}
      {!loading && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              viewMode === "grid"
                ? "repeat(auto-fill, minmax(250px, 1fr))"
                : "1fr",
            gap: 2,
          }}
        >
          {paginatedInstructions.map((instruction) => (
            <Card
              key={instruction.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
              }}
              onClick={() => handleOpenDetails(instruction)} // Открываем модальное окно деталей
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >
                  {/* Здесь можно добавить кнопки действий (звезда, меню) */}
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" gutterBottom>
                  {instruction.name}
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={1}
                >
                  <Typography variant="body2" color="text.secondary">
                    {instruction.size}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {/* Отображение аватара и ФИО */}
                    <Avatar
                      src={instruction.creator.avatar}
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {instruction.creator.fullName}
                    </Typography>
                  </Stack>
                </Stack>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={1}
                >
                  Добавлено: {instruction.createdAt}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Пагинация */}
      <TablePagination
        component="div"
        count={filteredInstructions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Записей на странице:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} из ${count}`
        }
      />

      {/* Кнопка "Добавить инструкцию" */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddModal(true)}
        sx={{ mt: 2 }}
        disabled={categories.length === 0} // Отключаем, если нет категорий
      >
        Добавить инструкцию
      </Button>

      {/* Модальное окно добавления категории */}
      <Modal
        open={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 400,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" gutterBottom>
              Добавить категорию
            </Typography>
            <IconButton
              onClick={() => setOpenCategoryModal(false)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          <TextField
            label="Название категории"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCategory}
            disabled={!newCategory.trim()}
          >
            Сохранить
          </Button>
        </Box>
      </Modal>

      {/* Модальное окно редактирования категории */}
      <Modal
        open={openEditCategoryModal}
        onClose={() => setOpenEditCategoryModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 400,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" gutterBottom>
              Редактировать категорию
            </Typography>
            <IconButton
              onClick={() => setOpenEditCategoryModal(false)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          <TextField
            label="Название категории"
            fullWidth
            value={editCategory.name}
            onChange={(e) =>
              setEditCategory({ ...editCategory, name: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditCategory}
            disabled={!editCategory.name.trim()}
          >
            Сохранить
          </Button>
        </Box>
      </Modal>

      {/* Диалог подтверждения удаления категории */}
      <Dialog
        open={openDeleteCategoryDialog}
        onClose={() => setOpenDeleteCategoryDialog(false)}
      >
        <DialogTitle>Удалить категорию</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить категорию "{selectedCategory?.name}"?
            Все инструкции в этой категории также будут удалены.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteCategoryDialog(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleDeleteCategory}
            color="error"
            variant="contained"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Модальное окно добавления инструкции */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 400,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" gutterBottom>
              Добавить инструкцию
            </Typography>
            <IconButton onClick={() => setOpenAddModal(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
          <TextField
            label="Название инструкции"
            fullWidth
            value={newInstruction.name}
            onChange={(e) =>
              setNewInstruction({ ...newInstruction, name: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <Select
            value={newInstruction.categoryId}
            onChange={(e) =>
              setNewInstruction({
                ...newInstruction,
                categoryId: Number(e.target.value),
              })
            }
            displayEmpty
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>
              Выберите категорию
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          {/* Скрытый input type="file" */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) =>
              setNewInstruction({
                ...newInstruction,
                file: e.target.files?.[0] || null,
              })
            }
            style={{ display: "none" }} // Скрыть стандартный input
          />
          {/* Кнопка "Выберите файл" */}
          <Button
            variant="outlined"
            component="span" // Важно для работы с input file
            onClick={() => fileInputRef.current?.click()} // Нажимаем на скрытый input
            sx={{ mb: 2 }}
            fullWidth
          >
            Выберите файл{" "}
            {newInstruction.file ? `: ${newInstruction.file.name}` : ""}
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddInstruction}
            disabled={
              !newInstruction.name ||
              !newInstruction.file ||
              !newInstruction.categoryId
            }
          >
            Сохранить
          </Button>
        </Box>
      </Modal>

      {/* Модальное окно редактирования инструкции */}
      <Modal
        open={openEditInstructionModal}
        onClose={() => setOpenEditInstructionModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 400,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" gutterBottom>
              Редактировать инструкцию
            </Typography>
            <IconButton
              onClick={() => setOpenEditInstructionModal(false)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          <TextField
            label="Название инструкции"
            fullWidth
            value={editInstruction.name}
            onChange={(e) =>
              setEditInstruction({ ...editInstruction, name: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <Select
            value={editInstruction.categoryId}
            onChange={(e) =>
              setEditInstruction({
                ...editInstruction,
                categoryId: Number(e.target.value),
              })
            }
            displayEmpty
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>
              Выберите категорию
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>

          <Button
            variant="contained"
            color="primary"
            onClick={handleEditInstruction}
            disabled={!editInstruction.name || !editInstruction.categoryId}
          >
            Сохранить
          </Button>
        </Box>
      </Modal>

      {/* Диалог подтверждения удаления инструкции */}
      <Dialog
        open={openDeleteInstructionDialog}
        onClose={() => setOpenDeleteInstructionDialog(false)}
      >
        <DialogTitle>Удалить инструкцию</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить инструкцию "
            {selectedInstruction?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteInstructionDialog(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleDeleteInstruction}
            color="error"
            variant="contained"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Модальное окно деталей инструкции */}
      <Modal open={openDetailsModal} onClose={() => setOpenDetailsModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 500,
          }}
        >
          {selectedInstruction && (
            <>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" gutterBottom>
                  {selectedInstruction.name}
                </Typography>
                <IconButton
                  onClick={() => setOpenDetailsModal(false)}
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                  {" "}
                  {/* Исправлено: size={{ xs: 4 }} на item xs={4} */}
                  <Typography variant="body2" color="text.secondary">
                    Создал:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  {" "}
                  {/* Исправлено */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      src={selectedInstruction.creator.avatar}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Typography variant="body2">
                      {selectedInstruction.creator.fullName}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  {" "}
                  {/* Исправлено */}
                  <Typography variant="body2" color="text.secondary">
                    Дата создания:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  {" "}
                  {/* Исправлено */}
                  <Typography variant="body2">
                    {selectedInstruction.createdAt}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  {" "}
                  {/* Исправлено */}
                  <Typography variant="body2" color="text.secondary">
                    Размер:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  {" "}
                  {/* Исправлено */}
                  <Typography variant="body2">
                    {selectedInstruction.size}
                  </Typography>
                </Grid>
              </Grid>
              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 3 }}
                justifyContent="flex-end"
              >
                <IconButton
                  color="primary"
                  onClick={handleDownload}
                  title="Скачать"
                >
                  <DownloadIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={handleView} // При нажатии открывает в новой вкладке
                  title="Просмотреть"
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => {
                    setOpenDetailsModal(false);
                    handleOpenEditInstruction(selectedInstruction);
                  }}
                  title="Редактировать"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() =>
                    handleOpenDeleteInstruction(selectedInstruction)
                  }
                  title="Удалить"
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};
