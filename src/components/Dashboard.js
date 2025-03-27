"use client";

import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
  IconButton,
  Paper,
  Divider,
  Avatar,
  Stack,
  LinearProgress,
  useTheme,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
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
import {
  KingBed,
  Person,
  CleaningServices,
  MoreVert,
  CheckCircle,
  DoNotDisturb,
  Refresh,
  TrendingUp,
  AttachMoney,
  People,
  CalendarToday,
  RoomService,
  Delete,
  Add,
} from "@mui/icons-material";

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

  // Tìm tên dịch vụ từ ID
  // eslint-disable-next-line
  const getServiceNameById = (id) => {
    const service = services.find((service) => service.id === id);
    return service ? service.ten_dich_vu : "Unknown Service";
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
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.light", mr: 2 }}>
                  <KingBed />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Occupancy Rate
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                {stats.occupancyRate}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stats.occupancyRate}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <TrendingUp
                  sx={{ color: "success.main", mr: 1, fontSize: 16 }}
                />
                <Typography variant="body2" color="success.main">
                  +5.2% from last week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "success.light", mr: 2 }}>
                  <AttachMoney />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Revenue
                </Typography>
              </Box>
              <Typography variant="h4" component="div">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(stats.totalRevenue)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <TrendingUp
                  sx={{ color: "success.main", mr: 1, fontSize: 16 }}
                />
                <Typography variant="body2" color="success.main">
                  +12.5% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "info.light", mr: 2 }}>
                  <People />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Customers
                </Typography>
              </Box>
              <Typography variant="h4" component="div">
                {stats.totalCustomers}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <TrendingUp
                  sx={{ color: "success.main", mr: 1, fontSize: 16 }}
                />
                <Typography variant="body2" color="success.main">
                  +8.1% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "warning.light", mr: 2 }}>
                  <CalendarToday />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Bookings
                </Typography>
              </Box>
              <Typography variant="h4" component="div">
                {stats.totalBookings}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <TrendingUp
                  sx={{ color: "success.main", mr: 1, fontSize: 16 }}
                />
                <Typography variant="body2" color="success.main">
                  +3.7% from last week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tổng quan trạng thái phòng */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Room Status Overview
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                borderRadius: 2,
                bgcolor: "background.default",
              }}
            >
              <Typography variant="h3" color="text.primary">
                {roomStats.total}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Rooms
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                borderRadius: 2,
                bgcolor: "success.light",
              }}
            >
              <Typography variant="h3" color="success.dark">
                {roomStats.available}
              </Typography>
              <Typography variant="body1" color="success.dark">
                Available
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                borderRadius: 2,
                bgcolor: "error.light",
              }}
            >
              <Typography variant="h3" color="error.dark">
                {roomStats.occupied}
              </Typography>
              <Typography variant="body1" color="error.dark">
                Occupied
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                borderRadius: 2,
                bgcolor: "warning.light",
              }}
            >
              <Typography variant="h3" color="warning.dark">
                {roomStats.cleaning}
              </Typography>
              <Typography variant="body1" color="warning.dark">
                Cleaning
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Danh sách phòng */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Room Management
      </Typography>
      <Grid container spacing={2}>
        {rooms.map((room) => {
          const statusColor = getRoomStatusColor(room.trang_thai);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={room.id}>
              <Card sx={{ height: "100%", position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 1,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, room)}
                    sx={{ bgcolor: "background.paper", boxShadow: 1 }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Box>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <KingBed
                      sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
                        Room {room.so_phong}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Floor {room.so_tang} •{" "}
                        {room.ten_loai_phong || "Standard"}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Chip
                      icon={getRoomStatusIcon(room.trang_thai)}
                      label={room.trang_thai}
                      size="small"
                      sx={{
                        bgcolor: statusColor.bg,
                        color: statusColor.color,
                        fontWeight: "medium",
                      }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      onClick={(e) => handleMenuOpen(e, room)}
                    >
                      Actions
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2, minWidth: 180 },
        }}
      >
        {selectedRoom?.trang_thai === "trống" && (
          <MenuItem onClick={handleCheckInOpen} sx={{ py: 1.5 }}>
            <Person sx={{ mr: 2, fontSize: 20 }} /> Check In
          </MenuItem>
        )}
        {selectedRoom?.trang_thai === "đang sử dụng" && (
          <>
            <MenuItem onClick={handleCheckOutOpen} sx={{ py: 1.5 }}>
              <CheckCircle sx={{ mr: 2, fontSize: 20 }} /> Check Out
            </MenuItem>
            <MenuItem onClick={handleServiceDialogOpen} sx={{ py: 1.5 }}>
              <RoomService sx={{ mr: 2, fontSize: 20 }} /> Add Services
            </MenuItem>
          </>
        )}
        {selectedRoom?.trang_thai === "đang dọn" && (
          <MenuItem onClick={handleMarkAsCleaned} sx={{ py: 1.5 }}>
            <Refresh sx={{ mr: 2, fontSize: 20 }} /> Mark as Cleaned
          </MenuItem>
        )}
      </Menu>

      {/* Check-In Dialog */}
      <Dialog
        open={checkInDialogOpen}
        onClose={handleCheckInClose}
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" component="div" fontWeight="bold">
            Check In
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Room {selectedRoom?.so_phong}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="customer-select-label">Customer</InputLabel>
              <Select
                labelId="customer-select-label"
                value={checkInData.khach_hang_id}
                label="Customer"
                onChange={(e) =>
                  setCheckInData({
                    ...checkInData,
                    khach_hang_id: e.target.value,
                  })
                }
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.ho_ten} - {customer.cmnd}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Notes"
              name="ghi_chu"
              value={checkInData.ghi_chu}
              onChange={(e) =>
                setCheckInData({ ...checkInData, ghi_chu: e.target.value })
              }
              multiline
              rows={3}
              variant="outlined"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCheckInClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleCheckInSubmit} variant="contained">
            Check In
          </Button>
        </DialogActions>
      </Dialog>

      {/* Check-Out Dialog */}
      <Dialog
        open={checkOutDialogOpen}
        onClose={handleCheckOutClose}
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" component="div" fontWeight="bold">
            Check Out
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Room {selectedRoom?.so_phong}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {checkOutData ? (
            <Box sx={{ mt: 1 }}>
              <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Room Charges
                </Typography>
                <Box sx={{ ml: 2 }}>
                  {checkOutData.tien_phong.chiTiet.map((detail, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">
                        {detail.loaiTinh}: {detail.soLuong} x{" "}
                        {new Intl.NumberFormat("vi-VN").format(detail.donGia)}{" "}
                        VND
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {new Intl.NumberFormat("vi-VN").format(
                          detail.thanhTien
                        )}{" "}
                        VND
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle2">Total Room Charge</Typography>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {new Intl.NumberFormat("vi-VN").format(
                      checkOutData.tien_phong.tongTien
                    )}{" "}
                    VND
                  </Typography>
                </Box>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Service Charges
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle2">
                    Total Service Charge
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {new Intl.NumberFormat("vi-VN").format(
                      checkOutData.tien_dich_vu.tong_tien
                    )}{" "}
                    VND
                  </Typography>
                </Box>
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "primary.light",
                  color: "white",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">Total Amount</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {new Intl.NumberFormat("vi-VN").format(
                      checkOutData.tong_tien
                    )}{" "}
                    VND
                  </Typography>
                </Box>
              </Paper>
            </Box>
          ) : (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography>Loading price information...</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCheckOutClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleCheckOutSubmit}
            variant="contained"
            disabled={!checkOutData}
          >
            Confirm Check Out
          </Button>
        </DialogActions>
      </Dialog>

      {/* Service Dialog */}
      <Dialog
        open={serviceDialogOpen}
        onClose={handleServiceDialogClose}
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" component="div" fontWeight="bold">
            Room Services
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Room {selectedRoom?.so_phong}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Add New Service
            </Typography>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} sm={5}>
                <FormControl fullWidth>
                  <InputLabel id="service-select-label">Service</InputLabel>
                  <Select
                    labelId="service-select-label"
                    value={newServiceData.dich_vu_id}
                    label="Service"
                    onChange={(e) =>
                      setNewServiceData({
                        ...newServiceData,
                        dich_vu_id: e.target.value,
                      })
                    }
                  >
                    {services.map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        {service.ten_dich_vu} -{" "}
                        {new Intl.NumberFormat("vi-VN").format(service.gia)} VND
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  InputProps={{ inputProps: { min: 1 } }}
                  value={newServiceData.so_luong}
                  onChange={(e) =>
                    setNewServiceData({
                      ...newServiceData,
                      so_luong: Number.parseInt(e.target.value) || 1,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Notes"
                  value={newServiceData.ghi_chu}
                  onChange={(e) =>
                    setNewServiceData({
                      ...newServiceData,
                      ghi_chu: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={handleAddService}
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Service History
          </Typography>
          {bookingServices.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell align="right">Time</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookingServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.ten_dich_vu}</TableCell>
                      <TableCell align="right">
                        {new Intl.NumberFormat("vi-VN").format(
                          service.gia_tien
                        )}{" "}
                        VND
                      </TableCell>
                      <TableCell align="right">{service.so_luong}</TableCell>
                      <TableCell align="right">
                        {new Intl.NumberFormat("vi-VN").format(
                          service.gia_tien * service.so_luong
                        )}{" "}
                        VND
                      </TableCell>
                      <TableCell>{service.ghi_chu}</TableCell>
                      <TableCell align="right">
                        {new Date(service.thoi_gian_su_dung).toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete Service">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: "background.default",
                borderRadius: 2,
              }}
            >
              <Typography color="text.secondary">
                No services have been added yet
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleServiceDialogClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
