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
  InputBase,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useUser } from "@shared/hooks/use-user";
import { useAuthStore } from "@features/auth/model/store";
import { useNotifications } from "@/app/stores/notifications/hooks/use-notifications";
import { Logo } from "@shared/ui/Logo";
import type { HeaderProps } from "./types";
import { toast } from "sonner";

const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
      "&:focus": {
        width: "28ch",
      },
    },
  },
}));

function formatInitials(fullName: string | null | undefined, nameFallback: string | null | undefined): string {
  const nameToFormat = fullName || nameFallback;
  if (!nameToFormat) return "Пользователь";
  const parts = nameToFormat.trim().split(/\s+/);
  if (parts.length === 0) return "Пользователь";
  const lastName = parts[0];
  const firstNameInit = parts[1] ? ` ${parts[1][0]}.` : "";
  const middleNameInit = parts[2] ? `${parts[2][0]}.` : "";
  return `${lastName}${firstNameInit}${middleNameInit}`;
}

export function Header({ onToggleSidebar }: HeaderProps): JSX.Element {
  const navigate = useNavigate();
  const { user } = useUser();
  const { logout } = useAuthStore();
  const { notifications } = useNotifications();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearch = (): void => {
    if (searchQuery.trim()) {
      toast.info(`Поиск: "${searchQuery}"`);
    } else {
      toast.warning("Введите запрос для поиска");
    }
  };

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 64, px: 2 }}>
        {/* 1 & 2. кнопка "бургер" и Логотип с наименованием */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            onClick={onToggleSidebar}
            sx={{ color: "common.white" }}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Logo sx={{ height: 32, mx: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              fontWeight: 700,
              display: { xs: "none", md: "block" },
              letterSpacing: "0.5px",
            }}
          >
            Обходчик
          </Typography>
        </Box>

        {/* 3. строка поиска (input) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "center",
            maxWidth: 450,
            mx: 2,
          }}
        >
          <SearchContainer>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: (theme) => alpha(theme.palette.common.white, 0.7) }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Поиск..."
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </SearchContainer>
        </Box>

        {/* 4 & 5. элемент Уведомления (колокольчик) и Аватар с Фамилией И.О. */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton sx={{ color: "common.white" }}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Box
            onClick={handleMenuOpen}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              borderRadius: 2,
              p: 0.5,
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.1),
              },
            }}
          >
            <Avatar
              alt={user?.fullName || user?.name || "User"}
              src={user?.photo ?? undefined}
              sx={{ width: 32, height: 32, boxShadow: "none" }}
            >
              {user?.fullName?.[0] || user?.name?.[0] || "U"}
            </Avatar>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 500,
                color: "common.white",
                display: { xs: "none", md: "block" },
              }}
            >
              {formatInitials(user?.fullName, user?.name)}
            </Typography>
          </Box>
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
              {user?.fullName || user?.name || "Пользователь"}
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


