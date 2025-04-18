"use client";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { CssBaseline, Box, ThemeProvider } from "@mui/material";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import RoomManagement from "./components/RoomManagement";
import RoomTypeManagement from "./components/RoomTypeManagement";
import CustomerManagement from "./components/CustomerManagement";
import BookingManagement from "./components/BookingManagement";
import ServiceManagement from "./components/ServiceManagement";
import InvoiceManagement from "./components/InvoiceManagement";
import SettingsPage from "./components/SettingsPage";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import {
  ThemeProvider as CustomThemeProvider,
  useThemeSettings,
} from "./contexts/ThemeContext";

// Layout component để tái sử dụng
const DashboardLayout = ({ children }) => {
  const { theme, settings } = useThemeSettings();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: settings.compactMode ? 2 : 3,
          pt: {
            xs: settings.compactMode ? 7 : 8,
            sm: settings.compactMode ? 8 : 9,
          },
          overflow: "auto",
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

// Wrapper component để sử dụng theme từ context
const AppWithTheme = () => {
  const { theme } = useThemeSettings();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <CssBaseline />
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Route cho cả quản lý và nhân viên */}
            <Route element={<PrivateRoute />}>
              <Route
                path="/"
                element={
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                }
              />

              <Route
                path="/customers"
                element={
                  <DashboardLayout>
                    <CustomerManagement />
                  </DashboardLayout>
                }
              />

              <Route
                path="/settings"
                element={
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                }
              />
            </Route>

            {/* Route chỉ cho quản lý */}
            <Route element={<RoleBasedRoute allowedRoles={["quản lý"]} />}>
              <Route
                path="/rooms"
                element={
                  <DashboardLayout>
                    <RoomManagement />
                  </DashboardLayout>
                }
              />

              <Route
                path="/room-types"
                element={
                  <DashboardLayout>
                    <RoomTypeManagement />
                  </DashboardLayout>
                }
              />

              <Route
                path="/bookings"
                element={
                  <DashboardLayout>
                    <BookingManagement />
                  </DashboardLayout>
                }
              />

              <Route
                path="/services"
                element={
                  <DashboardLayout>
                    <ServiceManagement />
                  </DashboardLayout>
                }
              />

              <Route
                path="/invoices"
                element={
                  <DashboardLayout>
                    <InvoiceManagement />
                  </DashboardLayout>
                }
              />
            </Route>

            {/* Redirect to login if no route matches */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <CustomThemeProvider>
      <AppWithTheme />
    </CustomThemeProvider>
  );
}

export default App;
