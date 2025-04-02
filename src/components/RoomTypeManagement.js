"use client";

import { useState, useEffect } from "react";
import {
  getRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
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
  InputAdornment,
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
  useMediaQuery,
  useTheme,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import { Add, Edit, Delete, Category, MoreVert } from "@mui/icons-material";

const RoomTypeManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // "add" or "edit"
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [formData, setFormData] = useState({
    ten_loai_phong: "",
    gia_qua_dem: "",
    gia_gio_dau: "",
    gia_theo_gio: "",
    gia_qua_ngay: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roomTypeToDelete, setRoomTypeToDelete] = useState(null);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
  const [selectedRoomTypeForMenu, setSelectedRoomTypeForMenu] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const response = await getRoomTypes();
      setRoomTypes(response.data);
    } catch (error) {
      console.error("Error fetching room types:", error);
      setSnackbar({
        open: true,
        message: "Lỗi khi tải danh sách loại phòng",
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
      ten_loai_phong: "",
      gia_qua_dem: "",
      gia_gio_dau: "",
      gia_theo_gio: "",
      gia_qua_ngay: "",
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (roomType) => {
    setDialogMode("edit");
    setSelectedRoomType(roomType);
    setFormData({
      ten_loai_phong: roomType.ten_loai_phong,
      gia_qua_dem: roomType.gia_qua_dem,
      gia_gio_dau: roomType.gia_gio_dau,
      gia_theo_gio: roomType.gia_theo_gio,
      gia_qua_ngay: roomType.gia_qua_ngay,
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
      if (!formData.ten_loai_phong) {
        setSnackbar({
          open: true,
          message: "Vui lòng nhập tên loại phòng",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      if (dialogMode === "add") {
        await createRoomType(formData);
        setSnackbar({
          open: true,
          message: "Thêm loại phòng thành công",
          severity: "success",
        });
      } else {
        await updateRoomType(selectedRoomType.id, formData);
        setSnackbar({
          open: true,
          message: "Cập nhật loại phòng thành công",
          severity: "success",
        });
      }

      fetchRoomTypes();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving room type:", error);
      setSnackbar({
        open: true,
        message: `Lỗi khi ${
          dialogMode === "add" ? "thêm" : "cập nhật"
        } loại phòng`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteConfirm = (roomType) => {
    setRoomTypeToDelete(roomType);
    setDeleteConfirmOpen(true);
    handleCloseActionMenu();
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setRoomTypeToDelete(null);
  };

  const handleDeleteRoomType = async () => {
    if (!roomTypeToDelete) return;

    setLoading(true);
    try {
      await deleteRoomType(roomTypeToDelete.id);
      fetchRoomTypes();
      setSnackbar({
        open: true,
        message: "Xóa loại phòng thành công",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting room type:", error);
      setSnackbar({
        open: true,
        message: "Lỗi khi xóa loại phòng",
        severity: "error",
      });
    } finally {
      setLoading(false);
      handleCloseDeleteConfirm();
    }
  };

  const handleOpenActionMenu = (event, roomType) => {
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedRoomTypeForMenu(roomType);
  };

  const handleCloseActionMenu = () => {
    setActionMenuAnchorEl(null);
    setSelectedRoomTypeForMenu(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Render mobile view with cards instead of table
  const renderMobileView = () => {
    return (
      <Box sx={{ p: 2 }}>
        {roomTypes.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              Chưa có loại phòng nào
            </Typography>
          </Box>
        ) : (
          roomTypes.map((roomType) => (
            <Card key={roomType.id} sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="h6" fontWeight="medium">
                    {roomType.ten_loai_phong}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleOpenActionMenu(e, roomType)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Giá qua đêm:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(roomType.gia_qua_dem)}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Giá giờ đầu:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {formatCurrency(roomType.gia_gio_dau)}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Giá theo giờ:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {formatCurrency(roomType.gia_theo_gio)}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Giá qua ngày:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {formatCurrency(roomType.gia_qua_ngay)}
                    </Typography>
                  </Grid>
                </Grid>

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleOpenEditDialog(roomType)}
                    sx={{ mr: 1 }}
                  >
                    Sửa
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleOpenDeleteConfirm(roomType)}
                  >
                    Xóa
                  </Button>
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
        <Table stickyHeader aria-label="room types table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                STT
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tên loại phòng</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Giá qua đêm
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Giá giờ đầu
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Giá theo giờ
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Giá qua ngày
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roomTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">
                    Chưa có loại phòng nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              roomTypes.map((roomType, index) => (
                <TableRow hover key={roomType.id}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {roomType.ten_loai_phong}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(roomType.gia_qua_dem)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(roomType.gia_gio_dau)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(roomType.gia_theo_gio)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(roomType.gia_qua_ngay)}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEditDialog(roomType)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDeleteConfirm(roomType)}
                        >
                          <Delete fontSize="small" />
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
          Quản lý loại phòng
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
        >
          Thêm loại phòng
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Category sx={{ color: "primary.main", mr: 1 }} />
                  <Typography variant={isMobile ? "subtitle1" : "h6"}>
                    Tổng số loại phòng
                  </Typography>
                </Box>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
                  {roomTypes.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Room Types Table/Cards */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        {isMobile ? renderMobileView() : renderDesktopView()}
      </Paper>

      {/* Action Menu for Mobile */}
      <Menu
        anchorEl={actionMenuAnchorEl}
        open={Boolean(actionMenuAnchorEl)}
        onClose={handleCloseActionMenu}
      >
        <MenuItem onClick={() => handleOpenEditDialog(selectedRoomTypeForMenu)}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Chỉnh sửa
        </MenuItem>
        <MenuItem
          onClick={() => handleOpenDeleteConfirm(selectedRoomTypeForMenu)}
        >
          <Delete fontSize="small" sx={{ mr: 1, color: "error.main" }} />
          <Typography color="error">Xóa</Typography>
        </MenuItem>
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
              ? "Thêm loại phòng mới"
              : "Chỉnh sửa loại phòng"}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên loại phòng"
                name="ten_loai_phong"
                value={formData.ten_loai_phong}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Giá qua đêm"
                name="gia_qua_dem"
                value={formData.gia_qua_dem}
                onChange={handleInputChange}
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₫</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Giá giờ đầu"
                name="gia_gio_dau"
                value={formData.gia_gio_dau}
                onChange={handleInputChange}
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₫</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Giá theo giờ"
                name="gia_theo_gio"
                value={formData.gia_theo_gio}
                onChange={handleInputChange}
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₫</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Giá qua ngày"
                name="gia_qua_ngay"
                value={formData.gia_qua_ngay}
                onChange={handleInputChange}
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₫</InputAdornment>
                  ),
                }}
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
            Bạn có chắc chắn muốn xóa loại phòng "
            {roomTypeToDelete?.ten_loai_phong}"?
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
            onClick={handleDeleteRoomType}
            variant="contained"
            color="error"
          >
            Xóa
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

export default RoomTypeManagement;
