"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

const CheckInDialog = ({
  open,
  onClose,
  onSubmit,
  checkInData,
  setCheckInData,
  customers,
  selectedRoom,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" component="div" fontWeight="bold">
          Check In
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Room {selectedRoom?.so_phong}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="customer-select-label">Customer</InputLabel>
            <Select
              labelId="customer-select-label"
              value={checkInData.khach_hang_id}
              label="Customer"
              onChange={(e) =>
                setCheckInData({
                  ...checkInData,
                  khach_hang_id: e.target.value,
                })
              }
            >
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.ho_ten} - {customer.cmnd}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Notes"
            name="ghi_chu"
            value={checkInData.ghi_chu}
            onChange={(e) =>
              setCheckInData({ ...checkInData, ghi_chu: e.target.value })
            }
            multiline
            rows={3}
            variant="outlined"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained">
          Check In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckInDialog;
