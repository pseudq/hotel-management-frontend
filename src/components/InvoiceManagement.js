import React, { useState, useEffect } from "react";
import { getInvoices, updateInvoice } from "../apiService";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await getInvoices();
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const handleUpdateInvoice = async (id) => {
    try {
      const updatedInvoice = {
        trang_thai_thanh_toan: "đã thanh toán",
      };
      await updateInvoice(id, updatedInvoice);
      fetchInvoices();
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý hóa đơn
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Danh sách hóa đơn
          </Typography>
          <List>
            {invoices.map((invoice) => (
              <ListItem key={invoice.id}>
                <ListItemText
                  primary={`Customer ID: ${invoice.khach_hang_id}, Total: ${invoice.tong_tien}`}
                  secondary={`Status: ${invoice.trang_thai_thanh_toan}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="mark as paid"
                    onClick={() => handleUpdateInvoice(invoice.id)}
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

export default InvoiceManagement;
