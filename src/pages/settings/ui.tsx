// src/pages/settings/ui.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  TablePagination,
} from "@mui/material";
import { useAuthStore } from "@features/auth/model/store";
import { User } from "@entities/user/types";
import { getEmployeesByDepartment } from "@shared/api/employee";
import { statusMap } from "@entities/user/model/normalize";
import { useThemeStore } from "@shared/processes/theme/store";
import {
  Person as PersonIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as LightModeIcon,
  SettingsBrightness as SystemIcon,
  Group as GroupIcon,
} from "@mui/icons-material";

// Стили для карточек
const cardSx = {
  borderRadius: 2,
  boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
  bgcolor: "var(--mui-palette-background-paper)",
  minWidth: "1300px",
  mx: "auto",
};

interface ProfileTabProps {
  formData: Partial<User>;
  isCurrentUser: boolean;
  isAdmin: boolean;
}

interface EmployeeTabProps {
  employees: User[];
}

const ProfileTab: React.FC<ProfileTabProps> = ({ formData, isAdmin }) => {
  const { updateUser, logout } = useAuthStore();
  const [fullName, setFullName] = useState(formData.full_name || "");
  const [phone, setPhone] = useState(formData.phone || "");
  const [selectedStatusLabel, setSelectedStatusLabel] = useState(
    formData.status_id !== undefined && formData.status_id !== null
      ? statusMap[formData.status_id] || "Неизвестно"
      : "Неизвестно"
  );
  const [techSupportEmail, setTechSupportEmail] = useState(
    formData.tech_support_email || ""
  );

  useEffect(() => {
    setFullName(formData.full_name || "");
    setPhone(formData.phone || "");
    setSelectedStatusLabel(
      formData.status_id !== undefined && formData.status_id !== null
        ? statusMap[formData.status_id] || "Неизвестно"
        : "Неизвестно"
    );
    setTechSupportEmail(formData.tech_support_email || "");
  }, [formData]);

  const getStatusIdFromLabel = (label: string): number | null => {
    const entry = Object.entries(statusMap).find(
      ([, value]) => value === label
    );
    return entry ? parseInt(entry[0]) : null;
  };

  const handleSave = () => {
    const updatedData: Partial<User> = {
      full_name: fullName,
      phone: phone,
      status_id: getStatusIdFromLabel(selectedStatusLabel),
    };
    if (isAdmin) {
      updatedData.tech_support_email = techSupportEmail;
    }
    updateUser(updatedData);
  };

  const handleDelete = () => {
    updateUser({ status_id: 2 });
    logout();
  };

  return (
    <Card sx={cardSx}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "var(--mui-palette-primary-main)" }}>
            <PersonIcon />
          </Avatar>
        }
        title="Мой профиль"
        titleTypographyProps={{ variant: "h5", fontWeight: 600 }}
        subheader="Обновите информацию о вашем профиле"
        subheaderTypographyProps={{
          variant: "body2",
          color: "var(--mui-palette-text-secondary)",
        }}
      />
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={formData.photo || "/assets/avatar.png"}
              sx={{ width: 64, height: 64 }}
            />
            <Typography variant="subtitle1">
              {fullName || "Не указано"}
            </Typography>
          </Stack>
          <TextField
            label="Email"
            value={formData.email || "Не указано"}
            disabled
            fullWidth
            variant="outlined"
            sx={{
              "& .MuiInputBase-input": {
                color: "var(--mui-palette-text-primary)",
              },
              "& .MuiInputLabel-root": {
                color: "var(--mui-palette-text-secondary)",
              },
            }}
          />
          {isAdmin && (
            <TextField
              label="Email технической поддержки"
              value={techSupportEmail}
              onChange={(e) => setTechSupportEmail(e.target.value)}
              fullWidth
              variant="outlined"
              helperText="Это поле видно только администраторам филиала"
              sx={{
                "& .MuiInputBase-input": {
                  color: "var(--mui-palette-text-primary)",
                },
                "& .MuiInputLabel-root": {
                  color: "var(--mui-palette-text-secondary)",
                },
              }}
            />
          )}
          <TextField
            label="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              "& .MuiInputBase-input": {
                color: "var(--mui-palette-text-primary)",
              },
              "& .MuiInputLabel-root": {
                color: "var(--mui-palette-text-secondary)",
              },
            }}
          />
          <FormControl fullWidth>
            <InputLabel sx={{ color: "var(--mui-palette-text-secondary)" }}>
              Статус
            </InputLabel>
            <Select
              value={selectedStatusLabel}
              onChange={(e) => setSelectedStatusLabel(e.target.value as string)}
              label="Статус"
              sx={{
                "& .MuiSelect-select": {
                  color: "var(--mui-palette-text-primary)",
                },
              }}
            >
              {Object.entries(statusMap).map(([id, label]) => (
                <MenuItem key={id} value={label}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          sx={{ borderColor: "var(--mui-palette-error-main)" }}
        >
          Удалить профиль
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ bgcolor: "var(--mui-palette-primary-main)" }}
        >
          Сохранить
        </Button>
      </CardActions>
    </Card>
  );
};

