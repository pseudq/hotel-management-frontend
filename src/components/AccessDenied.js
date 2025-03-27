"use client";
import { Box, Typography, Button, Paper } from "@mui/material";
import { Lock, Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <Lock sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Truy cập bị từ chối
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị
          viên nếu bạn cần quyền truy cập.
        </Typography>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Quay lại trang chủ
        </Button>
      </Paper>
    </Box>
  );
};

export default AccessDenied;
