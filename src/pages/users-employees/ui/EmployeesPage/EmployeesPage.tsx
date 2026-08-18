// src/pages/users-employees/ui/EmployeesPage/EmployeesPage.tsx
import { useState, useEffect } from "react";
import type { JSX } from "react";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Avatar,
  Chip,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import { userApi } from "@/shared/api/user";
import { User, EditUserPayload } from "@/entities/user/types";

const statusTabs = [
  { label: "Все", value: null },
  { label: "Работает", value: 1 },
  { label: "Больничный", value: 5 },
  { label: "Командировка", value: 4 },
  { label: "Отпуск", value: 3 },
  { label: "Уволены", value: 2 },
];

const roleMap: Record<number, string> = {
  1: "Администратор ИТЦ",
  2: "Администратор Филиала",
  3: "Мастер",
  4: "Оператор",
  5: "Наблюдатель Филиала",
  6: "Гость",
  7: "Уволенные",
  8: "Администратор Общества",
};

const statusMap: Record<number, string> = {
  1: "Работает",
  2: "Уволен",
  3: "Отпуск",
  4: "Командировка",
  5: "Больничный",
};

// Определяем роли, которые считаются "сотрудниками"
const EMPLOYEE_ROLES = [2, 3, 4]; // Администратор филиала, Мастер, Оператор

// Custom SVG Icons
const UncheckedCheckboxIcon = () => (
  <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" style={{ color: "#98A2B3" }}>
    <path clipRule="evenodd" d="M8 2C4.68629 2 2 4.68629 2 8V16C2 19.3137 4.68629 22 8 22H16C19.3137 22 22 19.3137 22 16V8C22 4.68629 19.3137 2 16 2H8ZM8 4C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20H16C18.2091 20 20 18.2091 20 16V8C20 5.79086 18.2091 4 16 4H8Z" fill="currentColor" fillRule="evenodd"></path>
  </svg>
);

