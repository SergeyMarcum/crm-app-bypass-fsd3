// src/pages/users-employees/ui/EmployeesPage/EmployeesPage.tsx
import { useEffect, useState, useRef } from "react";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  // Removed unused Material-UI components like TextField, Select, MenuItem, IconButton
} from "@mui/material";
// Icons for filter buttons (reused from UsersPage)
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { AgGridReact } from "ag-grid-react";
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
  const [employees, setEmployees] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState<number | null>(null);

  const gridRef = useRef<AgGridReact<User>>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const company = await userApi.getCompanyUsers();

        const filteredByRole = company.users.filter((user) =>
          EMPLOYEE_ROLES.includes(user.role_id)
        );

        // Преобразуем undefined в null для id и status_id, а также фильтруем
        // объекты, которые не соответствуют требованиям User типа (например,
        // если id или status_id после преобразования все равно не являются number или null)
        const validatedEmployees: User[] = filteredByRole
          .map((user) => {
            // Создаем новый объект, чтобы избежать мутации исходных данных
            const newUser = { ...user };
            // Приводим id к number | null
            if (newUser.id === undefined) {
              newUser.id = null;
            } else if (typeof newUser.id !== "number") {
              // Если id не undefined и не number, возможно, это ошибка данных.
              // Можно здесь установить в null или отфильтровать позже.
              newUser.id = null; // Делаем его null, чтобы соответствовать User типу
            }

            // Приводим status_id к number | null
            if (newUser.status_id === undefined) {
              newUser.status_id = null;
            } else if (typeof newUser.status_id !== "number") {
              newUser.status_id = null; // Делаем его null
            }
            return newUser;
          })
          .filter((user): user is User => {
            // Дополнительная фильтрация, чтобы гарантировать, что id и status_id
            // корректны согласно типу User. Если User требует id: number,
            // то здесь нужно будет отфильтровать user.id === null.
            // Предполагаем, что User допускает id: number | null и status_id: number | null
            return (
              (user.id === null || typeof user.id === "number") &&
              (user.status_id === null || typeof user.status_id === "number")
            );
          });

        setEmployees(validatedEmployees);
      } catch (error) {
        console.error("Ошибка при загрузке сотрудников:", error);
      }
    };

    load();
  }, []);

  const filterDefinitions: FilterDefinition<User>[] = [
    { key: "email", label: "Email", icon: <EmailIcon /> },
    { key: "phone", label: "Телефон", icon: <PhoneIcon /> },
    { key: "department", label: "Отдел", icon: <ApartmentIcon /> },
  ];

  const filteredByStatus = employees
    .filter((u) =>
      statusFilter !== null ? u.status_id === statusFilter : true
    )
    // Используем оператор ?? 0 для безопасной сортировки по id, если он может быть null
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

  const columns = [
    { headerName: "", checkboxSelection: true, width: 40 },
    { headerName: "#", valueGetter: "node.rowIndex + 1", width: 60 },
    {
      headerName: "ФИО",
      field: "full_name",
      cellRenderer: (params: ICellRendererParams<User>) =>
        params.data?.full_name,
    },
    {
      headerName: "Должность",
      field: "position",
      cellRenderer: (params: ICellRendererParams<User>) =>
        params.data?.position || "—",
    },
    {
      headerName: "Email",
      field: "email",
      cellRenderer: (params: ICellRendererParams<User>) => params.data?.email,
    },
    {
      headerName: "Телефон",
      field: "phone",
      cellRenderer: (params: ICellRendererParams<User>) => params.data?.phone,
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
        // Используем ?? 0 для row.id, чтобы гарантировать числовое значение для toString()
        getRowId={(row) => (row.id ?? 0).toString()}
        filters={filterDefinitions}
      />
    </Box>
  );
};