const ThemeTab: React.FC = () => {
  const { themeMode, setThemeMode } = useThemeStore();

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThemeMode(event.target.value as "light" | "dark" | "system");
  };

  return (
    <Card sx={cardSx}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "var(--mui-palette-primary-main)" }}>
            <Brightness4Icon />
          </Avatar>
        }
        title="Настройки темы"
        titleTypographyProps={{ variant: "h5", fontWeight: 600 }}
        subheader="Выберите предпочитаемый режим отображения"
        subheaderTypographyProps={{
          variant: "body2",
          color: "var(--mui-palette-text-secondary)",
        }}
      />
      <CardContent>
        <FormControl component="fieldset">
          <RadioGroup value={themeMode} onChange={handleThemeChange}>
            <FormControlLabel
              value="light"
              control={<Radio />}
              label={
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: "var(--mui-palette-neutral-100)",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <LightModeIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">Светлый режим</Typography>
                    <Typography
                      variant="body2"
                      color="var(--mui-palette-text-secondary)"
                    >
                      Лучше всего подходит для яркого окружения
                    </Typography>
                  </Box>
                </Stack>
              }
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              value="dark"
              control={<Radio />}
              label={
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: "var(--mui-palette-neutral-100)",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <Brightness4Icon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">Темный режим</Typography>
                    <Typography
                      variant="body2"
                      color="var(--mui-palette-text-secondary)"
                    >
                      Рекомендуется для темных помещений
                    </Typography>
                  </Box>
                </Stack>
              }
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              value="system"
              control={<Radio />}
              label={
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: "var(--mui-palette-neutral-100)",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <SystemIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">Система</Typography>
                    <Typography
                      variant="body2"
                      color="var(--mui-palette-text-secondary)"
                    >
                      Адаптируется к теме вашего устройства
                    </Typography>
                  </Box>
                </Stack>
              }
            />
          </RadioGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
};

