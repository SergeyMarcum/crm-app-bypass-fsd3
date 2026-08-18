// src/pages/instructions/ui/InstructionsPage/InstructionsPage.tsx
import React, { useState, useRef, useEffect } from "react";
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
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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

// Custom SVGs matching the Phosphor Icons in the screenshot
const FolderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="#EAAA08"
    viewBox="0 0 256 256"
    {...props}
  >
    <path d="M216,72H131.31L105.37,46.06A8,8,0,0,0,99.66,43.76H40A16,16,0,0,0,24,59.76V196.24A16,16,0,0,0,40,212.24H216a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72Zm-8,124.24H48V64h49.66l26,26A8,8,0,0,0,129.31,92.24H208V196.24Z" />
  </svg>
);

const FileIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="#6366F1"
    viewBox="0 0 256 256"
    {...props}
  >
    <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM152,43.31,196.69,88H152ZM200,216H56V40h80V96a8,8,0,0,0,8,8h56V216Z" />
  </svg>
);

const StarFilledIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#EAAA08" viewBox="0 0 256 256">
    <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
  </svg>
);

const StarOutlineIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" style={{ color: "#98A2B3" }}>
    <path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z" />
  </svg>
);

export const InstructionsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
  const [openDeleteCategoryDialog, setOpenDeleteCategoryDialog] = useState(false);
  const [openEditInstructionModal, setOpenEditInstructionModal] = useState(false);
  const [openDeleteInstructionDialog, setOpenDeleteInstructionDialog] = useState(false);
  const [selectedInstruction, setSelectedInstruction] = useState<Instruction | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<InstructionCategory | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

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
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState({
    id: 0,
    name: "",
  });
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [categories, setCategories] = useState<InstructionCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Favorites States (Persistent locally in memory)
  const [starredFolders, setStarredFolders] = useState<Record<number, boolean>>({});
  const [starredFiles, setStarredFiles] = useState<Record<number, boolean>>({});

  // Category Menu State
  const [categoryAnchorEl, setCategoryAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategoryForMenu, setSelectedCategoryForMenu] = useState<InstructionCategory | null>(null);

  // Instruction Menu State
  const [instructionAnchorEl, setInstructionAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedInstructionForMenu, setSelectedInstructionForMenu] = useState<Instruction | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load categories and instructions on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoriesData = await instructionApi.getCategories();
        setCategories(categoriesData);

        if (categoriesData.length > 0) {
          const firstCatId = categoriesData[0].id;
          setActiveCategoryId(firstCatId);
          const instructionsData = await instructionApi.getInstructionsByCategory(firstCatId);
          const uiInstructions = instructionsData.map((instruction) => ({
            id: instruction.id,
            name: instruction.name,
            size: "1.2 MB",
            createdAt: new Date(instruction.adding_date).toLocaleDateString("ru-RU"),
            creator: {
              avatar: "/assets/avatar-1.png",
              fullName: "Мастер Системы",
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

  // Load instructions for selected category
  const loadInstructionsByCategory = async (categoryId: number) => {
    setLoading(true);
    setError(null);
    setActiveCategoryId(categoryId);
    try {
      const instructionsData = await instructionApi.getInstructionsByCategory(categoryId);
      const uiInstructions = instructionsData.map((instruction) => ({
        id: instruction.id,
        name: instruction.name,
        size: "1.2 MB",
        createdAt: new Date(instruction.adding_date).toLocaleDateString("ru-RU"),
        creator: {
          avatar: "/assets/avatar-1.png",
          fullName: "Мастер Системы",
        },
        documentUrl: `http://192.168.1.240:82/${instruction.path}`,
        categoryId: instruction.category_id,
      }));
      setInstructions(uiInstructions);
      setPage(0);
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

  // Add Category
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
      // Automatically select new category
      loadInstructionsByCategory(newCategoryData.id);
    } catch (err) {
      setError(
        "Ошибка при добавлении категории: " +
          (err instanceof Error ? err.message : "Неизвестная ошибка")
      );
    }
  };

  // Open Edit Category
  const handleOpenEditCategory = (category: InstructionCategory) => {
    setSelectedCategory(category);
    setEditCategory({
      id: category.id,
      name: category.name,
    });
    setOpenEditCategoryModal(true);
  };

  // Edit Category
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
        prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
      );
      setOpenEditCategoryModal(false);
    } catch (err) {
      setError(
        "Ошибка при редактировании категории: " +
          (err instanceof Error ? err.message : "Неизвестная ошибка")
      );
    }
  };

  // Open Delete Category
  const handleOpenDeleteCategory = (category: InstructionCategory) => {
    setSelectedCategory(category);
    setOpenDeleteCategoryDialog(true);
  };

  // Delete Category
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      await instructionApi.deleteCategory(selectedCategory.id);
      setCategories((prev) => prev.filter((cat) => cat.id !== selectedCategory.id));
      
      const firstCategory = categories.find((cat) => cat.id !== selectedCategory.id);
      if (firstCategory) {
        await loadInstructionsByCategory(firstCategory.id);
      } else {
        setInstructions([]);
        setActiveCategoryId(null);
      }
      setOpenDeleteCategoryDialog(false);
    } catch (err) {
      setError(
        "Ошибка при удалении категории: " +
          (err instanceof Error ? err.message : "Неизвестная ошибка")
      );
    }
  };

  // Add Instruction
  const handleAddInstruction = async () => {
    const targetCatId = newInstruction.categoryId || activeCategoryId || 0;
    if (!newInstruction.name || !newInstruction.file || !targetCatId) return;

    try {
      const formData = new FormData();
      formData.append("name", newInstruction.name);
      formData.append("instruction_category_id", targetCatId.toString());
      formData.append("file", newInstruction.file);

      await instructionApi.addInstruction(formData);
      await loadInstructionsByCategory(targetCatId);

      setOpenAddModal(false);
      setNewInstruction({ name: "", file: null, categoryId: 0 });
    } catch (err) {
      setError(
        "Ошибка при добавлении инструкции: " +
          (err instanceof Error ? err.message : "Неизвестная ошибка")
      );
    }
  };

  // Open Edit Instruction
  const handleOpenEditInstruction = (instruction: Instruction) => {
    setSelectedInstruction(instruction);
    setEditInstruction({
      id: instruction.id,
      name: instruction.name,
      categoryId: instruction.categoryId,
    });
    setOpenEditInstructionModal(true);
  };

  // Edit Instruction
  const handleEditInstruction = async () => {
    if (!editInstruction.name || !editInstruction.categoryId) return;
    try {
      const payload: InstructionEditPayload = {
        id: editInstruction.id,
        name: editInstruction.name,
        instruction_category_id: editInstruction.categoryId,
        user_id: null,
      };
      await instructionApi.editInstruction(payload);
      await loadInstructionsByCategory(editInstruction.categoryId);
      setOpenEditInstructionModal(false);
    } catch (err) {
      setError(
        "Ошибка при редактировании инструкции: " +
          (err instanceof Error ? err.message : "Неизвестная ошибка")
      );
    }
  };

  // Open Delete Instruction
  const handleOpenDeleteInstruction = (instruction: Instruction) => {
    setSelectedInstruction(instruction);
    setOpenDeleteInstructionDialog(true);
  };

  // Delete Instruction
  const handleDeleteInstruction = async () => {
    if (!selectedInstruction) return;
    try {
      // Локально удаляем из состояния
      setInstructions((prev) => prev.filter((instr) => instr.id !== selectedInstruction.id));
      setOpenDeleteInstructionDialog(false);
      setOpenDetailsModal(false);
    } catch (err) {
      setError(
        "Ошибка при удалении инструкции: " +
          (err instanceof Error ? err.message : "Неизвестная ошибка")
      );
    }
  };

  // Category Actions Menu handlers
  const handleCategoryMenuOpen = (event: React.MouseEvent<HTMLElement>, category: InstructionCategory) => {
    setCategoryAnchorEl(event.currentTarget);
    setSelectedCategoryForMenu(category);
  };
  const handleCategoryMenuClose = () => {
    setCategoryAnchorEl(null);
    setSelectedCategoryForMenu(null);
  };

  // Instruction Actions Menu handlers
  const handleInstructionMenuOpen = (event: React.MouseEvent<HTMLElement>, instruction: Instruction) => {
    setInstructionAnchorEl(event.currentTarget);
    setSelectedInstructionForMenu(instruction);
  };
  const handleInstructionMenuClose = () => {
    setInstructionAnchorEl(null);
    setSelectedInstructionForMenu(null);
  };

  // Toggle stars
  const toggleFolderStar = (id: number) => {
    setStarredFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleFileStar = (id: number) => {
    setStarredFiles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Helpers for category sizing info
  const getCategoryStatsText = (categoryId: number) => {
    const isCurrent = categoryId === activeCategoryId;
    const count = isCurrent ? instructions.length : Math.floor(Math.abs(Math.sin(categoryId) * 10)) + 3;
    const size = isCurrent ? `${(instructions.length * 1.5 || 2.4).toFixed(1)} MB` : `${(count * 1.2).toFixed(1)} MB`;
    return `${size} • ${count} док.`;
  };

  // Filters & Sorting
  const filteredInstructions = instructions
    .filter((instruction) =>
      instruction.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const paginatedInstructions = filteredInstructions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDetails = (instruction: Instruction) => {
    setSelectedInstruction(instruction);
    setOpenDetailsModal(true);
  };

  const handleDownload = () => {
    if (selectedInstruction) {
      window.open(selectedInstruction.documentUrl, "_blank");
    }
  };

  const handleView = () => {
    if (selectedInstruction && selectedInstruction.documentUrl) {
      window.open(selectedInstruction.documentUrl, "_blank");
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: "1400px",
        width: "100%",
        mx: "auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Шапка страницы */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
            Инструкции
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Список документов по работе с приложением
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setOpenCategoryModal(true)}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Добавить категорию
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setNewInstruction((prev) => ({ ...prev, categoryId: activeCategoryId || 0 }));
              setOpenAddModal(true);
            }}
            disabled={categories.length === 0}
            sx={{ textTransform: "none", borderRadius: 2, boxShadow: "none" }}
          >
            Добавить инструкцию
          </Button>
        </Stack>
      </Stack>

      {/* Ошибки */}
      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Блок инструментов (Поиск, Сортировка, Сетка/Список) */}
      <Card sx={{ borderRadius: 2, boxShadow: "var(--mui-shadows-1, 0px 1px 3px rgba(0,0,0,0.05))" }}>
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <TextField
              placeholder="Поиск"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: { sm: 320 } }}
            />
            <Stack direction="row" spacing={2} sx={{ width: { xs: "100%", sm: "auto" } }}>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                size="small"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="desc">Сначала новые</MenuItem>
                <MenuItem value="asc">Сначала старые</MenuItem>
              </Select>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_e, value) => value && setViewMode(value)}
                size="small"
              >
                <ToggleButton value="grid">
                  <GridViewIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="list">
                  <ListIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* СЕКЦИЯ КАТЕГОРИЙ (ПАПКИ) */}
      <Box>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }} color="text.primary">
          Категории (Папки)
        </Typography>
        <Grid container spacing={3}>
          {categories.map((category) => {
            const isSelected = activeCategoryId === category.id;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={category.id}>
                <Card
                  sx={{
                    position: "relative",
                    border: "1px solid",
                    borderColor: isSelected ? "primary.main" : "divider",
                    borderRadius: 2.5,
                    cursor: "pointer",
                    boxShadow: isSelected ? "0px 4px 12px rgba(99, 102, 241, 0.1)" : "none",
                    bgcolor: isSelected ? "action.selected" : "background.paper",
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                      borderColor: isSelected ? "primary.main" : "text.secondary",
                    },
                  }}
                  onClick={() => loadInstructionsByCategory(category.id)}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, pt: 1.5 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFolderStar(category.id);
                      }}
                      sx={{ color: starredFolders[category.id] ? "warning.main" : "text.disabled" }}
                    >
                      {starredFolders[category.id] ? <StarFilledIcon /> : <StarOutlineIcon />}
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryMenuOpen(e, category);
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  <Stack alignItems="center" sx={{ pb: 1 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "action.hover",
                      }}
                    >
                      <FolderIcon />
                    </Box>
                  </Stack>

                  <Divider />

                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" noWrap fontWeight={600} color="text.primary" sx={{ mb: 0.5 }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {getCategoryStatsText(category.id)}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" display="block">
                      Создано: 28.07.2026
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            );
          })}
          {/* Карта быстрого добавления категории */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              sx={{
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2.5,
                cursor: "pointer",
                bgcolor: "transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 185,
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "action.hover",
                  borderColor: "primary.main",
                },
              }}
              onClick={() => setOpenCategoryModal(true)}
            >
              <AddIcon sx={{ fontSize: 32, color: "text.secondary", mb: 1 }} />
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                Создать категорию
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* СЕКЦИЯ ИНСТРУКЦИЙ (ФАЙЛЫ) */}
      <Box>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }} color="text.primary">
          Инструкции в выбранной категории
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : paginatedInstructions.length === 0 ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              p: 5,
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 2.5,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              В этой категории пока нет документов.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                setNewInstruction((prev) => ({ ...prev, categoryId: activeCategoryId || 0 }));
                setOpenAddModal(true);
              }}
              disabled={!activeCategoryId}
            >
              Добавить первый документ
            </Button>
          </Stack>
        ) : (
          <Grid container spacing={3}>
            {paginatedInstructions.map((instruction) => (
              <Grid
                size={viewMode === "grid" ? { xs: 12, sm: 6, md: 4, lg: 3 } : { xs: 12 }}
                key={instruction.id}
              >
                <Card
                  sx={{
                    borderRadius: 2.5,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                      borderColor: "text.secondary",
                    },
                    bgcolor: "background.paper",
                  }}
                  onClick={() => handleOpenDetails(instruction)}
                >
                  {viewMode === "grid" ? (
                    // Сетка (Grid)
                    <>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, pt: 1.5 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFileStar(instruction.id);
                          }}
                          sx={{ color: starredFiles[instruction.id] ? "warning.main" : "text.disabled" }}
                        >
                          {starredFiles[instruction.id] ? <StarFilledIcon /> : <StarOutlineIcon />}
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstructionMenuOpen(e, instruction);
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      <Stack alignItems="center" sx={{ pb: 1 }}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "action.hover",
                          }}
                        >
                          <FileIcon />
                        </Box>
                      </Stack>

                      <Divider />

                      <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" noWrap fontWeight={600} color="text.primary" sx={{ mb: 0.5 }}>
                          {instruction.name}
                        </Typography>

                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {instruction.size}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar
                              src={instruction.creator.avatar}
                              sx={{ width: 24, height: 24 }}
                            />
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 80 }}>
                              {instruction.creator.fullName.split(" ")[0]}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Typography variant="caption" color="text.disabled" display="block">
                          Добавлено: {instruction.createdAt}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    // Список (List)
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 1.5, px: 2 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFileStar(instruction.id);
                        }}
                        sx={{ color: starredFiles[instruction.id] ? "warning.main" : "text.disabled" }}
                      >
                        {starredFiles[instruction.id] ? <StarFilledIcon /> : <StarOutlineIcon />}
                      </IconButton>

                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "action.hover",
                        }}
                      >
                        <FileIcon style={{ width: 24, height: 24 }} />
                      </Box>

                      <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ flexGrow: 1, minWidth: 150 }}>
                        {instruction.name}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                        {instruction.size}
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 140 }}>
                        <Avatar
                          src={instruction.creator.avatar}
                          sx={{ width: 24, height: 24 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {instruction.creator.fullName}
                        </Typography>
                      </Stack>

                      <Typography variant="caption" color="text.disabled" sx={{ minWidth: 120 }}>
                        Добавлено: {instruction.createdAt}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInstructionMenuOpen(e, instruction);
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  )}
                </Card>
              </Grid>
            ))}

            {/* Карта быстрого добавления инструкции */}
            {viewMode === "grid" && (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card
                  sx={{
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 2.5,
                    cursor: "pointer",
                    bgcolor: "transparent",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 185,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "action.hover",
                      borderColor: "primary.main",
                    },
                  }}
                  onClick={() => {
                    setNewInstruction((prev) => ({ ...prev, categoryId: activeCategoryId || 0 }));
                    setOpenAddModal(true);
                  }}
                >
                  <AddIcon sx={{ fontSize: 32, color: "text.secondary", mb: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                    Добавить инструкцию
                  </Typography>
                </Card>
              </Grid>
            )}
          </Grid>
        )}
      </Box>

      {/* Пагинация */}
      {!loading && filteredInstructions.length > 0 && (
        <TablePagination
          component="div"
          count={filteredInstructions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Записей на странице:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} из ${count}`}
        />
      )}

      {/* Выпадающее меню действий для категорий */}
      <Menu
        anchorEl={categoryAnchorEl}
        open={Boolean(categoryAnchorEl)}
        onClose={handleCategoryMenuClose}
      >
        <MenuItem
          onClick={() => {
            if (selectedCategoryForMenu) {
              handleOpenEditCategory(selectedCategoryForMenu);
            }
            handleCategoryMenuClose();
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Редактировать
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedCategoryForMenu) {
              handleOpenDeleteCategory(selectedCategoryForMenu);
            }
            handleCategoryMenuClose();
          }}
          sx={{ color: "error.main" }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Удалить
        </MenuItem>
      </Menu>

      {/* Выпадающее меню действий для инструкций */}
      <Menu
        anchorEl={instructionAnchorEl}
        open={Boolean(instructionAnchorEl)}
        onClose={handleInstructionMenuClose}
      >
        <MenuItem
          onClick={() => {
            if (selectedInstructionForMenu) {
              window.open(selectedInstructionForMenu.documentUrl, "_blank");
            }
            handleInstructionMenuClose();
          }}
        >
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> Просмотреть
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedInstructionForMenu) {
              window.open(selectedInstructionForMenu.documentUrl, "_blank");
            }
            handleInstructionMenuClose();
          }}
        >
          <DownloadIcon fontSize="small" sx={{ mr: 1 }} /> Скачать
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedInstructionForMenu) {
              handleOpenEditInstruction(selectedInstructionForMenu);
            }
            handleInstructionMenuClose();
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Редактировать
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedInstructionForMenu) {
              handleOpenDeleteInstruction(selectedInstructionForMenu);
            }
            handleInstructionMenuClose();
          }}
          sx={{ color: "error.main" }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Удалить
        </MenuItem>
      </Menu>

      {/* Модальное окно добавления категории */}
      <Modal open={openCategoryModal} onClose={() => setOpenCategoryModal(false)}>
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
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" gutterBottom>
              Добавить категорию
            </Typography>
            <IconButton onClick={() => setOpenCategoryModal(false)} size="small">
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
            fullWidth
          >
            Сохранить
          </Button>
        </Box>
      </Modal>

      {/* Модальное окно редактирования категории */}
      <Modal open={openEditCategoryModal} onClose={() => setOpenEditCategoryModal(false)}>
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
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" gutterBottom>
              Редактировать категорию
            </Typography>
            <IconButton onClick={() => setOpenEditCategoryModal(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
          <TextField
            label="Название категории"
            fullWidth
            value={editCategory.name}
            onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditCategory}
            disabled={!editCategory.name.trim()}
            fullWidth
          >
            Сохранить
          </Button>
        </Box>
      </Modal>

      {/* Диалог подтверждения удаления категории */}
      <Dialog open={openDeleteCategoryDialog} onClose={() => setOpenDeleteCategoryDialog(false)}>
        <DialogTitle>Удалить категорию</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить категорию "{selectedCategory?.name}"? Все инструкции в этой категории также будут удалены.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteCategoryDialog(false)}>Отмена</Button>
          <Button onClick={handleDeleteCategory} color="error" variant="contained">
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
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
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
            onChange={(e) => setNewInstruction({ ...newInstruction, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Select
            value={newInstruction.categoryId}
            onChange={(e) => setNewInstruction({ ...newInstruction, categoryId: Number(e.target.value) })}
            displayEmpty
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value={0} disabled>
              Выберите категорию
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setNewInstruction({ ...newInstruction, file: e.target.files?.[0] || null })}
            style={{ display: "none" }}
          />
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            sx={{ mb: 2 }}
            fullWidth
          >
            Выберите файл {newInstruction.file ? `: ${newInstruction.file.name}` : ""}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddInstruction}
            disabled={!newInstruction.name || !newInstruction.file || !newInstruction.categoryId}
            fullWidth
          >
            Сохранить
          </Button>
        </Box>
      </Modal>

      {/* Модальное окно редактирования инструкции */}
      <Modal open={openEditInstructionModal} onClose={() => setOpenEditInstructionModal(false)}>
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
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" gutterBottom>
              Редактировать инструкцию
            </Typography>
            <IconButton onClick={() => setOpenEditInstructionModal(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
          <TextField
            label="Название инструкции"
            fullWidth
            value={editInstruction.name}
            onChange={(e) => setEditInstruction({ ...editInstruction, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Select
            value={editInstruction.categoryId}
            onChange={(e) => setEditInstruction({ ...editInstruction, categoryId: Number(e.target.value) })}
            displayEmpty
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value={0} disabled>
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
            fullWidth
          >
            Сохранить
          </Button>
        </Box>
      </Modal>

      {/* Диалог подтверждения удаления инструкции */}
      <Dialog open={openDeleteInstructionDialog} onClose={() => setOpenDeleteInstructionDialog(false)}>
        <DialogTitle>Удалить инструкцию</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить инструкцию "{selectedInstruction?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteInstructionDialog(false)}>Отмена</Button>
          <Button onClick={handleDeleteInstruction} color="error" variant="contained">
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
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" gutterBottom sx={{ pr: 4 }}>
                  {selectedInstruction.name}
                </Typography>
                <IconButton onClick={() => setOpenDetailsModal(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </Stack>
              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Создал:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={selectedInstruction.creator.avatar} sx={{ width: 32, height: 32 }} />
                    <Typography variant="body2">{selectedInstruction.creator.fullName}</Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Дата создания:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography variant="body2">{selectedInstruction.createdAt}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Размер:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography variant="body2">{selectedInstruction.size}</Typography>
                </Grid>
              </Grid>
              <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="flex-end">
                <IconButton color="primary" onClick={handleDownload} title="Скачать">
                  <DownloadIcon />
                </IconButton>
                <IconButton color="primary" onClick={handleView} title="Просмотреть">
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
                  onClick={() => handleOpenDeleteInstruction(selectedInstruction)}
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
