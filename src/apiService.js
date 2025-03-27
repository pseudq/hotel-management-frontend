import axios from "axios";

// const API_URL = "http://54.254.23.63:5000/api";
const API_URL = "http://localhost:5000/api";
const API_KEY = "your_api_key";

// Tạo instance axios với interceptors để xử lý lỗi và logging
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "X-API-KEY": API_KEY,
    "Content-Type": "application/json",
  },
  // Thêm timeout để tránh request treo quá lâu
  timeout: 10000,
});

// Thêm interceptor để log requests
api.interceptors.request.use(
  (config) => {
    console.log(
      `API Request: ${config.method.toUpperCase()} ${config.url}`,
      config.data || {}
    );

    // Thêm token vào header nếu có
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Thêm interceptor để log responses
api.interceptors.response.use(
  (response) => {
    console.log(
      `API Response: ${response.status} ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error) => {
    if (error.response) {
      // Server trả về response với status code nằm ngoài range 2xx
      console.error(
        `API Error ${
          error.response.status
        }: ${error.config.method.toUpperCase()} ${error.config.url}`,
        error.response.data
      );

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
      // Request đã được gửi nhưng không nhận được response
      console.error("API No Response:", error.request);
    } else {
      // Có lỗi khi thiết lập request
      console.error("API Request Setup Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (credentials) => api.post("/auth/login", credentials);
export const checkAuth = () => api.get("/auth/me");
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Room APIs
export const getRooms = () => api.get("/phong");
export const getRoomById = (id) => api.get(`/phong/${id}`);
export const createRoom = (roomData) => api.post("/phong", roomData);
export const updateRoom = (id, roomData) => {
  console.log(`Updating room ${id} with data:`, roomData);
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
  console.log("Creating booking with data:", bookingData);
  return api.post("/dat-phong", bookingData);
};
export const updateBooking = (id, bookingData) => {
  console.log(`Updating booking ${id} with data:`, bookingData);
  return api.put(`/dat-phong/${id}`, bookingData);
};
export const deleteBooking = (id) => api.delete(`/dat-phong/${id}`);
export const checkoutBooking = (id) => {
  console.log(`Checking out booking ${id}`);
  return api.post(`/dat-phong/${id}/tra-phong`);
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
  console.log(`Adding service to booking ${bookingId}:`, serviceData);
  return api.post(`/dich-vu/dat-phong/${bookingId}`, serviceData);
};
export const deleteBookingService = (serviceUsageId) => {
  console.log(`Deleting service usage ${serviceUsageId}`);
  return api.delete(`/dich-vu/su-dung/${serviceUsageId}`);
};

// Invoice APIs
export const getInvoices = () => api.get("/hoa-don");
export const updateInvoice = (id, invoiceData) =>
  api.put(`/hoa-don/${id}`, invoiceData);

// Calculation and other APIs
export const calculatePrice = (id) => {
  console.log(`Calculating price for booking ${id}`);
  return api.get(`/dat-phong/${id}/tinh-gia`);
};

export default api;
