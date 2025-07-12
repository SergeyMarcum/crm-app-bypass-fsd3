// src/shared/api/help/client.ts
// import axios from 'axios'; // Удалена строка, вызывающая ошибку "defined but never used"

interface SupportRequestData {
  subject: string;
  type: "Проблемы и предложения по работе приложения" | "Другое";
  name: string;
  email: string;
  message: string;
}

export const helpApi = {
  sendSupportRequest: async (data: SupportRequestData) => {
    // Здесь будет логика отправки запроса на ваш backend.
    // Backend должен определить, на какой email отправлять письмо
    // в зависимости от значения data.type.

    // Пример заглушки:
    console.log("Отправка запроса в поддержку:", data);
    // Имитация задержки сети
    return new Promise(resolve => setTimeout(resolve, 1000));
  },
};