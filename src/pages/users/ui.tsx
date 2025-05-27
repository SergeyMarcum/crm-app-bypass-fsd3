// src/pages/users/ui.tsx
import { useEffect, useState, useMemo, useRef } from "react";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material"; // Added TextField, Select, MenuItem, IconButton
import EditIcon from "@mui/icons-material/Edit"; // Added EditIcon
import SaveIcon from "@mui/icons-material/Save"; // Added SaveIcon
import { AgGridReact } from "ag-grid-react";
import { CustomTable } from "@/widgets/table";
import { userApi } from "@/shared/api/user";
import { User, EditUserPayload } from "@/entities/user/types"; // Added EditUserPayload
import { useTableStore } from "@/widgets/table/model/store";
// import { EditButton } from "@/features/user-list/ui/edit-button"; // Removed unused import
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

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  // Define maps based on imported functions or actual data
  // These are placeholders and should be populated correctly
  const roleMap: Record<number, string> = {
    1: "Super Admin",
    2: "Admin",
    3: "Manager",
    4: "User",
    5: "Guest",
    6: "Auditor",
    7: "Editor",
    8: "Contributor",
    // Populate based on mapRoleIdToLabel or actual system roles
  };

  const statusMap: Record<number, string> = {
    1: "Работает",
    2: "Уволен",
    3: "Отпуск",
    4: "Командировка",
    5: "Больничный",
    // Populate based on mapStatusIdToLabel or actual system statuses
  };

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

  const handleEdit = (userToEdit: User) => {
    setEditingUserId(userToEdit.id);
    setEditedUser({
      full_name: userToEdit.full_name,
      email: userToEdit.email,
      phone: userToEdit.phone,
      department: userToEdit.department,
      role_id: userToEdit.role_id,
      status_id: userToEdit.status_id,
      company: userToEdit.company, // Assuming these might be editable or relevant
      position: userToEdit.position, // Assuming these might be editable or relevant
      name: userToEdit.name, // Assuming these might be editable or relevant
    });
  };

  const handleSave = async (userIdToSave: number) => {
    const originalUser = users.find((u) => u.id === userIdToSave);
    if (!originalUser) {
      console.error("Original user not found for saving.");
      setEditingUserId(null);
      setEditedUser({});
      return;
    }

    const changedFields: Partial<User> = {};
    let hasChanges = false;

    // Compare each editable field
    if (
      editedUser.full_name !== undefined &&
      editedUser.full_name !== originalUser.full_name
    ) {
      changedFields.full_name = editedUser.full_name;
      hasChanges = true;
    }
    if (
      editedUser.email !== undefined &&
      editedUser.email !== originalUser.email
    ) {
      changedFields.email = editedUser.email;
      hasChanges = true;
    }
    if (
      editedUser.phone !== undefined &&
      editedUser.phone !== originalUser.phone
    ) {
      changedFields.phone = editedUser.phone;
      hasChanges = true;
    }
    if (
      editedUser.department !== undefined &&
      editedUser.department !== originalUser.department
    ) {
      changedFields.department = editedUser.department;
      hasChanges = true;
    }
    if (
      editedUser.role_id !== undefined &&
      Number(editedUser.role_id) !== originalUser.role_id
    ) {
      changedFields.role_id = Number(editedUser.role_id);
      hasChanges = true;
    }
    if (
      editedUser.status_id !== undefined &&
      Number(editedUser.status_id) !== originalUser.status_id
    ) {
      changedFields.status_id = Number(editedUser.status_id);
      hasChanges = true;
    }
    // Assuming these fields might be part of editing logic based on User type
    if (
      editedUser.company !== undefined &&
      editedUser.company !== originalUser.company
    ) {
      changedFields.company = editedUser.company;
      hasChanges = true;
    }
    if (
      editedUser.position !== undefined &&
      editedUser.position !== originalUser.position
    ) {
      changedFields.position = editedUser.position;
      hasChanges = true;
    }
    if (
      editedUser.name !== undefined &&
      editedUser.name !== originalUser.name
    ) {
      changedFields.name = editedUser.name;
      hasChanges = true;
    }

    if (hasChanges) {
      try {
        if (!originalUser) {
          console.error(
            "Critical: originalUser not found when constructing payload."
          );
          setEditingUserId(null);
          setEditedUser({});
          return;
        }

        // Construct the payload strictly adhering to EditUserPayload type
        const payloadToSubmit: EditUserPayload = {
          user_id: originalUser.id, // Map User.id to EditUserPayload.user_id

          name: editedUser.name ?? originalUser.name ?? "",

          full_name: editedUser.full_name ?? originalUser.full_name ?? "",

          position: editedUser.position ?? originalUser.position ?? "",

          company: editedUser.company ?? originalUser.company ?? "",

          department: editedUser.department ?? originalUser.department ?? "",

          email: editedUser.email ?? originalUser.email ?? "",

          phone: editedUser.phone ?? originalUser.phone ?? "",

          role_id: Number(editedUser.role_id ?? originalUser.role_id),

          status_id: Number(
            editedUser.status_id ?? originalUser.status_id ?? 1
          ), // Default to 1 if null and payload requires non-null
        };

        // Make sure originalUser and editedUser are accessible in this scope
        // payloadToSubmit should have just been constructed before this point

        console.log("--- handleSave ---");
        console.log("originalUser:", JSON.stringify(originalUser, null, 2));
        console.log("editedUser:", JSON.stringify(editedUser, null, 2));
        console.log(
          "payloadToSubmit before API call:",
          JSON.stringify(payloadToSubmit, null, 2)
        );
        console.log("--- end handleSave logs ---");

        await userApi.editUser(payloadToSubmit);

        // Optimistic update:
        setUsers((currentUsers) =>
          currentUsers.map((u) =>
            u.id === originalUser.id
              ? {
                  ...originalUser,
                  name: payloadToSubmit.name,
                  full_name: payloadToSubmit.full_name,
                  position: payloadToSubmit.position,
                  company: payloadToSubmit.company,
                  department: payloadToSubmit.department,
                  email: payloadToSubmit.email,
                  phone: payloadToSubmit.phone,
                  role_id: payloadToSubmit.role_id,
                  status_id: payloadToSubmit.status_id,
                }
              : u
          )
        );

        if (gridRef.current?.api) {
          const rowNode = gridRef.current.api.getRowNode(
            originalUser.id.toString()
          );
          if (rowNode) {
            gridRef.current.api.refreshCells({ rowNodes: [rowNode] });
          }
        }
      } catch (error) {
        console.error("Error saving user:", error);
        // Potentially revert optimistic update or show error to user
      }
    }

    setEditingUserId(null);
    setEditedUser({});
  };

  const columns = [
    { headerName: "", checkboxSelection: true, width: 40 },
    { headerName: "#", valueGetter: "node.rowIndex + 1", width: 60 },
    {
      headerName: "ФИО",
      field: "full_name",
      cellRenderer: (params: ICellRendererParams<User>) => {
        if (!params.data) return null;
        if (params.data.id === editingUserId) {
          return (
            <TextField
              value={editedUser.full_name ?? params.data.full_name ?? ""}
              onChange={(e) =>
                setEditedUser((prev) => ({
                  ...prev,
                  full_name: e.target.value,
                }))
              }
              size="small"
              fullWidth
              autoFocus
            />
          );
        }
        return params.data.full_name || params.data.name;
      },
    },
    {
      headerName: "Email",
      field: "email",
      cellRenderer: (params: ICellRendererParams<User>) => {
        if (!params.data) return null;
        if (params.data.id === editingUserId) {
          return (
            <TextField
              value={editedUser.email ?? params.data.email ?? ""}
              onChange={(e) =>
                setEditedUser((prev) => ({ ...prev, email: e.target.value }))
              }
              size="small"
              fullWidth
            />
          );
        }
        return params.data.email;
      },
    },
    {
      headerName: "Телефон",
      field: "phone",
      cellRenderer: (params: ICellRendererParams<User>) => {
        if (!params.data) return null;
        if (params.data.id === editingUserId) {
          return (
            <TextField
              value={editedUser.phone ?? params.data.phone ?? ""}
              onChange={(e) =>
                setEditedUser((prev) => ({ ...prev, phone: e.target.value }))
              }
              size="small"
              fullWidth
            />
          );
        }
        return params.data.phone;
      },
    },
    {
      headerName: "Отдел",
      field: "department",
      cellRenderer: (params: ICellRendererParams<User>) => {
        if (!params.data) return null;
        if (params.data.id === editingUserId) {
          return (
            <Select
              value={editedUser.department ?? params.data.department ?? ""}
              onChange={(e) =>
                setEditedUser((prev) => ({
                  ...prev,
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
          );
        }
        return params.data.department ?? "Не указан";
      },
    },
    {
      headerName: "Права доступа",
      field: "role_id",
      cellRenderer: (params: ICellRendererParams<User>) => {
        if (!params.data) return null;
        if (params.data.id === editingUserId) {
          return (
            <Select
              value={editedUser.role_id ?? params.data.role_id ?? ""}
              onChange={(e) =>
                setEditedUser((prev) => ({
                  ...prev,
                  role_id: Number(e.target.value),
                }))
              }
              size="small"
              fullWidth
            >
              {Object.entries(roleMap).map(([id, name]) => (
                <MenuItem key={id} value={Number(id)}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          );
        }
        return roleMap[params.data.role_id] ?? "Неизвестная роль";
      },
    },
    {
      headerName: "Статус",
      field: "status_id",
      cellRenderer: (params: ICellRendererParams<User>) => {
        if (!params.data) return null;
        if (params.data.id === editingUserId) {
          return (
            <Select
              value={editedUser.status_id ?? params.data.status_id ?? ""}
              onChange={(e) =>
                setEditedUser((prev) => ({
                  ...prev,
                  status_id: Number(e.target.value),
                }))
              }
              size="small"
              fullWidth
            >
              {Object.entries(statusMap).map(([id, name]) => (
                <MenuItem key={id} value={Number(id)}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          );
        }
        return statusMap[params.data.status_id ?? 0] ?? "Неизвестный статус";
      },
    },
    {
      headerName: "Действия",
      field: "actions",
      cellRenderer: (params: ICellRendererParams<User>) => {
        if (!params.data) return null;
        if (params.data.id === editingUserId) {
          return (
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleSave(params.data!.id)}
            >
              <SaveIcon fontSize="small" />
            </IconButton>
          );
        } else {
          return (
            <IconButton
              color="secondary"
              size="small"
              onClick={() => handleEdit(params.data!)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          );
        }
      },
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
