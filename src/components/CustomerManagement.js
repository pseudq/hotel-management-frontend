"use client";

import { useState, useEffect } from "react";
import { getCustomers, createCustomer } from "../apiService";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Box,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Divider,
  Chip,
  Pagination,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Search,
  Add,
  Person,
  Phone,
  Email,
  Home,
  Clear,
} from "@mui/icons-material";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    ho_ten: "",
    cmnd: "",
    so_dien_thoai: "",
    email: "",
    dia_chi: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const itemsPerPage = 6;

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers(); // eslint-disable-next-line
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data);
      setFilteredCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setSnackbar({
        open: true,
        message: "Lỗi khi tải danh sách khách hàng",
        severity: "error",
      });
    }
  };

  const filterCustomers = () => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers);
      setPage(1);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = customers.filter(
      (customer) =>
        customer.ho_ten.toLowerCase().includes(searchTermLower) ||
        customer.cmnd.toLowerCase().includes(searchTermLower) ||
        (customer.so_dien_thoai &&
          customer.so_dien_thoai.toLowerCase().includes(searchTermLower)) ||
        (customer.email &&
          customer.email.toLowerCase().includes(searchTermLower)) ||
        (customer.dia_chi &&
          customer.dia_chi.toLowerCase().includes(searchTermLower))
    );

    setFilteredCustomers(filtered);
    setPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleCreateCustomer = async () => {
    try {
      // Validate required fields
      if (!newCustomer.ho_ten || !newCustomer.cmnd) {
        setSnackbar({
          open: true,
          message: "Vui lòng nhập họ tên và CCCD",
          severity: "error",
        });
        return;
      }

      await createCustomer(newCustomer);
      fetchCustomers();

      // Reset form
      setNewCustomer({
        ho_ten: "",
        cmnd: "",
        so_dien_thoai: "",
        email: "",
        dia_chi: "",
      });

      setShowAddForm(false);

      setSnackbar({
        open: true,
        message: "Thêm khách hàng thành công",
        severity: "success",
      });
    } catch (error) {
      console.error("Error creating customer:", error);
      setSnackbar({
        open: true,
        message: "Lỗi khi thêm khách hàng",
        severity: "error",
      });
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Calculate pagination
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Quản lý khách hàng
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          Thêm khách hàng
        </Button>
      </Box>

      {/* Search Box */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm theo tên, CCCD, số điện thoại, email hoặc địa chỉ..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={clearSearch} size="small">
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Add Customer Form */}
      {showAddForm && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Thêm khách hàng mới
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Họ tên"
                name="ho_ten"
                value={newCustomer.ho_ten}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CCCD/CMND"
                name="cmnd"
                value={newCustomer.cmnd}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="so_dien_thoai"
                value={newCustomer.so_dien_thoai}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={newCustomer.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="dia_chi"
                value={newCustomer.dia_chi}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowAddForm(false)}
                >
                  Hủy
                </Button>
                <Button variant="contained" onClick={handleCreateCustomer}>
                  Lưu khách hàng
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Customer List */}
      <Box>
        {filteredCustomers.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              {searchTerm
                ? "Không tìm thấy khách hàng phù hợp"
                : "Chưa có khách hàng nào"}
            </Typography>
          </Paper>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Hiển thị{" "}
                {Math.min(filteredCustomers.length, paginatedCustomers.length)}{" "}
                trên {filteredCustomers.length} khách hàng
                {searchTerm && ` cho tìm kiếm "${searchTerm}"`}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {paginatedCustomers.map((customer) => (
                <Grid item xs={12} sm={6} md={4} key={customer.id}>
                  <Card sx={{ height: "100%" }}>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Person
                          sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "medium" }}
                          >
                            {customer.ho_ten}
                          </Typography>
                          <Chip
                            label={customer.cmnd}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </Box>

                      <Divider sx={{ my: 1.5 }} />

                      <Box sx={{ mt: 2 }}>
                        {customer.so_dien_thoai && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Phone
                              fontSize="small"
                              sx={{ mr: 1, color: "text.secondary" }}
                            />
                            <Typography variant="body2">
                              {customer.so_dien_thoai}
                            </Typography>
                          </Box>
                        )}

                        {customer.email && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Email
                              fontSize="small"
                              sx={{ mr: 1, color: "text.secondary" }}
                            />
                            <Typography variant="body2">
                              {customer.email}
                            </Typography>
                          </Box>
                        )}

                        {customer.dia_chi && (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Home
                              fontSize="small"
                              sx={{ mr: 1, color: "text.secondary" }}
                            />
                            <Typography variant="body2">
                              {customer.dia_chi}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerManagement;
