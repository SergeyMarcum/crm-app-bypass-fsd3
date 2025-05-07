// src/pages/users/ui.tsx
import { Box, Typography } from "@mui/material";
import { AppTables } from "@shared/ui/custom-component/app-tables";
import { ColDef } from "ag-grid-community";
import { useUserList } from "@features/user-list";
import { useUser } from "@shared/hooks/use-user";
import { userApi } from "@shared/api/user";
import { NormalizedUser, EditUserPayload } from "@entities/user/types";
import { roleMap, statusMap } from "@entities/user";

const columns: ColDef<NormalizedUser>[] = [
  { headerName: "№", field: "id", width: 80 },
  { headerName: "ФИО", field: "fullName" },
  { headerName: "Отдел", field: "department" },
  { headerName: "Email", field: "email" },
  { headerName: "Телефон", field: "phone" },
  { headerName: "Права доступа", field: "accessRights" },
  { headerName: "Статус", field: "status" },
];

const tabLabels = [
  "Все",
  "Работает",
  "Больничный",
  "Командировка",
  "Отпуск",
  "Уволен(а)",
];

const UsersPage = () => {
  const { users, departments, isLoading, error } = useUserList();
  const { user } = useUser();
  const canEdit = [
    "Администратор ИТЦ",
    "Администратор Общества",
    "Администратор Филиала",
  ].includes(user?.accessRights || "");

  const tabData = [
    users,
    users.filter((row) => row.status === "Работает"),
    users.filter((row) => row.status === "Больничный"),
    users.filter((row) => row.status === "Командировка"),
    users.filter((row) => row.status === "Отпуск"),
    users.filter((row) => row.status === "Уволен(а)"),
  ];

  const handleEdit = async (row: NormalizedUser) => {
    const roleId = Object.entries(roleMap).find(
      ([_, value]) => value === row.accessRights
    )?.[0];
    const statusId = Object.entries(statusMap).find(
      ([_, value]) => value === row.status
    )?.[0];

    if (!roleId || !statusId) {
      console.error("Invalid role or status:", row.accessRights, row.status);
      return;
    }

    const payload: EditUserPayload = {
      user_id: row.id,
      name: row.name,
      full_name: row.fullName,
      position: row.position,
      company: row.company,
      department: row.department,
      email: row.email,
      phone: row.phone,
      role_id: Number(roleId),
      status_id: Number(statusId),
    };

    try {
      await userApi.editUser(payload);
      console.log("User updated:", row);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  if (isLoading) return <Typography>Загрузка...</Typography>;
  if (error) {
    const errorMessage =
      error instanceof Error
        ? error.message.includes("Network Error")
          ? "Не удалось подключиться к серверу. Проверьте соединение или попробуйте позже."
          : error.message
        : "Произошла неизвестная ошибка";
    return <Typography color="error">{errorMessage}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Список пользователей
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Информация по пользователям данного филиала
      </Typography>
      <AppTables
        tableType="with-tabs"
        columns={columns}
        data={users}
        tabLabels={tabLabels}
        tabData={tabData}
        onEdit={canEdit ? handleEdit : undefined}
        filters={{
          email: true,
          department: departments,
          phone: true,
        }}
        paginationOptions={[10, 25, 50]}
      />
    </Box>
  );
};

export { UsersPage };
