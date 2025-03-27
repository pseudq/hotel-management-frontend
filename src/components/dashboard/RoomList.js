"use client";

import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RoomCard from "./RoomCard";

const RoomList = ({
  rooms,
  onMenuOpen,
  getRoomStatusIcon,
  getRoomStatusColor,
  selectedFloor,
  onFloorChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [uniqueFloors, setUniqueFloors] = useState([]);

  // Lấy danh sách các tầng duy nhất từ danh sách phòng
  useEffect(() => {
    if (rooms && rooms.length > 0) {
      const floors = [...new Set(rooms.map((room) => room.so_tang))].sort(
        (a, b) => a - b
      );
      setUniqueFloors(floors);
    }
  }, [rooms]);

  // Lọc phòng theo tầng đã chọn
  const filteredRooms =
    selectedFloor === "all"
      ? rooms
      : rooms.filter((room) => room.so_tang === selectedFloor);

  // Hiển thị dropdown cho mobile và toggle buttons cho desktop
  const renderFloorSelector = () => {
    if (isMobile) {
      return (
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel id="floor-select-label">Chọn tầng</InputLabel>
          <Select
            labelId="floor-select-label"
            value={selectedFloor}
            label="Chọn tầng"
            onChange={(e) => onFloorChange(e.target.value)}
          >
            <MenuItem value="all">Tất cả các tầng</MenuItem>
            {uniqueFloors.map((floor) => (
              <MenuItem key={floor} value={floor}>
                Tầng {floor}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    } else {
      return (
        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={selectedFloor}
            exclusive
            onChange={(e, newFloor) => {
              if (newFloor !== null) {
                onFloorChange(newFloor);
              }
            }}
            aria-label="floor selection"
            size="small"
          >
            <ToggleButton value="all" aria-label="all floors">
              Tất cả
            </ToggleButton>
            {uniqueFloors.map((floor) => (
              <ToggleButton
                key={floor}
                value={floor}
                aria-label={`floor ${floor}`}
              >
                Tầng {floor}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      );
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 4,
          mb: 2,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
          Quản lý phòng
        </Typography>
      </Box>

      {renderFloorSelector()}

      <Grid container spacing={2}>
        {filteredRooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={room.id}>
            <RoomCard
              room={room}
              onMenuOpen={onMenuOpen}
              getRoomStatusIcon={getRoomStatusIcon}
              getRoomStatusColor={getRoomStatusColor}
            />
          </Grid>
        ))}

        {filteredRooms.length === 0 && (
          <Grid item xs={12}>
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "background.paper",
                borderRadius: 2,
              }}
            >
              <Typography color="text.secondary">
                Không có phòng nào ở tầng này
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default RoomList;
