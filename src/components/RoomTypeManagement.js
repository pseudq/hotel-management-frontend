import React, { useState, useEffect } from "react";
import { getRoomTypes, createRoomType, deleteRoomType } from "../apiService";
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

const RoomTypeManagement = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [newRoomType, setNewRoomType] = useState({
    ten_loai_phong: "",
    gia_qua_dem: "",
    gia_gio_dau: "",
    gia_theo_gio: "",
    gia_qua_ngay: "",
  });

  useEffect(() => {
    fetchRoomTypes();
  }, []);

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
    setNewRoomType({ ...newRoomType, [name]: value });
  };

  const handleCreateRoomType = async () => {
    try {
      await createRoomType(newRoomType);
      fetchRoomTypes();
    } catch (error) {
      console.error("Error creating room type:", error);
    }
  };

  const handleDeleteRoomType = async (id) => {
    try {
      await deleteRoomType(id);
      fetchRoomTypes();
    } catch (error) {
      console.error("Error deleting room type:", error);
    }
  };

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h4" gutterBottom>
        Room Type Management
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Room Type Name"
            name="ten_loai_phong"
            value={newRoomType.ten_loai_phong}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Price per Night"
            name="gia_qua_dem"
            value={newRoomType.gia_qua_dem}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="First Hour Price"
            name="gia_gio_dau"
            value={newRoomType.gia_gio_dau}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Hourly Price"
            name="gia_theo_gio"
            value={newRoomType.gia_theo_gio}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Daily Price"
            name="gia_qua_ngay"
            value={newRoomType.gia_qua_ngay}
            onChange={handleInputChange}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateRoomType}
          >
            Create Room Type
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            Room Type List
          </Typography>
          <List>
            {roomTypes.map((roomType) => (
              <ListItem key={roomType.id}>
                <ListItemText
                  primary={roomType.ten_loai_phong}
                  secondary={`Night: ${roomType.gia_qua_dem}, First Hour: ${roomType.gia_gio_dau}, Hourly: ${roomType.gia_theo_gio}, Daily: ${roomType.gia_qua_ngay}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteRoomType(roomType.id)}
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

export default RoomTypeManagement;
