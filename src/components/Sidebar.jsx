import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Link as LinkIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Links", icon: <LinkIcon />, path: "/links" },
    { text: "Analytics", icon: <AnalyticsIcon />, path: "/analytics" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          borderRight: "1px solid #e0e0e0",
          backgroundColor: "#fff",
        },
      }}
    >
      <Box sx={{ p: 2, mt: 8 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "24px",
            fontWeight: 500,
            color: "#2962ff",
            mb: 4,
          }}
        >
          Cuvette
        </Typography>

        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              button
              onClick={() => navigate(item.path)}
              sx={{
                mb: 1,
                borderRadius: 1,
                backgroundColor:
                  location.pathname === item.path ? "#f0f5ff" : "transparent",
                color: location.pathname === item.path ? "#2962ff" : "#666",
                "&:hover": {
                  backgroundColor: "#f0f5ff",
                  color: "#2962ff",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: "40px",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "14px",
                  fontWeight: location.pathname === item.path ? 500 : 400,
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
