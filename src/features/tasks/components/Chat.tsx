// src/features/tasks/components/Chat.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  TextField,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useChat } from "../hooks/useChat";
import dayjs from "dayjs";

interface ChatProps {
  taskId: string;
  currentUserId: number;
  operatorId: number;
  managerId: number;
  operatorName: string;
  managerName: string;
  baseUrl: string;
}

const Chat: React.FC<ChatProps> = ({
  taskId,
  currentUserId,
  operatorId,
  managerId,
  operatorName,
  managerName,
  baseUrl,
}) => {
  const { messages, users, loading, error, sendMessage, refetch } = useChat(
    taskId,
    currentUserId
  );
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Выбор второго пользователя из users, если managerId недействителен
  const secondUser = users.find((user) => user.user_id !== currentUserId) || {
    user_id: managerId,
    name: managerName,
  };
  const secondUserId = secondUser.user_id;
  const secondUserName = secondUser.name;

  const handleSendMessage = async () => {
    if (!currentMessage.trim() && !selectedFile) return;

    try {
      await sendMessage(
        Number(taskId),
        currentUserId,
        secondUserId,
        currentMessage,
        selectedFile
      );
      setCurrentMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Ошибка отправки сообщения:", err);
      alert("Ошибка отправки сообщения. Пожалуйста, попробуйте снова.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleAttachFileClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <CircularProgress />
        <Typography ml={2}>Загрузка сообщений...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
        <Button onClick={refetch}>Повторить</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "500px" }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6">
          Чат между {operatorName} и {secondUserName}
        </Typography>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messages.length === 0 ? (
          <Typography>Нет сообщений</Typography>
        ) : (
          <List>
            {messages.map((msg) => (
              <ListItem
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.user_id === currentUserId ? "flex-end" : "flex-start",
                }}
              >
                {msg.user_id !== currentUserId && (
                  <ListItemAvatar>
                    <Avatar
                      src={
                        msg.filepath ? `${baseUrl}/${msg.filepath}` : undefined
                      }
                      alt={msg.user_name}
                    />
                  </ListItemAvatar>
                )}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: "70%",
                    bgcolor:
                      msg.user_id === currentUserId
                        ? "primary.light"
                        : "grey.200",
                    color:
                      msg.user_id === currentUserId ? "white" : "text.primary",
                    textAlign: msg.user_id === currentUserId ? "right" : "left",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    {msg.user_name}
                  </Typography>
                  <Typography variant="body2">{msg.message}</Typography>
                  {msg.filepath && (
                    <Button
                      variant="text"
                      href={`${baseUrl}/${msg.filepath}`}
                      download
                      sx={{ mt: 0.5 }}
                    >
                      Скачать файл
                    </Button>
                  )}
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{
                      mt: 0.5,
                      color:
                        msg.user_id === currentUserId
                          ? "rgba(255,255,255,0.7)"
                          : "text.secondary",
                    }}
                  >
                    {dayjs(msg.date_time).format("DD.MM.YYYY HH:mm")}
                  </Typography>
                </Paper>
                {msg.user_id === currentUserId && (
                  <ListItemAvatar>
                    <Avatar
                      src={
                        msg.filepath ? `${baseUrl}/${msg.filepath}` : undefined
                      }
                      alt={msg.user_name}
                    />
                  </ListItemAvatar>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Divider />
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <IconButton onClick={handleAttachFileClick}>
          <AttachFileIcon />
        </IconButton>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Введите сообщение..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={!currentMessage.trim() && !selectedFile}
          data-testid="send-message-button"
        >
          <SendIcon />
        </IconButton>
      </Box>
      {selectedFile && (
        <Typography variant="caption" sx={{ p: 1 }}>
          Прикреплен файл: {selectedFile.name}
        </Typography>
      )}
    </Box>
  );
};

export default Chat;
