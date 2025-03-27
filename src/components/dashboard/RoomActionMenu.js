"use client";

import { Menu, MenuItem } from "@mui/material";
import {
  Person,
  CheckCircle,
  RoomService,
  Refresh,
  SwapHoriz,
} from "@mui/icons-material";

const RoomActionMenu = ({
  anchorEl,
  onClose,
  selectedRoom,
  onCheckIn,
  onCheckOut,
  onAddService,
  onMarkAsCleaned,
  onTransferRoom,
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
          <Person sx={{ mr: 2, fontSize: 20 }} /> Nhận phòng
        </MenuItem>
      )}
      {selectedRoom?.trang_thai === "đang sử dụng" && (
        <>
          <MenuItem onClick={onCheckOut} sx={{ py: 1.5 }}>
            <CheckCircle sx={{ mr: 2, fontSize: 20 }} /> Trả phòng
          </MenuItem>
          <MenuItem onClick={onAddService} sx={{ py: 1.5 }}>
            <RoomService sx={{ mr: 2, fontSize: 20 }} /> Thêm dịch vụ
          </MenuItem>
          <MenuItem onClick={onTransferRoom} sx={{ py: 1.5 }}>
            <SwapHoriz sx={{ mr: 2, fontSize: 20 }} /> Chuyển phòng
          </MenuItem>
        </>
      )}
      {selectedRoom?.trang_thai === "đang dọn" && (
        <MenuItem onClick={onMarkAsCleaned} sx={{ py: 1.5 }}>
          <Refresh sx={{ mr: 2, fontSize: 20 }} /> Đã dọn phòng
        </MenuItem>
      )}
    </Menu>
  );
};

export default RoomActionMenu;
