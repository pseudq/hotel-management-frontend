"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
  Chip,
  Paper,
} from "@mui/material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const BookingDetailsDialog = ({ open, onClose, booking, showInvoice }) => {
  if (!booking) return null;

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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          {showInvoice ? "Chi tiết hóa đơn" : "Chi tiết đặt phòng"}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Thông tin khách hàng
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>Họ tên:</strong> {booking.ho_ten}
              </Typography>
              <Typography variant="body1">
                <strong>CCCD:</strong> {booking.cmnd}
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom>
              Thông tin phòng
            </Typography>
            <Box>
              <Typography variant="body1">
                <strong>Phòng:</strong> {booking.so_phong}
              </Typography>
              <Typography variant="body1">
                <strong>Tầng:</strong> {booking.so_tang}
              </Typography>
              <Typography variant="body1">
                <strong>Loại phòng:</strong> {booking.ten_loai_phong}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Thông tin đặt phòng
            </Typography>
            <Box>
              <Typography variant="body1">
                <strong>Thời gian vào:</strong>{" "}
                {formatDate(booking.thoi_gian_vao)}
              </Typography>
              {booking.thoi_gian_du_kien_ra && (
                <Typography variant="body1">
                  <strong>Thời gian dự kiến ra:</strong>{" "}
                  {formatDate(booking.thoi_gian_du_kien_ra)}
                </Typography>
              )}
              <Typography variant="body1">
                <strong>Trạng thái:</strong> {getStatusChip(booking.trang_thai)}
              </Typography>
              {booking.ghi_chu && (
                <Typography variant="body1">
                  <strong>Ghi chú:</strong> {booking.ghi_chu}
                </Typography>
              )}
            </Box>
          </Grid>

          {showInvoice && booking.invoice && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Chi tiết hóa đơn
              </Typography>

              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Thông tin thanh toán
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Thời gian trả phòng:</strong>{" "}
                      {formatDate(booking.invoice.thoi_gian_tra)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Trạng thái thanh toán:</strong>{" "}
                      {booking.invoice.trang_thai_thanh_toan}
                    </Typography>
                    {booking.invoice.phuong_thuc_thanh_toan && (
                      <Typography variant="body2">
                        <strong>Phương thức thanh toán:</strong>{" "}
                        {booking.invoice.phuong_thuc_thanh_toan}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Tiền phòng:</strong>{" "}
                      {formatCurrency(booking.invoice.tong_tien_phong)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Tiền dịch vụ:</strong>{" "}
                      {formatCurrency(booking.invoice.tong_tien_dich_vu)}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{ mt: 1 }}
                    >
                      <strong>Tổng tiền:</strong>{" "}
                      {formatCurrency(booking.invoice.tong_tien)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {booking.invoice.ghi_chu && (
                <Typography variant="body1">
                  <strong>Ghi chú:</strong> {booking.invoice.ghi_chu}
                </Typography>
              )}
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDetailsDialog;
