// src/pages/calendar/ui/CheckModal/CheckModal.tsx
import {
  Modal,
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { Check } from "@/features/calendar";
import dayjs from "dayjs"; // Добавлен import dayjs для форматирования даты/времени

interface CheckModalProps {
  open: boolean;
  onClose: () => void;
  check: Check | null;
}

export const CheckModal = ({ open, onClose, check }: CheckModalProps) => {
  const [tabValue, setTabValue] = useState(0);

  if (!check) return null;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 600 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Детали проверки</Typography>
            <IconButton onClick={onClose} sx={{ color: "text.primary" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mt: 2 }}>
            <Tab label="Общая информация" />
            <Tab label="Детали" />
          </Tabs>
          {tabValue === 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ mb: 1 }}>
                <strong>Объект:</strong> {check.objectName}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Время начала:</strong>{" "}
                {dayjs(check.startTime).format("YYYY-MM-DD HH:mm:ss")}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Статус:</strong> {check.status}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Avatar src={check.operator.avatar} sx={{ mr: 1 }} />
                <Typography>{check.operator.fullName}</Typography>
              </Box>
            </Box>
          )}
          {tabValue === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography>
                Дополнительные детали (например, параметры проверки, повторная
                проверка).
                {/* Здесь можно добавить логику для отображения дополнительных деталей */}
              </Typography>
            </Box>
          )}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              component={Link}
              to={`/tasks/view/${check.id}`} // Предполагается, что id проверки совпадает с id задания
              variant="contained"
            >
              Перейти к заданию
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Modal>
  );
};
