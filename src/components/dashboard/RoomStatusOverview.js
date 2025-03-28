import { Paper, Typography, Grid, Box } from "@mui/material";

const RoomStatusOverview = ({ roomStats }) => {
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Tình trạng phòng
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={6} sm={3}>
          <Box
            sx={{
              textAlign: "center",
              p: 2,
              borderRadius: 2,
              bgcolor: "background.default",
            }}
          >
            <Typography variant="h3" color="text.primary">
              {roomStats.total}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Phòng tổng
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box
            sx={{
              textAlign: "center",
              p: 2,
              borderRadius: 2,
              bgcolor: "success.light",
            }}
          >
            <Typography variant="h3" color="success.dark">
              {roomStats.available}
            </Typography>
            <Typography variant="body1" color="success.dark">
              Trống
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box
            sx={{
              textAlign: "center",
              p: 2,
              borderRadius: 2,
              bgcolor: "error.light",
            }}
          >
            <Typography variant="h3" color="error.dark">
              {roomStats.occupied}
            </Typography>
            <Typography variant="body1" color="error.dark">
              Đang ở
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box
            sx={{
              textAlign: "center",
              p: 2,
              borderRadius: 2,
              bgcolor: "warning.light",
            }}
          >
            <Typography variant="h3" color="warning.dark">
              {roomStats.cleaning}
            </Typography>
            <Typography variant="body1" color="warning.dark">
              Đang dọn
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RoomStatusOverview;
