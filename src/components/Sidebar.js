"use client";

import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
  AppBar,
  Avatar,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Home,
  KingBed,
  Category,
  People,
  Book,
  RoomService,
  Receipt,
  Notifications,
  Menu as MenuIcon, // eslint-disable-next-line
  ChevronLeft,
  Settings,
  Logout,
  Person,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const drawerWidth = 260;

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout, hasRole } = useAuth(); // eslint-disable-next-line
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  // Định nghĩa các menu item với thông tin về quyền truy cập
  const menuItems = [
    {
      text: "Trang chủ",
      icon: <Home />,
      path: "/",
      roles: ["quản lý", "nhân viên"],
    },
    { text: "QL Phòng", icon: <KingBed />, path: "/rooms", roles: ["quản lý"] },
    {
      text: "Cài đặt phòng",
      icon: <Category />,
      path: "/room-types",
      roles: ["quản lý"],
    },
    {
      text: "Quản lý khách",
      icon: <People />,
      path: "/customers",
      roles: ["quản lý", "nhân viên"],
    },
    {
      text: "QL đặt phòng",
      icon: <Book />,
      path: "/bookings",
      roles: ["quản lý"],
    },
    {
      text: "QL dịch vụ",
      icon: <RoomService />,
      path: "/services",
      roles: ["quản lý"],
    },
    {
      text: "QL hóa đơn",
      icon: <Receipt />,
      path: "/invoices",
      roles: ["quản lý", "nhân viên"],
    },
  ];

  // Lọc menu items dựa trên vai trò của người dùng
  const filteredMenuItems = menuItems.filter((item) => {
    return hasRole(item.roles);
  });

  // Lấy chữ cái đầu tiên của tên người dùng cho Avatar
  const getInitials = () => {
    if (!user || !user.ho_ten) return "U";
    return user.ho_ten.charAt(0).toUpperCase();
  };

  const drawer = (
    <>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: [1],
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src="/Frame1000003404.svg"
            alt="Logo"
            style={{ marginRight: 12, height: 40, width: 40 }}
          />
          <Typography
            variant="h6"
            noWrap
            sx={{ fontWeight: 700, color: "primary.main" }}
          >
            HỆ THỐNG QLKS
          </Typography>
        </Box>
        {/* {open && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeft />
          </IconButton>
        )} */}
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: "auto", height: "100%" }}>
        <List component="nav" sx={{ px: 2 }}>
          {filteredMenuItems.map((item) => (
            <ListItem
              button
              component={Link}
              to={item.path}
              key={item.text}
              sx={{
                mb: 1,
                borderRadius: 2,
                backgroundColor:
                  location.pathname === item.path
                    ? "primary.light"
                    : "transparent",
                color:
                  location.pathname === item.path ? "white" : "text.primary",
                "&:hover": {
                  backgroundColor:
                    location.pathname === item.path
                      ? "primary.main"
                      : "action.hover",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? "white" : "inherit",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <List sx={{ px: 2 }}>
          <ListItem
            button
            sx={{
              mb: 1,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Box>
    </>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { md: open ? `calc(100% - ${drawerWidth}px)` : "100%" },
          ml: { md: open ? `${drawerWidth}px` : 0 },
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit" size="large">
                <Badge badgeContent={4} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title={user?.ho_ten || "Account"}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                  {getInitials()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {user?.ho_ten || "User"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.vai_tro || "Role"}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={open}
        onClose={handleDrawerToggle}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid rgba(0, 0, 0, 0.05)",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;
