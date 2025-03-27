"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import {
  CheckCircle,
  Person,
  CleaningServices,
  DoNotDisturb,
} from "@mui/icons-material";
import {
  getRooms,
  createBooking,
  checkoutBooking,
  calculatePrice,
  getCustomers,
  getBookings,
  getBookingById,
  updateRoom,
  getServices,
  getBookingServices,
  addBookingService,
  deleteBookingService,
} from "../apiService";

// Import các component con
import DashboardStats from "./dashboard/DashboardStats";
import RoomStatusOverview from "./dashboard/RoomStatusOverview";
import RoomList from "./dashboard/RoomList";
import CheckInDialog from "./dashboard/CheckInDialog";
import CheckOutDialog from "./dashboard/CheckOutDialog";
import ServiceDialog from "./dashboard/ServiceDialog";
import RoomActionMenu from "./dashboard/RoomActionMenu";

const Dashboard = () => {
  const theme = useTheme();
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [bookingServices, setBookingServices] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkInData, setCheckInData] = useState({
    khach_hang_id: "",
    phong_id: "",
    thoi_gian_vao: new Date().toISOString(),
    ghi_chu: "",
    trang_thai: "đã nhận",
  });
  const [checkOutData, setCheckOutData] = useState(null);
  const [newServiceData, setNewServiceData] = useState({
    dich_vu_id: "",
    so_luong: 1,
    ghi_chu: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Thống kê giả định
  const stats = {
    occupancyRate: 68,
    totalRevenue: 12500000,
    totalCustomers: 42,
    totalBookings: 56,
  };

  useEffect(() => {
    fetchRooms();
    fetchCustomers();
    fetchBookings();
    fetchServices();
  }, []);

  const fetchRooms = async () => {
    try {
      console.log("Fetching rooms...");
      const response = await getRooms();
      console.log("Rooms fetched:", response.data);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setSnackbar({
        open: true,
        message:
          "Error fetching rooms: " +
          (error.response?.data?.message || error.message),
        severity: "error",
      });
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await getBookings();
      console.log("Bookings fetched:", response.data);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await getServices();
      console.log("Services fetched:", response.data);
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchBookingServices = async (bookingId) => {
    try {
      const response = await getBookingServices(bookingId);
      console.log("Booking services fetched:", response.data);
      setBookingServices(response.data);
    } catch (error) {
      console.error("Error fetching booking services:", error);
      setBookingServices([]);
    }
  };

  // Tìm booking ID cho phòng đang được sử dụng
  const findActiveBookingId = (roomId) => {
    if (!bookings || bookings.length === 0) return null;

    const activeBooking = bookings.find(
      (booking) =>
        booking.phong_id === roomId && booking.trang_thai === "đã nhận"
    );

    return activeBooking ? activeBooking.id : null;
  };

  const handleMenuOpen = (event, room) => {
    setAnchorEl(event.currentTarget);
    setSelectedRoom(room);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCheckInOpen = () => {
    if (!selectedRoom) {
      console.error("No room selected for check-in");
      return;
    }

    console.log("Opening check-in dialog for room:", selectedRoom);

    setCheckInData({
      khach_hang_id: "",
      phong_id: selectedRoom.id,
      thoi_gian_vao: new Date().toISOString(),
      ghi_chu: "",
      trang_thai: "đã nhận",
    });

    setCheckInDialogOpen(true);
    handleMenuClose();
  };

  const handleCheckInClose = () => {
    setCheckInDialogOpen(false);
  };

  const handleCheckInSubmit = async () => {
    try {
      setLoading(true);

      // Kiểm tra dữ liệu trước khi gửi
      if (!checkInData.khach_hang_id) {
        setSnackbar({
          open: true,
          message: "Vui lòng chọn khách hàng",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      if (!checkInData.phong_id) {
        setSnackbar({
          open: true,
          message: "Không tìm thấy thông tin phòng",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      console.log("Submitting check-in with data:", checkInData);

      // Tạo booking với đúng định dạng API yêu cầu
      const bookingResponse = await createBooking({
        khach_hang_id: checkInData.khach_hang_id,
        phong_id: checkInData.phong_id,
        thoi_gian_vao: checkInData.thoi_gian_vao,
        ghi_chu: checkInData.ghi_chu,
        trang_thai: "đã nhận",
      });

      console.log("Booking created successfully:", bookingResponse.data);

      // Cập nhật trạng thái phòng
      const roomId = checkInData.phong_id;
      console.log("Updating room status for room ID:", roomId);

      try {
        // Thay vì cập nhật trực tiếp, chúng ta sẽ làm mới danh sách phòng
        // Vì API cập nhật phòng đang gặp lỗi 500
        await fetchRooms();
        console.log("Room list refreshed instead of direct update");
      } catch (roomError) {
        console.error("Error refreshing rooms:", roomError);
      }

      // Làm mới danh sách bookings
      await fetchBookings();

      setSnackbar({
        open: true,
        message: "Check-in thành công",
        severity: "success",
      });

      handleCheckInClose();
    } catch (error) {
      console.error("Error during check-in:", error);
      setSnackbar({
        open: true,
        message:
          "Lỗi khi check-in: " +
          (error.response?.data?.message || error.message),
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOutOpen = async () => {
    if (!selectedRoom) {
      console.error("No room selected for check-out");
      return;
    }

    setLoading(true);

    try {
      // Tìm booking ID cho phòng đang được sử dụng
      const bookingId = findActiveBookingId(selectedRoom.id);

      if (!bookingId) {
        setSnackbar({
          open: true,
          message: "Không tìm thấy thông tin đặt phòng cho phòng này",
          severity: "error",
        });
        handleMenuClose();
        setLoading(false);
        return;
      }

      console.log("Calculating price for booking ID:", bookingId);
      const response = await calculatePrice(bookingId);
      console.log("Price calculation response:", response.data);

      // Lấy thêm thông tin booking để có khách hàng ID
      try {
        const bookingInfo = await getBookingById(bookingId);
        console.log("Booking info:", bookingInfo.data);

        // Kết hợp dữ liệu từ cả hai API
        setCheckOutData({
          ...response.data,
          booking: bookingInfo.data,
        });
      } catch (bookingError) {
        console.error("Error fetching booking details:", bookingError);
        // Vẫn tiếp tục với dữ liệu đã có
        setCheckOutData(response.data);
      }

      setCheckOutDialogOpen(true);
    } catch (error) {
      console.error("Error fetching check-out data:", error);
      setSnackbar({
        open: true,
        message:
          "Lỗi khi tính giá: " +
          (error.response?.data?.message || error.message),
        severity: "error",
      });
    } finally {
      handleMenuClose();
      setLoading(false);
    }
  };

  const handleCheckOutClose = () => {
    setCheckOutDialogOpen(false);
  };

  const handleCheckOutSubmit = async () => {
    if (!selectedRoom) {
      console.error("No room selected for check-out");
      return;
    }

    setLoading(true);

    try {
      // Tìm booking ID cho phòng đang được sử dụng
      const bookingId = findActiveBookingId(selectedRoom.id);

      if (!bookingId) {
        setSnackbar({
          open: true,
          message: "Không tìm thấy thông tin đặt phòng cho phòng này",
          severity: "error",
        });
        handleCheckOutClose();
        setLoading(false);
        return;
      }

      console.log("Processing checkout for booking ID:", bookingId);

      // Thực hiện trả phòng
      const checkoutResponse = await checkoutBooking(bookingId);
      console.log("Checkout response:", checkoutResponse.data);

      // Không cần tạo hóa đơn thủ công vì API trả phòng đã tạo hóa đơn
      console.log(
        "Invoice created by checkout API:",
        checkoutResponse.data.hoaDon
      );

      try {
        // Thay vì cập nhật trực tiếp, chúng ta sẽ làm mới danh sách phòng
        await fetchRooms();
        console.log("Room list refreshed instead of direct update");
      } catch (roomError) {
        console.error("Error refreshing rooms:", roomError);
      }

      // Làm mới danh sách bookings
      await fetchBookings();

      setSnackbar({
        open: true,
        message: "Check-out thành công",
        severity: "success",
      });

      handleCheckOutClose();
    } catch (error) {
      console.error("Error during check-out:", error);
      setSnackbar({
        open: true,
        message:
          "Lỗi khi check-out: " +
          (error.response?.data?.message || error.message),
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsCleaned = async () => {
    if (!selectedRoom) {
      console.error("No room selected");
      return;
    }

    setLoading(true);

    try {
      console.log("Marking room as cleaned:", selectedRoom.id);

      // Lấy thông tin hiện tại của phòng
      const roomData = {
        so_phong: selectedRoom.so_phong,
        so_tang: selectedRoom.so_tang,
        loai_phong_id: selectedRoom.loai_phong_id,
        trang_thai: "trống", // Cập nhật trạng thái thành "trống"
      };

      // Gọi API để cập nhật trạng thái phòng
      await updateRoom(selectedRoom.id, roomData);
      console.log("Room status updated successfully to 'trống'");

      // Làm mới danh sách phòng
      await fetchRooms();

      setSnackbar({
        open: true,
        message: "Phòng đã được đánh dấu là sạch sẽ",
        severity: "success",
      });
    } catch (error) {
      console.error("Error marking room as cleaned:", error);
      setSnackbar({
        open: true,
        message:
          "Lỗi khi cập nhật trạng thái phòng: " +
          (error.response?.data?.message || error.message),
        severity: "error",
      });

      // Vẫn làm mới danh sách phòng để hiển thị trạng thái mới nhất
      try {
        await fetchRooms();
      } catch (refreshError) {
        console.error("Error refreshing rooms:", refreshError);
      }
    } finally {
      handleMenuClose();
      setLoading(false);
    }
  };

  const handleServiceDialogOpen = async () => {
    if (!selectedRoom) {
      console.error("No room selected for adding services");
      return;
    }

    setLoading(true);

    try {
      // Tìm booking ID cho phòng đang được sử dụng
      const bookingId = findActiveBookingId(selectedRoom.id);

      if (!bookingId) {
        setSnackbar({
          open: true,
          message: "Không tìm thấy thông tin đặt phòng cho phòng này",
          severity: "error",
        });
        handleMenuClose();
        setLoading(false);
        return;
      }

      // Reset form data
      setNewServiceData({
        dich_vu_id: "",
        so_luong: 1,
        ghi_chu: "",
      });

      // Lấy danh sách dịch vụ đã sử dụng của booking
      await fetchBookingServices(bookingId);

      setServiceDialogOpen(true);
    } catch (error) {
      console.error("Error preparing service dialog:", error);
      setSnackbar({
        open: true,
        message:
          "Lỗi khi chuẩn bị thêm dịch vụ: " +
          (error.response?.data?.message || error.message),
        severity: "error",
      });
    } finally {
      handleMenuClose();
      setLoading(false);
    }
  };

  const handleServiceDialogClose = () => {
    setServiceDialogOpen(false);
  };

  const handleAddService = async () => {
    if (!selectedRoom) {
      console.error("No room selected for adding services");
      return;
    }

    setLoading(true);

    try {
      // Kiểm tra dữ liệu trước khi gửi
      if (!newServiceData.dich_vu_id) {
        setSnackbar({
          open: true,
          message: "Vui lòng chọn dịch vụ",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      if (!newServiceData.so_luong || newServiceData.so_luong < 1) {
        setSnackbar({
          open: true,
          message: "Số lượng phải lớn hơn 0",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      // Tìm booking ID cho phòng đang được sử dụng
      const bookingId = findActiveBookingId(selectedRoom.id);

      if (!bookingId) {
        setSnackbar({
          open: true,
          message: "Không tìm thấy thông tin đặt phòng cho phòng này",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      console.log(
        "Adding service to booking ID:",
        bookingId,
        "with data:",
        newServiceData
      );

      // Thêm dịch vụ cho booking
      await addBookingService(bookingId, newServiceData);

      // Làm mới danh sách dịch vụ đã sử dụng
      await fetchBookingServices(bookingId);

      // Reset form
      setNewServiceData({
        dich_vu_id: "",
        so_luong: 1,
        ghi_chu: "",
      });

      setSnackbar({
        open: true,
        message: "Thêm dịch vụ thành công",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding service:", error);
      setSnackbar({
        open: true,
        message:
          "Lỗi khi thêm dịch vụ: " +
          (error.response?.data?.message || error.message),
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceUsageId) => {
    setLoading(true);

    try {
      console.log("Deleting service usage:", serviceUsageId);

      // Xóa dịch vụ đã sử dụng
      await deleteBookingService(serviceUsageId);

      // Tìm booking ID cho phòng đang được sử dụng
      const bookingId = findActiveBookingId(selectedRoom.id);

      // Làm mới danh sách dịch vụ đã sử dụng
      if (bookingId) {
        await fetchBookingServices(bookingId);
      }

      setSnackbar({
        open: true,
        message: "Xóa dịch vụ thành công",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      setSnackbar({
        open: true,
        message:
          "Lỗi khi xóa dịch vụ: " +
          (error.response?.data?.message || error.message),
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoomStatusIcon = (status) => {
    switch (status) {
      case "trống":
        return <CheckCircle sx={{ color: theme.palette.success.main }} />;
      case "đang sử dụng":
        return <Person sx={{ color: theme.palette.error.main }} />;
      case "đang dọn":
        return <CleaningServices sx={{ color: theme.palette.warning.main }} />;
      default:
        return <DoNotDisturb sx={{ color: theme.palette.text.disabled }} />;
    }
  };

  const getRoomStatusColor = (status) => {
    switch (status) {
      case "trống":
        return {
          bg: theme.palette.success.light,
          color: theme.palette.success.dark,
        };
      case "đang sử dụng":
        return {
          bg: theme.palette.error.light,
          color: theme.palette.error.dark,
        };
      case "đang dọn":
        return {
          bg: theme.palette.warning.light,
          color: theme.palette.warning.dark,
        };
      default:
        return {
          bg: theme.palette.grey[200],
          color: theme.palette.text.secondary,
        };
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Tính toán số lượng phòng theo trạng thái
  const roomStats = {
    total: rooms.length,
    available: rooms.filter((room) => room.trang_thai === "trống").length,
    occupied: rooms.filter((room) => room.trang_thai === "đang sử dụng").length,
    cleaning: rooms.filter((room) => room.trang_thai === "đang dọn").length,
  };

  return (
    <Box>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}

      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
        Hotel Dashboard
      </Typography>

      {/* Thống kê tổng quan */}
      <DashboardStats stats={stats} />

      {/* Tổng quan trạng thái phòng */}
      <RoomStatusOverview roomStats={roomStats} />

      {/* Danh sách phòng */}
      <RoomList
        rooms={rooms}
        onMenuOpen={handleMenuOpen}
        getRoomStatusIcon={getRoomStatusIcon}
        getRoomStatusColor={getRoomStatusColor}
      />

      {/* Action Menu */}
      <RoomActionMenu
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        selectedRoom={selectedRoom}
        onCheckIn={handleCheckInOpen}
        onCheckOut={handleCheckOutOpen}
        onAddService={handleServiceDialogOpen}
        onMarkAsCleaned={handleMarkAsCleaned}
      />

      {/* Check-In Dialog */}
      <CheckInDialog
        open={checkInDialogOpen}
        onClose={handleCheckInClose}
        onSubmit={handleCheckInSubmit}
        checkInData={checkInData}
        setCheckInData={setCheckInData}
        customers={customers}
        selectedRoom={selectedRoom}
      />

      {/* Check-Out Dialog */}
      <CheckOutDialog
        open={checkOutDialogOpen}
        onClose={handleCheckOutClose}
        onSubmit={handleCheckOutSubmit}
        checkOutData={checkOutData}
        selectedRoom={selectedRoom}
      />

      {/* Service Dialog */}
      <ServiceDialog
        open={serviceDialogOpen}
        onClose={handleServiceDialogClose}
        onAddService={handleAddService}
        onDeleteService={handleDeleteService}
        newServiceData={newServiceData}
        setNewServiceData={setNewServiceData}
        bookingServices={bookingServices}
        services={services}
        selectedRoom={selectedRoom}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
