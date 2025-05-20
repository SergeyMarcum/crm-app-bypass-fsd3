// ✅ src/pages/users/ui.tsx

import { useEffect, useState, useMemo } from "react";
import { Tabs, Tab, Typography, Box, MenuItem, Select } from "@mui/material";
import { CustomTable } from "@/widgets/table";
import { userApi } from "@/shared/api/user";
import { User } from "@/entities/user/types";
import { useTableStore } from "@/widgets/table/model/store";
import {
  mapRoleIdToLabel,
  mapStatusIdToLabel,
} from "@/entities/user/model/normalize";
import { EditButton } from "@/features/user-list/ui/edit-button";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ApartmentIcon from "@mui/icons-material/Apartment";

const statusTabs = [
  { label: "Все", value: null },
  { label: "Работает", value: 1 },
  { label: "Больничный", value: 5 },
  { label: "Командировка", value: 4 },
  { label: "Отпуск", value: 3 },
  { label: "Уволены", value: 2 },
];

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [sortDirection] = useState<"new" | "old">("new");
  const { filters } = useTableStore();
  const filterDefinitions = [
    { key: "email", label: "Email", icon: <EmailIcon /> },
    { key: "phone", label: "Телефон", icon: <PhoneIcon /> },
    { key: "department", label: "Отдел", icon: <ApartmentIcon /> },
  ];

  useEffect(() => {
    userApi.getCompanyUsers().then((res) => {
      setUsers(res.users);
    });
  }, []);

  const filtered = useMemo(() => {
    let data = [...users];

    if (statusFilter !== null) {
      data = data.filter((u) => u.status_id === statusFilter);
    }

    Object.entries(filters).forEach(([field, value]) => {
      data = data.filter((u) =>
        String(u[field as keyof User] ?? "")
          .toLowerCase()
          .includes(value.toLowerCase())
      );
    });

    if (sortDirection === "new") {
      data.sort((a, b) => b.id - a.id);
    } else {
      data.sort((a, b) => a.id - b.id);
    }

    return data;
  }, [users, filters, statusFilter, sortDirection]);

  const columns = [
    {
      headerName: "",
      checkboxSelection: true,
      width: 40,
    },
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      width: 60,
    },
    {
      headerName: "ФИО / Email",
      valueGetter: (params: { data: User }) =>
        `${params.data.full_name || ""} / ${params.data.email || ""}`,
    },
    {
      headerName: "Отдел",
      field: "department",
    },
    {
      headerName: "Телефон",
      field: "phone",
    },
    {
      headerName: "Права доступа",
      valueGetter: (params: { data: User }) =>
        mapRoleIdToLabel(params.data.role_id),
    },
    {
      headerName: "Статус",
      valueGetter: (params: { data: User }) =>
        mapStatusIdToLabel(params.data.status_id ?? -1),
    },
    {
      headerName: "Действия",
      cellRenderer: (params: { data: User }) => (
        <EditButton user={params.data} />
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
        onChange={(_, v) => setStatusFilter(v)}
        sx={{ my: 2 }}
      >
        {statusTabs.map((tab) => (
          <Tab key={tab.label} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      <CustomTable
        rowData={filtered}
        columnDefs={columns}
        filters={filterDefinitions}
      />
    </Box>
  );
};
