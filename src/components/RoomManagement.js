import React, { useState, useEffect } from "react";
import { getRooms, createRoom, deleteRoom } from "../apiService";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    so_phong: "",
    so_tang: "",
    loai_phong_id: "",
    trang_thai: "trống",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
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
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      await deleteRoom(id);
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h4" gutterBottom>
        Room Management
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Room Number"
            name="so_phong"
            value={newRoom.so_phong}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Floor"
            name="so_tang"
            value={newRoom.so_tang}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Room Type ID"
            name="loai_phong_id"
            value={newRoom.loai_phong_id}
            onChange={handleInputChange}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateRoom}
          >
            Create Room
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            Room List
          </Typography>
          <List>
            {rooms.map((room) => (
              <ListItem key={room.id}>
                <ListItemText
                  primary={`Room ${room.so_phong} - ${room.ten_loai_phong}`}
                  secondary={`Floor: ${room.so_tang}, Status: ${room.trang_thai}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteRoom(room.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RoomManagement;
