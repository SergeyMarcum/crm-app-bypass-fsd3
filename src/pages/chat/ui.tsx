// src/pages/chat/ui.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  IconButton,
  ListItemButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";

// Пример данных для контактов и сообщений
interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
}

interface Message {
  id: string;
  sender: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isCurrentUser: boolean; // Для определения стиля сообщения
}

const mockContacts: Contact[] = [
  { id: "1", name: "Иванов И.И.", avatar: "/avatars/avatar1.png", lastMessage: "Здравствуйте!" },
  { id: "2", name: "Петрова А.А.", avatar: "/avatars/avatar2.png", lastMessage: "Ок, принято." },
  { id: "3", name: "Сидоров В.Н.", avatar: "/avatars/avatar3.png", lastMessage: "Как дела?" },
];

const mockMessages: Message[] = [
  {
    id: "m1",
    sender: "Иванов И.И.",
    senderAvatar: "/avatars/avatar1.png",
    text: "Здравствуйте, Алексей! У меня вопрос по заданию #123.",
    timestamp: "10:00",
    isCurrentUser: false,
  },
  {
    id: "m2",
    sender: "Вы",
    senderAvatar: "/avatars/current_user_avatar.png",
    text: "Привет, Иван! Слушаю внимательно.",
    timestamp: "10:05",
    isCurrentUser: true,
  },
  {
    id: "m3",
    sender: "Иванов И.И.",
    senderAvatar: "/avatars/avatar1.png",
    text: "Когда будет возможность проверить объект 'Газпром Офис'?",
    timestamp: "10:15",
    isCurrentUser: false,
  },
  {
    id: "m4",
    sender: "Вы",
    senderAvatar: "/avatars/current_user_avatar.png",
    text: "Думаю, к концу недели смогу все организовать. Я вам сообщу.",
    timestamp: "10:20",
    isCurrentUser: true,
  },
];

const ChatPage: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(mockContacts[0]); // Выбранный контакт по умолчанию

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const newMessage: Message = {
        id: String(messages.length + 1),
        sender: "Вы",
        senderAvatar: "/avatars/current_user_avatar.png",
        text: currentMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
      };
      setMessages((prev) => [...prev, newMessage]);
      setCurrentMessage("");
    }
  };

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: "100vh" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Чат по проверке объекта
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Просмотр сообщений по проверке объекта филиала
      </Typography>

      <Paper
        elevation={3}
        sx={{
          display: "flex",
          height: "calc(100vh - 200px)", // Высота чата, подгоните по необходимости
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Левая панель - Список контактов */}
        <Box sx={{ width: 300, borderRight: 1, borderColor: "divider", bgcolor: "background.paper" }}>
          <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Поиск контактов"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Box>
          <Divider />
          <List sx={{ overflowY: "auto", height: "calc(100% - 65px)" }}>
            {filteredContacts.map((contact) => (
              <ListItemButton
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                selected={selectedContact?.id === contact.id}
              >
                <ListItemAvatar>
                  {/* ИСПРАВЛЕНИЕ: Удалено process.env.PUBLIC_URL */}
                  <Avatar src={contact.avatar} alt={contact.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={contact.name}
                  secondary={contact.lastMessage}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Правая панель - История чата */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6">
              {selectedContact ? selectedContact.name : "Выберите контакт"}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent: msg.isCurrentUser ? "flex-end" : "flex-start",
                }}
              >
                {!msg.isCurrentUser && (
                  // ИСПРАВЛЕНИЕ: Удалено process.env.PUBLIC_URL
                  <Avatar src={msg.senderAvatar} alt={msg.sender} sx={{ mr: 1 }} />
                )}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: "70%",
                    bgcolor: msg.isCurrentUser ? "primary.light" : "grey.200",
                    color: msg.isCurrentUser ? "white" : "text.primary",
                    textAlign: msg.isCurrentUser ? "right" : "left",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {msg.sender}
                  </Typography>
                  <Typography variant="body2">{msg.text}</Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 0.5, color: msg.isCurrentUser ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                    {msg.timestamp}
                  </Typography>
                </Paper>
                {msg.isCurrentUser && (
                  // ИСПРАВЛЕНИЕ: Удалено process.env.PUBLIC_URL
                  <Avatar src={msg.senderAvatar} alt={msg.sender} sx={{ ml: 1 }} />
                )}
              </Box>
            ))}
          </Box>
          <Divider />
          {/* Поле ввода нового сообщения */}
          <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
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
            <IconButton color="primary" onClick={handleSendMessage} disabled={!currentMessage.trim()}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatPage;