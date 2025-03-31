"use client";

import { useState, useEffect } from "react";
import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  checkoutBooking,
  getRooms,
  getCustomers,
  calculatePrice,
} from "../apiService";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Box,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
  Menu,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  Book,
  Person,
  KingBed,
  EventAvailable,
  Visibility,
  MoreVert,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

const BookingManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // "add" or "edit"
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({
    khach_hang_id: "",
    phong_id: "",
    thoi_gian_vao: new Date().toISOString().slice(0, 16),
    ghi_chu: "",
    trang_thai: "đã nhận",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [checkoutConfirmOpen, setCheckoutConfirmOpen] = useState(false);
  const [bookingToCheckout, setBookingToCheckout] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
  const [selectedBookingForMenu, setSelectedBookingForMenu] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsResponse, roomsResponse, customersResponse] =
        await Promise.all([getBookings(), getRooms(), getCustomers()]);
      setBookings(bookingsResponse.data);
      setRooms(roomsResponse.data);
      setCustomers(customersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSnackbar({
        open: true,
        message: "Lỗi khi tải dữ liệu",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenAddDialog = () => {
    setDialogMode("add");
    setFormData({
      khach_hang_id: "",
      phong_id: "",
      thoi_gian_vao: new Date().toISOString().slice(0, 16),
      ghi_chu: "",
      trang_thai: "đã nhận",
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (booking) => {
    setDialogMode("edit");
    setSelectedBooking(booking);
    setFormData({
      khach_hang_id: booking.khach_hang_id,
      phong_id: booking.phong_id,
      thoi_gian_vao: booking.thoi_gian_vao
        ? new Date(booking.thoi_gian_vao).toISOString().slice(0, 16)
        : "",
      ghi_chu: booking.ghi_chu || "",
      trang_thai: booking.trang_thai,
    });
    setOpenDialog(true);
    handleCloseActionMenu();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Validate form data
      if (
        !formData.khach_hang_id ||
        !formData.phong_id ||
        !formData.thoi_gian_vao
      ) {
        setSnackbar({
          open: true,
          message:
            "Vui lòng nhập đầy đủ thông tin khách hàng, phòng và thời gian vào",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      if (dialogMode === "add") {
        await createBooking(formData);
        setSnackbar({
          open: true,
          message: "Thêm đặt phòng thành công",
          severity: "success",
        });
      } else {
        await updateBooking(selectedBooking.id, formData);
        setSnackbar({
          open: true,
          message: "Cập nhật đặt phòng thành công",
          severity: "success",
        });
      }

      fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving booking:", error);
      setSnackbar({
        open: true,
        message: `Lỗi khi ${
          dialogMode === "add" ? "thêm" : "cập nhật"
        } đặt phòng`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteConfirm = (booking) => {
    setBookingToDelete(booking);
    setDeleteConfirmOpen(true);
    handleCloseActionMenu();
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setBookingToDelete(null);
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;

    setLoading(true);
    try {
      await deleteBooking(bookingToDelete.id);
      fetchData();
      setSnackbar({
        open: true,
        message: "Xóa đặt phòng thành công",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      setSnackbar({
        open: true,
        message: "Lỗi khi xóa đặt phòng",
        severity: "error",
      });
    } finally {
      setLoading(false);
      handleCloseDeleteConfirm();
    }
  };

  const handleOpenCheckoutConfirm = async (booking) => {
    setLoading(true);
    try {
      const response = await calculatePrice(booking.id);
      setCheckoutData(response.data);
      setBookingToCheckout(booking);
      setCheckoutConfirmOpen(true);
      handleCloseActionMenu();
    } catch (error) {
      console.error("Error calculating price:", error);
      setSnackbar({
        open: true,
        message: "Lỗi khi tính giá trả phòng",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCheckoutConfirm = () => {
    setCheckoutConfirmOpen(false);
    setBookingToCheckout(null);
    setCheckoutData(null);
  };

  const handleCheckoutBooking = async () => {
    if (!bookingToCheckout) return;

    setLoading(true);
    try {
      await checkoutBooking(bookingToCheckout.id);
      fetchData();
      setSnackbar({
        open: true,
        message: "Trả phòng thành công",
        severity: "success",
      });
    } catch (error) {
      console.error("Error checking out booking:", error);
      setSnackbar({
        open: true,
        message: "Lỗi khi trả phòng",
        severity: "error",
      });
    } finally {
      setLoading(false);
      handleCloseCheckoutConfirm();
    }
  };

  const handleViewDetails = async (booking) => {
    setLoading(true);
    try {
      // If booking is active, get current price calculation
      if (booking.trang_thai === "đã nhận") {
        const response = await calculatePrice(booking.id);
        booking.priceCalculation = response.data;
      }

      setBookingDetails(booking);
      setDetailsDialogOpen(true);
      handleCloseActionMenu();
    } catch (error) {
      console.error("Error fetching booking details:", error);
      setSnackbar({
        open: true,
        message: "Lỗi khi tải chi tiết đặt phòng",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
    setBookingDetails(null);
  };

  const handleOpenActionMenu = (event, booking) => {
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedBookingForMenu(booking);
  };

  const handleCloseActionMenu = () => {
    setActionMenuAnchorEl(null);
    setSelectedBookingForMenu(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "HH:mm, dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return dateString;
    }
  };
  //eslint-disable-next-line
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "đã nhận":
        return <Chip label="Đang ở" color="primary" size="small" />;
      case "đã trả":
        return <Chip label="Đã trả phòng" color="success" size="small" />;
      case "đặt trước":
        return <Chip label="Đặt trước" color="warning" size="small" />;
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };

  // Filter bookings based on tab
  const filteredBookings = bookings.filter((booking) => {
    if (tabValue === 0) return true; // All bookings
    if (tabValue === 1) return booking.trang_thai === "đã nhận"; // Active bookings
    if (tabValue === 2) return booking.trang_thai === "đã trả"; // Past bookings
    return true;
  });

  // Get customer name by ID
  const getCustomerName = (id) => {
    const customer = customers.find((c) => c.id === id);
    return customer ? customer.ho_ten : "Không xác định";
  };

  // Get room number by ID
  const getRoomNumber = (id) => {
    const room = rooms.find((r) => r.id === id);
    return room ? `${room.so_phong} (Tầng ${room.so_tang})` : "Không xác định";
  };

  // Calculate statistics
  const activeBookingsCount = bookings.filter(
    (booking) => booking.trang_thai === "đã nhận"
  ).length;
  const completedBookingsCount = bookings.filter(
    (booking) => booking.trang_thai === "đã trả"
  ).length;
  const totalBookingsCount = bookings.length;

  // Render mobile view with cards instead of table
  const renderMobileView = () => {
    return (
      <Box sx={{ p: 2 }}>
        {filteredBookings.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              Không có đặt phòng nào
            </Typography>
          </Box>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="medium">
                      {getCustomerName(booking.khach_hang_id)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phòng: {getRoomNumber(booking.phong_id)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {getStatusChip(booking.trang_thai)}
                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenActionMenu(e, booking)}
                      sx={{ ml: 1 }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Grid container spacing={1}>
                  <Grid item xs={5}>
                    <Typography variant="body2" color="text.secondary">
                      Thời gian vào:
                    </Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="body2">
                      {formatDate(booking.thoi_gian_vao)}
                    </Typography>
                  </Grid>

                  {booking.ghi_chu && (
                    <>
                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Ghi chú:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2">
                          {booking.ghi_chu}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleViewDetails(booking)}
                    sx={{ mr: 1 }}
                  >
                    Chi tiết
                  </Button>

                  {booking.trang_thai === "đã nhận" && (
                    <Button
                      size="small"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => handleOpenCheckoutConfirm(booking)}
                    >
                      Trả phòng
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    );
  };

  // Render desktop view with table
  const renderDesktopView = () => {
    return (
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="bookings table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                STT
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Khách hàng</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Phòng</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Thời gian vào</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ghi chú</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">
                    Không có đặt phòng nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking, index) => (
                <TableRow hover key={booking.id}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {getCustomerName(booking.khach_hang_id)}
                    </Typography>
                  </TableCell>
                  <TableCell>{getRoomNumber(booking.phong_id)}</TableCell>
                  <TableCell>{formatDate(booking.thoi_gian_vao)}</TableCell>
                  <TableCell>{getStatusChip(booking.trang_thai)}</TableCell>
                  <TableCell>{booking.ghi_chu || "-"}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewDetails(booking)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {booking.trang_thai === "đã nhận" && (
                        <>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleOpenEditDialog(booking)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Trả phòng">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleOpenCheckoutConfirm(booking)}
                            >
                              <CheckCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}

                      {booking.trang_thai !== "đã trả" && (
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDeleteConfirm(booking)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Quản lý đặt phòng
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
        >
          Thêm đặt phòng
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Book sx={{ color: "primary.main", mr: 1 }} />
                  <Typography variant={isMobile ? "subtitle1" : "h6"}>
                    Tổng đặt phòng
                  </Typography>
                </Box>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
                  {totalBookingsCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Person sx={{ color: "info.main", mr: 1 }} />
                  <Typography variant={isMobile ? "subtitle1" : "h6"}>
                    Đang ở
                  </Typography>
                </Box>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
                  {activeBookingsCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <EventAvailable sx={{ color: "success.main", mr: 1 }} />
                  <Typography variant={isMobile ? "subtitle1" : "h6"}>
                    Đã trả phòng
                  </Typography>
                </Box>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
                  {completedBookingsCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <KingBed sx={{ color: "warning.main", mr: 1 }} />
                  <Typography variant={isMobile ? "subtitle1" : "h6"}>
                    Phòng trống
                  </Typography>
                </Box>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
                  {rooms.filter((room) => room.trang_thai === "trống").length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs for filtering bookings */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="booking tabs"
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : "auto"}
        >
          <Tab label="Tất cả đặt phòng" />
          <Tab label="Đang ở" />
          <Tab label="Đã trả phòng" />
        </Tabs>
      </Box>

      {/* Bookings Table/Cards */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        {isMobile ? renderMobileView() : renderDesktopView()}
      </Paper>

      {/* Action Menu for Mobile */}
      <Menu
        anchorEl={actionMenuAnchorEl}
        open={Boolean(actionMenuAnchorEl)}
        onClose={handleCloseActionMenu}
      >
        <MenuItem onClick={() => handleViewDetails(selectedBookingForMenu)}>
          <Visibility fontSize="small" sx={{ mr: 1 }} /> Xem chi tiết
        </MenuItem>

        {selectedBookingForMenu?.trang_thai === "đã nhận" && (
          <>
            <MenuItem
              onClick={() => handleOpenEditDialog(selectedBookingForMenu)}
            >
              <Edit fontSize="small" sx={{ mr: 1 }} /> Chỉnh sửa
            </MenuItem>
            <MenuItem
              onClick={() => handleOpenCheckoutConfirm(selectedBookingForMenu)}
            >
              <CheckCircle fontSize="small" sx={{ mr: 1 }} /> Trả phòng
            </MenuItem>
          </>
        )}

        {selectedBookingForMenu?.trang_thai !== "đã trả" && (
          <MenuItem
            onClick={() => handleOpenDeleteConfirm(selectedBookingForMenu)}
          >
            <Delete fontSize="small" sx={{ mr: 1, color: "error.main" }} />
            <Typography color="error">Xóa</Typography>
          </MenuItem>
        )}
      </Menu>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, margin: isMobile ? 2 : "auto" },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" component="div" fontWeight="bold">
            {dialogMode === "add"
              ? "Thêm đặt phòng mới"
              : "Chỉnh sửa đặt phòng"}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="customer-select-label">Khách hàng</InputLabel>
                <Select
                  labelId="customer-select-label"
                  name="khach_hang_id"
                  value={formData.khach_hang_id}
                  onChange={handleInputChange}
                  label="Khách hàng"
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.ho_ten} - {customer.cmnd}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="room-select-label">Phòng</InputLabel>
                <Select
                  labelId="room-select-label"
                  name="phong_id"
                  value={formData.phong_id}
                  onChange={handleInputChange}
                  label="Phòng"
                >
                  {rooms
                    .filter(
                      (room) =>
                        room.trang_thai === "trống" ||
                        (dialogMode === "edit" &&
                          room.id === selectedBooking?.phong_id)
                    )
                    .map((room) => (
                      <MenuItem key={room.id} value={room.id}>
                        Phòng {room.so_phong} (Tầng {room.so_tang})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Thời gian vào"
                name="thoi_gian_vao"
                type="datetime-local"
                value={formData.thoi_gian_vao}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="status-select-label">Trạng thái</InputLabel>
                <Select
                  labelId="status-select-label"
                  name="trang_thai"
                  value={formData.trang_thai}
                  onChange={handleInputChange}
                  label="Trạng thái"
                >
                  <MenuItem value="đã nhận">Đang ở</MenuItem>
                  <MenuItem value="đặt trước">Đặt trước</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                name="ghi_chu"
                value={formData.ghi_chu}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {dialogMode === "add" ? "Thêm" : "Lưu thay đổi"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 2, margin: isMobile ? 2 : "auto" },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            Xác nhận xóa
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bạn có chắc chắn muốn xóa đặt phòng này?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Lưu ý: Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDeleteConfirm} variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleDeleteBooking}
            variant="contained"
            color="error"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Checkout Confirmation Dialog */}
      <Dialog
        open={checkoutConfirmOpen}
        onClose={handleCloseCheckoutConfirm}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, margin: isMobile ? 2 : "auto" },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" component="div" fontWeight="bold">
            Xác nhận trả phòng
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {checkoutData ? (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Thông tin khách hàng
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body1">
                      <strong>Họ tên:</strong>{" "}
                      {getCustomerName(bookingToCheckout?.khach_hang_id)}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Phòng:</strong>{" "}
                      {getRoomNumber(bookingToCheckout?.phong_id)}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Thời gian vào:</strong>{" "}
                      {formatDate(bookingToCheckout?.thoi_gian_vao)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Chi tiết thanh toán
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Tiền phòng
                    </Typography>
                    <Box sx={{ ml: 2 }}>
                      {checkoutData.tien_phong.chiTiet.map((detail, index) => (
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
                            {new Intl.NumberFormat("vi-VN").format(
                              detail.donGia
                            )}{" "}
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
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle2">
                        Tổng tiền phòng
                      </Typography>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {new Intl.NumberFormat("vi-VN").format(
                          checkoutData.tien_phong.tongTien
                        )}{" "}
                        VND
                      </Typography>
                    </Box>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Tiền dịch vụ
                    </Typography>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle2">
                        Tổng tiền dịch vụ
                      </Typography>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {new Intl.NumberFormat("vi-VN").format(
                          checkoutData.tien_dich_vu.tong_tien
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
                      <Typography variant="h6">Tổng tiền</Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {new Intl.NumberFormat("vi-VN").format(
                          checkoutData.tong_tien
                        )}{" "}
                        VND
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseCheckoutConfirm} variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleCheckoutBooking}
            variant="contained"
            color="success"
            disabled={!checkoutData}
          >
            Xác nhận trả phòng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Booking Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, margin: isMobile ? 2 : "auto" },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" component="div" fontWeight="bold">
            Chi tiết đặt phòng
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {bookingDetails && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Thông tin khách hàng
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1">
                    <strong>Họ tên:</strong>{" "}
                    {getCustomerName(bookingDetails.khach_hang_id)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phòng:</strong>{" "}
                    {getRoomNumber(bookingDetails.phong_id)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Thời gian vào:</strong>{" "}
                    {formatDate(bookingDetails.thoi_gian_vao)}
                  </Typography>
                  {bookingDetails.thoi_gian_ra && (
                    <Typography variant="body1">
                      <strong>Thời gian ra:</strong>{" "}
                      {formatDate(bookingDetails.thoi_gian_ra)}
                    </Typography>
                  )}
                  <Typography variant="body1">
                    <strong>Trạng thái:</strong>{" "}
                    {getStatusChip(bookingDetails.trang_thai)}
                  </Typography>
                  {bookingDetails.ghi_chu && (
                    <Typography variant="body1">
                      <strong>Ghi chú:</strong> {bookingDetails.ghi_chu}
                    </Typography>
                  )}
                </Box>
              </Grid>

              {bookingDetails.priceCalculation && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Chi tiết thanh toán hiện tại
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Tiền phòng
                    </Typography>
                    <Box sx={{ ml: 2 }}>
                      {bookingDetails.priceCalculation.tien_phong.chiTiet.map(
                        (detail, index) => (
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
                              {new Intl.NumberFormat("vi-VN").format(
                                detail.donGia
                              )}{" "}
                              VND
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {new Intl.NumberFormat("vi-VN").format(
                                detail.thanhTien
                              )}{" "}
                              VND
                            </Typography>
                          </Box>
                        )
                      )}
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle2">
                        Tổng tiền phòng
                      </Typography>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {new Intl.NumberFormat("vi-VN").format(
                          bookingDetails.priceCalculation.tien_phong.tongTien
                        )}{" "}
                        VND
                      </Typography>
                    </Box>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Tiền dịch vụ
                    </Typography>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle2">
                        Tổng tiền dịch vụ
                      </Typography>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {new Intl.NumberFormat("vi-VN").format(
                          bookingDetails.priceCalculation.tien_dich_vu.tong_tien
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
                      <Typography variant="h6">Tổng tiền</Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {new Intl.NumberFormat("vi-VN").format(
                          bookingDetails.priceCalculation.tong_tien
                        )}{" "}
                        VND
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDetailsDialog} variant="contained">
            Đóng
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

export default BookingManagement;
