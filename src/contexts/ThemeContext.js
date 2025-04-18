"use client";

import { createContext, useState, useContext, useEffect, useMemo } from "react";
import { createTheme } from "@mui/material";

// Tạo context cho theme
const ThemeContext = createContext();

// Hook để sử dụng theme context
export const useThemeSettings = () => useContext(ThemeContext);

// Cài đặt mặc định
const defaultSettings = {
  darkMode: false,
  primaryColor: "#2563eb",
  fontSize: 1,
  compactMode: false,
  language: "vi",
  showNotifications: true,
  animationsEnabled: true,
};

export const ThemeProvider = ({ children }) => {
  // State để lưu trữ cài đặt người dùng
  const [settings, setSettings] = useState(defaultSettings);

  // Load settings từ localStorage khi component mount
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem("hotelAppSettings");
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
        } catch (error) {
          console.error("Error parsing saved settings:", error);
        }
      }
    };

    // Load settings khi component mount
    loadSettings();

    // Thêm event listener để phát hiện thay đổi từ tab khác
    window.addEventListener("storage", (e) => {
      if (e.key === "hotelAppSettings") {
        loadSettings();
      }
    });

    // Tạo một custom event để phát hiện thay đổi trong cùng tab
    window.addEventListener("settingsChanged", loadSettings);

    return () => {
      window.removeEventListener("storage", loadSettings);
      window.removeEventListener("settingsChanged", loadSettings);
    };
  }, []);

  // Hàm để cập nhật settings
  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem("hotelAppSettings", JSON.stringify(updatedSettings));

    // Dispatch custom event để thông báo thay đổi
    window.dispatchEvent(new Event("settingsChanged"));
  };

  // Tạo theme dựa trên cài đặt người dùng
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: settings.darkMode ? "dark" : "light",
          primary: {
            main: settings.primaryColor,
            light: settings.darkMode ? settings.primaryColor : "#3b82f6",
            dark: settings.darkMode ? "#1d4ed8" : "#1d4ed8",
          },
          secondary: {
            main: "#10b981",
            light: "#34d399",
            dark: "#059669",
          },
          background: {
            default: settings.darkMode ? "#0f172a" : "#f8fafc",
            paper: settings.darkMode ? "#1e293b" : "#ffffff",
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
            primary: settings.darkMode ? "#f8fafc" : "#1e293b",
            secondary: settings.darkMode ? "#94a3b8" : "#64748b",
          },
        },
        typography: {
          fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
          fontSize: 14 * settings.fontSize,
          h1: {
            fontWeight: 700,
            fontSize: 32 * settings.fontSize,
          },
          h2: {
            fontWeight: 700,
            fontSize: 24 * settings.fontSize,
          },
          h3: {
            fontWeight: 600,
            fontSize: 20 * settings.fontSize,
          },
          h4: {
            fontWeight: 600,
            fontSize: 18 * settings.fontSize,
          },
          h5: {
            fontWeight: 600,
            fontSize: 16 * settings.fontSize,
          },
          h6: {
            fontWeight: 600,
            fontSize: 14 * settings.fontSize,
          },
          body1: {
            fontSize: 14 * settings.fontSize,
          },
          body2: {
            fontSize: 12 * settings.fontSize,
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
                padding: settings.compactMode ? "6px 12px" : "8px 16px",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                },
              },
              containedPrimary: {
                "&:hover": {
                  backgroundColor: settings.primaryColor,
                  filter: "brightness(90%)",
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
          MuiTableCell: {
            styleOverrides: {
              root: {
                padding: settings.compactMode ? "8px 12px" : "16px",
              },
            },
          },
          MuiDialogContent: {
            styleOverrides: {
              root: {
                padding: settings.compactMode ? "12px" : "20px",
              },
            },
          },
        },
      }),
    [settings]
  );

  return (
    <ThemeContext.Provider value={{ theme, settings, updateSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};
