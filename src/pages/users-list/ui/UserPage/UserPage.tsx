// src/pages/users-list/ui/UserPage/UserPage.tsx
import { useEffect, useState, useRef } from "react";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { AgGridReact } from "ag-grid-react";
import type { ICellRendererParams } from "ag-grid-community";

import { CustomTable, FilterDefinition } from "@/widgets/table";
import { userApi } from "@/shared/api/user";
import { User, EditUserPayload } from "@/entities/user/types";
import type { JSX } from "react";

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

export const UsersPage = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const gridRef = useRef<AgGridReact<User>>(null);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const company = await userApi.getCompanyUsers();
        // Приводим company.users к типу User[], преобразуя undefined в null
        const normalizedUsers: User[] = company.users.map((user) => ({
          ...user,
          id: user.id ?? null,
          status_id: user.status_id ?? null,
          domain: user.domain ?? null,
          name: user.name ?? null, // Нормализация name
          photo: user.photo ?? null,
        }));
        setUsers(normalizedUsers);

        const departmentList = Array.from(
          new Set(
            company.users
              .map((u) => u.department)
              .filter(
                (d): d is string => typeof d === "string" && d.trim() !== ""
              )
          )
        );
        setDepartments(departmentList);
      } catch (error) {
        console.error("Ошибка при загрузке пользователей:", error);
      }
    };

    load();
  }, []);

  const handleEdit = (user: User): void => {
    if (user.id == null) return; // Проверяем, что id не null/undefined
    setEditingUserId(user.id);
    setEditedUser({ ...user });
  };

  const handleSave = async (userId: number): Promise<void> => {
    const original = users.find((u) => u.id === userId);
    if (!original) return;

    const payload: EditUserPayload = {
      user_id: userId,
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
        prev.map((u) => (u.id === userId ? { ...u, ...payload } : u))
      );
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
    }

    setEditingUserId(null);
    setEditedUser({});
  };

  const filterDefinitions: FilterDefinition<User>[] = [
    { key: "email", label: "Email", icon: <EmailIcon /> },
    { key: "phone", label: "Телефон", icon: <PhoneIcon /> },
    { key: "department", label: "Отдел", icon: <ApartmentIcon /> },
  ];

  const filtered = users
    .filter((u) =>
      statusFilter !== null ? u.status_id === statusFilter : true
    )
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0)); // Обработка null/undefined для id

  const columns = [
    { headerName: "", checkboxSelection: true, width: 40 },
    { headerName: "#", valueGetter: "node.rowIndex + 1", width: 60 },
    {
      headerName: "ФИО",
      field: "full_name",
      cellRenderer: (params: ICellRendererParams<User>) =>
        editingUserId === params.data?.id ? (
          <TextField
            key={`${params.data!.id}-full_name`}
            value={editedUser.full_name ?? ""}
            onChange={(e) =>
              setEditedUser((p) => ({ ...p, full_name: e.target.value }))
            }
            size="small"
            fullWidth
          />
        ) : (
          params.data?.full_name
        ),
    },
    {
      headerName: "Должность",
      field: "position",
      cellRenderer: (params: ICellRendererParams<User>) =>
        editingUserId === params.data?.id ? (
          <TextField
            key={`${params.data!.id}-position`}
            value={editedUser.position ?? ""}
            onChange={(e) =>
              setEditedUser((p) => ({ ...p, position: e.target.value }))
            }
            size="small"
            fullWidth
          />
        ) : (
          params.data?.position || "—"
        ),
    },
    {
      headerName: "Email",
      field: "email",
      cellRenderer: (params: ICellRendererParams<User>) =>
        editingUserId === params.data?.id ? (
          <TextField
            key={`${params.data!.id}-email`}
            value={editedUser.email ?? ""}
            onChange={(e) =>
              setEditedUser((p) => ({ ...p, email: e.target.value }))
            }
            size="small"
            fullWidth
          />
        ) : (
          params.data?.email
        ),
    },
    {
      headerName: "Телефон",
      field: "phone",
      cellRenderer: (params: ICellRendererParams<User>) =>
        editingUserId === params.data?.id ? (
          <TextField
            key={`${params.data!.id}-phone`}
            value={editedUser.phone ?? ""}
            onChange={(e) =>
              setEditedUser((p) => ({ ...p, phone: e.target.value }))
            }
            size="small"
            fullWidth
          />
        ) : (
          params.data?.phone
        ),
    },
    {
      headerName: "Отдел",
      field: "department",
      cellRenderer: (params: ICellRendererParams<User>) =>
        editingUserId === params.data?.id ? (
          <Select
            key={`${params.data!.id}-department`}
            value={editedUser.department ?? ""}
            onChange={(e) =>
              setEditedUser((p) => ({
                ...p,
                department: e.target.value as string,
              }))
            }
            size="small"
            fullWidth
          >
            <MenuItem value="">Не указано</MenuItem>
            {departments.map((dep) => (
              <MenuItem key={dep} value={dep}>
                {dep}
              </MenuItem>
            ))}
          </Select>
        ) : (
          (params.data?.department ?? "—")
        ),
    },
    {
      headerName: "Права доступа",
      field: "role_id",
      cellRenderer: (params: ICellRendererParams<User>) =>
        editingUserId === params.data?.id ? (
          <Select
            key={`${params.data!.id}-role_id`}
            value={editedUser.role_id ?? ""}
            onChange={(e) =>
              setEditedUser((p) => ({
                ...p,
                role_id: Number(e.target.value),
              }))
            }
            size="small"
            fullWidth
          >
            {Object.entries(roleMap).map(([id, name]) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        ) : (
          (roleMap[params.data?.role_id ?? 0] ?? "—")
        ),
    },
    {
      headerName: "Статус",
      field: "status_id",
      cellRenderer: (params: ICellRendererParams<User>) =>
        editingUserId === params.data?.id ? (
          <Select
            key={`${params.data!.id}-status_id`}
            value={editedUser.status_id ?? ""}
            onChange={(e) =>
              setEditedUser((p) => ({
                ...p,
                status_id: Number(e.target.value),
              }))
            }
            size="small"
            fullWidth
          >
            {Object.entries(statusMap).map(([id, name]) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        ) : (
          (statusMap[params.data?.status_id ?? 0] ?? "—")
        ),
    },
    {
      headerName: "Действия",
      field: "actions",
      cellRenderer: (params: ICellRendererParams<User>) =>
        editingUserId === params.data?.id ? (
          params.data?.id != null ? (
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleSave(params.data!.id!)}
            >
              <SaveIcon fontSize="small" />
            </IconButton>
          ) : null
        ) : (
          <IconButton
            color="secondary"
            size="small"
            onClick={() => handleEdit(params.data!)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ),
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Список пользователей
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Информация по пользователям данного филиала
      </Typography>

      <Tabs
        value={statusFilter}
        onChange={(_, value) => setStatusFilter(value)}
        sx={{ my: 2 }}
      >
        {statusTabs.map((tab) => (
          <Tab key={tab.label} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      <CustomTable<User>
        ref={gridRef}
        rowData={filtered}
        columnDefs={columns}
        getRowId={(row) => (row.id ?? "0").toString()}
        filters={filterDefinitions}
      />
    </Box>
  );
};
