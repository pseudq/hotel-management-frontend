"use client";

import {
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  Chip,
  Button,
  IconButton,
} from "@mui/material";
import { KingBed, MoreVert } from "@mui/icons-material";
import { useTheme } from "@mui/material";

const RoomCard = ({
  room,
  onMenuOpen,
  getRoomStatusIcon,
  getRoomStatusColor,
}) => {
  // eslint-disable-next-line
  const theme = useTheme();
  const statusColor = getRoomStatusColor(room.trang_thai);

  return (
    <Card sx={{ height: "100%", position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={(e) => onMenuOpen(e, room)}
          sx={{ bgcolor: "background.paper", boxShadow: 1 }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Box>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <KingBed sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
              Phòng {room.so_phong}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tầng {room.so_tang} • {room.ten_loai_phong || "Standard"}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 1.5 }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
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
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={(e) => onMenuOpen(e, room)}
          >
            Hành động
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
