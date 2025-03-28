"use client";

import { useState, useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  TablePagination,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
} from "@mui/material";
import { Visibility, Receipt } from "@mui/icons-material";
import {
  format,
  startOfToday,
  endOfToday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { vi } from "date-fns/locale";

const PastBookingsTable = ({ bookings, invoices, onViewDetails }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [timeFilter, setTimeFilter] = useState("all");

  // Kết hợp dữ liệu bookings và invoices
  const pastBookings = useMemo(() => {
    return bookings
      .filter((booking) => booking.trang_thai === "đã trả")
      .map((booking) => {
        // Find corresponding invoice
        const invoice = invoices.find((inv) => inv.dat_phong_id === booking.id);
        return {
          ...booking,
          invoice: invoice || null,
        };
      });
  }, [bookings, invoices]);

  // Lọc booking theo thời gian và tính tổng doanh thu
  const { filteredBookings, totalRevenue } = useMemo(() => {
    if (!pastBookings || pastBookings.length === 0) {
      return { filteredBookings: [], totalRevenue: 0 };
    }

    // Lấy thời gian hiện tại
    const today = new Date();
    const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 }); // Tuần bắt đầu từ thứ 2
    const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 });
    const startOfMonthDate = startOfMonth(today);
    const endOfMonthDate = endOfMonth(today);

    // Lọc booking theo thời gian
    const filtered = pastBookings.filter((booking) => {
      if (!booking.invoice) return false;

      // Lấy thời gian trả phòng từ hóa đơn hoặc booking
      const checkoutDateStr =
        booking.invoice.thoi_gian_tra || booking.thoi_gian_ra;
      if (!checkoutDateStr) return false;

      try {
        const checkoutDate = new Date(checkoutDateStr);

        switch (timeFilter) {
          case "today":
            return (
              checkoutDate >= startOfToday() && checkoutDate <= endOfToday()
            );
          case "week":
            return (
              checkoutDate >= startOfWeekDate && checkoutDate <= endOfWeekDate
            );
          case "month":
            return (
              checkoutDate >= startOfMonthDate && checkoutDate <= endOfMonthDate
            );
          case "all":
          default:
            return true;
        }
      } catch (error) {
        console.error("Error parsing date:", error);
        return false;
      }
    });

    // Tính tổng doanh thu
    const total = filtered.reduce((sum, booking) => {
      const amount =
        booking.invoice && !isNaN(booking.invoice.tong_tien)
          ? Number(booking.invoice.tong_tien)
          : 0;
      return sum + amount;
    }, 0);

    return { filteredBookings: filtered, totalRevenue: total };
  }, [pastBookings, timeFilter]);

  const handleTimeFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setTimeFilter(newFilter);
      setPage(0); // Reset về trang đầu tiên khi thay đổi bộ lọc
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "HH:mm, dd/MM/yyyy", { locale: vi });
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

  // Hiển thị dạng card cho thiết bị di động
  const renderMobileView = () => {
    return (
      <Box>
        {filteredBookings.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              bgcolor: "background.default",
              borderRadius: 2,
            }}
          >
            <Typography color="text.secondary">
              {timeFilter === "all"
                ? "Không có lịch sử trả phòng"
                : "Không có lịch sử trả phòng trong khoảng thời gian này"}
            </Typography>
          </Box>
        ) : (
          filteredBookings
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((booking) => (
              <Card key={booking.id} sx={{ mb: 2, borderRadius: 2 }}>
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
                      Phòng {booking.so_phong} (Tầng {booking.so_tang})
                    </Typography>
                    <Chip label="Đã trả phòng" color="success" size="small" />
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Grid container spacing={1}>
                    <Grid item xs={5}>
                      <Typography variant="body2" color="text.secondary">
                        Khách hàng:
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="body2">{booking.ho_ten}</Typography>
                    </Grid>

                    <Grid item xs={5}>
                      <Typography variant="body2" color="text.secondary">
                        CCCD:
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="body2">{booking.cmnd}</Typography>
                    </Grid>

                    <Grid item xs={5}>
                      <Typography variant="body2" color="text.secondary">
                        Ngày tạo:
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="body2">
                        {formatDate(booking.thoi_gian_vao)}
                      </Typography>
                    </Grid>

                    <Grid item xs={5}>
                      <Typography variant="body2" color="text.secondary">
                        Ngày trả:
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="body2">
                        {formatDate(
                          booking.invoice?.thoi_gian_tra || booking.thoi_gian_ra
                        )}
                      </Typography>
                    </Grid>

                    {booking.invoice && (
                      <>
                        <Grid item xs={5}>
                          <Typography variant="body2" color="text.secondary">
                            Tiền thu:
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(booking.invoice.tong_tien)}
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>

                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                  >
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onViewDetails(booking)}
                        sx={{ mr: 1 }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {booking.invoice && (
                      <Tooltip title="Xem hóa đơn">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => onViewDetails(booking, true)}
                        >
                          <Receipt fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))
        )}
      </Box>
    );
  };

  // Hiển thị dạng bảng cho desktop
  const renderDesktopView = () => {
    return (
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="past bookings table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                STT
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tên khách hàng</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Số CCCD</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Phòng</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ngày trả</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tiền thu</TableCell>
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
                    {timeFilter === "all"
                      ? "Không có lịch sử trả phòng"
                      : "Không có lịch sử trả phòng trong khoảng thời gian này"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell align="center">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{row.ho_ten}</TableCell>
                    <TableCell>{row.cmnd}</TableCell>
                    <TableCell>
                      {row.so_phong} (Tầng {row.so_tang})
                    </TableCell>
                    <TableCell>
                      {formatDate(
                        row.invoice?.thoi_gian_tra || row.thoi_gian_ra
                      )}
                    </TableCell>
                    <TableCell>
                      {row.invoice
                        ? formatCurrency(row.invoice.tong_tien)
                        : "-"}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onViewDetails(row)}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {row.invoice && (
                          <Tooltip title="Xem hóa đơn">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => onViewDetails(row, true)}
                            >
                              <Receipt fontSize="small" />
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

  // Hiển thị tiêu đề theo bộ lọc thời gian
  const getTimeFilterTitle = () => {
    switch (timeFilter) {
      case "today":
        return "Hôm nay";
      case "week":
        return "Tuần này";
      case "month":
        return "Tháng này";
      case "all":
      default:
        return "Tất cả thời gian";
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mt: 4 }}>
      <Typography variant="h5" sx={{ p: 2, pb: 1 }}>
        Lịch sử trả phòng
      </Typography>

      <Box sx={{ px: 2, pb: 2 }}>
        <Card
          variant="outlined"
          sx={{ bgcolor: "primary.light", color: "white" }}
        >
          <CardContent>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Tổng doanh thu ({getTimeFilterTitle()})
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {formatCurrency(totalRevenue)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent={{ xs: "flex-start", md: "flex-end" }}
                >
                  <ToggleButtonGroup
                    value={timeFilter}
                    exclusive
                    onChange={handleTimeFilterChange}
                    aria-label="time filter"
                    size="small"
                    sx={{
                      bgcolor: "white",
                      "& .MuiToggleButton-root.Mui-selected": {
                        bgcolor: "primary.dark",
                        color: "white",
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                      },
                    }}
                  >
                    <ToggleButton value="today" aria-label="today">
                      Hôm nay
                    </ToggleButton>
                    <ToggleButton value="week" aria-label="this week">
                      Tuần này
                    </ToggleButton>
                    <ToggleButton value="month" aria-label="this month">
                      Tháng này
                    </ToggleButton>
                    <ToggleButton value="all" aria-label="all time">
                      Tất cả
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {isMobile ? renderMobileView() : renderDesktopView()}

      {filteredBookings.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count}`
          }
        />
      )}
    </Paper>
  );
};

export default PastBookingsTable;
