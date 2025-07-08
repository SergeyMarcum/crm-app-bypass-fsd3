// src/shared/api/object-type/client.ts
import axiosInstance from "@/shared/api/axios";
import { AxiosError } from "axios";
import { getAuthParams } from "@/shared/lib/auth";

// Define the expected successful response type for addNewObjectType
interface AddNewObjectTypeSuccessResponse {
  message: string; // Assuming a success message
  // Add other fields if the backend returns them, e.g., 'objectType: { id: number; name: string }'
}

export const objectTypeApi = {
  /**
   * Получает все типы объектов.
   * @returns Массив объектов { id: number; name: string }.
   */
  async getAllObjectTypes(): Promise<{ id: number; name: string }[]> {
    try {
      const res = await axiosInstance.get("/all-object-types", {
        params: getAuthParams(),
      });
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при получении всех типов объектов:", err.message);
      throw err;
    }
  },

  /**
   * Сохраняет параметры для типа объекта.
   * @param data Объект с ID типа объекта, именем и массивом ID параметров.
   */
  async saveObjectTypeParam(data: {
    id: number;
    name: string;
    parameter_ids: number[];
  }): Promise<void> {
    try {
      const authParams = getAuthParams();
      await axiosInstance.put("/edit-object-type", data, {
        params: authParams,
      });
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error(
        "Ошибка при сохранении параметров типа объекта:",
        err.message
      );
      throw err;
    }
  },

  /**
   * Добавляет новый тип объекта.
   * @param name Название нового типа объекта.
   * @param parameter_ids Массив ID параметров, связанных с новым типом объекта.
   * @returns Объект успешного ответа.
   */
  async addNewObjectType(
    name: string,
    parameter_ids: number[] = []
  ): Promise<AddNewObjectTypeSuccessResponse> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.post<AddNewObjectTypeSuccessResponse>(
        `${import.meta.env.VITE_API_URL}/add-object-type`,
        { name, parameter_ids },
        {
          params: authParams,
        }
      );
      console.log("Ответ сервера при добавлении типа объекта:", res);
      return { message: "Тип объекта успешно добавлен" };
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при добавлении нового типа объекта:", err.message);
      if (err.response && err.response.data) {
        console.error("Детали ошибки от сервера:", err.response.data);
      }
      throw err;
    }
  },
};
