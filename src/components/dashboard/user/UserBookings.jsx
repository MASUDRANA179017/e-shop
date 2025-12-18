import React, { useState, useEffect } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
  Typography, Box, CircularProgress, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import { FaEye, FaCalendarCheck } from "react-icons/fa";
import { getAllOrders } from "../../../@Services/CheckoutService";
import { useCurrency } from "../../../context/CurrencyContext";

const UserBookings = () => {
  const { formatPrice } = useCurrency();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const allOrders = await getAllOrders();
      // Filter for orders that contain serviceDate items
      // If an order has mixed items, we might want to show it here too, or just the service items?
      // For now, if it contains ANY service, we treat it as relevant to Bookings.
      const bookingOrders = allOrders.filter(order => 
        order.items.some(item => item.serviceDate)
      );
      
      setBookings(bookingOrders);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedBooking(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <FaCalendarCheck className="text-blue-600"/> My Bookings
      </h2>
      
      {bookings.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No bookings found.</p>
        </div>
      ) : (
        <TableContainer component={Paper} elevation={0} variant="outlined">
          <Table>
            <TableHead className="bg-blue-50">
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Booked On</TableCell>
                <TableCell>Service Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => {
                 // Find the service date from the items (taking the first one found)
                 const serviceItem = booking.items.find(i => i.serviceDate);
                 const serviceDate = serviceItem ? new Date(serviceItem.serviceDate).toLocaleDateString() : "N/A";

                 return (
                  <TableRow key={booking.id} hover>
                    <TableCell>#{booking.id}</TableCell>
                    <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-bold text-blue-600">{serviceDate}</TableCell>
                    <TableCell className="font-medium">{formatPrice(booking.totalAmount)}</TableCell>
                    <TableCell>
                      <Chip 
                        label="Confirmed" 
                        color="primary" 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => handleViewDetails(booking)}>
                        <FaEye />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                 );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Booking Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>Booking Details #{selectedBooking?.id}</DialogTitle>
        <DialogContent dividers>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Booked On</p>
                  <p className="font-medium">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                </div>
                <div>
                   <p className="text-sm text-gray-500">Total Amount</p>
                   <p className="font-medium text-lg text-blue-600">{formatPrice(selectedBooking.totalAmount)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Service Location/Address</p>
                  <p className="font-medium">{selectedBooking.shippingAddress}</p>
                </div>
              </div>

              <Typography variant="h6" className="mt-4 mb-2">Booked Services</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead className="bg-gray-50">
                    <TableRow>
                      <TableCell>Service Name</TableCell>
                      <TableCell>Service Date</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedBooking.items.filter(i => i.serviceDate).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                            <div>
                                <p className="font-medium">{item.product?.title || "Service"}</p>
                            </div>
                        </TableCell>
                        <TableCell>
                            <span className="font-bold text-blue-600">
                                {new Date(item.serviceDate).toLocaleDateString()}
                            </span>
                        </TableCell>
                        <TableCell align="right">{formatPrice(item.price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

               {/* If there are products in this booking order, show them too? */}
               {selectedBooking.items.some(i => !i.serviceDate) && (
                 <>
                    <Typography variant="h6" className="mt-4 mb-2">Other Items</Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                        <TableHead className="bg-gray-50">
                            <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedBooking.items.filter(i => !i.serviceDate).map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.product?.title || "Product"}</TableCell>
                                <TableCell align="right">{item.quantity}</TableCell>
                                <TableCell align="right">{formatPrice(item.price)}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </TableContainer>
                 </>
               )}

            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserBookings;
