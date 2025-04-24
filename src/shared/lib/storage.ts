// src/shared/lib/storage.ts
export const storage = {
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      console.log(`Storage set: ${key}=${value}`);
      // Проверка, что данные действительно сохранены
      const savedValue = localStorage.getItem(key);
      if (savedValue !== value) {
        console.error(`Storage set failed: ${key} was not saved correctly`);
      }
    } catch (error) {
      console.error(`Failed to set ${key} in localStorage:`, error);
    }
  },
  get: (key: string): string | null => {
    try {
      const value = localStorage.getItem(key);
      console.log(`Storage get: ${key}=${value}`);
      return value;
    } catch (error) {
      console.error(`Failed to get ${key} from localStorage:`, error);
      return null;
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
      console.log(`Storage remove: ${key}`);
    } catch (error) {
      console.error(`Failed to remove ${key} from localStorage:`, error);
    }
  },
};
