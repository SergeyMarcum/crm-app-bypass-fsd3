// src/widgets/sidebar/ui.tsx
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useAuthStore } from "@features/auth/model/store";
import { navigation } from "@shared/config/navigation";
import { useNavigate } from "react-router-dom";

export const Sidebar = (): JSX.Element => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const allowedItems = navigation.filter((item) =>
    user?.role_id ? item.roles.includes(user.role_id) : false
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          top: 64,
        },
      }}
    >
      <List>
        {allowedItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
