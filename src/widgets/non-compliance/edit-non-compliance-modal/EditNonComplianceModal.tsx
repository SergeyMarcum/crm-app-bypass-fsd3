// src/widgets/non-compliance/edit-non-compliance-modal/EditNonComplianceModal.tsx
import { useState, useEffect } from "react";
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

interface EditNonComplianceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  nonComplianceId: number;
  nonComplianceName: string;
}

export const EditNonComplianceModal = ({
  open,
  onClose,
  onSuccess,
  nonComplianceId,
  nonComplianceName,
}: EditNonComplianceModalProps) => {
  const [currentName, setCurrentName] = useState(nonComplianceName);

  useEffect(() => {
    setCurrentName(nonComplianceName);
  }, [nonComplianceName]);

  const handleSave = async () => {
    if (currentName.trim() && nonComplianceId) {
      try {
        await nonComplianceApi.editNonCompliance(nonComplianceId, currentName); //
        onSuccess();
      } catch (error) {
        console.error("Error editing non-compliance:", error);
        // TODO: Add proper error handling and user feedback
      }
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="edit-non-compliance-title"
    >
      <DialogTitle id="edit-non-compliance-title">
        Несоответствие
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
          label="Поле ввода наименования несоответствия"
          type="text"
          fullWidth
          variant="outlined"
          value={currentName}
          onChange={(e) => setCurrentName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!currentName.trim()}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
