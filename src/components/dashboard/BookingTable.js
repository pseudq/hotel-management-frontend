// "use client";

// import { useState } from "react";
// import {
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Box,
//   Chip,
//   TablePagination,
//   IconButton,
//   Tooltip,
//   Card,
//   CardContent,
//   Grid,
//   Divider,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import { Visibility, Receipt } from "@mui/icons-material";
// import { format } from "date-fns";
// import { vi } from "date-fns/locale";

// const BookingTable = ({ bookings, invoices, onViewDetails }) => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   // Kết hợp dữ liệu từ bookings và invoices
//   const combinedData = bookings.map((booking) => {
//     // Tìm hóa đơn tương ứng với booking (nếu có)
//     const invoice = invoices.find((inv) => inv.dat_phong_id === booking.id);
//     return {
//       ...booking,
//       invoice: invoice || null,
//     };
//   });

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(Number.parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const getStatusChip = (status) => {
//     switch (status) {
//       case "đã nhận":
//         return <Chip label="Đang ở" color="primary" size="small" />;
//       case "đã trả":
//         return <Chip label="Đã trả phòng" color="success" size="small" />;
//       case "đặt trước":
//         return <Chip label="Đặt trước" color="warning" size="small" />;
//       default:
//         return <Chip label={status} color="default" size="small" />;
//     }
//   };

//   const formatDate = (dateString) => {
//     try {
//       return format(new Date(dateString), "HH:mm, dd/MM/yyyy", { locale: vi });
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(amount);
//   };

//   // Hiển thị dạng card cho thiết bị di động
//   const renderMobileView = () => {
//     return (
//       <Box>
//         {combinedData
//           .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//           .map((booking, index) => (
//             <Card key={booking.id} sx={{ mb: 2, borderRadius: 2 }}>
//               <CardContent sx={{ p: 2 }}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     mb: 1,
//                   }}
//                 >
//                   <Typography variant="subtitle1" fontWeight="bold">
//                     Phòng {booking.so_phong} (Tầng {booking.so_tang})
//                   </Typography>
//                   {getStatusChip(booking.trang_thai)}
//                 </Box>

//                 <Divider sx={{ my: 1 }} />

//                 <Grid container spacing={1}>
//                   <Grid item xs={5}>
//                     <Typography variant="body2" color="text.secondary">
//                       Khách hàng:
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={7}>
//                     <Typography variant="body2">{booking.ho_ten}</Typography>
//                   </Grid>

//                   <Grid item xs={5}>
//                     <Typography variant="body2" color="text.secondary">
//                       CCCD:
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={7}>
//                     <Typography variant="body2">{booking.cmnd}</Typography>
//                   </Grid>

//                   <Grid item xs={5}>
//                     <Typography variant="body2" color="text.secondary">
//                       Ngày tạo:
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={7}>
//                     <Typography variant="body2">
//                       {formatDate(booking.thoi_gian_vao)}
//                     </Typography>
//                   </Grid>

//                   {booking.trang_thai === "đã trả" && booking.invoice && (
//                     <>
//                       <Grid item xs={5}>
//                         <Typography variant="body2" color="text.secondary">
//                           Tiền thu:
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={7}>
//                         <Typography variant="body2" fontWeight="medium">
//                           {formatCurrency(booking.invoice.tong_tien)}
//                         </Typography>
//                       </Grid>
//                     </>
//                   )}
//                 </Grid>

//                 <Box
//                   sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
//                 >
//                   <Tooltip title="Xem chi tiết">
//                     <IconButton
//                       size="small"
//                       color="primary"
//                       onClick={() => onViewDetails(booking)}
//                       sx={{ mr: 1 }}
//                     >
//                       <Visibility fontSize="small" />
//                     </IconButton>
//                   </Tooltip>

//                   {booking.trang_thai === "đã trả" && (
//                     <Tooltip title="Xem hóa đơn">
//                       <IconButton
//                         size="small"
//                         color="success"
//                         onClick={() => onViewDetails(booking, true)}
//                       >
//                         <Receipt fontSize="small" />
//                       </IconButton>
//                     </Tooltip>
//                   )}
//                 </Box>
//               </CardContent>
//             </Card>
//           ))}
//       </Box>
//     );
//   };

//   // Hiển thị dạng bảng cho desktop
//   const renderDesktopView = () => {
//     return (
//       <TableContainer sx={{ maxHeight: 440 }}>
//         <Table stickyHeader aria-label="sticky table">
//           <TableHead>
//             <TableRow>
//               <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                 STT
//               </TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Tên khách hàng</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Số CCCD</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Phòng</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Ngày tạo</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Tình trạng</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Tiền thu</TableCell>
//               <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                 Thao tác
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {combinedData
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((row, index) => (
//                 <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
//                   <TableCell align="center">
//                     {page * rowsPerPage + index + 1}
//                   </TableCell>
//                   <TableCell>{row.ho_ten}</TableCell>
//                   <TableCell>{row.cmnd}</TableCell>
//                   <TableCell>
//                     {row.so_phong} (Tầng {row.so_tang})
//                   </TableCell>
//                   <TableCell>{formatDate(row.thoi_gian_vao)}</TableCell>
//                   <TableCell>{getStatusChip(row.trang_thai)}</TableCell>
//                   <TableCell>
//                     {row.trang_thai === "đã trả" && row.invoice
//                       ? formatCurrency(row.invoice.tong_tien)
//                       : "-"}
//                   </TableCell>
//                   <TableCell align="center">
//                     <Box sx={{ display: "flex", justifyContent: "center" }}>
//                       <Tooltip title="Xem chi tiết">
//                         <IconButton
//                           size="small"
//                           color="primary"
//                           onClick={() => onViewDetails(row)}
//                         >
//                           <Visibility fontSize="small" />
//                         </IconButton>
//                       </Tooltip>
//                       {row.trang_thai === "đã trả" && (
//                         <Tooltip title="Xem hóa đơn">
//                           <IconButton
//                             size="small"
//                             color="success"
//                             onClick={() => onViewDetails(row, true)}
//                           >
//                             <Receipt fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                       )}
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     );
//   };

//   return (
//     <Paper sx={{ width: "100%", overflow: "hidden", mt: 4 }}>
//       <Typography variant="h5" sx={{ p: 2, pb: 1 }}>
//         Danh sách đặt phòng và hóa đơn
//       </Typography>

//       {isMobile ? renderMobileView() : renderDesktopView()}

//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={combinedData.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         labelRowsPerPage="Số hàng:"
//         labelDisplayedRows={({ from, to, count }) =>
//           `${from}-${to} của ${count}`
//         }
//       />
//     </Paper>
//   );
// };

// export default BookingTable;
