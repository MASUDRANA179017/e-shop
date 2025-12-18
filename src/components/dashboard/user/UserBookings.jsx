import React, { useState, useEffect } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
  Typography, Box, CircularProgress, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import { FaEye, FaCalendarCheck, FaFileInvoice } from "react-icons/fa";
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

  const handlePrintInvoice = () => {
    if (!selectedBooking) return;
    
    const printWindow = window.open('', '_blank');
    const itemsHtml = selectedBooking.items.map(item => `
        <tr>
            <td>
                ${item.product?.title || "Item"}
                ${item.serviceDate ? `<br><small style="color: #666;">Service Date: ${new Date(item.serviceDate).toLocaleDateString()}</small>` : ''}
            </td>
            <td>${item.quantity || 1}</td>
            <td>${formatPrice(item.price)}</td>
            <td>${formatPrice(item.price * (item.quantity || 1))}</td>
        </tr>
    `).join('');

    const content = `
        <html>
        <head>
            <title>Booking Invoice - #${selectedBooking.id}</title>
            <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; }
                .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                .company-name { font-size: 24px; font-weight: bold; color: #2c3e50; }
                .invoice-title { font-size: 32px; font-weight: bold; color: #7f8c8d; text-align: right; }
                .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                .meta-box h3 { margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #7f8c8d; }
                .meta-box p { margin: 0 0 5px 0; font-size: 14px; }
                .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                .table th { background-color: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #eee; font-weight: 600; }
                .table td { padding: 12px; border-bottom: 1px solid #eee; }
                .totals { float: right; width: 300px; }
                .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
                .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #333; margin-top: 10px; padding-top: 10px; }
                .footer { clear: both; margin-top: 60px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="company-name">
                    Service Sell<br>
                    <span style="font-size: 14px; font-weight: normal; color: #666;">Booking Confirmation</span>
                </div>
                <div class="invoice-details">
                    <div class="invoice-title">INVOICE</div>
                    <p style="text-align: right; margin: 5px 0;"># ${selectedBooking.id}</p>
                    <p style="text-align: right; margin: 0;">Date: ${new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            
            <div class="meta-grid">
                <div class="meta-box">
                    <h3>Bill To</h3>
                    <p><strong>${selectedBooking.customerName || "Customer"}</strong></p>
                    <p>${selectedBooking.customerPhone || ''}</p>
                    <p>${selectedBooking.shippingAddress || ''}</p>
                </div>
                <div class="meta-box">
                    <h3>Booking Details</h3>
                    <p>Status: Confirmed</p>
                    ${selectedBooking.notes ? `<p>Notes: ${selectedBooking.notes}</p>` : ''}
                </div>
            </div>

            <table class="table">
                <thead>
                    <tr>
                        <th>Service / Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <div class="totals">
                <div class="total-row total-final">
                    <span>Total</span>
                    <span>${formatPrice(selectedBooking.totalAmount)}</span>
                </div>
            </div>
            
            <div class="footer">
                <p>Thank you for booking with us!</p>
            </div>

            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
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
                        label={booking.status || "Pending"} 
                        color={booking.status === "Completed" ? "success" : booking.status === "Cancelled" ? "error" : "primary"}
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => handleViewDetails(booking)}>
                        <FaEye />
                      </IconButton>
                      {booking.status === 'Completed' && (
                          <IconButton 
                              size="small"
                              color="secondary"
                              onClick={() => handlePrintInvoice(booking)}
                              title="Download Invoice"
                              sx={{ ml: 1 }}
                          >
                              <FaFileInvoice />
                          </IconButton>
                      )}
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
                {selectedBooking.customerPhone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedBooking.customerPhone}</p>
                  </div>
                )}
                {selectedBooking.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="font-medium bg-gray-50 p-2 rounded">{selectedBooking.notes}</p>
                  </div>
                )}
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
          <Button 
            startIcon={<FaFileInvoice />} 
            onClick={handlePrintInvoice}
            color="primary"
            variant="contained"
          >
              Download Invoice
          </Button>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserBookings;
