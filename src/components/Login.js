"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    ten_dang_nhap: "",
    mat_khau: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy đường dẫn trước đó nếu có
  const from = location.state?.from?.pathname || "/";

  // Nếu đã đăng nhập, chuyển hướng về trang trước đó hoặc trang chủ
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(credentials);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 450,
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="primary.main"
          >
            HOTEL MANAGER
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Đăng nhập để tiếp tục
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Tên đăng nhập"
            name="ten_dang_nhap"
            value={credentials.ten_dang_nhap}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            autoFocus
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Mật khẩu"
            name="mat_khau"
            type={showPassword ? "text" : "password"}
            value={credentials.mat_khau}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Đăng nhập"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
