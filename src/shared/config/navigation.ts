// src/shared/config/navigation.ts
import { SvgIconComponent } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import ListAltIcon from "@mui/icons-material/ListAlt";

interface NavItem {
  path: string;
  label: string;
  icon: SvgIconComponent;
  roles: number[]; // Доступные роли (role_id)
}

export const navigation: NavItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    roles: [1, 2, 3],
  },
  { path: "/users", label: "Users", icon: PeopleIcon, roles: [1, 2] },
  { path: "/employees", label: "Employees", icon: PeopleIcon, roles: [1, 2] },
  {
    path: "/tasks/control",
    label: "Task Control",
    icon: AssignmentIcon,
    roles: [1, 2, 3],
  },
  {
    path: "/calendar",
    label: "Calendar",
    icon: CalendarTodayIcon,
    roles: [1, 2, 3],
  },
  { path: "/settings", label: "Settings", icon: SettingsIcon, roles: [1] },
  { path: "/help", label: "Help", icon: HelpIcon, roles: [1, 2, 3] },
  {
    path: "/logs/checks",
    label: "Check Logs",
    icon: ListAltIcon,
    roles: [1, 2],
  },
  {
    path: "/logs/defects",
    label: "Defect Logs",
    icon: ListAltIcon,
    roles: [1, 2],
  },
];
