// src/pages/users/ui.tsx
import { useEffect, useState, useMemo, useRef } from "react";
import { Tabs, Tab, Typography, Box } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
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
import type { ICellRendererParams } from "ag-grid-community";

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
  const [departments, setDepartments] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [sortDirection] = useState<"new" | "old">("new");
  const { filters } = useTableStore();
  const gridRef = useRef<AgGridReact<User>>(null);

  const filterDefinitions = [
    { key: "email", label: "Email", icon: <EmailIcon /> },
    { key: "phone", label: "Телефон", icon: <PhoneIcon /> },
    { key: "department", label: "Отдел", icon: <ApartmentIcon /> },
  ];

  useEffect(() => {
    userApi.getCompanyUsers().then((res) => {
      setUsers(res.users);
      setDepartments(
        Array.from(
          new Set(
            res.users.map((u) => u.department).filter((d): d is string => !!d)
          )
        )
      );
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
    { headerName: "", checkboxSelection: true, width: 40 },
    { headerName: "#", valueGetter: "node.rowIndex + 1", width: 60 },
    {
      headerName: "ФИО",
      field: "full_name",
      editable: true,
      cellEditor: "agTextCellEditor",
    },
    {
      headerName: "Email",
      field: "email",
      editable: true,
      cellEditor: "agTextCellEditor",
    },
    {
      headerName: "Телефон",
      field: "phone",
      editable: true,
      cellEditor: "agTextCellEditor",
    },
    {
      headerName: "Отдел",
      field: "department",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: departments },
    },
    {
      headerName: "Права доступа",
      field: "role_id",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: [1, 2, 3, 4, 5, 6, 7, 8] },
      valueFormatter: (params: { value: number }) =>
        mapRoleIdToLabel(params.value),
    },
    {
      headerName: "Статус",
      field: "status_id",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: [1, 2, 3, 4, 5] },
      valueFormatter: (params: { value: number }) =>
        mapStatusIdToLabel(params.value),
    },
    {
      headerName: "Действия",
      field: "actions",
      cellRenderer: EditButton,
      cellRendererParams: (params: ICellRendererParams<User>) => ({
        user: params.data,
        api: params.api,
      }),
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
        ref={gridRef}
        rowData={filtered}
        columnDefs={columns}
        filters={filterDefinitions}
      />
    </Box>
  );
};
