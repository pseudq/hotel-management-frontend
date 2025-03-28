"use client";

import { useState, useEffect } from "react";
import { getInvoices, updateInvoice, getBookings } from "../apiService";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Pagination,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  Visibility,
  CheckCircle,
  Clear,
  Person,
  AttachMoney,
  FilterList,
} from "@mui/icons-material";
import { format, parseISO, isAfter, isBefore, isEqual } from "date-fns";
import { vi } from "date-fns/locale";

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    startDate: "",
    endDate: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (invoices.length > 0 && bookings.length > 0) {
      combineData();
    } // eslint-disable-next-line
  }, [invoices, bookings]);

  useEffect(() => {
    applyFiltersAndSearch(); // eslint-disable-next-line
  }, [combinedData, searchTerm, filters]);

  const fetchData = async () => {
    try {
      const [invoicesResponse, bookingsResponse] = await Promise.all([
        getInvoices(),
        getBookings(),
      ]);
      setInvoices(invoicesResponse.data);
      setBookings(bookingsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSnackbar({
        open: true,
        message: "Lỗi khi tải dữ liệu",
        severity: "error",
      });
    }
  };

  const combineData = () => {
    const combined = invoices.map((invoice) => {
      const booking = bookings.find((b) => b.id === invoice.dat_phong_id);
      return {
        ...invoice,
        booking: booking || null,
      };
    });
    setCombinedData(combined);
    setFilteredData(combined);
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...combinedData];

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(
        (item) => item.trang_thai_thanh_toan === filters.status
      );
    }

    // Apply date filters
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter((item) => {
        const invoiceDate = new Date(item.thoi_gian_tra);
        return (
          isAfter(invoiceDate, startDate) || isEqual(invoiceDate, startDate)
        );
      });
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      // Set time to end of day
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((item) => {
        const invoiceDate = new Date(item.thoi_gian_tra);
        return isBefore(invoiceDate, endDate) || isEqual(invoiceDate, endDate);
      });
    }

    // Apply search term
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.booking?.ho_ten &&
            item.booking.ho_ten.toLowerCase().includes(searchTermLower)) ||
          (item.booking?.cmnd &&
            item.booking.cmnd.toLowerCase().includes(searchTermLower)) ||
          (item.booking?.so_phong &&
            item.booking.so_phong.toString().includes(searchTermLower))
      );
    }

    setFilteredData(filtered);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      startDate: "",
      endDate: "",
    });
  };

  const handleUpdateInvoice = async (id, newStatus) => {
    try {
      await updateInvoice(id, { trang_thai_thanh_toan: newStatus });
      fetchData();
      setSnackbar({
        open: true,
        message: "Cập nhật trạng thái hóa đơn thành công",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating invoice:", error);
      setSnackbar({
        open: true,
        message: "Lỗi khi cập nhật trạng thái hóa đơn",
        severity: "error",
      });
    }
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "HH:mm, dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "đã thanh toán":
        return <Chip label="Đã thanh toán" color="success" size="small" />;
      case "chưa thanh toán":
        return <Chip label="Chưa thanh toán" color="error" size="small" />;
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };

  // Calculate pagination
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Quản lý hóa đơn
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
        </Button>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm theo tên khách hàng, CCCD hoặc số phòng..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={clearSearch} size="small">
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {showFilters && (
            <>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-filter-label">
                    Trạng thái thanh toán
                  </InputLabel>
                  <Select
                    labelId="status-filter-label"
                    name="status"
                    value={filters.status}
                    label="Trạng thái thanh toán"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="đã thanh toán">Đã thanh toán</MenuItem>
                    <MenuItem value="chưa thanh toán">Chưa thanh toán</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Từ ngày"
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Đến ngày"
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="outlined"
                    onClick={clearFilters}
                    startIcon={<Clear />}
                  >
                    Xóa bộ lọc
                  </Button>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* Invoice Summary Card */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AttachMoney sx={{ color: "primary.main", mr: 1 }} />
                  <Typography variant={isMobile ? "subtitle1" : "h6"}>
                    Tổng số hóa đơn
                  </Typography>
                </Box>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
                  {filteredData.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CheckCircle sx={{ color: "success.main", mr: 1 }} />
                  <Typography variant={isMobile ? "subtitle1" : "h6"}>
                    Đã thanh toán
                  </Typography>
                </Box>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
                  {
                    filteredData.filter(
                      (item) => item.trang_thai_thanh_toan === "đã thanh toán"
                    ).length
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Clear sx={{ color: "error.main", mr: 1 }} />
                  <Typography variant={isMobile ? "subtitle1" : "h6"}>
                    Chưa thanh toán
                  </Typography>
                </Box>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
                  {
                    filteredData.filter(
                      (item) => item.trang_thai_thanh_toan === "chưa thanh toán"
                    ).length
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AttachMoney sx={{ color: "primary.main", mr: 1 }} />
                  <Typography variant={isMobile ? "subtitle1" : "h6"}>
                    Tổng doanh thu
                  </Typography>
                </Box>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
                  {formatCurrency(
                    filteredData.reduce(
                      (sum, item) => sum + (Number(item.tong_tien) || 0),
                      0
                    )
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Invoice Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        {isMobile ? (
          // Mobile view - Cards
          <Box sx={{ p: 2 }}>
            {filteredData.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="text.secondary">
                  {searchTerm ||
                  filters.status !== "all" ||
                  filters.startDate ||
                  filters.endDate
                    ? "Không tìm thấy hóa đơn phù hợp với điều kiện tìm kiếm"
                    : "Chưa có hóa đơn nào"}
                </Typography>
              </Box>
            ) : (
              paginatedData.map((invoice, index) => (
                <Card key={invoice.id} sx={{ mb: 2, borderRadius: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {invoice.booking
                          ? invoice.booking.ho_ten
                          : "Không có thông tin"}
                      </Typography>
                      {getStatusChip(invoice.trang_thai_thanh_toan)}
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Grid container spacing={1}>
                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Phòng:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2">
                          {invoice.booking
                            ? `${invoice.booking.so_phong} (Tầng ${invoice.booking.so_tang})`
                            : "N/A"}
                        </Typography>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Ngày trả:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2">
                          {formatDate(invoice.thoi_gian_tra)}
                        </Typography>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Tổng tiền:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(invoice.tong_tien)}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 2,
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => handleViewDetails(invoice)}
                        sx={{ mr: 1 }}
                      >
                        Chi tiết
                      </Button>

                      {invoice.trang_thai_thanh_toan === "chưa thanh toán" && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircle />}
                          onClick={() =>
                            handleUpdateInvoice(invoice.id, "đã thanh toán")
                          }
                        >
                          Đã thanh toán
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                />
              </Box>
            )}
          </Box>
        ) : (
          // Desktop view - Table
          <>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="invoice table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      STT
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Khách hàng
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Phòng</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Ngày trả phòng
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Tổng tiền</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Trạng thái
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color="text.secondary">
                          {searchTerm ||
                          filters.status !== "all" ||
                          filters.startDate ||
                          filters.endDate
                            ? "Không tìm thấy hóa đơn phù hợp với điều kiện tìm kiếm"
                            : "Chưa có hóa đơn nào"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((invoice, index) => (
                      <TableRow hover key={invoice.id}>
                        <TableCell align="center">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell>
                          {invoice.booking ? (
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {invoice.booking.ho_ten}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                CCCD: {invoice.booking.cmnd}
                              </Typography>
                            </Box>
                          ) : (
                            "Không có thông tin"
                          )}
                        </TableCell>
                        <TableCell>
                          {invoice.booking
                            ? `${invoice.booking.so_phong} (Tầng ${invoice.booking.so_tang})`
                            : "Không có thông tin"}
                        </TableCell>
                        <TableCell>
                          {formatDate(invoice.thoi_gian_tra)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(invoice.tong_tien)}
                        </TableCell>
                        <TableCell>
                          {getStatusChip(invoice.trang_thai_thanh_toan)}
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <Tooltip title="Xem chi tiết">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleViewDetails(invoice)}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {invoice.trang_thai_thanh_toan ===
                              "chưa thanh toán" && (
                              <Tooltip title="Đánh dấu đã thanh toán">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() =>
                                    handleUpdateInvoice(
                                      invoice.id,
                                      "đã thanh toán"
                                    )
                                  }
                                >
                                  <CheckCircle fontSize="small" />
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

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Invoice Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            Chi tiết hóa đơn
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedInvoice && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Thông tin khách hàng
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {selectedInvoice.booking ? (
                    <>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Person sx={{ mr: 1, color: "text.secondary" }} />
                        <Typography variant="body1">
                          <strong>Họ tên:</strong>{" "}
                          {selectedInvoice.booking.ho_ten}
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        <strong>CCCD:</strong> {selectedInvoice.booking.cmnd}
                      </Typography>
                      {selectedInvoice.booking.so_dien_thoai && (
                        <Typography variant="body1">
                          <strong>Số điện thoại:</strong>{" "}
                          {selectedInvoice.booking.so_dien_thoai}
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography color="text.secondary">
                      Không có thông tin khách hàng
                    </Typography>
                  )}
                </Box>

                <Typography variant="h6" gutterBottom>
                  Thông tin phòng
                </Typography>
                <Box>
                  {selectedInvoice.booking ? (
                    <>
                      <Typography variant="body1">
                        <strong>Phòng:</strong>{" "}
                        {selectedInvoice.booking.so_phong}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Tầng:</strong> {selectedInvoice.booking.so_tang}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Loại phòng:</strong>{" "}
                        {selectedInvoice.booking.ten_loai_phong ||
                          "Không có thông tin"}
                      </Typography>
                    </>
                  ) : (
                    <Typography color="text.secondary">
                      Không có thông tin phòng
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Thông tin hóa đơn
                </Typography>
                <Box>
                  <Typography variant="body1">
                    <strong>Thời gian trả phòng:</strong>{" "}
                    {formatDate(selectedInvoice.thoi_gian_tra)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Trạng thái thanh toán:</strong>{" "}
                    {getStatusChip(selectedInvoice.trang_thai_thanh_toan)}
                  </Typography>
                  {selectedInvoice.phuong_thuc_thanh_toan && (
                    <Typography variant="body1">
                      <strong>Phương thức thanh toán:</strong>{" "}
                      {selectedInvoice.phuong_thuc_thanh_toan}
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Chi tiết thanh toán
                </Typography>
                <Box>
                  <Typography variant="body1">
                    <strong>Tiền phòng:</strong>{" "}
                    {formatCurrency(selectedInvoice.tong_tien_phong)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Tiền dịch vụ:</strong>{" "}
                    {formatCurrency(selectedInvoice.tong_tien_dich_vu)}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ mt: 2, color: "primary.main" }}
                  >
                    <strong>Tổng tiền:</strong>{" "}
                    {formatCurrency(selectedInvoice.tong_tien)}
                  </Typography>
                </Box>
              </Grid>

              {selectedInvoice.ghi_chu && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Ghi chú
                  </Typography>
                  <Typography variant="body1">
                    {selectedInvoice.ghi_chu}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained">
            Đóng
          </Button>
          {selectedInvoice &&
            selectedInvoice.trang_thai_thanh_toan === "chưa thanh toán" && (
              <Button
                onClick={() => {
                  handleUpdateInvoice(selectedInvoice.id, "đã thanh toán");
                  handleCloseDialog();
                }}
                variant="contained"
                color="success"
              >
                Đánh dấu đã thanh toán
              </Button>
            )}
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

export default InvoiceManagement;
