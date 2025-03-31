"use client";

import { useState, useEffect } from "react";
import {
  getServices,
  createService,
  updateService,
  deleteService,
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
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  RoomService,
  AttachMoney,
  MoreVert,
} from "@mui/icons-material";

const ServiceManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // "add" or "edit"
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    ten_dich_vu: "",
    gia: "",
    mo_ta: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null); //eslint-disable-line
  const [selectedServiceForMenu, setSelectedServiceForMenu] = useState(null); //eslint-disable-line
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await getServices();
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      setSnackbar({
        open: true,
        message: "Lỗi khi tải danh sách dịch vụ",
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
      ten_dich_vu: "",
      gia: "",
      mo_ta: "",
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (service) => {
    setDialogMode("edit");
    setSelectedService(service);
    setFormData({
      ten_dich_vu: service.ten_dich_vu,
      gia: service.gia,
      mo_ta: service.mo_ta || "",
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
      if (!formData.ten_dich_vu || !formData.gia) {
        setSnackbar({
          open: true,
          message: "Vui lòng nhập tên dịch vụ và giá",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      if (dialogMode === "add") {
        await createService(formData);
        setSnackbar({
          open: true,
          message: "Thêm dịch vụ thành công",
          severity: "success",
        });
      } else {
        await updateService(selectedService.id, formData);
        setSnackbar({
          open: true,
          message: "Cập nhật dịch vụ thành công",
          severity: "success",
        });
      }

      fetchServices();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving service:", error);
      setSnackbar({
        open: true,
        message: `Lỗi khi ${
          dialogMode === "add" ? "thêm" : "cập nhật"
        } dịch vụ`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteConfirm = (service) => {
    setServiceToDelete(service);
    setDeleteConfirmOpen(true);
    handleCloseActionMenu();
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setServiceToDelete(null);
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    setLoading(true);
    try {
      await deleteService(serviceToDelete.id);
      fetchServices();
      setSnackbar({
        open: true,
        message: "Xóa dịch vụ thành công",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      setSnackbar({
        open: true,
        message: "Lỗi khi xóa dịch vụ",
        severity: "error",
      });
    } finally {
      setLoading(false);
      handleCloseDeleteConfirm();
    }
  };

  const handleOpenActionMenu = (event, service) => {
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedServiceForMenu(service);
  };

  const handleCloseActionMenu = () => {
    setActionMenuAnchorEl(null);
    setSelectedServiceForMenu(null);
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

  // Calculate total revenue if all services were used once
  const totalPotentialRevenue = services.reduce(
    (sum, service) => sum + Number.parseFloat(service.gia || 0),
    0
  );

  // Render mobile view with cards instead of table
  const renderMobileView = () => {
    return (
      <Box>
        {services.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">Chưa có dịch vụ nào</Typography>
          </Paper>
        ) : (
          services.map((service) => (
            <Card key={service.id} sx={{ mb: 2, borderRadius: 2 }}>
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
                      {service.ten_dich_vu}
                    </Typography>
                    <Typography
                      variant="h5"
                      color="primary.main"
                      fontWeight="bold"
                      sx={{ my: 1 }}
                    >
                      {formatCurrency(service.gia)}
                    </Typography>
                    {service.mo_ta && (
                      <Typography variant="body2" color="text.secondary">
                        {service.mo_ta}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenActionMenu(e, service)}
                      sx={{ ml: 1 }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                >
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleOpenEditDialog(service)}
                    sx={{ mr: 1 }}
                  >
                    Sửa
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleOpenDeleteConfirm(service)}
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
        <Table stickyHeader aria-label="services table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                STT
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tên dịch vụ</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Giá
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Mô tả</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">
                    Chưa có dịch vụ nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              services.map((service, index) => (
                <TableRow hover key={service.id}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {service.ten_dich_vu}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(service.gia)}
                  </TableCell>
                  <TableCell>{service.mo_ta || "-"}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEditDialog(service)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDeleteConfirm(service)}
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
          Quản lý dịch vụ
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
        >
          Thêm dịch vụ
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <RoomService sx={{ color: "primary.main", mr: 1 }} />
                  <Typography variant={isMobile ? "subtitle1" : "h6"}>
                    Tổng số dịch vụ
                  </Typography>
                </Box>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
                  {services.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AttachMoney sx={{ color: "success.main", mr: 1 }} />
                  <Typography variant={isMobile ? "subtitle1" : "h6"}>
                    Giá cao nhất
                  </Typography>
                </Box>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
                  {services.length > 0
                    ? formatCurrency(
                        Math.max(
                          ...services.map(
                            (service) => Number.parseFloat(service.gia) || 0
                          )
                        )
                      )
                    : formatCurrency(0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AttachMoney sx={{ color: "info.main", mr: 1 }} />
                  <Typography variant={isMobile ? "subtitle1" : "h6"}>
                    Tổng giá trị
                  </Typography>
                </Box>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
                  {formatCurrency(totalPotentialRevenue)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Services Table/Cards */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        {isMobile ? renderMobileView() : renderDesktopView()}
      </Paper>

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
            {dialogMode === "add" ? "Thêm dịch vụ mới" : "Chỉnh sửa dịch vụ"}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên dịch vụ"
                name="ten_dich_vu"
                value={formData.ten_dich_vu}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Giá"
                name="gia"
                value={formData.gia}
                onChange={handleInputChange}
                type="number"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₫</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                name="mo_ta"
                value={formData.mo_ta}
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
            Bạn có chắc chắn muốn xóa dịch vụ "{serviceToDelete?.ten_dich_vu}"?
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
            onClick={handleDeleteService}
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

export default ServiceManagement;
