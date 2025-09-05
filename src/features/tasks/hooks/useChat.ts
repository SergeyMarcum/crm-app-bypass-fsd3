// src/features/tasks/hooks/useChat.ts
import { useState, useEffect } from "react";

interface ChatMessage {
  id: number;
  task_id: number;
  user_id: number;
  user_name: string;
  second_user_id: number;
  second_user_name: string;
  message: string;
  date_time: string;
  filepath: string | null;
}

interface ChatUser {
  user_id: number;
  name: string;
  thumbnail_photo_url: string | null;
}

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const useChat = (taskId: string, currentUserId: number) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const domain = localStorage.getItem("auth_domain") || "";
  const username = localStorage.getItem("username") || "";
  const sessionCode = localStorage.getItem("session_code") || "";
  //const userId = localStorage.getItem("user_id") || "";

  const fetchUsersWithActiveChats = async () => {
    if (!domain || !username || !sessionCode) {
      setError("Отсутствуют данные аутентификации.");
      return;
    }

    setLoading(true);
    try {
      const url = `${BASE_URL}/chat/all-users-with-active-chats?domain=${domain}&username=${username}&session_code=${sessionCode}&user_id=${currentUserId}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка получения пользователей: ${response.status} - ${errorText}`
        );
      }
      const data: ChatUser[] = await response.json();
      setUsers(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Не удалось загрузить пользователей: ${errorMessage}`);
      console.error("fetchUsersWithActiveChats error:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagesByTaskId = async () => {
    if (!taskId || !domain || !username || !sessionCode) {
      setError("Отсутствуют данные аутентификации или task_id.");
      return;
    }

    setLoading(true);
    try {
      const url = `${BASE_URL}/chat/all-messages-by-task-id?domain=${domain}&username=${username}&session_code=${sessionCode}&task_id=${taskId}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка получения сообщений: ${response.status} - ${errorText}`
        );
      }
      const data: ChatMessage[] = await response.json();
      setMessages(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Не удалось загрузить сообщения: ${errorMessage}`);
      console.error("fetchMessagesByTaskId error:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (
    taskId: number,
    userId: number,
    secondUserId: number,
    message: string,
    file?: File | null
  ) => {
    if (!domain || !username || !sessionCode) {
      setError("Отсутствуют данные аутентификации.");
      return;
    }

    const url = `${BASE_URL}/chat/add-message?domain=${domain}&username=${username}&session_code=${sessionCode}`;
    const formData = new FormData();
    formData.append("task_id", String(taskId));
    formData.append("user_id", String(userId));
    formData.append("second_user_id", String(secondUserId));
    formData.append("message", message);
    if (file) {
      formData.append("file", file);
    }

    try {
      console.log("Sending message to:", url);
      console.log("FormData:", {
        task_id: String(taskId),
        user_id: String(userId),
        second_user_id: String(secondUserId),
        message,
        file: file ? file.name : null,
      });

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();
      console.log("sendMessage response:", response.status, responseText);

      if (!response.ok) {
        throw new Error(
          `Ошибка отправки сообщения: ${response.status} - ${responseText || "Неизвестная ошибка"}`
        );
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        // Убрано имя переменной parseError
        throw new Error("Некорректный формат ответа сервера: не JSON");
      }

      if (result.status === "OK") {
        await fetchMessagesByTaskId(); // Обновляем сообщения после отправки
      } else {
        throw new Error(
          `Ошибка сервера: ${result.message || "Неизвестная ошибка"}`
        );
      }
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Не удалось отправить сообщение: ${errorMessage}`);
      console.error("sendMessage error:", errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchUsersWithActiveChats();
    fetchMessagesByTaskId();
  }, [taskId, currentUserId]);

  return {
    messages,
    users,
    loading,
    error,
    sendMessage,
    refetch: fetchMessagesByTaskId,
  };
};
