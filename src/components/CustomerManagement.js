import React, { useState, useEffect } from "react";
import { getCustomers, createCustomer, deleteCustomer } from "../apiService";
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

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    ho_ten: "",
    cmnd: "",
    so_dien_thoai: "",
    email: "",
    dia_chi: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleCreateCustomer = async () => {
    try {
      await createCustomer(newCustomer);
      fetchCustomers();
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await deleteCustomer(id);
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h4" gutterBottom>
        Customer Management
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="ho_ten"
            value={newCustomer.ho_ten}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="ID Number"
            name="cmnd"
            value={newCustomer.cmnd}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="so_dien_thoai"
            value={newCustomer.so_dien_thoai}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={newCustomer.email}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Address"
            name="dia_chi"
            value={newCustomer.dia_chi}
            onChange={handleInputChange}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateCustomer}
          >
            Create Customer
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            Customer List
          </Typography>
          <List>
            {customers.map((customer) => (
              <ListItem key={customer.id}>
                <ListItemText
                  primary={customer.ho_ten}
                  secondary={`ID: ${customer.cmnd}, Phone: ${customer.so_dien_thoai}, Email: ${customer.email}, Address: ${customer.dia_chi}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteCustomer(customer.id)}
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

export default CustomerManagement;
