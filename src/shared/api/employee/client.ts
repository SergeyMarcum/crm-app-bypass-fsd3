// src/shared/api/employee/client.ts
import { User as Employee } from "@/entities/user/types";

/**
 * Mocks fetching employees by department.
 * Replace this with actual API call.
 */
export const getEmployeesByDepartment = async (
  departmentName: string,
  isTestMode: boolean = false
): Promise<Employee[]> => {
  console.log(
    `Mocking employee fetch for department: ${departmentName}, test mode: ${isTestMode}`
  );
  // Example mock data - now includes the required 'domain' property
  return [
    {
      id: 1,
      full_name: "Иванов И.И.",
      email: "ivanov@example.com",
      phone: "+79001234567",
      position: "Начальник отдела",
      department: departmentName,
      status_id: 1, // Работает
      role_id: 3, // Мастер
      domain: "main_domain", // Added required 'domain' property
      company: null,
      name: null,
      login: null,
      system_login: null,
      address: null,
      photo: null,
      tech_support_email: null,
    },
    {
      id: 2,
      full_name: "Петров П.П.",
      email: "petrov@example.com",
      phone: "+79007654321",
      position: "Оператор",
      department: departmentName,
      status_id: 1, // Работает
      role_id: 4, // Оператор
      domain: "main_domain", // Added required 'domain' property
      company: null,
      name: null,
      login: null,
      system_login: null,
      address: null,
      photo: null,
      tech_support_email: null,
    },
    // Add more mock employees as needed
  ];
};