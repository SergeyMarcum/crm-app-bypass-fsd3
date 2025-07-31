// src/pages/users-employees/ui/EmployeesPage/EmployeesPage.tsx
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, Tab, Typography, Box } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { AgGridReact } from "ag-grid-react";
import { toast } from "sonner";
import type { ICellRendererParams } from "ag-grid-community";

import { CustomTable, FilterDefinition } from "@/widgets/table";
import { userApi } from "@/shared/api/user";
import { User } from "@/entities/user/types";
import type { JSX } from "react";

const statusTabs = [
  { label: "Все", value: null },
  { label: "Работает", value: 1 },
  { label: "Больничный", value: 5 },
  { label: "Командировка", value: 4 },
  { label: "Отпуск", value: 3 },
  { label: "Уволены", value: 2 },
];

const statusMap: Record<number, string> = {
  1: "Работает",
  2: "Уволен",
  3: "Отпуск",
  4: "Командировка",
  5: "Больничный",
};

// Определяем роли, которые считаются "сотрудниками"
const EMPLOYEE_ROLES = [2, 3, 4]; // Администратор филиала, Мастер, Оператор

export const EmployeesPage = (): JSX.Element => {
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const gridRef = useRef<AgGridReact<User>>(null);

  // Запрос для получения списка сотрудников
  const {
    data: companyData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["companyUsers"],
    queryFn: async () => {
      const data = await userApi.getCompanyUsers();
      return data.users
        .filter((user) => EMPLOYEE_ROLES.includes(user.role_id))
        .map((user) => ({
          ...user,
          id: user.id ?? null,
          status_id: user.status_id ?? null,
        }));
    },
  });

  if (error) {
    toast.error("Не удалось загрузить список сотрудников. Попробуйте позже.");
  }

  const filteredByStatus = (companyData || [])
    .filter((u) =>
      statusFilter !== null ? u.status_id === statusFilter : true
    )
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

  const filterDefinitions: FilterDefinition<User>[] = [
    { key: "email", label: "Email", icon: <EmailIcon /> },
    { key: "phone", label: "Телефон", icon: <PhoneIcon /> },
    { key: "department", label: "Отдел", icon: <ApartmentIcon /> },
  ];

  const columns = [
    { headerName: "", checkboxSelection: true, width: 40 },
    { headerName: "#", valueGetter: "node.rowIndex + 1", width: 60 },
    {
      headerName: "ФИО",
      field: "full_name",
      cellRenderer: (params: ICellRendererParams<User>) =>
        params.data?.full_name ?? "—",
    },
    {
      headerName: "Должность",
      field: "position",
      cellRenderer: (params: ICellRendererParams<User>) =>
        params.data?.position ?? "—",
    },
    {
      headerName: "Email",
      field: "email",
      cellRenderer: (params: ICellRendererParams<User>) =>
        params.data?.email ?? "—",
    },
    {
      headerName: "Телефон",
      field: "phone",
      cellRenderer: (params: ICellRendererParams<User>) =>
        params.data?.phone ?? "—",
    },
    {
      headerName: "Отдел",
      field: "department",
      cellRenderer: (params: ICellRendererParams<User>) =>
        params.data?.department ?? "—",
    },
    {
      headerName: "Статус",
      field: "status_id",
      cellRenderer: (params: ICellRendererParams<User>) =>
        statusMap[params.data?.status_id ?? 0] ?? "—",
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Список сотрудников
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Информация по сотрудникам данного филиала
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
        rowData={filteredByStatus}
        columnDefs={columns}
        getRowId={(row) => (row.id ?? 0).toString()}
        filters={filterDefinitions}
        loading={isLoading} // Передаем состояние загрузки
      />
    </Box>
  );
};
