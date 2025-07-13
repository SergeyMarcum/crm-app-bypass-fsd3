// src/pages/instructions/ui.tsx
import React, { useState, useRef } from "react"; // Импортируем useRef
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
  AvatarGroup,
  Button,
  Modal,
  TablePagination,
  InputAdornment,
  IconButton,
  Grid, // Убедимся, что Grid импортирован
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close"; // Импортируем CloseIcon

// Тип для инструкции
interface Instruction {
  id: number;
  name: string;
  size: string;
  createdAt: string;
  creator: {
    avatar: string;
    fullName: string;
  };
  documentUrl: string; // Добавим URL документа для демонстрации открытия в новой вкладке
}

const mockInstructions: Instruction[] = [
  {
    id: 1,
    name: "Инструкция Администратора. Работа в планшете",
    size: "5 MB",
    createdAt: "Апр. 4, 2025",
    creator: { avatar: "/assets/avatar-7.png", fullName: "Иванов Иван" },
    documentUrl: "https://www.africau.edu/images/default/sample.pdf", // Пример PDF
  },
  {
    id: 2,
    name: "Инструкция пользователя. Работа в планшете",
    size: "1.2 GB",
    createdAt: "Апр. 4, 2025",
    creator: { avatar: "/assets/avatar-10.png", fullName: "Петров Петр" },
    documentUrl: "https://www.africau.edu/images/default/sample.pdf",
  },
  {
    id: 3,
    name: "Инструкция Администратора. Работа в системе",
    size: "325.2 MB",
    createdAt: "Апр. 4, 2025",
    creator: { avatar: "/assets/avatar-11.png", fullName: "Сидоров Сергей" },
    documentUrl: "https://www.africau.edu/images/default/sample.pdf",
  },
  {
    id: 4,
    name: "Инструкция пользователя. Работа в системе",
    size: "1.2 MB",
    createdAt: "Апр. 4, 2025",
    creator: { avatar: "/assets/avatar-7.png", fullName: "Иванов Иван" },
    documentUrl: "https://www.africau.edu/images/default/sample.pdf",
  },
  {
    id: 5,
    name: "Инструкция, как заполнять журнал",
    size: "16.7 MB",
    createdAt: "Апр. 4, 2025",
    creator: { avatar: "/assets/avatar-11.png", fullName: "Сидоров Сергей" },
    documentUrl: "https://www.africau.edu/images/default/sample.pdf",
  },
  {
    id: 6,
    name: "Приказ. Список объектов",
    size: "13.37 KB",
    createdAt: "Апр. 4, 2025",
    creator: { avatar: "/assets/avatar-2.png", fullName: "Козлов Алексей" },
    documentUrl: "https://www.africau.edu/images/default/sample.pdf",
  },
  {
    id: 7,
    name: "Правила проверки объектов",
    size: "2.3 MB",
    createdAt: "Апр. 4, 2025",
    creator: { avatar: "/assets/avatar-2.png", fullName: "Козлов Алексей" },
    documentUrl: "https://www.africau.edu/images/default/sample.pdf",
  },
  {
    id: 8,
    name: "Инструкция по контролю проверки объектов",
    size: "684.1 KB",
    createdAt: "Апр. 4, 2025",
    creator: { avatar: "/assets/avatar-11.png", fullName: "Сидоров Сергей" },
    documentUrl: "https://www.africau.edu/images/default/sample.pdf",
  },
  {
    id: 9,
    name: "Справочник служб",
    size: "5.2 MB",
    createdAt: "Апр. 4, 2025",
    creator: { avatar: "/assets/avatar-11.png", fullName: "Сидоров Сергей" },
    documentUrl: "https://www.africau.edu/images/default/sample.pdf",
  },
];

const InstructionsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedInstruction, setSelectedInstruction] =
    useState<Instruction | null>(null);
  const [newInstruction, setNewInstruction] = useState({
    name: "",
    file: null as File | null,
  });
  const [instructions, setInstructions] =
    useState<Instruction[]>(mockInstructions);

  const fileInputRef = useRef<HTMLInputElement>(null); // Ref для скрытого input file

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

  const handleAddInstruction = () => {
    if (newInstruction.name && newInstruction.file) {
      const newId = instructions.length + 1;
      const newInstr: Instruction = {
        id: newId,
        name: newInstruction.name,
        size: `${(newInstruction.file.size / 1024 / 1024).toFixed(2)} MB`, // Пример размера
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        creator: {
          avatar: "/assets/avatar-1.png", // Заменить на данные текущего пользователя
          fullName: "Текущий Пользователь", // Заменить на данные текущего пользователя
        },
        documentUrl: "https://www.africau.edu/images/default/sample.pdf", // Пример URL для новой инструкции
      };
      setInstructions([...instructions, newInstr]);
      setOpenAddModal(false);
      setNewInstruction({ name: "", file: null });
    }
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

  const handleDelete = () => {
    if (selectedInstruction) {
      setInstructions(
        instructions.filter((instr) => instr.id !== selectedInstruction.id)
      );
      setOpenDetailsModal(false);
      console.log(`Удалена инструкция: ${selectedInstruction.name}`);
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

      {/* Список инструкций */}
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
            sx={{ display: "flex", flexDirection: "column", cursor: "pointer" }}
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
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                Добавлено: {instruction.createdAt}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

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
      >
        Добавить инструкцию
      </Button>

      {/* Модальное окно добавления */}
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
            Выберите файл {newInstruction.file ? `: ${newInstruction.file.name}` : ""}
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddInstruction}
            disabled={!newInstruction.name || !newInstruction.file}
          >
            Сохранить
          </Button>
        </Box>
      </Modal>

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
                <IconButton onClick={() => setOpenDetailsModal(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </Stack>
              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}> {/* Исправлено: size={{ xs: 4 }} на item xs={4} */}
                  <Typography variant="body2" color="text.secondary">
                    Создал:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 8 }}> {/* Исправлено */}
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
                <Grid size={{ xs: 4 }}> {/* Исправлено */}
                  <Typography variant="body2" color="text.secondary">
                    Дата создания:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 8 }}> {/* Исправлено */}
                  <Typography variant="body2">
                    {selectedInstruction.createdAt}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4 }}> {/* Исправлено */}
                  <Typography variant="body2" color="text.secondary">
                    Размер:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 8 }}> {/* Исправлено */}
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
                  color="error"
                  onClick={handleDelete}
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

export default InstructionsPage;