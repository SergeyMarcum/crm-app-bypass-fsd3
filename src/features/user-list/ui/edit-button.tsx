// src/features/user-list/ui/edit-button.tsx

import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { User } from "@/entities/user/types";

type Props = {
  user: User;
};

export const EditButton = ({ user }: Props) => {
  const handleClick = () => {
    console.log("Edit user:", user);
    // TODO: открыть модалку редактирования
  };

  return (
    <Tooltip title="Редактировать">
      <IconButton onClick={handleClick} size="small" color="primary">
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};
