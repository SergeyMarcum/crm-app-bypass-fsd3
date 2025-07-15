// src/widgets/header/ui.tsx
import { useState } from "react";
import type { JSX } from "react";
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
  Divider as MuiDivider,
  List as MuiList,
  ListItemIcon as MuiListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useUser } from "@shared/hooks/use-user";
import { useAuthStore } from "@features/auth/model/store";
import { useNotifications } from "@shared/processes/notifications/hooks/use-notifications";
import { Logo } from "@shared/ui/Logo";
import type { HeaderProps } from "./types";

export function Header({ onToggleSidebar }: HeaderProps): JSX.Element {
  const navigate = useNavigate();
  const { user } = useUser();
  const { logout } = useAuthStore();
  const { notifications } = useNotifications();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchorEl(null);
  };

  const handleLogout = (): void => {
    logout();
    navigate("/login");
    handleMenuClose();
  };

  const handleSettings = (): void => {
    navigate("/settings");
    handleMenuClose();
  };

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={onToggleSidebar} color="inherit" edge="start">
            <MenuIcon />
          </IconButton>
          <Logo />
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Обходчик
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
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
              src={user?.photo ?? undefined} // Преобразуем null в undefined
              sx={{ width: 32, height: 32 }}
            >
              {user?.name?.[0] || "U"}
            </Avatar>
          </IconButton>
        </Box>

        <MuiMenu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {user?.name || "Пользователь"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email || "email@example.com"}
            </Typography>
          </Box>
          <MuiDivider />
          <MuiList>
            <MuiMenuItem onClick={handleSettings}>
              <MuiListItemIcon>
                <PersonIcon />
              </MuiListItemIcon>
              Профиль
            </MuiMenuItem>
          </MuiList>
          <MuiDivider />
          <Box sx={{ px: 2, py: 1 }}>
            <MuiMenuItem onClick={handleLogout}>
              <MuiListItemIcon>
                <LogoutIcon />
              </MuiListItemIcon>
              Выход
            </MuiMenuItem>
          </Box>
        </MuiMenu>
      </Toolbar>
    </MuiAppBar>
  );
}
