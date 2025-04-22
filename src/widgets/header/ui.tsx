// src/widgets/header/ui.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Badge,
  Typography,
  Box,
  Avatar,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser } from "@shared/hooks/use-user";
import { useNotifications } from "@shared/processes/notifications/hooks/use-notifications";
import { Logo } from "@shared/ui/Logo";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps): JSX.Element {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { notifications } = useNotifications();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate("/profile");
    handleMenuClose();
  };

  return (
    <MuiAppBar position="static">
      <Toolbar>
        <IconButton onClick={onToggleSidebar} color="inherit">
          <MenuIcon />
        </IconButton>
        <Logo />
        <Box sx={{ flexGrow: 1 }}>
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
        </Box>
        <IconButton color="inherit">
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit" onClick={() => navigate("/settings")}>
          <SettingsIcon />
        </IconButton>
        <IconButton onClick={handleMenuOpen} color="inherit">
          <Avatar
            alt={user?.name}
            src={user?.avatar}
            sx={{ width: 32, height: 32 }}
          >
            {user?.name?.[0] || "U"}
          </Avatar>
        </IconButton>
        <MuiMenu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MuiMenuItem disabled>
            <Typography variant="body2">
              {user?.name || "Пользователь"}
              <br />
              {user?.email || "email@example.com"}
            </Typography>
          </MuiMenuItem>
          <MuiMenuItem onClick={handleProfile}>Профиль</MuiMenuItem>
          <MuiMenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            Выход
          </MuiMenuItem>
        </MuiMenu>
      </Toolbar>
    </MuiAppBar>
  );
}
