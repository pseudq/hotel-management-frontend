import React, { useState, useEffect } from "react";
import { getServices, createService, deleteService } from "../apiService";
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

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    ten_dich_vu: "",
    gia: "",
    mo_ta: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await getServices();
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  const handleCreateService = async () => {
    try {
      await createService(newService);
      fetchServices();
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await deleteService(id);
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h4" gutterBottom>
        Service Management
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Service Name"
            name="ten_dich_vu"
            value={newService.ten_dich_vu}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Price"
            name="gia"
            value={newService.gia}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="mo_ta"
            value={newService.mo_ta}
            onChange={handleInputChange}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateService}
          >
            Create Service
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            Service List
          </Typography>
          <List>
            {services.map((service) => (
              <ListItem key={service.id}>
                <ListItemText
                  primary={service.ten_dich_vu}
                  secondary={`Price: ${service.gia}, Description: ${service.mo_ta}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteService(service.id)}
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

export default ServiceManagement;
