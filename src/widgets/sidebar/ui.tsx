// src/widgets/sidebar/ui.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import ListAltIcon from "@mui/icons-material/ListAlt";
import BuildIcon from "@mui/icons-material/Build";
import MessageIcon from "@mui/icons-material/Message";
import HelpIcon from "@mui/icons-material/Help";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useUser } from "@shared/hooks/use-user";

interface SidebarProps {
  isOpen: boolean;
}

export function SidebarNav({ isOpen }: SidebarProps): JSX.Element {
  const navigate = useNavigate();
  const { logout } = useUser();
  const [tasksExpanded, setTasksExpanded] = useState(false);
  const [logsExpanded, setLogsExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Drawer
      variant="persistent"
      open={isOpen}
      sx={{
        width: isOpen ? 240 : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
    >
      <List>
        <ListItem button onClick={() => navigate("/dashboard")}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Главная" />
        </ListItem>
        <ListItem button onClick={() => navigate("/calendar")}>
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
          <ListItemText primary="Календарь работ" />
        </ListItem>
        <ListItem button onClick={() => setTasksExpanded(!tasksExpanded)}>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Задания" />
          {tasksExpanded ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={tasksExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              sx={{ pl: 4 }}
              onClick={() => navigate("/tasks/create")}
            >
              <ListItemText primary="Создать" />
            </ListItem>
            <ListItem
              button
              sx={{ pl: 4 }}
              onClick={() => navigate("/tasks/view")}
            >
              <ListItemText primary="Просмотр" />
            </ListItem>
            <ListItem
              button
              sx={{ pl: 4 }}
              onClick={() => navigate("/tasks/control")}
            >
              <ListItemText primary="Контроль" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button onClick={() => navigate("/employees")}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Сотрудники" />
        </ListItem>
        <ListItem button onClick={() => navigate("/users")}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Пользователи" />
        </ListItem>
        <ListItem button onClick={() => setLogsExpanded(!logsExpanded)}>
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <ListItemText primary="Журналы" />
          {logsExpanded ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={logsExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              sx={{ pl: 4 }}
              onClick={() => navigate("/logs/checks")}
            >
              <ListItemText primary="Проверки" />
            </ListItem>
            <ListItem
              button
              sx={{ pl: 4 }}
              onClick={() => navigate("/logs/defects")}
            >
              <ListItemText primary="Дефекты" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button onClick={() => navigate("/objects")}>
          <ListItemIcon>
            <BuildIcon />
          </ListItemIcon>
          <ListItemText primary="Объекты" />
        </ListItem>
        <ListItem button onClick={() => navigate("/messages")}>
          <ListItemIcon>
            <MessageIcon />
          </ListItemIcon>
          <ListItemText primary="Сообщения" />
        </ListItem>
        <ListItem button onClick={() => navigate("/instructions")}>
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Инструкции" />
        </ListItem>
        <ListItem button onClick={() => navigate("/settings")}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Настройки" />
        </ListItem>
        <ListItem button onClick={() => navigate("/help")}>
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Нужна помощь?" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Выход" />
        </ListItem>
      </List>
    </Drawer>
  );
}
