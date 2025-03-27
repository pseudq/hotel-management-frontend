"use client"

import { useState } from "react"
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
} from "@mui/material"
import {
  Home,
  KingBed,
  Category,
  People,
  Book,
  RoomService,
  Receipt,
  Notifications,
  Menu as MenuIcon,
  ChevronLeft,
  Settings,
  Logout,
  Person,
} from "@mui/icons-material"
import { Link, useLocation } from "react-router-dom"

const drawerWidth = 260

const Sidebar = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [open, setOpen] = useState(!isMobile)
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const menuItems = [
    { text: "Dashboard", icon: <Home />, path: "/" },
    { text: "Rooms", icon: <KingBed />, path: "/rooms" },
    { text: "Room Types", icon: <Category />, path: "/room-types" },
    { text: "Customers", icon: <People />, path: "/customers" },
    { text: "Bookings", icon: <Book />, path: "/bookings" },
    { text: "Services", icon: <RoomService />, path: "/services" },
    { text: "Invoices", icon: <Receipt />, path: "/invoices" },
  ]

  const drawer = (
    <>
      <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: [1] }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src="/placeholder.svg?height=40&width=40"
            alt="Logo"
            style={{ marginRight: 12, height: 40, width: 40 }}
          />
          <Typography variant="h6" noWrap sx={{ fontWeight: 700, color: "primary.main" }}>
            HOTEL MANAGER
          </Typography>
        </Box>
        {open && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeft />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: "auto", height: "100%" }}>
        <List component="nav" sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              component={Link}
              to={item.path}
              key={item.text}
              sx={{
                mb: 1,
                borderRadius: 2,
                backgroundColor: location.pathname === item.path ? "primary.light" : "transparent",
                color: location.pathname === item.path ? "white" : "text.primary",
                "&:hover": {
                  backgroundColor: location.pathname === item.path ? "primary.main" : "action.hover",
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? "white" : "inherit", minWidth: 40 }}>
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
  )

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
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: open ? "none" : "block" } }}
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
            <Tooltip title="Account">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>A</Avatar>
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
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid rgba(0, 0, 0, 0.05)",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Sidebar

