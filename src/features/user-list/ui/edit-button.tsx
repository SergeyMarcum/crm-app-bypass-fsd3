// src/features/user-list/ui/edit-button.tsx
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { GridApi, IRowNode } from "ag-grid-community";
import { User } from "@/entities/user/types";
import { userApi } from "@/shared/api/user";

type EditButtonProps = {
  user: User;
  api: GridApi<User>;
};

export const EditButton = ({ user, api }: EditButtonProps) => {
  const node: IRowNode<User> | undefined = api.getRowNode(user.id.toString());
  if (!node || !node.data) return null;

  const isEditing = api
    .getEditingCells()
    .some((cell) => cell.rowIndex === node.rowIndex);

  const handleEdit = () => {
    api.startEditingCell({ rowIndex: node.rowIndex!, colKey: "full_name" });
  };

  const handleSave = async () => {
    api.stopEditing(false);
    const updated = node.data;
    if (!updated) return;

    try {
      await userApi.editUser({
        user_id: updated.id,
        full_name: updated.full_name ?? "",
        email: updated.email ?? "",
        phone: updated.phone ?? "",
        department: updated.department ?? "",
        role_id: updated.role_id,
        status_id: updated.status_id ?? 1,
        name: updated.name,
        position: updated.position ?? "",
        company: updated.company ?? "",
      });
    } catch (err) {
      console.error("Ошибка при сохранении", err);
    }
  };

  return (
    <Tooltip title={isEditing ? "Сохранить" : "Редактировать"}>
      <IconButton
        size="small"
        color={isEditing ? "success" : "primary"}
        onClick={isEditing ? handleSave : handleEdit}
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
