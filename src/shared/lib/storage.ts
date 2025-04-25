// src/shared/lib/storage.ts
export const storage = {
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      console.log(`Набор для хранения: ${key}=${value}`);
      // Проверка, что данные действительно сохранены
      const savedValue = localStorage.getItem(key);
      if (savedValue !== value) {
        console.error(`Сбой набора памяти: ${key} не был сохранен правильно`);
      }
    } catch (error) {
      console.error(`Не удалось установить ${key} в localStorage:`, error);
    }
  },
  get: (key: string): string | null => {
    try {
      const value = localStorage.getItem(key);
      console.log(`Получить хранилище: ${key}=${value}`);
      return value;
    } catch (error) {
      console.error(`Не удалось получить ${key} c localStorage:`, error);
      return null;
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
      console.log(`Убрать на хранение: ${key}`);
    } catch (error) {
      console.error(`Не удалось удалить ${key} c localStorage:`, error);
    }
  },
};
