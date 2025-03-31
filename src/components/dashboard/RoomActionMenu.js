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
  // Prepare menu items based on room status
  const renderMenuItems = () => {
    if (!selectedRoom) return [];

    if (selectedRoom.trang_thai === "trống") {
      return [
        <MenuItem key="checkin" onClick={onCheckIn} sx={{ py: 1.5 }}>
          <Person sx={{ mr: 2, fontSize: 20 }} /> Nhận phòng
        </MenuItem>,
      ];
    } else if (selectedRoom.trang_thai === "đang sử dụng") {
      return [
        <MenuItem key="checkout" onClick={onCheckOut} sx={{ py: 1.5 }}>
          <CheckCircle sx={{ mr: 2, fontSize: 20 }} /> Trả phòng
        </MenuItem>,
        <MenuItem key="addservice" onClick={onAddService} sx={{ py: 1.5 }}>
          <RoomService sx={{ mr: 2, fontSize: 20 }} /> Thêm dịch vụ
        </MenuItem>,
        <MenuItem key="transfer" onClick={onTransferRoom} sx={{ py: 1.5 }}>
          <SwapHoriz sx={{ mr: 2, fontSize: 20 }} /> Chuyển phòng
        </MenuItem>,
      ];
    } else if (selectedRoom.trang_thai === "đang dọn") {
      return [
        <MenuItem key="clean" onClick={onMarkAsCleaned} sx={{ py: 1.5 }}>
          <Refresh sx={{ mr: 2, fontSize: 20 }} /> Đã dọn phòng
        </MenuItem>,
      ];
    }

    return [];
  };

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
      {renderMenuItems()}
    </Menu>
  );
};

export default RoomActionMenu;
