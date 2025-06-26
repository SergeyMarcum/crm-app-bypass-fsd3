// src/widgets/sidebar/ui.tsx
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
  Tooltip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  ListAlt as ListAltIcon,
  Message as MessageIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  Layers as LayersIcon,
} from "@mui/icons-material";
//import { useUser } from "@shared/hooks/use-user";
import { useAuthStore } from "@features/auth/model/store";

interface SidebarProps {
  isOpen: boolean;
}

const DRAWER_WIDTH = 240;
const MINI_WIDTH = 60;
const HEADER_HEIGHT = 64;

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
  const logout = useAuthStore((state) => state.logout);

  const [tasksOpen, setTasksOpen] = useState(pathname.startsWith("/tasks"));
  const [logsOpen, setLogsOpen] = useState(pathname.startsWith("/logs"));
  const [objectsOpen, setObjectsOpen] = useState(
    pathname.startsWith("/objects")
  );

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
        <Tooltip title={isOpen ? "" : text} placement="right">
          <ListItemButton
            sx={{
              ...(isActive ? activeStyle : {}),
              justifyContent: isOpen ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isOpen ? 2 : "auto",
                justifyContent: "center",
              }}
            >
              {icon}
            </ListItemIcon>
            {isOpen && <ListItemText primary={text} />}
          </ListItemButton>
        </Tooltip>
      )}
    </NavLink>
  );

  const NestedNavItem = ({ to, text }: { to: string; text: string }) => (
    <NavLink to={to} style={linkStyle}>
      {({ isActive }) => (
        <ListItemButton
          sx={{
            pl: isOpen ? 4 : 2,
            ...(isActive ? activeStyle : {}),
            justifyContent: isOpen ? "initial" : "center",
          }}
        >
          {isOpen && <ListItemText primary={text} />}
        </ListItemButton>
      )}
    </NavLink>
  );

  return (
    <Drawer
      variant="permanent"
      open={isOpen}
      sx={{
        width: isOpen ? DRAWER_WIDTH : MINI_WIDTH,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: isOpen ? DRAWER_WIDTH : MINI_WIDTH,
          mt: `${HEADER_HEIGHT}px`,
          overflowX: "hidden",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
          boxSizing: "border-box",
          borderRight: "1px solid rgba(0,0,0,0.12)",
        },
      }}
    >
      <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
        <List>
          <NavItem to="/dashboard" icon={<DashboardIcon />} text="Главная" />
          <NavItem to="/calendar" icon={<CalendarIcon />} text="Календарь" />

          <ListItemButton
            onClick={() => setTasksOpen((prev) => !prev)}
            sx={{ justifyContent: isOpen ? "initial" : "center" }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : "auto" }}>
              <AssignmentIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Задания" />}
            {isOpen && (tasksOpen ? <ExpandLess /> : <ExpandMore />)}
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

          <ListItemButton
            onClick={() => setLogsOpen((prev) => !prev)}
            sx={{ justifyContent: isOpen ? "initial" : "center" }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : "auto" }}>
              <ListAltIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Журналы" />}
            {isOpen && (logsOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
          <Collapse in={logsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <NestedNavItem to="/logs/checks" text="Проверки" />
              <NestedNavItem to="/logs/defects" text="Дефекты" />
            </List>
          </Collapse>

          <ListItemButton
            onClick={() => setObjectsOpen((prev) => !prev)}
            sx={{ justifyContent: isOpen ? "initial" : "center" }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : "auto" }}>
              <LayersIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Объекты" />}
            {isOpen && (objectsOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
          <Collapse in={objectsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <NestedNavItem to="/objects" text="Список объектов" />
              <NestedNavItem to="/objects/types" text="Типы объектов" />
              <NestedNavItem
                to="/objects/parameters"
                text="Список параметров"
              />
            </List>
          </Collapse>

          <NavItem to="/messages" icon={<MessageIcon />} text="Сообщения" />
        </List>
      </Box>

      <Divider />

      <Box>
        <List>
          <NavItem to="/instructions" icon={<HelpIcon />} text="Инструкции" />
          <NavItem to="/settings" icon={<SettingsIcon />} text="Настройки" />
          <NavItem to="/help" icon={<HelpIcon />} text="Нужна помощь?" />
          <ListItemButton
            onClick={handleLogout}
            sx={{ justifyContent: isOpen ? "initial" : "center" }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : "auto" }}>
              <LogoutIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Выход" />}
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
