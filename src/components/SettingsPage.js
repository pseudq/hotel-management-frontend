"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  Slider,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  RadioGroup,
  Radio,
  FormControl,
} from "@mui/material";
import {
  DarkMode,
  LightMode,
  Refresh,
  Save,
  Palette,
  FormatSize,
  Visibility,
  Language,
} from "@mui/icons-material";
import { useThemeSettings } from "../contexts/ThemeContext";

// Các màu chủ đạo có thể chọn
const primaryColors = [
  { name: "Xanh dương", value: "#2563eb" },
  { name: "Đỏ", value: "#dc2626" },
  { name: "Xanh lá", value: "#16a34a" },
  { name: "Tím", value: "#7c3aed" },
  { name: "Cam", value: "#ea580c" },
  { name: "Hồng", value: "#db2777" },
];

const SettingsPage = () => {
  const { settings, updateSettings } = useThemeSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Cập nhật localSettings khi settings thay đổi
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Lưu settings
  const saveSettings = () => {
    updateSettings(localSettings);
    setSnackbar({
      open: true,
      message: "Cài đặt đã được lưu thành công!",
      severity: "success",
    });
  };

  // Reset settings về mặc định
  const resetSettings = () => {
    const defaultSettings = {
      darkMode: false,
      primaryColor: "#2563eb",
      fontSize: 1,
      compactMode: false,
      language: "vi",
      showNotifications: true,
      animationsEnabled: true,
    };
    setLocalSettings(defaultSettings);
    updateSettings(defaultSettings);
    setSnackbar({
      open: true,
      message: "Cài đặt đã được khôi phục về mặc định!",
      severity: "info",
    });
  };

  const handleChange = (setting, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Hiển thị preview của theme
  const ThemePreview = () => (
    <Card
      sx={{
        bgcolor: localSettings.darkMode ? "#1e293b" : "#ffffff",
        color: localSettings.darkMode ? "#f8fafc" : "#1e293b",
        transition: "all 0.3s ease",
        mb: 3,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{ mb: 1, color: localSettings.primaryColor }}
        >
          Xem trước giao diện
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: localSettings.primaryColor,
              "&:hover": {
                bgcolor: localSettings.primaryColor,
                filter: "brightness(90%)",
              },
              fontSize: `${0.875 * localSettings.fontSize}rem`,
            }}
          >
            Nút chính
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{
              color: localSettings.primaryColor,
              borderColor: localSettings.primaryColor,
              fontSize: `${0.875 * localSettings.fontSize}rem`,
            }}
          >
            Nút phụ
          </Button>
        </Box>
        <Typography
          sx={{
            fontSize: `${1 * localSettings.fontSize}rem`,
            mb: 1,
          }}
        >
          Đây là văn bản mẫu để xem trước kích thước chữ và màu sắc.
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: `${0.875 * localSettings.fontSize}rem`,
            color: localSettings.darkMode ? "#94a3b8" : "#64748b",
          }}
        >
          Văn bản phụ với kích thước nhỏ hơn
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Cài đặt hệ thống
      </Typography>

      <Grid container spacing={4}>
        {/* Cột bên trái - Xem trước và lưu cài đặt */}
        <Grid item xs={12} md={4}>
          <ThemePreview />
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Thao tác
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={saveSettings}
                fullWidth
                sx={{ bgcolor: localSettings.primaryColor }}
              >
                Lưu cài đặt
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={resetSettings}
                fullWidth
              >
                Khôi phục mặc định
              </Button>
            </Box>
          </Paper>

          <Alert severity="info" sx={{ mb: 3 }}>
            Cài đặt sẽ được lưu vào trình duyệt của bạn và áp dụng cho lần truy
            cập tiếp theo.
          </Alert>
        </Grid>

        {/* Cột bên phải - Các tùy chọn cài đặt */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Palette sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Giao diện</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.darkMode}
                  onChange={(e) => handleChange("darkMode", e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {localSettings.darkMode ? (
                    <DarkMode sx={{ mr: 1, fontSize: 20 }} />
                  ) : (
                    <LightMode sx={{ mr: 1, fontSize: 20 }} />
                  )}
                  <Typography>Chế độ tối</Typography>
                </Box>
              }
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Màu chủ đạo
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              {primaryColors.map((color) => (
                <Tooltip title={color.name} key={color.value}>
                  <IconButton
                    sx={{
                      bgcolor: color.value,
                      width: 36,
                      height: 36,
                      border:
                        localSettings.primaryColor === color.value
                          ? "2px solid #000"
                          : "none",
                      "&:hover": {
                        bgcolor: color.value,
                        opacity: 0.9,
                      },
                    }}
                    onClick={() => handleChange("primaryColor", color.value)}
                  />
                </Tooltip>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <FormatSize sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Văn bản</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Typography id="font-size-slider" gutterBottom>
              Kích thước chữ:{" "}
              {localSettings.fontSize === 1
                ? "Mặc định"
                : localSettings.fontSize < 1
                ? "Nhỏ"
                : "Lớn"}
            </Typography>
            <Slider
              value={localSettings.fontSize}
              min={0.8}
              max={1.2}
              step={0.1}
              onChange={(_, value) => handleChange("fontSize", value)}
              aria-labelledby="font-size-slider"
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${Math.round((value - 1) * 100)}%`}
              sx={{ mb: 3 }}
            />
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Visibility sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Hiển thị</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.compactMode}
                  onChange={(e) =>
                    handleChange("compactMode", e.target.checked)
                  }
                  color="primary"
                />
              }
              label="Chế độ gọn nhẹ (giảm khoảng cách giữa các phần tử)"
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.showNotifications}
                  onChange={(e) =>
                    handleChange("showNotifications", e.target.checked)
                  }
                  color="primary"
                />
              }
              label="Hiển thị thông báo"
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.animationsEnabled}
                  onChange={(e) =>
                    handleChange("animationsEnabled", e.target.checked)
                  }
                  color="primary"
                />
              }
              label="Bật hiệu ứng chuyển động"
            />
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Language sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Ngôn ngữ</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <FormControl component="fieldset">
              <RadioGroup
                value={localSettings.language}
                onChange={(e) => handleChange("language", e.target.value)}
              >
                <FormControlLabel
                  value="vi"
                  control={<Radio />}
                  label="Tiếng Việt"
                />
                <FormControlLabel
                  value="en"
                  control={<Radio />}
                  label="English"
                />
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;
