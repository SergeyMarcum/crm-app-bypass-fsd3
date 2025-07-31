// src/widgets/non-compliance/add-new-non-compliance-modal/AddNewNonComplianceModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { nonComplianceApi } from "@/shared/api/non-compliance"; // Adjust path as needed

interface AddNewNonComplianceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddNewNonComplianceModal = ({
  open,
  onClose,
  onSuccess,
}: AddNewNonComplianceModalProps) => {
  const [nonComplianceName, setNonComplianceName] = useState("");

  const handleSave = async () => {
    if (nonComplianceName.trim()) {
      try {
        await nonComplianceApi.addNewNonCompliance(nonComplianceName); //
        onSuccess();
        setNonComplianceName("");
      } catch (error) {
        console.error("Error adding new non-compliance:", error);
        // TODO: Add proper error handling and user feedback (e.g., toast notification)
      }
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="add-new-non-compliance-title"
    >
      <DialogTitle id="add-new-non-compliance-title">
        Новое несоответствие
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Поле ввода нового названия несоответствия"
          type="text"
          fullWidth
          variant="outlined"
          value={nonComplianceName}
          onChange={(e) => setNonComplianceName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!nonComplianceName.trim()}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
