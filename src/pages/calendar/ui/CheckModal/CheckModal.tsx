// src/pages/calendar/ui/CheckModal/CheckModal.tsx
import {
  Modal,
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
  const [taskData, setTaskData] = useState<any>(null);
  const [parameters, setParameters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !check) {
      setTaskData(null);
      setParameters([]);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const domain = localStorage.getItem("domain");
        const username = localStorage.getItem("username");
        const sessionCode = localStorage.getItem("session_code");

        if (!domain || !username || !sessionCode) {
          return;
        }

        const BASE_URL = import.meta.env.VITE_API_URL || "/api";

        // Fetch task details
        const taskUrl = `${BASE_URL}/task/get?domain=${domain}&username=${username}&session_code=${sessionCode}&task_id=${check.id}`;
        const taskRes = await fetch(taskUrl);
        if (taskRes.ok) {
          const taskJson = await taskRes.json();
          if (taskJson && taskJson.task) {
            setTaskData(taskJson.task);
          }
        }

        // Fetch parameters
        const paramsUrl = `${BASE_URL}/task/parameters-and-non-compliances?domain=${domain}&username=${username}&session_code=${sessionCode}&id=${check.id}`;
        const paramsRes = await fetch(paramsUrl);
        if (paramsRes.ok) {
          const paramsJson = await paramsRes.json();
          if (paramsJson && paramsJson.parameters) {
            setParameters(paramsJson.parameters);
          }
        }
      } catch (err) {
        console.error("Error fetching modal task details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [open, check]);

  if (!check) return null;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const isRepeat = taskData
    ? taskData.checking_type_text === "Повторная" ||
      taskData.checking_type_id === 1
    : false;

  const getPeriodicText = (val: number | undefined | null) => {
    if (val === 1) return "Каждая неделя";
    if (val === 2) return "Каждый месяц";
    if (val === 3) return "Разовая";
    if (val === 0) return "не выбрана";
    return "не выбрана";
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
              <Typography sx={{ mb: 1 }}>
                <strong>Оператор:</strong> {check.operator.fullName}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Мастер:</strong>{" "}
                {taskData?.manager_name ||
                  (loading ? "Загрузка..." : "Неизвестен")}
              </Typography>
            </Box>
          )}
          {tabValue === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ mb: 1 }}>
                <strong>Повторная проверка:</strong> {isRepeat ? "Да" : "Нет"}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Периодическая проверка:</strong>{" "}
                {getPeriodicText(taskData?.periodic)}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Список параметров проверки:
                </Typography>
                {parameters.length > 0 ? (
                  <Box
                    sx={{
                      maxHeight: "150px",
                      overflowY: "auto",
                      border: "1px solid #EAECF0",
                      borderRadius: "8px",
                      p: 1.5,
                      backgroundColor: "#F9FAFB",
                    }}
                  >
                    {parameters.map((param, index) => (
                      <Typography
                        key={param.id || index}
                        variant="body2"
                        sx={{
                          py: 0.5,
                          borderBottom:
                            index < parameters.length - 1
                              ? "1px solid #EAECF0"
                              : "none",
                          color: "#344054",
                        }}
                      >
                        {index + 1}. {param.text || param.name}
                      </Typography>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {loading
                      ? "Загрузка параметров..."
                      : "Параметры проверки отсутствуют"}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              component={Link}
              to={`/task/${check.id}`}
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
