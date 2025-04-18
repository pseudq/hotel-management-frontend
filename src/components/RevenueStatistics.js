"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Divider,
  useTheme,
  LinearProgress,
} from "@mui/material";
import {
  AttachMoney,
  Hotel,
  RoomService,
  Receipt,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { getRevenueStatistics } from "../apiService";

const RevenueStatistics = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("all");
  const [stats, setStats] = useState({
    tong_hoa_don: 0,
    tong_doanh_thu: 0,
    tong_tien_phong: 0,
    tong_tien_dich_vu: 0,
    da_thanh_toan: 0,
    chua_thanh_toan: 0,
  });

  // Format tiền tệ VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Lấy dữ liệu thống kê
  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // Trong thực tế, bạn có thể thêm các tham số để lọc theo thời gian
      const params = {};

      // Thêm logic để lọc theo khoảng thời gian nếu API hỗ trợ
      // if (timeRange === 'today') {
      //   params.from = new Date().toISOString().split('T')[0]
      //   params.to = new Date().toISOString().split('T')[0]
      // } else if (timeRange === 'week') {
      //   const today = new Date()
      //   const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      //   params.from = lastWeek.toISOString().split('T')[0]
      //   params.to = today.toISOString().split('T')[0]
      // } else if (timeRange === 'month') {
      //   const today = new Date()
      //   const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
      //   params.from = lastMonth.toISOString().split('T')[0]
      //   params.to = today.toISOString().split('T')[0]
      // }

      const response = await getRevenueStatistics(params);
      setStats({
        tong_hoa_don: Number.parseInt(response.data.tong_hoa_don) || 0,
        tong_doanh_thu: Number.parseFloat(response.data.tong_doanh_thu) || 0,
        tong_tien_phong: Number.parseFloat(response.data.tong_tien_phong) || 0,
        tong_tien_dich_vu:
          Number.parseFloat(response.data.tong_tien_dich_vu) || 0,
        da_thanh_toan: Number.parseInt(response.data.da_thanh_toan) || 0,
        chua_thanh_toan: Number.parseInt(response.data.chua_thanh_toan) || 0,
      });
    } catch (error) {
      console.error("Error fetching revenue statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  // Tính phần trăm
  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  // Phần trăm doanh thu từ phòng và dịch vụ
  const roomRevenuePercentage = calculatePercentage(
    stats.tong_tien_phong,
    stats.tong_doanh_thu
  );
  const serviceRevenuePercentage = calculatePercentage(
    stats.tong_tien_dich_vu,
    stats.tong_doanh_thu
  );

  // Phần trăm hóa đơn đã thanh toán và chưa thanh toán
  const totalInvoices = stats.da_thanh_toan + stats.chua_thanh_toan;
  const paidPercentage = calculatePercentage(
    stats.da_thanh_toan,
    totalInvoices
  );
  const unpaidPercentage = calculatePercentage(
    stats.chua_thanh_toan,
    totalInvoices
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Thống kê doanh thu
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Khoảng thời gian</InputLabel>
              <Select
                value={timeRange}
                label="Khoảng thời gian"
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="today">Hôm nay</MenuItem>
                <MenuItem value="week">7 ngày qua</MenuItem>
                <MenuItem value="month">30 ngày qua</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              onClick={fetchStatistics}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : "Lọc dữ liệu"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <AttachMoney color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      Tổng doanh thu
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(stats.tong_doanh_thu)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Hotel color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      Tiền phòng
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(stats.tong_tien_phong)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <RoomService color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      Tiền dịch vụ
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(stats.tong_tien_dich_vu)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Receipt color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      Tổng hóa đơn
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.tong_hoa_don}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Phân bổ doanh thu
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box mb={2}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Box display="flex" alignItems="center">
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          bgcolor: theme.palette.primary.main,
                          mr: 1,
                          borderRadius: "50%",
                        }}
                      />
                      <Typography>Tiền phòng</Typography>
                    </Box>
                    <Typography>
                      {formatCurrency(stats.tong_tien_phong)} (
                      {roomRevenuePercentage.toFixed(1)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={roomRevenuePercentage}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: theme.palette.grey[200],
                      "& .MuiLinearProgress-bar": {
                        bgcolor: theme.palette.primary.main,
                      },
                    }}
                  />
                </Box>

                <Box mb={2}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Box display="flex" alignItems="center">
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          bgcolor: theme.palette.secondary.main,
                          mr: 1,
                          borderRadius: "50%",
                        }}
                      />
                      <Typography>Tiền dịch vụ</Typography>
                    </Box>
                    <Typography>
                      {formatCurrency(stats.tong_tien_dich_vu)} (
                      {serviceRevenuePercentage.toFixed(1)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={serviceRevenuePercentage}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: theme.palette.grey[200],
                      "& .MuiLinearProgress-bar": {
                        bgcolor: theme.palette.secondary.main,
                      },
                    }}
                  />
                </Box>

                <Box mt={4} textAlign="center">
                  <Typography variant="h5" fontWeight="bold">
                    Tổng doanh thu: {formatCurrency(stats.tong_doanh_thu)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Trạng thái thanh toán
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box mb={2}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Box display="flex" alignItems="center">
                      <CheckCircle
                        sx={{ color: theme.palette.success.main, mr: 1 }}
                      />
                      <Typography>Đã thanh toán</Typography>
                    </Box>
                    <Typography>
                      {stats.da_thanh_toan} ({paidPercentage.toFixed(1)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={paidPercentage}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: theme.palette.grey[200],
                      "& .MuiLinearProgress-bar": {
                        bgcolor: theme.palette.success.main,
                      },
                    }}
                  />
                </Box>

                <Box mb={2}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Box display="flex" alignItems="center">
                      <Cancel sx={{ color: theme.palette.error.main, mr: 1 }} />
                      <Typography>Chưa thanh toán</Typography>
                    </Box>
                    <Typography>
                      {stats.chua_thanh_toan} ({unpaidPercentage.toFixed(1)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={unpaidPercentage}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: theme.palette.grey[200],
                      "& .MuiLinearProgress-bar": {
                        bgcolor: theme.palette.error.main,
                      },
                    }}
                  />
                </Box>

                <Box mt={4} textAlign="center">
                  <Typography variant="h5" fontWeight="bold">
                    Tổng số hóa đơn: {totalInvoices}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default RevenueStatistics;
