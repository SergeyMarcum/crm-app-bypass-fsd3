// ✅ src/features/user-list/ui/edit-button.tsx

import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import { userApi } from "@shared/api/user";
import { User } from "@/entities/user/types";

export const EditButton = ({ user }: { user: User }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      const payload = {
        user_id: user.id,
        full_name: user.full_name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        department: user.department ?? "",
        role_id: user.role_id,
        status_id: user.status_id ?? 1,
      };

      await userApi.editUser(payload);
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
    }
  };

  return (
    <Tooltip title={isEditing ? "Сохранить" : "Редактировать"}>
      <IconButton
        size="small"
        color={isEditing ? "success" : "primary"}
        onClick={isEditing ? handleSave : () => setIsEditing(true)}
      >
        {isEditing ? (
          <SaveIcon fontSize="small" />
        ) : (
          <EditIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
};
