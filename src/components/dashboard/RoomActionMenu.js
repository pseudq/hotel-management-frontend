"use client";

import { Menu, MenuItem } from "@mui/material";
import { Person, CheckCircle, RoomService, Refresh } from "@mui/icons-material";

const RoomActionMenu = ({
  anchorEl,
  onClose,
  selectedRoom,
  onCheckIn,
  onCheckOut,
  onAddService,
  onMarkAsCleaned,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        elevation: 3,
        sx: { borderRadius: 2, minWidth: 180 },
      }}
    >
      {selectedRoom?.trang_thai === "trống" && (
        <MenuItem onClick={onCheckIn} sx={{ py: 1.5 }}>
          <Person sx={{ mr: 2, fontSize: 20 }} /> Check In
        </MenuItem>
      )}
      {selectedRoom?.trang_thai === "đang sử dụng" && (
        <>
          <MenuItem onClick={onCheckOut} sx={{ py: 1.5 }}>
            <CheckCircle sx={{ mr: 2, fontSize: 20 }} /> Check Out
          </MenuItem>
          <MenuItem onClick={onAddService} sx={{ py: 1.5 }}>
            <RoomService sx={{ mr: 2, fontSize: 20 }} /> Add Services
          </MenuItem>
        </>
      )}
      {selectedRoom?.trang_thai === "đang dọn" && (
        <MenuItem onClick={onMarkAsCleaned} sx={{ py: 1.5 }}>
          <Refresh sx={{ mr: 2, fontSize: 20 }} /> Mark as Cleaned
        </MenuItem>
      )}
    </Menu>
  );
};

export default RoomActionMenu;
