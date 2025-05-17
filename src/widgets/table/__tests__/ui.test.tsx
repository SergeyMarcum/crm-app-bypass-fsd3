import { render, screen, fireEvent } from "@testing-library/react";
import { CustomTable } from "../ui";

const mockData = [
  {
    id: "1",
    full_name: "Иванов Иван",
    email: "ivan@test.com",
    department: "ИТ",
    phone: "123456",
  },
  {
    id: "2",
    full_name: "Петров Петр",
    email: "petr@test.com",
    department: "Маркетинг",
    phone: "654321",
  },
];

const columns = [
  { headerName: "#", valueGetter: "node.rowIndex + 1" },
  { headerName: "ФИО", field: "full_name" },
  { headerName: "Email", field: "email" },
  { headerName: "Отдел", field: "department" },
  { headerName: "Телефон", field: "phone" },
];

test("renders table and filters correctly", () => {
  render(<CustomTable rowData={mockData} columnDefs={columns} />);

  expect(screen.getByText("ФИО")).toBeInTheDocument();
  expect(screen.getByText("Иванов Иван")).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "ivan" },
  });

  fireEvent.click(screen.getByText("Применить"));

  expect(screen.getByText("Иванов Иван")).toBeInTheDocument();
  expect(screen.queryByText("Петров Петр")).toBeNull();
});
