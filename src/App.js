import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import RoomManagement from "./components/RoomManagement";
import RoomTypeManagement from "./components/RoomTypeManagement";
import CustomerManagement from "./components/CustomerManagement";
import BookingManagement from "./components/BookingManagement";
import ServiceManagement from "./components/ServiceManagement";
import InvoiceManagement from "./components/InvoiceManagement";

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Hotel Management
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Rooms
          </Button>
          <Button color="inherit" component={Link} to="/room-types">
            Room Types
          </Button>
          <Button color="inherit" component={Link} to="/customers">
            Customers
          </Button>
          <Button color="inherit" component={Link} to="/bookings">
            Bookings
          </Button>
          <Button color="inherit" component={Link} to="/services">
            Services
          </Button>
          <Button color="inherit" component={Link} to="/invoices">
            Invoices
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<RoomManagement />} />
          <Route path="/room-types" element={<RoomTypeManagement />} />
          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/bookings" element={<BookingManagement />} />
          <Route path="/services" element={<ServiceManagement />} />
          <Route path="/invoices" element={<InvoiceManagement />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
