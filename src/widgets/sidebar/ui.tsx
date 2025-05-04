import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  ListAlt as ListAltIcon,
  Build as BuildIcon,
  Message as MessageIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useUser } from "@shared/hooks/use-user";

interface SidebarProps {
  isOpen: boolean;
}

const linkStyle = {
  color: "inherit",
  textDecoration: "none",
};

const activeStyle = {
  backgroundColor: "rgba(25, 118, 210, 0.08)",
  borderRadius: "4px",
  "& .MuiListItemIcon-root": {
    color: "primary.main",
  },
};

export function SidebarNav({ isOpen }: SidebarProps): React.ReactElement {
  const { pathname } = useLocation();
  const { logout } = useUser();

  const [tasksOpen, setTasksOpen] = useState(pathname.startsWith("/tasks"));
  const [logsOpen, setLogsOpen] = useState(pathname.startsWith("/logs"));

  const handleLogout = () => logout();

  const NavItem = ({
    to,
    icon,
    text,
  }: {
    to: string;
    icon: React.ReactElement;
    text: string;
  }) => (
    <NavLink to={to} style={linkStyle}>
      {({ isActive }) => (
        <ListItemButton sx={isActive ? activeStyle : undefined}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItemButton>
      )}
    </NavLink>
  );

  const NestedNavItem = ({ to, text }: { to: string; text: string }) => (
    <NavLink to={to} style={linkStyle}>
      {({ isActive }) => (
        <ListItemButton sx={{ pl: 4, ...(isActive ? activeStyle : {}) }}>
          <ListItemText primary={text} />
        </ListItemButton>
      )}
    </NavLink>
  );

  return (
    <Drawer
      variant="persistent"
      open={isOpen}
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      {/* Главное меню */}
      <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
        <List>
          <NavItem to="/dashboard" icon={<DashboardIcon />} text="Главная" />
          <NavItem to="/calendar" icon={<CalendarIcon />} text="Календарь" />

          <ListItemButton onClick={() => setTasksOpen((prev) => !prev)}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Задания" />
            {tasksOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={tasksOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <NestedNavItem to="/tasks/create" text="Создать" />
              <NestedNavItem to="/tasks/view" text="Просмотр" />
              <NestedNavItem to="/tasks/control" text="Контроль" />
            </List>
          </Collapse>

          <NavItem to="/employees" icon={<PeopleIcon />} text="Сотрудники" />
          <NavItem to="/users" icon={<PeopleIcon />} text="Пользователи" />

          <ListItemButton onClick={() => setLogsOpen((prev) => !prev)}>
            <ListItemIcon>
              <ListAltIcon />
            </ListItemIcon>
            <ListItemText primary="Журналы" />
            {logsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={logsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <NestedNavItem to="/logs/checks" text="Проверки" />
              <NestedNavItem to="/logs/defects" text="Дефекты" />
            </List>
          </Collapse>

          <NavItem to="/objects" icon={<BuildIcon />} text="Объекты" />
          <NavItem to="/messages" icon={<MessageIcon />} text="Сообщения" />
        </List>
      </Box>

      {/* Разделитель */}
      <Divider />

      {/* Дополнительное меню */}
      <Box>
        <List>
          <NavItem to="/instructions" icon={<HelpIcon />} text="Инструкции" />
          <NavItem to="/settings" icon={<SettingsIcon />} text="Настройки" />
          <NavItem to="/help" icon={<HelpIcon />} text="Нужна помощь?" />
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Выход" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
