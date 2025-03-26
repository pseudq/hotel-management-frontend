import React, { useState, useEffect } from "react";
import {
  getBookings,
  createBooking,
  deleteBooking,
  checkoutBooking,
} from "../apiService";
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
import CheckIcon from "@mui/icons-material/Check";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [newBooking, setNewBooking] = useState({
    khach_hang_id: "",
    phong_id: "",
    thoi_gian_vao: "",
    ghi_chu: "",
    trang_thai: "đã nhận",
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getBookings();
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking({ ...newBooking, [name]: value });
  };

  const handleCreateBooking = async () => {
    try {
      await createBooking(newBooking);
      fetchBookings();
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      await deleteBooking(id);
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleCheckoutBooking = async (id) => {
    try {
      await checkoutBooking(id);
      fetchBookings();
    } catch (error) {
      console.error("Error checking out booking:", error);
    }
  };

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h4" gutterBottom>
        Booking Management
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Customer ID"
            name="khach_hang_id"
            value={newBooking.khach_hang_id}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Room ID"
            name="phong_id"
            value={newBooking.phong_id}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Check-in Time"
            name="thoi_gian_vao"
            value={newBooking.thoi_gian_vao}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Notes"
            name="ghi_chu"
            value={newBooking.ghi_chu}
            onChange={handleInputChange}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateBooking}
          >
            Create Booking
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            Booking List
          </Typography>
          <List>
            {bookings.map((booking) => (
              <ListItem key={booking.id}>
                <ListItemText
                  primary={`Customer ID: ${booking.khach_hang_id}, Room ID: ${booking.phong_id}`}
                  secondary={`Check-in: ${booking.thoi_gian_vao}, Status: ${booking.trang_thai}, Notes: ${booking.ghi_chu}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteBooking(booking.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="checkout"
                    onClick={() => handleCheckoutBooking(booking.id)}
                  >
                    <CheckIcon />
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

export default BookingManagement;
