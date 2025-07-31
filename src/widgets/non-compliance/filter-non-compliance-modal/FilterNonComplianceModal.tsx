// src/widgets/non-compliance/filter-non-compliance-modal/FilterNonComplianceModal.tsx
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

interface FilterNonComplianceModalProps {
  open: boolean;
  onClose: () => void;
  onApplyFilter: (filterValue: string) => void;
  initialFilterValue: string;
}

export const FilterNonComplianceModal = ({
  open,
  onClose,
  onApplyFilter,
  initialFilterValue,
}: FilterNonComplianceModalProps) => {
  const [filterValue, setFilterValue] = useState(initialFilterValue);

  useEffect(() => {
    setFilterValue(initialFilterValue);
  }, [initialFilterValue]);

  const handleApply = () => {
    onApplyFilter(filterValue);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="filter-non-compliance-title"
    >
      <DialogTitle id="filter-non-compliance-title">
        Фильтрация по несоответствиям
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
          id="filter-name"
          label="Поле ввода несоответствия"
          type="text"
          fullWidth
          variant="outlined"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleApply} variant="contained">
          Применить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
