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
      setLoading(true);
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        try {
          // Đặt user từ localStorage trước
          setUser(JSON.parse(storedUser));

          // Kiểm tra token còn hợp lệ không
          const response = await checkAuth();

          // Nếu API trả về thông tin người dùng mới, cập nhật lại
          if (response && response.data) {
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
          }
        } catch (error) {
          console.error("Token invalid or expired:", error);
          // Chỉ xóa token và user nếu lỗi là 401 (Unauthorized)
          if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
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

  // Hàm kiểm tra vai trò
  const hasRole = (roles) => {
    if (!user) return false;

    const userRole = user.vai_tro?.toLowerCase();
    if (!userRole) return false;

    // Nếu roles là một mảng, kiểm tra xem người dùng có vai trò nào trong mảng không
    if (Array.isArray(roles)) {
      return roles.some((role) => role.toLowerCase() === userRole);
    }

    // Nếu roles là một chuỗi, kiểm tra xem người dùng có vai trò đó không
    return roles.toLowerCase() === userRole;
  };

  const value = {
    user,
    loading,
    error,
    login: loginUser,
    logout: logoutUser,
    isAuthenticated: !!user,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