const DepartmentTab: React.FC<EmployeeTabProps> = ({ employees }) => {
  const sortedEmployees = [...employees].sort((a, b) => {
    const positionOrder: { [key: string]: number } = {
      "Начальник отдела": 1,
      "Заместитель начальника отдела": 2,
    };
    const aPosition = a.position || "";
    const bPosition = b.position || "";
    const aOrder = positionOrder[aPosition] || 3;
    const bOrder = positionOrder[bPosition] || 3;
    return aOrder - bOrder;
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedEmployees = sortedEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Card sx={cardSx}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "var(--mui-palette-primary-main)" }}>
            <GroupIcon />
          </Avatar>
        }
        title={`Мой отдел: ${employees[0]?.department || "Не указано"}`}
        titleTypographyProps={{ variant: "h5", fontWeight: 600 }}
        subheader="Список сотрудников вашего отдела"
        subheaderTypographyProps={{
          variant: "body2",
          color: "var(--mui-palette-text-secondary)",
        }}
      />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>ФИО / Email</TableCell>
              <TableCell>Должность</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Статус</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedEmployees.map((employee, index) => (
              <TableRow key={employee.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={employee.photo || "/assets/avatar.png"}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box>
                      <Typography
                        variant="body1"
                        color="var(--mui-palette-text-primary)"
                      >
                        {employee.full_name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="var(--mui-palette-text-secondary)"
                      >
                        {employee.email}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{employee.position || "Не указано"}</TableCell>
                <TableCell>{employee.phone || "Не указано"}</TableCell>
                <TableCell>
                  {employee.status_id !== undefined &&
                  employee.status_id !== null
                    ? statusMap[employee.status_id] || "Неизвестно"
                    : "Не указано"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedEmployees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Строк на странице:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} из ${count !== -1 ? count : `более ${to}`}`
        }
      />
    </Card>
  );
};

const SettingsPage: React.FC = () => {
  const { user, isTestMode } = useAuthStore();
  const [tab, setTab] = useState(1);
  const [departmentEmployees, setDepartmentEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role_id === 2;

  const currentUserFormData: Partial<User> = {
    id: user?.id || null,
    full_name: user?.full_name || null,
    email: user?.email || null,
    phone: user?.phone || null,
    status_id: user?.status_id || null,
    photo: user?.photo || null,
    department: user?.department || null,
    tech_support_email: user?.tech_support_email || null,
    role_id: user?.role_id,
    company: user?.company || null,
    domain: user?.domain || null,
    name: user?.name || null,
    position: user?.position || null,
    login: user?.login || null,
    system_login: user?.system_login || null,
    address: user?.address || null,
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!currentUserFormData.department || tab !== 3) return;
      setLoading(true);
      try {
        const employees = await getEmployeesByDepartment(
          currentUserFormData.department,
          isTestMode
        );
        setDepartmentEmployees(employees);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ошибка загрузки сотрудников"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [currentUserFormData.department, isTestMode, tab]);

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: "1300px",
        mx: "auto",
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Stack
        sx={{
          width: { xs: "100%", sm: 260 },
          pr: { sm: 3 },
          flexShrink: 0,
        }}
      >
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            color="var(--mui-palette-text-primary)"
          >
            Настройки
          </Typography>
          {user ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={currentUserFormData.photo || "/assets/avatar.png"}
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Typography
                  variant="subtitle1"
                  color="var(--mui-palette-text-primary)"
                >
                  {currentUserFormData.full_name}
                </Typography>
                <Typography
                  variant="caption"
                  color="var(--mui-palette-text-secondary)"
                >
                  {currentUserFormData.email}
                </Typography>
              </Box>
            </Stack>
          ) : (
            <Typography color="var(--mui-palette-error-main)">
              Пользователь не авторизован
            </Typography>
          )}
        </Stack>
        <Stack spacing={1}>
          <Button
            startIcon={<PersonIcon />}
            sx={{
              justifyContent: "flex-start",
              color:
                tab === 1
                  ? "var(--mui-palette-primary-main)"
                  : "var(--mui-palette-text-primary)",
              bgcolor:
                tab === 1 ? "var(--mui-palette-primary-50)" : "transparent",
              p: 1.5,
              borderRadius: 1,
              textTransform: "none",
              fontWeight: tab === 1 ? 600 : 400,
            }}
            onClick={() => setTab(1)}
          >
            Мой профиль
          </Button>
          <Button
            startIcon={<Brightness4Icon />}
            sx={{
              justifyContent: "flex-start",
              color:
                tab === 2
                  ? "var(--mui-palette-primary-main)"
                  : "var(--mui-palette-text-primary)",
              bgcolor:
                tab === 2 ? "var(--mui-palette-primary-50)" : "transparent",
              p: 1.5,
              borderRadius: 1,
              textTransform: "none",
              fontWeight: tab === 2 ? 600 : 400,
            }}
            onClick={() => setTab(2)}
          >
            Настройки
          </Button>
          <Button
            startIcon={<GroupIcon />}
            sx={{
              justifyContent: "flex-start",
              color:
                tab === 3
                  ? "var(--mui-palette-primary-main)"
                  : "var(--mui-palette-text-primary)",
              bgcolor:
                tab === 3 ? "var(--mui-palette-primary-50)" : "transparent",
              p: 1.5,
              borderRadius: 1,
              textTransform: "none",
              fontWeight: tab === 3 ? 600 : 400,
            }}
            onClick={() => setTab(3)}
          >
            Мой отдел
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          flexGrow: 1,
          pl: { sm: 3 },
          pt: { xs: 2, sm: 0 },
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {tab === 1 && (
          <ProfileTab
            formData={currentUserFormData}
            isCurrentUser
            isAdmin={isAdmin}
          />
        )}
        {tab === 2 && <ThemeTab />}
        {tab === 3 && (
          <>
            {loading && (
              <Typography color="var(--mui-palette-text-primary)">
                Загрузка...
              </Typography>
            )}
            {error && (
              <Typography color="var(--mui-palette-error-main)">
                {error}
              </Typography>
            )}
            {!loading && !error && departmentEmployees.length > 0 && (
              <DepartmentTab employees={departmentEmployees} />
            )}
            {!loading && !error && departmentEmployees.length === 0 && (
              <Typography color="var(--mui-palette-text-primary)">
                Сотрудники в вашем отделе не найдены.
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SettingsPage;
