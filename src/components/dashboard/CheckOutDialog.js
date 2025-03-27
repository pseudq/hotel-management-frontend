"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";

const CheckOutDialog = ({
  open,
  onClose,
  onSubmit,
  checkOutData,
  selectedRoom,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
                      {new Intl.NumberFormat("vi-VN").format(detail.donGia)} VND
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {new Intl.NumberFormat("vi-VN").format(detail.thanhTien)}{" "}
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
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" disabled={!checkOutData}>
          Confirm Check Out
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckOutDialog;
