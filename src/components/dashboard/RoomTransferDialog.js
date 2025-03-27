"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";

const RoomTransferDialog = ({
  open,
  onClose,
  onSubmit,
  selectedRoom,
  availableRooms,
  roomTypes,
  currentBooking,
}) => {
  const [targetRoomId, setTargetRoomId] = useState("");
  const [notes, setNotes] = useState("");
  const [showPriceWarning, setShowPriceWarning] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setTargetRoomId("");
      setNotes("");
      setShowPriceWarning(false);
    }
  }, [open]);

  // Check if room types are different when target room changes
  useEffect(() => {
    if (!targetRoomId || !selectedRoom) return;

    const targetRoom = availableRooms.find((room) => room.id === targetRoomId);
    if (!targetRoom) return;

    // Check if room types are different
    if (targetRoom.loai_phong_id !== selectedRoom.loai_phong_id) {
      setShowPriceWarning(true);
    } else {
      setShowPriceWarning(false);
    }
  }, [targetRoomId, selectedRoom, availableRooms]);

  // Get room type name by id
  const getRoomTypeName = (id) => {
    const roomType = roomTypes.find((type) => type.id === id);
    return roomType ? roomType.ten_loai_phong : "Unknown";
  };

  const handleSubmit = () => {
    if (!targetRoomId) return;

    onSubmit({
      targetRoomId,
      notes,
      sourceRoomId: selectedRoom.id,
      bookingId: currentBooking?.id,
    });
  };

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
          Chuyển phòng
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Từ phòng {selectedRoom?.so_phong} (
          {getRoomTypeName(selectedRoom?.loai_phong_id)})
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 2, mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="target-room-label">Chọn phòng mới</InputLabel>
            <Select
              labelId="target-room-label"
              value={targetRoomId}
              label="Chọn phòng mới"
              onChange={(e) => setTargetRoomId(e.target.value)}
            >
              {availableRooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  Phòng {room.so_phong} - Tầng {room.so_tang} -{" "}
                  {getRoomTypeName(room.loai_phong_id)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {showPriceWarning && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Lưu ý: Bạn đang chuyển sang loại phòng khác. Chỉ được chuyển sang
              phòng có giá phòng cao hơn
            </Alert>
          )}

          <TextField
            fullWidth
            label="Ghi chú"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập lý do chuyển phòng"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!targetRoomId}
        >
          Xác nhận chuyển phòng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoomTransferDialog;