const CheckedCheckboxIcon = () => (
  <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" style={{ color: "#0079c2" }}>
    <rect width="20" height="20" x="2" y="2" rx="6" fill="currentColor" />
    <path d="M7 12L10 15L17 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EmployeesPage = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<number | null>(null);

  // Search input filters
  const [emailFilter, setEmailFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Selection states
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Editing states (Dialog based)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  // Bulk action states
  const [isBulkStatusOpen, setIsBulkStatusOpen] = useState(false);
  const [newBulkStatus, setNewBulkStatus] = useState<number | "">("");

  useEffect(() => {
    const load = async () => {
      try {
        const company = await userApi.getCompanyUsers();
        const filteredEmployees = company.users.filter((user) =>
          EMPLOYEE_ROLES.includes(user.role_id)
        );
        const normalizedUsers: User[] = filteredEmployees.map((user) => ({
          ...user,
          id: user.id ?? null,
          status_id: user.status_id ?? null,
          domain: user.domain ?? null,
          name: user.name ?? null,
          photo: user.photo ?? null,
        }));
        setUsers(normalizedUsers);

        const departmentList = Array.from(
          new Set(
            filteredEmployees
              .map((u) => u.department)
              .filter(
                (d): d is string => typeof d === "string" && d.trim() !== ""
              )
          )
        );
        setDepartments(departmentList);
      } catch (error) {
        console.error("Ошибка при загрузке сотрудников:", error);
      }
    };

    load();
  }, []);

  const handleEditClick = (user: User): void => {
    if (user.id == null) return;
    setEditingUserId(user.id);
    setEditedUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const handleSaveDialog = async (): Promise<void> => {
    if (editingUserId == null) return;
    const original = users.find((u) => u.id === editingUserId);
    if (!original) return;

    const payload: EditUserPayload = {
      user_id: editingUserId,
      full_name: editedUser.full_name ?? original.full_name ?? "",
      position: editedUser.position ?? original.position ?? "",
      company: editedUser.company ?? original.company ?? "",
      department: editedUser.department ?? original.department ?? "",
      phone: editedUser.phone ?? original.phone ?? "",
      role_id: Number(editedUser.role_id ?? original.role_id),
      status_id: Number(editedUser.status_id ?? original.status_id ?? 1),
    };

    try {
      await userApi.editUser(payload);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUserId
            ? {
                ...u,
                ...payload,
                email: editedUser.email !== undefined ? editedUser.email : u.email,
              }
            : u
        )
      );
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
    }

    setIsEditDialogOpen(false);
    setEditingUserId(null);
    setEditedUser({});
  };

  // Checkbox handlers
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const pageIds = paginatedUsers.map((u) => u.id).filter((id): id is number => id != null);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = paginatedUsers.map((u) => u.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Action handlers
  const handleBulkAction = (action: string) => {
    if (action === "change_status") {
      setNewBulkStatus("");
      setIsBulkStatusOpen(true);
    }
  };

  const handleBulkChangeStatus = async (): Promise<void> => {
    if (newBulkStatus === "") return;
    try {
      await Promise.all(
        selectedIds.map(async (id) => {
          const u = users.find((user) => user.id === id);
          if (!u) return;
          const payload: EditUserPayload = {
            user_id: id,
            full_name: u.full_name || "",
            position: u.position || "",
            company: u.company || "",
            department: u.department || "",
            phone: u.phone || "",
            role_id: u.role_id,
            status_id: newBulkStatus,
          };
          await userApi.editUser(payload);
        })
      );
      setUsers((prev) =>
        prev.map((u) =>
          selectedIds.includes(u.id || 0)
            ? { ...u, status_id: newBulkStatus }
            : u
        )
      );
      setSelectedIds([]);
    } catch (err) {
      console.error("Ошибка при массовом изменении статуса:", err);
    }
    setIsBulkStatusOpen(false);
  };

  // Pagination handlers
  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter application
  const filtered = users
    .filter((u) => (statusFilter !== null ? u.status_id === statusFilter : true))
    .filter((u) => !emailFilter ? true : (u.email || "").toLowerCase().includes(emailFilter.toLowerCase()))
    .filter((u) => !phoneFilter ? true : (u.phone || "").toLowerCase().includes(phoneFilter.toLowerCase()))
    .filter((u) => !deptFilter ? true : (u.department || "").toLowerCase().includes(deptFilter.toLowerCase()))
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

  const paginatedUsers = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const allOnPageSelected = paginatedUsers.length > 0 && paginatedUsers.every((u) => selectedIds.includes(u.id || 0));

  return (
    <Box p={3} sx={{ backgroundColor: "#FCFDFD", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#101828", mb: 0.5 }}>
        Список сотрудников
      </Typography>
      <Typography variant="body1" sx={{ color: "#475467", mb: 3 }}>
        Информация по сотрудникам данного филиала
      </Typography>

      {/* Tabs */}
      <Tabs
        value={statusFilter}
        onChange={(_, value) => {
          setStatusFilter(value);
          setPage(0);
        }}
        sx={{
          mb: 3,
          borderBottom: "1px solid #EAECF0",
          "& .MuiTabs-indicator": {
            backgroundColor: "primary.main",
            height: "3px",
            borderRadius: "3px 3px 0 0",
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontSize: "15px",
            fontWeight: 500,
            color: "#475467",
            px: 1,
            mx: 1.5,
            minWidth: 0,
            "&.Mui-selected": {
              color: "primary.main",
              fontWeight: 600,
            },
          },
        }}
      >
        {statusTabs.map((tab) => (
          <Tab key={tab.label} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

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
          label="Email"
          placeholder="Поиск по email..."
          value={emailFilter}
          onChange={(e) => {
            setEmailFilter(e.target.value);
            setPage(0);
          }}
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
              endAdornment: emailFilter && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setEmailFilter("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          size="small"
          label="Телефон"
          placeholder="Поиск по телефону..."
          value={phoneFilter}
          onChange={(e) => {
            setPhoneFilter(e.target.value);
            setPage(0);
          }}
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
              endAdornment: phoneFilter && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setPhoneFilter("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Отдел</InputLabel>
          <Select
            value={deptFilter}
            label="Отдел"
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setPage(0);
            }}
            sx={{ borderRadius: "8px" }}
          >
            <MenuItem value="">Все отделы</MenuItem>
            {departments.map((dep) => (
              <MenuItem key={dep} value={dep}>
                {dep}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedIds.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="bulk-action-select-label">Действие</InputLabel>
            <Select
              labelId="bulk-action-select-label"
              value=""
              label="Действие"
              onChange={(e) => handleBulkAction(e.target.value as string)}
              sx={{
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                  borderWidth: "1.5px",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.dark",
                },
              }}
            >
              <MenuItem value="change_status">Сменить статус</MenuItem>
            </Select>
          </FormControl>
        )}

        {(emailFilter || phoneFilter || deptFilter) && (
          <Button
            variant="text"
            color="error"
            size="small"
            onClick={() => {
              setEmailFilter("");
              setPhoneFilter("");
              setDeptFilter("");
              setPage(0);
            }}
            sx={{ textTransform: "none", fontWeight: 600, ml: "auto" }}
          >
            Сбросить фильтры
          </Button>
        )}
      </Box>

      {/* Styled MUI Table */}
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
              <TableCell padding="checkbox" sx={{ borderBottom: "1px solid #EAECF0", pl: 3, py: 2 }}>
                <Checkbox
                  icon={<UncheckedCheckboxIcon />}
                  checkedIcon={<CheckedCheckboxIcon />}
                  indeterminate={selectedIds.length > 0 && !allOnPageSelected}
                  checked={allOnPageSelected}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2 }}>
                ФИО сотрудника
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2 }}>
                Отдел
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2 }}>
                Должность
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2 }}>
                Телефон
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontSize: "12px", fontWeight: 600, py: 2 }}>
                Статус
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  Сотрудники не найдены
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => {
                const isSelected = selectedIds.includes(user.id || 0);

                return (
                  <TableRow
                    key={user.id}
                    hover
                    selected={isSelected}
                    sx={{
                      height: "72px",
                      "&.Mui-selected": {
                        backgroundColor: "#F9FAFB",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "#F3F4F6",
                      },
                    }}
                  >
                    {/* Checkbox */}
                    <TableCell padding="checkbox" sx={{ borderBottom: "1px solid #EAECF0", pl: 3 }}>
                      <Checkbox
                        icon={<UncheckedCheckboxIcon />}
                        checkedIcon={<CheckedCheckboxIcon />}
                        checked={isSelected}
                        onChange={() => handleSelectOne(user.id || 0)}
                      />
                    </TableCell>

                    {/* ФИО сотрудника */}
                    <TableCell sx={{ borderBottom: "1px solid #EAECF0" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          src={user.photo || undefined}
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: "#F2F4F7",
                            color: "#475467",
                            fontSize: "14px",
                            fontWeight: 600,
                          }}
                        >
                          {user.full_name ? user.full_name[0].toUpperCase() : (user.name ? user.name[0].toUpperCase() : "?")}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            onClick={() => handleEditClick(user)}
                            sx={{
                              fontWeight: 600,
                              color: "#101828",
                              cursor: "pointer",
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            {user.full_name || user.name || "—"}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#475467", fontWeight: 400 }}>
                            {user.email || "—"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Отдел */}
                    <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400 }}>
                      {user.department || "—"}
                    </TableCell>

                    {/* Должность */}
                    <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400 }}>
                      {user.position || "—"}
                    </TableCell>

                    {/* Телефон */}
                    <TableCell sx={{ borderBottom: "1px solid #EAECF0", color: "#475467", fontWeight: 400 }}>
                      {user.phone || "—"}
                    </TableCell>

                    {/* Статус */}
                    <TableCell sx={{ borderBottom: "1px solid #EAECF0" }}>
                      {(() => {
                        const statusLabel = user.status_id ? statusMap[user.status_id] || "Неизвестно" : "Неизвестно";
                        if (user.status_id === 1) {
                          return (
                            <Chip
                              icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#10B981" viewBox="0 0 256 256" style={{ marginLeft: 8 }}>
                                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>
                                </svg>
                              }
                              label={statusLabel}
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
                        if (user.status_id === 2) {
                          return (
                            <Chip
                              icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#EF4444" viewBox="0 0 256 256" style={{ marginLeft: 8 }}>
                                  <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"></path>
                                </svg>
                              }
                              label={statusLabel}
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
                        // Default warning status for vacation, sickness, trip
                        return (
                          <Chip
                            icon={
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#F59E0B" viewBox="0 0 256 256" style={{ marginLeft: 8 }}>
                                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z"></path>
                              </svg>
                            }
                            label={statusLabel}
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
                      })()}
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
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          sx={{
            borderTop: "1px solid #EAECF0",
            color: "#475467",
            fontSize: "14px",
            "& .MuiTablePagination-selectLabel": {
              color: "#475467",
            },
            "& .MuiTablePagination-displayedRows": {
              color: "#475467",
            },
          }}
        />
      </TableContainer>

      {/* Premium Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              boxShadow: "0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)",
              p: 1.5,
            },
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#101828" }}>
            Редактирование сотрудника
          </Typography>
          <IconButton onClick={() => setIsEditDialogOpen(false)} size="small" sx={{ color: "#98A2B3" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: "#F2F4F7" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2.5,
              mt: 0.5,
            }}
          >
            <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
              <TextField
                fullWidth
                label="ФИО"
                size="medium"
                value={editedUser.full_name ?? ""}
                onChange={(e) => setEditedUser((p) => ({ ...p, full_name: e.target.value }))}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Должность"
                size="medium"
                value={editedUser.position ?? ""}
                onChange={(e) => setEditedUser((p) => ({ ...p, position: e.target.value }))}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Компания"
                size="medium"
                value={editedUser.company ?? ""}
                onChange={(e) => setEditedUser((p) => ({ ...p, company: e.target.value }))}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Email"
                size="medium"
                value={editedUser.email ?? ""}
                onChange={(e) => setEditedUser((p) => ({ ...p, email: e.target.value }))}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Телефон"
                size="medium"
                value={editedUser.phone ?? ""}
                onChange={(e) => setEditedUser((p) => ({ ...p, phone: e.target.value }))}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>

            <Box>
              <FormControl fullWidth size="medium">
                <InputLabel shrink>Отдел</InputLabel>
                <Select
                  notched
                  value={editedUser.department ?? ""}
                  label="Отдел"
                  onChange={(e) => setEditedUser((p) => ({ ...p, department: e.target.value }))}
                >
                  <MenuItem value="">Не указано</MenuItem>
                  {departments.map((dep) => (
                    <MenuItem key={dep} value={dep}>
                      {dep}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <FormControl fullWidth size="medium">
                <InputLabel shrink>Права доступа</InputLabel>
                <Select
                  notched
                  value={editedUser.role_id ?? ""}
                  label="Права доступа"
                  onChange={(e) => setEditedUser((p) => ({ ...p, role_id: Number(e.target.value) }))}
                >
                  {Object.entries(roleMap).map(([id, name]) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
              <FormControl fullWidth size="medium">
                <InputLabel shrink>Статус</InputLabel>
                <Select
                  notched
                  value={editedUser.status_id ?? ""}
                  label="Статус"
                  onChange={(e) => setEditedUser((p) => ({ ...p, status_id: Number(e.target.value) }))}
                >
                  {Object.entries(statusMap).map(([id, name]) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1.5 }}>
          <Button
            onClick={() => setIsEditDialogOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              borderColor: "#D0D5DD",
              color: "#344054",
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              py: 1,
              "&:hover": {
                borderColor: "#D0D5DD",
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSaveDialog}
            variant="contained"
            sx={{
              borderRadius: "8px",
              backgroundColor: "primary.main",
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              py: 1,
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Change Status Dialog */}
      <Dialog
        open={isBulkStatusOpen}
        onClose={() => setIsBulkStatusOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              boxShadow: "0px 20px 24px -4px rgba(16, 24, 40, 0.08)",
              p: 1.5,
            },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#101828" }}>
            Сменить статус ({selectedIds.length})
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2, pt: 1 }}>
          <FormControl fullWidth size="medium" sx={{ mt: 1 }}>
            <InputLabel>Новый статус</InputLabel>
            <Select
              value={newBulkStatus}
              label="Новый статус"
              onChange={(e) => setNewBulkStatus(Number(e.target.value))}
            >
              {Object.entries(statusMap).map(([id, name]) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1.5 }}>
          <Button
            onClick={() => setIsBulkStatusOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              borderColor: "#D0D5DD",
              color: "#344054",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleBulkChangeStatus}
            variant="contained"
            disabled={newBulkStatus === ""}
            sx={{
              borderRadius: "8px",
              backgroundColor: "primary.main",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            Применить
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};
