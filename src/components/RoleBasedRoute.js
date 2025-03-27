"use client";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Box, CircularProgress, Typography } from "@mui/material";
import AccessDenied from "./AccessDenied";

const RoleBasedRoute = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Đang tải...
        </Typography>
      </Box>
    );
  }

  // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Kiểm tra vai trò người dùng
  const userRole = user?.vai_tro?.toLowerCase();
  const hasRequiredRole = allowedRoles.some(
    (role) => role.toLowerCase() === userRole
  );

  // Nếu người dùng không có quyền truy cập, hiển thị trang từ chối truy cập
  if (!hasRequiredRole) {
    return <AccessDenied />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
