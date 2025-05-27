// src/features/user-list/ui/edit-button.tsx
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { IRowNode } from "ag-grid-community";
import { User } from "@/entities/user/types";
import { userApi } from "@/shared/api/user";
import type { AgGridReact } from "ag-grid-react";

type EditButtonProps = {
  node: IRowNode<User>;
  gridApiRef: React.RefObject<AgGridReact<User>>; // Changed from api: GridApi<User>
};

export const EditButton = ({ node, gridApiRef }: EditButtonProps) => {
  const api = gridApiRef.current?.api;

  if (!api) {
    console.error("Grid API not available in EditButton");
    return null;
  }
  // const node: IRowNode<User> | undefined = api.getRowNode(user.id.toString());
  if (!node || !node.data) return null;

  const editingCells = api.getEditingCells();
  const isEditing = editingCells
    ? editingCells.some((cell) => cell.rowIndex === node.rowIndex)
    : false;

  const handleEdit = () => {
    const allDisplayedColumns = api.getAllDisplayedColumns();
    if (allDisplayedColumns && allDisplayedColumns.length > 0) {
      api.startEditingCell({
        rowIndex: node.rowIndex!,
        colKey: allDisplayedColumns[0].getColId(),
      });
    } else {
      console.error(
        "AG Grid API error in handleEdit: getAllDisplayedColumns() returned no columns or an invalid value. Cannot reliably start editing the first column. Falling back to 'full_name'."
      );
      // Attempting to start edit on a predefined column as a fallback.
      api.startEditingCell({ rowIndex: node.rowIndex!, colKey: "full_name" });
    }
  };

  const handleSave = async () => {
    if (!api) {
      // Added null check for api
      console.error("Grid API not available in handleSave");
      return;
    }
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
