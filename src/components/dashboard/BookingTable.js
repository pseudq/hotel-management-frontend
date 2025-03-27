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
} from "@mui/material";
import { Visibility, Receipt } from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const BookingTable = ({ bookings, invoices, onViewDetails }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Kết hợp dữ liệu từ bookings và invoices
  const combinedData = bookings.map((booking) => {
    // Tìm hóa đơn tương ứng với booking (nếu có)
    const invoice = invoices.find((inv) => inv.dat_phong_id === booking.id);
    return {
      ...booking,
      invoice: invoice || null,
    };
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "đã nhận":
        return <Chip label="Đang ở" color="success" size="small" />;
      case "đã trả":
        return <Chip label="Đã trả phòng" color="error" size="small" />;
      case "đặt trước":
        return <Chip label="Đặt trước" color="warning" size="small" />;
      default:
        return <Chip label={status} color="default" size="small" />;
    }
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

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mt: 4 }}>
      <Typography variant="h5" sx={{ p: 2, pb: 1 }}>
        Danh sách đặt phòng và hóa đơn
      </Typography>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                STT
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tên khách hàng</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Số CCCD</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Phòng</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ngày tạo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tình trạng</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tiền thu</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {combinedData
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
                  <TableCell>{getStatusChip(row.trang_thai)}</TableCell>
                  <TableCell>
                    {row.trang_thai === "đã trả" && row.invoice
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
                      {row.trang_thai === "đã trả" && (
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
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={combinedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số hàng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} của ${count}`
        }
      />
    </Paper>
  );
};

export default BookingTable;
