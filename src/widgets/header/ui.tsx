import { Avatar, Menu, MenuItem } from "@mui/material";
import { useAuthStore } from "@features/auth/model/store";

export const Header = () => {
  const { user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Avatar onClick={handleMenu} src={user?.avatar} />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem>{user?.full_name}</MenuItem>
        <MenuItem onClick={logout}>Sign out</MenuItem>
      </Menu>
    </Box>
  );
};
