import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Grid,
} from "@mui/material";
import {
  KingBed,
  AttachMoney,
  People,
  CalendarToday,
  TrendingUp,
} from "@mui/icons-material";

const DashboardStats = ({ stats }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "primary.light", mr: 2 }}>
                <KingBed />
              </Avatar>
              <Typography variant="h6" color="text.secondary">
                Occupancy Rate
              </Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {stats.occupancyRate}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={stats.occupancyRate}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <TrendingUp sx={{ color: "success.main", mr: 1, fontSize: 16 }} />
              <Typography variant="body2" color="success.main">
                +5.2% from last week
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "success.light", mr: 2 }}>
                <AttachMoney />
              </Avatar>
              <Typography variant="h6" color="text.secondary">
                Revenue
              </Typography>
            </Box>
            <Typography variant="h4" component="div">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(stats.totalRevenue)}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <TrendingUp sx={{ color: "success.main", mr: 1, fontSize: 16 }} />
              <Typography variant="body2" color="success.main">
                +12.5% from last month
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "info.light", mr: 2 }}>
                <People />
              </Avatar>
              <Typography variant="h6" color="text.secondary">
                Customers
              </Typography>
            </Box>
            <Typography variant="h4" component="div">
              {stats.totalCustomers}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <TrendingUp sx={{ color: "success.main", mr: 1, fontSize: 16 }} />
              <Typography variant="body2" color="success.main">
                +8.1% from last month
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "warning.light", mr: 2 }}>
                <CalendarToday />
              </Avatar>
              <Typography variant="h6" color="text.secondary">
                Bookings
              </Typography>
            </Box>
            <Typography variant="h4" component="div">
              {stats.totalBookings}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <TrendingUp sx={{ color: "success.main", mr: 1, fontSize: 16 }} />
              <Typography variant="body2" color="success.main">
                +3.7% from last week
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardStats;
