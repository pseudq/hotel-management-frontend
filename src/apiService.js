import axios from "axios";
const getRuntimeConfig = () => {
  return window.RUNTIME_CONFIG || {};
};
const API_URL = getRuntimeConfig().API_URL || process.env.REACT_APP_API_URL;
console.log("API URL being used:", API_URL);
// const API_URL = "http://3.0.95.227:5000/api";
// const API_KEY = "your_api_key";

// Tạo instance axios với interceptors để xử lý lỗi và logging
const api = axios.create({
  baseURL: API_URL,
  headers: {
    // "X-API-KEY": API_KEY,
    "Content-Type": "application/json",
  },
  // Thêm timeout để tránh request treo quá lâu
  timeout: 10000,
});

// Thêm interceptor để log requests
api.interceptors.request.use(
  (config) => {
    // Remove this line:
    // console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config.data || {})

    // Thêm token vào header nếu có
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Remove this line:
    // console.error("API Request Error:", error)
    return Promise.reject(error);
  }
);

// Thêm interceptor để log responses
api.interceptors.response.use(
  (response) => {
    // Remove this line:
    // console.log(`API Response: ${response.status} ${response.config.url}`, response.data)
    return response;
  },
  (error) => {
    if (error.response) {
      // Remove this line:
      // console.error(
      //   `API Error ${error.response.status}: ${error.config.method.toUpperCase()} ${error.config.url}`,
      //   error.response.data,
      // )

      // Nếu token hết hạn (401), đăng xuất người dùng
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirect to login if not already there
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    } else if (error.request) {
      // Remove this line:
      // console.error("API No Response:", error.request)
    } else {
      // Remove this line:
      // console.error("API Request Setup Error:", error.message)
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (credentials) => api.post("/auth/login", credentials);
export const checkAuth = () => api.get("/auth/profile");
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Room APIs
export const getRooms = () => api.get("/phong");
export const getRoomById = (id) => api.get(`/phong/${id}`);
export const createRoom = (roomData) => api.post("/phong", roomData);
export const updateRoom = (id, roomData) => {
  // Remove this line:
  // console.log(`Updating room ${id} with data:`, roomData)
  return api.put(`/phong/${id}`, roomData);
};
export const deleteRoom = (id) => api.delete(`/phong/${id}`);

// Room Type APIs
export const getRoomTypes = () => api.get("/loai-phong");
export const createRoomType = (roomTypeData) =>
  api.post("/loai-phong", roomTypeData);
export const updateRoomType = (id, roomTypeData) =>
  api.put(`/loai-phong/${id}`, roomTypeData);
export const deleteRoomType = (id) => api.delete(`/loai-phong/${id}`);

// Customer APIs
export const getCustomers = () => api.get("/khach-hang");
export const createCustomer = (customerData) =>
  api.post("/khach-hang", customerData);
export const updateCustomer = (id, customerData) =>
  api.put(`/khach-hang/${id}`, customerData);
export const deleteCustomer = (id) => api.delete(`/khach-hang/${id}`);

// Booking APIs
export const getBookings = () => api.get("/dat-phong");
export const getBookingById = (id) => api.get(`/dat-phong/${id}`);
export const createBooking = (bookingData) => {
  // Đảm bảo bookingData có nhan_vien_id từ người dùng đăng nhập
  return api.post("/dat-phong", bookingData);
};
export const updateBooking = (id, bookingData) => {
  // Đảm bảo bookingData có nhan_vien_id từ người dùng đăng nhập
  return api.put(`/dat-phong/${id}`, bookingData);
};
export const deleteBooking = (id) => api.delete(`/dat-phong/${id}`);
export const checkoutBooking = (id, checkoutData = {}) => {
  // Thêm tham số checkoutData để có thể truyền nhan_vien_id
  return api.post(`/dat-phong/${id}/tra-phong`, checkoutData);
};

// Service APIs
export const getServices = () => api.get("/dich-vu");
export const getServiceById = (id) => api.get(`/dich-vu/${id}`);
export const createService = (serviceData) => api.post("/dich-vu", serviceData);
export const updateService = (id, serviceData) =>
  api.put(`/dich-vu/${id}`, serviceData);
export const deleteService = (id) => api.delete(`/dich-vu/${id}`);

// Booking Service APIs
export const getBookingServices = (bookingId) =>
  api.get(`/dich-vu/dat-phong/${bookingId}`);
export const addBookingService = (bookingId, serviceData) => {
  // Đảm bảo serviceData có nhan_vien_id từ người dùng đăng nhập
  return api.post(`/dich-vu/dat-phong/${bookingId}`, serviceData);
};
export const deleteBookingService = (serviceUsageId, data = {}) => {
  // Thêm tham số data để có thể truyền nhan_vien_id
  return api.delete(`/dich-vu/su-dung/${serviceUsageId}`, { data });
};

// Invoice APIs
export const getInvoices = () => api.get("/hoa-don");
export const updateInvoice = (id, invoiceData) => {
  // Đảm bảo invoiceData có nhan_vien_id từ người dùng đăng nhập
  return api.put(`/hoa-don/${id}`, invoiceData);
};

// Calculation and other APIs
export const calculatePrice = (id) => {
  // Remove this line:
  // console.log(`Calculating price for booking ${id}`)
  return api.get(`/dat-phong/${id}/tinh-gia`);
};

// Thống kê APIs
export const getRevenueStatistics = (params) => {
  return api.get("/hoa-don/thong-ke", { params });
};

export default api;
