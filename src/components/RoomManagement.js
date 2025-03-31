"use client";

import { useState, useEffect } from "react";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomTypes,
} from "../apiService";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Chip,
  Divider,
  Stack,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  Menu,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  KingBed,
  CheckCircle,
  Person,
  CleaningServices,
  MoreVert,
} from "@mui/icons-material";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [newRoom, setNewRoom] = useState({
    so_phong: "",
    so_tang: "",
    loai_phong_id: "",
    trang_thai: "trống",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // "add" or "edit"
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
  const [selectedRoomForMenu, setSelectedRoomForMenu] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch rooms",
        severity: "error",
      });
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await getRoomTypes();
      setRoomTypes(response.data);
    } catch (error) {
      console.error("Error fetching room types:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom({ ...newRoom, [name]: value });
  };

  const handleOpenAddDialog = () => {
    setDialogMode("add");
    setNewRoom({
      so_phong: "",
      so_tang: "",
      loai_phong_id: "",
      trang_thai: "trống",
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (room) => {
    setDialogMode("edit");
    setSelectedRoom(room);
    setNewRoom({
      so_phong: room.so_phong,
      so_tang: room.so_tang,
      loai_phong_id: room.loai_phong_id,
      trang_thai: room.trang_thai,
    });
    setOpenDialog(true);
    handleCloseActionMenu();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === "add") {
        await createRoom(newRoom);
        setSnackbar({
          open: true,
          message: "Room created successfully",
          severity: "success",
        });
      } else {
        await updateRoom(selectedRoom.id, newRoom);
        setSnackbar({
          open: true,
          message: "Room updated successfully",
          severity: "success",
        });
      }
      fetchRooms();
      handleCloseDialog();
      setNewRoom({
        so_phong: "",
        so_tang: "",
        loai_phong_id: "",
        trang_thai: "trống",
      });
    } catch (error) {
      console.error(
        `Error ${dialogMode === "add" ? "creating" : "updating"} room:`,
        error
      );
      setSnackbar({
        open: true,
        message: `Failed to ${dialogMode === "add" ? "create" : "update"} room`,
        severity: "error",
      });
    }
  };

  const handleOpenDeleteConfirm = (room) => {
    setRoomToDelete(room);
    setDeleteConfirmOpen(true);
    handleCloseActionMenu();
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setRoomToDelete(null);
  };

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;

    try {
      await deleteRoom(roomToDelete.id);
      fetchRooms();
      setSnackbar({
        open: true,
        message: "Room deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting room:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete room",
        severity: "error",
      });
    } finally {
      handleCloseDeleteConfirm();
    }
  };

  const handleOpenActionMenu = (event, room) => {
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedRoomForMenu(room);
  };

  const handleCloseActionMenu = () => {
    setActionMenuAnchorEl(null);
    setSelectedRoomForMenu(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getRoomStatusIcon = (status) => {
    switch (status) {
      case "trống":
        return <CheckCircle color="success" />;
      case "đang sử dụng":
        return <Person color="error" />;
      case "đang dọn":
        return <CleaningServices color="warning" />;
      default:
        return null;
    }
  };

  const getRoomStatusColor = (status) => {
    switch (status) {
      case "trống":
        return {
          bg: "success.light",
          color: "success.dark",
        };
      case "đang sử dụng":
        return {
          bg: "error.light",
          color: "error.dark",
        };
      case "đang dọn":
        return {
          bg: "warning.light",
          color: "warning.dark",
        };
      default:
        return {
          bg: "grey.200",
          color: "text.secondary",
        };
    }
  };

  // Get room type name by ID
  const getRoomTypeName = (id) => {
    const roomType = roomTypes.find((type) => type.id === id);
    return roomType ? roomType.ten_loai_phong : "Unknown";
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Quản lý phòng
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
        >
          Thêm phòng mới
        </Button>
      </Box>

      <Grid container spacing={3}>
        {rooms.map((room) => {
          const statusColor = getRoomStatusColor(room.trang_thai);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={room.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <KingBed
                        sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
                          Phòng {room.so_phong}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tầng {room.so_tang}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenActionMenu(e, room)}
                      sx={{ ml: 1 }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Loại phòng
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {getRoomTypeName(room.loai_phong_id) || "Standard"}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Trạng thái
                    </Typography>
                    <Chip
                      icon={getRoomStatusIcon(room.trang_thai)}
                      label={room.trang_thai}
                      size="small"
                      sx={{
                        bgcolor: statusColor.bg,
                        color: statusColor.color,
                        fontWeight: "medium",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchorEl}
        open={Boolean(actionMenuAnchorEl)}
        onClose={handleCloseActionMenu}
      >
        <MenuItem onClick={() => handleOpenEditDialog(selectedRoomForMenu)}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Chỉnh sửa phòng
        </MenuItem>
        <MenuItem onClick={() => handleOpenDeleteConfirm(selectedRoomForMenu)}>
          <Delete fontSize="small" sx={{ mr: 1, color: "error.main" }} />
          <Typography color="error">Xóa phòng</Typography>
        </MenuItem>
      </Menu>

      {/* Add/Edit Room Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" component="div" fontWeight="bold">
            {dialogMode === "add" ? "Add New Room" : "Edit Room"}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 400 }}>
            <TextField
              fullWidth
              label="Room Number"
              name="so_phong"
              value={newRoom.so_phong}
              onChange={handleInputChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Floor"
              name="so_tang"
              value={newRoom.so_tang}
              onChange={handleInputChange}
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel id="room-type-label">Loại phòng</InputLabel>
              <Select
                labelId="room-type-label"
                name="loai_phong_id"
                value={newRoom.loai_phong_id}
                onChange={handleInputChange}
                label="Room Type"
              >
                {roomTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.ten_loai_phong}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="status-label">Trạng thái</InputLabel>
              <Select
                labelId="status-label"
                name="trang_thai"
                value={newRoom.trang_thai}
                onChange={handleInputChange}
                label="Status"
              >
                <MenuItem value="trống">Trống</MenuItem>
                <MenuItem value="đang sử dụng">Đang sử dụng</MenuItem>
                <MenuItem value="đang dọn">Đang dọn</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {dialogMode === "add" ? "Create Room" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            Xác nhận xóa
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bạn có chắc chắn muốn xóa phòng {roomToDelete?.so_phong}?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Lưu ý: hành động không thể hoàn tác
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDeleteConfirm} variant="outlined">
            Hủy
          </Button>
          <Button onClick={handleDeleteRoom} variant="contained" color="error">
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

export default RoomManagement;
