"use client";

import { useState, useEffect } from "react";
import { getRooms, createRoom, deleteRoom, getRoomTypes } from "../apiService";
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
} from "@mui/material";
import {
  Add,
  Delete,
  KingBed,
  CheckCircle,
  Person,
  CleaningServices,
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

  const handleCreateRoom = async () => {
    try {
      await createRoom(newRoom);
      fetchRooms();
      setOpenDialog(false);
      setNewRoom({
        so_phong: "",
        so_tang: "",
        loai_phong_id: "",
        trang_thai: "trống",
      });
      setSnackbar({
        open: true,
        message: "Room created successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error creating room:", error);
      setSnackbar({
        open: true,
        message: "Failed to create room",
        severity: "error",
      });
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      await deleteRoom(id);
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
    }
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
          onClick={() => setOpenDialog(true)}
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
                          Room {room.so_phong}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Floor {room.so_tang}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteRoom(room.id)}
                      sx={{ ml: 1 }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Room Type
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {room.ten_loai_phong || "Standard"}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Status
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

      {/* Add Room Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" component="div" fontWeight="bold">
            Add New Room
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
              <InputLabel id="room-type-label">Room Type</InputLabel>
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
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="trang_thai"
                value={newRoom.trang_thai}
                onChange={handleInputChange}
                label="Status"
              >
                <MenuItem value="trống">Available</MenuItem>
                <MenuItem value="đang sử dụng">Occupied</MenuItem>
                <MenuItem value="đang dọn">Cleaning</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleCreateRoom} variant="contained">
            Create Room
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
