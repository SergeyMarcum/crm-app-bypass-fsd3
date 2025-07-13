// src/features/tasks/components/Chat.tsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Chat: React.FC = () => {
  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
      <Typography variant="body1" color="text.secondary">
        // Здесь будет реализована функциональность чата и истории проверки.
        // Для демонстрации: Моковая история сообщений.
        История проверки: (Пока нет сообщений)
      </Typography>
      {/* <Box sx={{ maxHeight: '300px', overflowY: 'auto', mt: 2 }}>
        <Typography variant="body2">Сообщение 1: Дата и время</Typography>
        <Typography variant="body2">Сообщение 2: Дата и время</Typography>
      </Box> */}
    </Paper>
  );
};

export default Chat;