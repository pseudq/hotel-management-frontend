"use client";

import { useState } from "react";
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
} from "@mui/material";
import { Visibility, Calculate } from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const ActiveBookingsTable = ({ bookings, onViewDetails }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Filter only active bookings (status = "đã nhận")
  const activeBookings = bookings
    .filter((booking) => booking.trang_thai === "đã nhận")
    .sort((a, b) => {
      // Sort by check-in time (newest first)
      return new Date(b.thoi_gian_vao) - new Date(a.thoi_gian_vao);
    });

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

  // Hiển thị dạng card cho thiết bị di động
  const renderMobileView = () => {
    return (
      <Box>
        {activeBookings.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              bgcolor: "background.default",
              borderRadius: 2,
            }}
          >
            <Typography color="text.secondary">
              Không có khách hàng nào đang ở
            </Typography>
          </Box>
        ) : (
          activeBookings
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
                    <Chip label="Đang ở" color="primary" size="small" />
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
                        Ngày nhận phòng:
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="body2">
                        {formatDate(booking.thoi_gian_vao)}
                      </Typography>
                    </Grid>
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
                    <Tooltip title="Tính tiền hiện tại">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => onViewDetails(booking, false, true)}
                        sx={{ mr: 1 }}
                      >
                        <Calculate fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
        <Table stickyHeader aria-label="active bookings table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                STT
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tên khách hàng</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Số CCCD</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Phòng</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ngày nhận phòng</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">
                    Không có khách hàng nào đang ở
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              activeBookings
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
                    <TableCell>{formatDate(row.thoi_gian_vao)}</TableCell>
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
                        <Tooltip title="Tính tiền hiện tại">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => onViewDetails(row, false, true)}
                          >
                            <Calculate fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
    <Paper sx={{ width: "100%", overflow: "hidden", mt: 4 }}>
      <Typography variant="h5" sx={{ p: 2, pb: 1 }}>
        Danh sách khách đang ở
      </Typography>

      {isMobile ? renderMobileView() : renderDesktopView()}

      {activeBookings.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={activeBookings.length}
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

export default ActiveBookingsTable;
