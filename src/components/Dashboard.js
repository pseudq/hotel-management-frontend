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
  updateBooking,
  getRoomTypes,
  getInvoices,
  createCustomer,
} from "../apiService";

// Import components
import RoomStatusOverview from "./dashboard/RoomStatusOverview";
import RoomList from "./dashboard/RoomList";
import CheckInDialog from "./dashboard/CheckInDialog";
import CheckOutDialog from "./dashboard/CheckOutDialog";
import ServiceDialog from "./dashboard/ServiceDialog";
import RoomActionMenu from "./dashboard/RoomActionMenu";
import RoomTransferDialog from "./dashboard/RoomTransferDialog";
import ActiveBookingsTable from "./dashboard/ActiveBookingsTable";
import PastBookingsTable from "./dashboard/PastBookingsTable";
import BookingDetailsDialog from "./dashboard/BookingDetailsDialog";

const Dashboard = () => {
  const theme = useTheme();
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [bookingServices, setBookingServices] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [bookingDetailsDialogOpen, setBookingDetailsDialogOpen] =
    useState(false);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
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
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [showCurrentCharges, setShowCurrentCharges] = useState(false);

  // State cho tìm kiếm và tạo khách hàng mới
  const [searchStatus, setSearchStatus] = useState(null); // null, "searching", "found", "not_found"
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    ho_ten: "",
    cmnd: "",
    so_dien_thoai: "",
    email: "",
    dia_chi: "",
  });

  // Giả định user đã được xác thực và có thông tin
  // eslint-disable-next-line
  const [user, setUser] = useState({ id: 1, ten_dang_nhap: "admin" });

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
    fetchCustomers();
    fetchBookings();
    fetchServices();
    fetchInvoices();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await getRooms();
      setRooms(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          "Error fetching rooms: " +
          (error.response?.data?.message || error.message),
        severity: "error",
      });
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await getRoomTypes();
      setRoomTypes(response.data);
    } catch (error) {
      // Handle error silently
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data);
    } catch (error) {
      // Handle error silently
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await getBookings();
      setBookings(response.data);
    } catch (error) {
      // Handle error silently
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await getInvoices();
      setInvoices(response.data);
    } catch (error) {
      // Handle error silently
    }
  };

  const fetchServices = async () => {
    try {
      const response = await getServices();
      setServices(response.data);
    } catch (error) {
      // Handle error silently
    }
  };

  const fetchBookingServices = async (bookingId) => {
    try {
      const response = await getBookingServices(bookingId);
      setBookingServices(response.data);
    } catch (error) {
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

  // Lấy thông tin booking hiện tại của phòng
  const getCurrentBooking = (roomId) => {
    if (!bookings || bookings.length === 0) return null;

    return bookings.find(
      (booking) =>
        booking.phong_id === roomId && booking.trang_thai === "đã nhận"
    );
  };

  const handleMenuOpen = (event, room) => {
    setAnchorEl(event.currentTarget);
    setSelectedRoom(room);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCheckInOpen = () => {
    if (!selectedRoom) return;

    // Reset form
    resetCheckInForm();

    setCheckInDialogOpen(true);
    handleMenuClose();
  };

  const resetCheckInForm = () => {
    setCheckInData({
      khach_hang_id: "",
      phong_id: selectedRoom ? selectedRoom.id : "",
      thoi_gian_vao: new Date().toISOString(),
      ghi_chu: "",
      trang_thai: "đã nhận",
    });
    setSearchStatus(null);
    setFoundCustomer(null);
    setNewCustomerData({
      ho_ten: "",
      cmnd: "",
      so_dien_thoai: "",
      email: "",
      dia_chi: "",
    });
  };

  const handleCheckInClose = () => {
    setCheckInDialogOpen(false);
  };

  // Tìm kiếm khách hàng theo CCCD
  const handleSearchCustomer = async (cccd) => {
    setIsSearching(true);
    setSearchStatus("searching");

    try {
      // Tìm kiếm trong danh sách khách hàng đã tải
      const customer = customers.find((cust) => cust.cmnd === cccd);

      if (customer) {
        setFoundCustomer(customer);
        setSearchStatus("found");
        // Cập nhật ID khách hàng vào form check-in
        setCheckInData({
          ...checkInData,
          khach_hang_id: customer.id,
        });
      } else {
        setFoundCustomer(null);
        setSearchStatus("not_found");
        // Cập nhật CCCD vào form tạo khách hàng mới
        setNewCustomerData({
          ...newCustomerData,
          cmnd: cccd,
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          "Lỗi khi tìm kiếm khách hàng: " +
          (error.response?.data?.message || error.message),
        severity: "error",
      });
      setSearchStatus("not_found");
    } finally {
      setIsSearching(false);
    }
  };

  // Tạo khách hàng mới
  const handleCreateCustomer = async (customerData) => {
    setLoading(true);

    try {
      // Kiểm tra dữ liệu
      if (!customerData.ho_ten || !customerData.cmnd) {
        setSnackbar({
          open: true,
          message: "Vui lòng nhập đầy đủ họ tên và CCCD",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      // Gọi API tạo khách hàng mới
      const response = await createCustomer(customerData);

      // Cập nhật danh sách khách hàng
      await fetchCustomers();

      // Cập nhật ID khách hàng vào form check-in
      setCheckInData({
        ...checkInData,
        khach_hang_id: response.data.id,
      });

      // Cập nhật trạng thái tìm kiếm
      setFoundCustomer(response.data);
      setSearchStatus("found");

      setSnackbar({
        open: true,
        message: "Tạo khách hàng mới thành công",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          "Lỗi khi tạo khách hàng mới: " +
          (error.response?.data?.message || error.message),
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật hàm handleCheckInSubmit
  const handleCheckInSubmit = async () => {
    try {
      setLoading(true);

      // Kiểm tra dữ liệu trước khi gửi
      if (!checkInData.khach_hang_id && searchStatus !== "found") {
        setSnackbar({
          open: true,
          message: "Vui lòng chọn hoặc tạo khách hàng",
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

      // Nếu đã tìm thấy khách hàng nhưng chưa cập nhật ID
      if (
        searchStatus === "found" &&
        foundCustomer &&
        !checkInData.khach_hang_id
      ) {
        setCheckInData({
          ...checkInData,
          khach_hang_id: foundCustomer.id,
        });
      }

      // Tạo booking với đúng định dạng API yêu cầu
      await createBooking({
        khach_hang_id: checkInData.khach_hang_id || foundCustomer.id,
        phong_id: checkInData.phong_id,
        thoi_gian_vao: checkInData.thoi_gian_vao,
        ghi_chu: checkInData.ghi_chu,
        trang_thai: "đã nhận",
        nhan_vien_id: user?.id, // Thêm nhan_vien_id từ người dùng đăng nhập
      });

      try {
        // Thay vì cập nhật trực tiếp, chúng ta sẽ làm mới danh sách phòng
        await fetchRooms();
      } catch (roomError) {
        // Handle error silently
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

  // Cập nhật hàm handleCheckOutSubmit
  const handleCheckOutSubmit = async (checkoutData = {}) => {
    if (!selectedRoom) return;

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

      // Thực hiện trả phòng với thông tin nhân viên
      await checkoutBooking(bookingId, {
        ...checkoutData,
        nhan_vien_id: user?.id, // Đảm bảo nhan_vien_id được truyền
      });

      try {
        // Thay vì cập nhật trực tiếp, chúng ta sẽ làm mới danh sách phòng
        await fetchRooms();
      } catch (roomError) {
        // Handle error silently
      }

      // Làm mới danh sách bookings và invoices
      await fetchBookings();
      await fetchInvoices();

      setSnackbar({
        open: true,
        message: "Check-out thành công",
        severity: "success",
      });

      handleCheckOutClose();
    } catch (error) {
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

  const handleCheckOutOpen = async () => {
    if (!selectedRoom) return;

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

      const response = await calculatePrice(bookingId);

      // Lấy thêm thông tin booking để có khách hàng ID
      try {
        const bookingInfo = await getBookingById(bookingId);

        // Kết hợp dữ liệu từ cả hai API
        setCheckOutData({
          ...response.data,
          booking: bookingInfo.data,
        });
      } catch (bookingError) {
        // Vẫn tiếp tục với dữ liệu đã có
        setCheckOutData(response.data);
      }

      setCheckOutDialogOpen(true);
    } catch (error) {
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

  // Cập nhật hàm handleAddService
  const handleAddService = async () => {
    if (!selectedRoom) return;

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

      // Đảm bảo newServiceData có nhan_vien_id
      if (!newServiceData.nhan_vien_id && user?.id) {
        newServiceData.nhan_vien_id = user.id;
      }

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

  // Cập nhật hàm handleDeleteService
  const handleDeleteService = async (serviceUsageId, data = {}) => {
    setLoading(true);

    try {
      // Đảm bảo data có nhan_vien_id
      if (!data.nhan_vien_id && user?.id) {
        data.nhan_vien_id = user.id;
      }

      // Xóa dịch vụ đã sử dụng với thông tin nhân viên
      await deleteBookingService(serviceUsageId, data);

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

  const handleMarkAsCleaned = async () => {
    if (!selectedRoom) return;

    setLoading(true);

    try {
      // Lấy thông tin hiện tại của phòng
      const roomData = {
        so_phong: selectedRoom.so_phong,
        so_tang: selectedRoom.so_tang,
        loai_phong_id: selectedRoom.loai_phong_id,
        trang_thai: "trống", // Cập nhật trạng thái thành "trống"
      };

      // Gọi API để cập nhật trạng thái phòng
      await updateRoom(selectedRoom.id, roomData);

      // Làm mới danh sách phòng
      await fetchRooms();

      setSnackbar({
        open: true,
        message: "Phòng đã được đánh dấu là sạch sẽ",
        severity: "success",
      });
    } catch (error) {
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
        // Handle error silently
      }
    } finally {
      handleMenuClose();
      setLoading(false);
    }
  };

  const handleServiceDialogOpen = async () => {
    if (!selectedRoom) return;

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

  const handleTransferRoomOpen = () => {
    if (!selectedRoom) return;

    setTransferDialogOpen(true);
    handleMenuClose();
  };

  const handleTransferRoomClose = () => {
    setTransferDialogOpen(false);
  };

  // Xử lý chuyển phòng
  const handleTransferRoomSubmit = async (transferData) => {
    setLoading(true);

    try {
      const { targetRoomId, sourceRoomId, bookingId, notes } = transferData;

      if (!bookingId) {
        setSnackbar({
          open: true,
          message: "Không tìm thấy thông tin đặt phòng",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      // Lấy thông tin booking hiện tại
      const bookingInfo = await getBookingById(bookingId);
      const currentBooking = bookingInfo.data;

      if (!currentBooking) {
        setSnackbar({
          open: true,
          message: "Không tìm thấy thông tin đặt phòng",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      // 1. Cập nhật booking sang phòng mới
      const updatedBookingData = {
        khach_hang_id: currentBooking.khach_hang_id,
        phong_id: targetRoomId,
        thoi_gian_vao: currentBooking.thoi_gian_vao,
        ghi_chu: notes || currentBooking.ghi_chu + " (Chuyển phòng)",
        trang_thai: "đã nhận",
      };

      await updateBooking(bookingId, updatedBookingData);

      // 2. Cập nhật trạng thái phòng cũ thành "đang dọn"
      const sourceRoom = rooms.find((room) => room.id === sourceRoomId);
      if (sourceRoom) {
        const sourceRoomData = {
          so_phong: sourceRoom.so_phong,
          so_tang: sourceRoom.so_tang,
          loai_phong_id: sourceRoom.loai_phong_id,
          trang_thai: "đang dọn",
        };
        await updateRoom(sourceRoomId, sourceRoomData);
      }

      // 3. Cập nhật trạng thái phòng mới thành "đang sử dụng"
      const targetRoom = rooms.find((room) => room.id === targetRoomId);
      if (targetRoom) {
        const targetRoomData = {
          so_phong: targetRoom.so_phong,
          so_tang: targetRoom.so_tang,
          loai_phong_id: targetRoom.loai_phong_id,
          trang_thai: "đang sử dụng",
        };
        await updateRoom(targetRoomId, targetRoomData);
      }

      // Làm mới dữ liệu
      await fetchRooms();
      await fetchBookings();

      setSnackbar({
        open: true,
        message: "Chuyển phòng thành công",
        severity: "success",
      });

      handleTransferRoomClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          "Lỗi khi chuyển phòng: " +
          (error.response?.data?.message || error.message),
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xem chi tiết booking
  const handleViewBookingDetails = (
    booking,
    showInvoice = false,
    showCurrentCharges = false
  ) => {
    setSelectedBooking(booking);
    setShowInvoiceDetails(showInvoice);
    setShowCurrentCharges(showCurrentCharges);
    setBookingDetailsDialogOpen(true);
  };

  // Đóng dialog chi tiết booking
  const handleBookingDetailsClose = () => {
    setBookingDetailsDialogOpen(false);
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

  // Lọc phòng trống cho dialog chuyển phòng
  const availableRooms = rooms.filter(
    (room) => room.trang_thai === "trống" && room.id !== selectedRoom?.id
  );

  const handleFloorChange = (floor) => {
    setSelectedFloor(floor);
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
        Quản lý khách sạn
      </Typography>

      {/* Tổng quan trạng thái phòng */}
      <RoomStatusOverview roomStats={roomStats} />

      {/* Danh sách phòng */}
      <RoomList
        rooms={rooms}
        onMenuOpen={handleMenuOpen}
        getRoomStatusIcon={getRoomStatusIcon}
        getRoomStatusColor={getRoomStatusColor}
        selectedFloor={selectedFloor}
        onFloorChange={handleFloorChange}
      />

      {/* Bảng thông tin đặt phòng */}
      <ActiveBookingsTable
        bookings={bookings}
        onViewDetails={handleViewBookingDetails}
      />

      {/* Bảng thông tin hóa đơn */}
      <PastBookingsTable
        bookings={bookings}
        invoices={invoices}
        onViewDetails={handleViewBookingDetails}
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
        onTransferRoom={handleTransferRoomOpen}
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
        onSearchCustomer={handleSearchCustomer}
        onCreateCustomer={handleCreateCustomer}
        searchStatus={searchStatus}
        foundCustomer={foundCustomer}
        isSearching={isSearching}
        newCustomerData={newCustomerData}
        setNewCustomerData={setNewCustomerData}
        resetForm={resetCheckInForm}
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

      {/* Room Transfer Dialog */}
      <RoomTransferDialog
        open={transferDialogOpen}
        onClose={handleTransferRoomClose}
        onSubmit={handleTransferRoomSubmit}
        selectedRoom={selectedRoom}
        availableRooms={availableRooms}
        roomTypes={roomTypes}
        currentBooking={getCurrentBooking(selectedRoom?.id)}
      />

      {/* Booking Details Dialog */}
      <BookingDetailsDialog
        open={bookingDetailsDialogOpen}
        onClose={handleBookingDetailsClose}
        booking={selectedBooking}
        showInvoice={showInvoiceDetails}
        showCurrentCharges={showCurrentCharges}
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
