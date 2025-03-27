import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { CssBaseline, Box, ThemeProvider, createTheme } from "@mui/material";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import RoomManagement from "./components/RoomManagement";
import RoomTypeManagement from "./components/RoomTypeManagement";
import CustomerManagement from "./components/CustomerManagement";
import BookingManagement from "./components/BookingManagement";
import ServiceManagement from "./components/ServiceManagement";
import InvoiceManagement from "./components/InvoiceManagement";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";

// Tạo theme hiện đại hơn
const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb", // Màu xanh dương hiện đại
      light: "#3b82f6",
      dark: "#1d4ed8",
    },
    secondary: {
      main: "#10b981", // Màu xanh lá hiện đại
      light: "#34d399",
      dark: "#059669",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    error: {
      main: "#ef4444",
    },
    warning: {
      main: "#f59e0b",
    },
    info: {
      main: "#3b82f6",
    },
    success: {
      main: "#10b981",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "8px 16px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          },
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#3b82f6",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          overflow: "hidden",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <CssBaseline />
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<PrivateRoute />}>
              <Route
                path="/"
                element={
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
                        p: 3,
                        pt: { xs: 8, sm: 9 },
                        overflow: "auto",
                      }}
                    >
                      <Dashboard />
                    </Box>
                  </Box>
                }
              />

              <Route
                path="/rooms"
                element={
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
                        p: 3,
                        pt: { xs: 8, sm: 9 },
                        overflow: "auto",
                      }}
                    >
                      <RoomManagement />
                    </Box>
                  </Box>
                }
              />

              <Route
                path="/room-types"
                element={
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
                        p: 3,
                        pt: { xs: 8, sm: 9 },
                        overflow: "auto",
                      }}
                    >
                      <RoomTypeManagement />
                    </Box>
                  </Box>
                }
              />

              <Route
                path="/customers"
                element={
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
                        p: 3,
                        pt: { xs: 8, sm: 9 },
                        overflow: "auto",
                      }}
                    >
                      <CustomerManagement />
                    </Box>
                  </Box>
                }
              />

              <Route
                path="/bookings"
                element={
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
                        p: 3,
                        pt: { xs: 8, sm: 9 },
                        overflow: "auto",
                      }}
                    >
                      <BookingManagement />
                    </Box>
                  </Box>
                }
              />

              <Route
                path="/services"
                element={
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
                        p: 3,
                        pt: { xs: 8, sm: 9 },
                        overflow: "auto",
                      }}
                    >
                      <ServiceManagement />
                    </Box>
                  </Box>
                }
              />

              <Route
                path="/invoices"
                element={
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
                        p: 3,
                        pt: { xs: 8, sm: 9 },
                        overflow: "auto",
                      }}
                    >
                      <InvoiceManagement />
                    </Box>
                  </Box>
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
}

export default App;
