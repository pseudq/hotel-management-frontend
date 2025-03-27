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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const ServiceDialog = ({
  open,
  onClose,
  onAddService,
  onDeleteService,
  newServiceData,
  setNewServiceData,
  bookingServices,
  services,
  selectedRoom,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" component="div" fontWeight="bold">
          Dịch vụ phòng
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Phòng {selectedRoom?.so_phong}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Thêm dịch vụ
          </Typography>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <InputLabel id="service-select-label">Loại dịch vụ</InputLabel>
                <Select
                  labelId="service-select-label"
                  value={newServiceData.dich_vu_id}
                  label="Loại dịch vụ"
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
                label="Số lượng"
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
                label="Ghi chú(nếu có)"
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
                onClick={onAddService}
                fullWidth
              >
                Thêm
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Các dịch vụ hiện có
        </Typography>
        {bookingServices.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Dịch vụ</TableCell>
                  <TableCell align="right">Giá</TableCell>
                  <TableCell align="right">Số Lượng</TableCell>
                  <TableCell align="right">Tổng cộng</TableCell>
                  <TableCell>Ghi chú</TableCell>
                  <TableCell align="right">Thời gian</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookingServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.ten_dich_vu}</TableCell>
                    <TableCell align="right">
                      {new Intl.NumberFormat("vi-VN").format(service.gia_tien)}{" "}
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
                          onClick={() => onDeleteService(service.id)}
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
              Chưa dùng dịch vụ nào
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceDialog;
