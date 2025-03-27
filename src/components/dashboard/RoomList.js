import { Grid, Typography } from "@mui/material";
import RoomCard from "./RoomCard";

const RoomList = ({
  rooms,
  onMenuOpen,
  getRoomStatusIcon,
  getRoomStatusColor,
}) => {
  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Room Management
      </Typography>
      <Grid container spacing={2}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={room.id}>
            <RoomCard
              room={room}
              onMenuOpen={onMenuOpen}
              getRoomStatusIcon={getRoomStatusIcon}
              getRoomStatusColor={getRoomStatusColor}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default RoomList;
