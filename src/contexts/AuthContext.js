"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { login, checkAuth } from "../apiService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Kiểm tra xem người dùng đã đăng nhập chưa khi tải trang
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
          // Kiểm tra token còn hợp lệ không
          await checkAuth();
        } catch (error) {
          console.error("Token invalid or expired:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Hàm đăng nhập
  const loginUser = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await login(credentials);
      const { token, nhan_vien } = response.data;

      // Lưu token và thông tin người dùng vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(nhan_vien));

      setUser(nhan_vien);
      navigate("/");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng xuất
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const value = {
    user,
    loading,
    error,
    login: loginUser,
    logout: logoutUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
