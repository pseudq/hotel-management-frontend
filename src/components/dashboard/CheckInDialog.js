"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  TextField,
  Box,
  CircularProgress,
  Divider,
  Alert,
  Grid,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  Search,
  PersonAdd,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
// Thêm import useAuth để lấy thông tin người dùng đăng nhập
import { useAuth } from "../../contexts/AuthContext";

const CheckInDialog = ({
  open,
  onClose,
  onSubmit,
  checkInData,
  setCheckInData,
  customers,
  selectedRoom,
  onSearchCustomer,
  onCreateCustomer,
  searchStatus,
  foundCustomer,
  isSearching,
  newCustomerData,
  setNewCustomerData,
  resetForm,
}) => {
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [cccdInput, setCccdInput] = useState("");
  // Thêm useAuth để lấy thông tin người dùng đăng nhập
  const { user } = useAuth();

  // Reset form khi dialog mở
  useEffect(() => {
    if (open) {
      setCccdInput("");
      setShowNewCustomerForm(false);

      // Thêm nhan_vien_id vào checkInData khi dialog mở
      if (user && user.id) {
        setCheckInData((prev) => ({
          ...prev,
          nhan_vien_id: user.id,
        }));
      }
    }
  }, [open, user, setCheckInData]);

  // Hiển thị form tạo khách hàng mới khi không tìm thấy khách hàng
  useEffect(() => {
    if (searchStatus === "not_found") {
      setShowNewCustomerForm(true);
    }
  }, [searchStatus]);

  const handleSearch = () => {
    if (cccdInput.trim()) {
      onSearchCustomer(cccdInput);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCreateCustomer = () => {
    onCreateCustomer(newCustomerData);
  };

  const toggleNewCustomerForm = () => {
    setShowNewCustomerForm(!showNewCustomerForm);
    if (!showNewCustomerForm) {
      // Reset form khi mở
      setNewCustomerData({
        ho_ten: "",
        cmnd: cccdInput, // Tự động điền CCCD đã nhập
        so_dien_thoai: "",
        email: "",
        dia_chi: "",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 3, width: { xs: "100%", sm: "500px" } },
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" component="div" fontWeight="bold">
          Check In
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Phòng {selectedRoom?.so_phong} - Tầng {selectedRoom?.so_tang}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Tìm kiếm khách hàng theo CCCD */}
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Tìm kiếm khách hàng
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                label="Nhập số CCCD/CMND"
                value={cccdInput}
                onChange={(e) => setCccdInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
                placeholder="Nhập số CCCD/CMND để tìm kiếm"
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={!cccdInput.trim() || isSearching}
                startIcon={
                  isSearching ? <CircularProgress size={20} /> : <Search />
                }
              >
                Tìm
              </Button>
            </Box>
          </Box>

          {/* Hiển thị kết quả tìm kiếm */}
          {searchStatus === "found" && foundCustomer && (
            <Alert severity="success" variant="outlined">
              <Typography variant="subtitle2" gutterBottom>
                Đã tìm thấy khách hàng:
              </Typography>
              <Box sx={{ ml: 2 }}>
                <Typography variant="body2">
                  <strong>Họ tên:</strong> {foundCustomer.ho_ten}
                </Typography>
                <Typography variant="body2">
                  <strong>CCCD/CMND:</strong> {foundCustomer.cmnd}
                </Typography>
                <Typography variant="body2">
                  <strong>Số điện thoại:</strong>{" "}
                  {foundCustomer.so_dien_thoai || "Không có"}
                </Typography>
              </Box>
            </Alert>
          )}

          {searchStatus === "not_found" && (
            <Alert severity="info" variant="outlined">
              Không tìm thấy khách hàng với CCCD/CMND này. Vui lòng nhập thông
              tin để tạo khách hàng mới.
            </Alert>
          )}

          {/* Form tạo khách hàng mới */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                mb: 1,
              }}
              onClick={toggleNewCustomerForm}
            >
              <Typography variant="subtitle1" fontWeight="medium">
                {searchStatus === "not_found"
                  ? "Thông tin khách hàng mới"
                  : "Tạo khách hàng mới"}
              </Typography>
              <IconButton size="small">
                {showNewCustomerForm ? (
                  <KeyboardArrowUp />
                ) : (
                  <KeyboardArrowDown />
                )}
              </IconButton>
            </Box>

            <Collapse in={showNewCustomerForm}>
              <Box
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Họ tên"
                      value={newCustomerData.ho_ten}
                      onChange={(e) =>
                        setNewCustomerData({
                          ...newCustomerData,
                          ho_ten: e.target.value,
                        })
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CCCD/CMND"
                      value={newCustomerData.cmnd}
                      onChange={(e) =>
                        setNewCustomerData({
                          ...newCustomerData,
                          cmnd: e.target.value,
                        })
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      value={newCustomerData.so_dien_thoai}
                      onChange={(e) =>
                        setNewCustomerData({
                          ...newCustomerData,
                          so_dien_thoai: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={newCustomerData.email}
                      onChange={(e) =>
                        setNewCustomerData({
                          ...newCustomerData,
                          email: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Địa chỉ"
                      value={newCustomerData.dia_chi}
                      onChange={(e) =>
                        setNewCustomerData({
                          ...newCustomerData,
                          dia_chi: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  {searchStatus !== "found" && (
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PersonAdd />}
                        onClick={handleCreateCustomer}
                        fullWidth
                        disabled={
                          !newCustomerData.ho_ten || !newCustomerData.cmnd
                        }
                      >
                        Tạo khách hàng mới
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Collapse>
          </Box>

          <Divider />

          {/* Ghi chú */}
          <TextField
            fullWidth
            label="Ghi chú"
            name="ghi_chu"
            value={checkInData.ghi_chu}
            onChange={(e) =>
              setCheckInData({ ...checkInData, ghi_chu: e.target.value })
            }
            multiline
            rows={3}
            variant="outlined"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={() => {
            onClose();
            resetForm();
          }}
          variant="outlined"
        >
          Hủy
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={!checkInData.khach_hang_id && searchStatus !== "found"}
        >
          Nhận phòng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckInDialog;
