import React, { useState, useEffect } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
  Typography, Box, CircularProgress, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import { FaEye, FaFileInvoice } from "react-icons/fa";
import { getAllOrders } from "../../../@Services/CheckoutService";
import { useCurrency } from "../../../context/CurrencyContext";
import { toast } from "react-toastify";

const UserOrders = () => {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const allOrders = await getAllOrders();
      // Filter for orders that contain ONLY products (no serviceDate in any item)
      // Or primarily products. The requirement is "full separate".
      // If an order has mixed items, it might appear in both or one.
      // Let's assume strict separation: if it has ANY service, it's a booking? 
      // Or maybe list products in Orders and services in Bookings even from same order?
      // Simpler approach: If order has NO serviceDate items, it's an Order.
      const productOrders = allOrders.filter(order => 
        !order.items.some(item => item.serviceDate)
      );
      
      setOrders(productOrders);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      // toast.error("Failed to load orders"); 
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedOrder(null);
  };

  const handlePrintInvoice = () => {
    if (!selectedOrder) return;
    
    const printWindow = window.open('', '_blank');
    const itemsHtml = selectedOrder.items.map(item => `
        <tr>
            <td>${item.product?.title || "Item"}</td>
            <td>${item.quantity}</td>
            <td>${formatPrice(item.price)}</td>
            <td>${formatPrice(item.price * item.quantity)}</td>
        </tr>
    `).join('');

    const content = `
        <html>
        <head>
            <title>Invoice - #${selectedOrder.id}</title>
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
                </div>
                <div class="invoice-details">
                    <div class="invoice-title">INVOICE</div>
                    <p style="text-align: right; margin: 5px 0;"># ${selectedOrder.id}</p>
                    <p style="text-align: right; margin: 0;">Date: ${new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            
            <div class="meta-grid">
                <div class="meta-box">
                    <h3>Bill To</h3>
                    <p><strong>${selectedOrder.customerName || "Customer"}</strong></p>
                    <p>${selectedOrder.customerPhone || ''}</p>
                    <p>${selectedOrder.shippingAddress || ''}</p>
                </div>
                <div class="meta-box">
                    <h3>Order Details</h3>
                    <p>Status: ${selectedOrder.status || "Completed"}</p>
                    ${selectedOrder.notes ? `<p>Notes: ${selectedOrder.notes}</p>` : ''}
                </div>
            </div>

            <table class="table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
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
                    <span>${formatPrice(selectedOrder.totalAmount)}</span>
                </div>
            </div>
            
            <div class="footer">
                <p>Thank you for your order!</p>
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
      <h2 className="text-xl font-bold mb-4 text-gray-800">My Orders</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No orders found.</p>
        </div>
      ) : (
        <TableContainer component={Paper} elevation={0} variant="outlined">
          <Table>
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{formatPrice(order.totalAmount)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status || "Pending"} 
                      color={order.status === "Completed" ? "success" : order.status === "Cancelled" ? "error" : "primary"}
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" onClick={() => handleViewDetails(order)}>
                      <FaEye />
                    </IconButton>
                    {order.status === 'Completed' && (
                        <IconButton 
                            size="small"
                            color="secondary"
                            onClick={() => handlePrintInvoice(order)}
                            title="Download Invoice"
                            sx={{ ml: 1 }}
                        >
                            <FaFileInvoice />
                        </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>Order Details #{selectedOrder?.id}</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                   <p className="text-sm text-gray-500">Total Amount</p>
                   <p className="font-medium text-lg text-blue-600">{formatPrice(selectedOrder.totalAmount)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Shipping Address</p>
                  <p className="font-medium">{selectedOrder.shippingAddress}</p>
                </div>
                {selectedOrder.customerPhone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedOrder.customerPhone}</p>
                  </div>
                )}
                {selectedOrder.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="font-medium bg-gray-50 p-2 rounded">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              <Typography variant="h6" className="mt-4 mb-2">Items</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead className="bg-gray-50">
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                            <div>
                                <p className="font-medium">{item.product?.title || "Product"}</p>
                            </div>
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatPrice(item.price)}</TableCell>
                        <TableCell align="right">{formatPrice(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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

export default UserOrders;
