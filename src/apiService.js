import axios from "axios";

const API_URL = "http://18.139.217.113:5000/api";
const API_KEY = "your_api_key";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "X-API-KEY": API_KEY,
    "Content-Type": "application/json",
  },
});

// Room APIs
export const getRooms = () => api.get("/phong");
export const getRoomById = (id) => api.get(`/phong/${id}`);
export const createRoom = (roomData) => api.post("/phong", roomData);
export const updateRoom = (id, roomData) => api.put(`/phong/${id}`, roomData);
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
export const createBooking = (bookingData) =>
  api.post("/dat-phong", bookingData);
export const updateBooking = (id, bookingData) =>
  api.put(`/dat-phong/${id}`, bookingData);
export const deleteBooking = (id) => api.delete(`/dat-phong/${id}`);
export const checkoutBooking = (id) => api.post(`/dat-phong/${id}/tra-phong`);

// Service APIs
export const getServices = () => api.get("/dich-vu");
export const createService = (serviceData) => api.post("/dich-vu", serviceData);
export const updateService = (id, serviceData) =>
  api.put(`/dich-vu/${id}`, serviceData);
export const deleteService = (id) => api.delete(`/dich-vu/${id}`);

// Invoice APIs
export const getInvoices = () => api.get("/hoa-don");
export const updateInvoice = (id, invoiceData) =>
  api.put(`/hoa-don/${id}`, invoiceData);
