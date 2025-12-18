import React, { useState, useEffect } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
  Typography, Box, CircularProgress, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { FaEye, FaFileInvoice } from "react-icons/fa";
import { getVendorOrders, updateOrderStatus } from "../../../@Services/CheckoutService";
import { getStoreTransactions } from "../../../@Services/PosService";
import { getAllStores } from "../../../@Services/StoreService";
import { sendStoreEmail } from "../../../@Services/StoreService";
import { getVendorProducts } from "../../../@Services/ProductService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCurrency } from "../../../context/CurrencyContext";

export default function VendorOrderTable() {
    const { formatPrice } = useCurrency();
    const [productOrders, setProductOrders] = useState([]);
    const [bookingOrders, setBookingOrders] = useState([]);
    const [posOrders, setPosOrders] = useState([]);
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [customerProfileOpen, setCustomerProfileOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerHistory, setCustomerHistory] = useState([]);
    const [sendOpen, setSendOpen] = useState(false);
    const [sendForm, setSendForm] = useState({ to: "", subject: "", text: "" });
    const [sending, setSending] = useState(false);
    const [myStores, setMyStores] = useState([]);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Online Orders
            let formattedOnline = [];
            try {
                const onlineOrders = await getVendorOrders();
                formattedOnline = onlineOrders.map(o => ({
                    id: o.id,
                    displayId: `ORD-${o.id}`,
                    date: o.createdAt,
                    customer: o.customerName || (o.user ? `${o.user.firstName} ${o.user.lastName}` : "Guest"),
                    phone: o.customerPhone,
                    notes: o.notes,
                    shippingAddress: o.shippingAddress,
                    total: o.totalAmount, 
                    status: o.status || "Pending", 
                    source: "Online",
                    items: o.items,
                    raw: o
                }));
            } catch (e) {
                console.error("Failed to fetch online orders", e);
                toast.error("Failed to load online orders", { position: "top-center", autoClose: 3000 });
            }

            // Split Online Orders into Products and Bookings
            const pOrders = formattedOnline.filter(o => !o.items?.some(i => i.serviceDate));
            const bOrders = formattedOnline.filter(o => o.items?.some(i => i.serviceDate));
            
            setProductOrders(pOrders);
            setBookingOrders(bOrders);

            // 2. Fetch POS Transactions
            let formattedPos = [];
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const allStores = await getAllStores();
                // Ensure ID comparison is type-safe
                let myStores = allStores.filter(s => String(s.ownerId || s.owner?.id) === String(user.id));
                setMyStores(myStores);
                
                // Fallback: derive store IDs from vendor products if none found
                if (myStores.length === 0) {
                    const vProducts = await getVendorProducts();
                    const storeIds = Array.from(new Set((vProducts || []).map(p => p.store?.id).filter(Boolean)));
                    myStores = allStores.filter(s => storeIds.includes(s.id));
                    setMyStores(myStores);
                }
                
                let posTransactions = [];
                for (const store of myStores) {
                    try {
                        const trans = await getStoreTransactions(store.id);
                        if (Array.isArray(trans)) {
                            posTransactions = [...posTransactions, ...trans];
                        }
                    } catch (e) {
                        console.error(`Failed to fetch transactions for store ${store.id}`, e);
                        toast.error(`Failed to load POS transactions for store #${store.id}`, { position: "top-center", autoClose: 2500 });
                    }
                }

                formattedPos = posTransactions.map(t => ({
                    id: t.id,
                    displayId: t.transactionNumber || `POS-${t.id}`,
                    date: t.createdAt,
                    customer: t.customer ? `${t.customer.firstName} ${t.customer.lastName}` : "Walk-in",
                    total: t.totalAmount,
                    status: t.status,
                    source: "POS",
                    items: t.items,
                    raw: t
                }));
                setPosOrders(formattedPos);
            } catch (e) {
                console.error("Failed to fetch POS transactions", e);
                toast.error("Failed to load POS transactions", { position: "top-center", autoClose: 3000 });
            }

            // Merge for "All" (if needed, or just derive it)
            // No need to setOrders state if we derive it in render, but let's keep consistency if used elsewhere
            // Actually, let's just use the split states.
            
        } catch (err) {
            console.error("Error fetching orders:", err);
            toast.error("Error fetching order history", { position: "top-center", autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleView = (order) => {
        setSelectedOrder(order);
        setDetailsOpen(true);
    };

    const handleContact = (order) => {
        setSelectedOrder(order);
        const to =
            order.source === "Online"
                ? (order.raw?.user?.email || "")
                : (order.raw?.customer?.email || "");
        const subject = `Regarding your ${order.source} order ${order.displayId}`;
        const text = `Hello ${order.customer},\n\nWe are contacting you about ${order.displayId} placed on ${new Date(order.date).toLocaleDateString()}.\nTotal: ${formatPrice(Number(order.total || 0))}.\n\nThank you,\nVendor`;
        setSendForm({ to, subject, text });
        setSendOpen(true);
    };

    const handleViewCustomer = (order) => {
        // Prepare customer data
        const customerData = {
            name: order.customer,
            email: order.source === "Online" ? (order.raw?.user?.email || "N/A") : (order.raw?.customer?.email || "N/A"),
            phone: order.phone,
            address: order.shippingAddress,
            image: order.raw?.user?.profileImage,
            userId: order.raw?.user?.id
        };
        
        // Filter history for this customer
        // We use email or user ID to match
        const history = [...productOrders, ...bookingOrders].filter(o => {
            if (customerData.userId && o.raw?.user?.id === customerData.userId) return true;
            if (customerData.email !== "N/A" && o.raw?.user?.email === customerData.email) return true;
            return false;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));

        setSelectedCustomer(customerData);
        setCustomerHistory(history);
        setCustomerProfileOpen(true);
    };

    const handlePrintInvoice = (order = selectedOrder) => {
        if (!selectedOrder) return;
        
        const printWindow = window.open('', '_blank');
        const itemsHtml = selectedOrder.items.map(item => `
            <tr>
                <td>
                    ${item.productName || item.product?.name || "Item"}
                    ${item.serviceDate ? `<br><small style="color: #666;">Service Date: ${new Date(item.serviceDate).toLocaleDateString()}</small>` : ''}
                </td>
                <td>${item.quantity}</td>
                <td>${formatPrice(Number(item.unitPrice || item.product?.price || 0))}</td>
                <td>${formatPrice(Number(item.totalPrice || 0))}</td>
            </tr>
        `).join('');

        const content = `
            <html>
            <head>
                <title>Invoice - ${selectedOrder.displayId}</title>
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
                        <span style="font-size: 14px; font-weight: normal; color: #666;">Vendor Portal</span>
                    </div>
                    <div class="invoice-details">
                        <div class="invoice-title">INVOICE</div>
                        <p style="text-align: right; margin: 5px 0;"># ${selectedOrder.displayId}</p>
                        <p style="text-align: right; margin: 0;">Date: ${new Date(selectedOrder.date).toLocaleDateString()}</p>
                    </div>
                </div>
                
                <div class="meta-grid">
                    <div class="meta-box">
                        <h3>Bill To</h3>
                        <p><strong>${selectedOrder.customer}</strong></p>
                        <p>${selectedOrder.phone || ''}</p>
                        <p>${selectedOrder.shippingAddress || ''}</p>
                    </div>
                    <div class="meta-box">
                        <h3>Order Details</h3>
                        <p>Source: ${selectedOrder.source}</p>
                        <p>Status: ${selectedOrder.status}</p>
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
                        <span>${formatPrice(Number(selectedOrder.total || 0))}</span>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Thank you for your business!</p>
                    <p>For questions concerning this invoice, please contact the vendor directly.</p>
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

    const handleSendEmail = async () => {
        if (!myStores[0]) {
            toast.error("No store found for sending email");
            return;
        }
        if (!sendForm.to) {
            toast.error("Recipient email is empty");
            return;
        }
        setSending(true);
        try {
            await sendStoreEmail(myStores[0].id, {
                to: sendForm.to,
                subject: sendForm.subject,
                text: sendForm.text
            });
            toast.success("Message sent");
            setSendOpen(false);
        } catch (e) {
            toast.error(e?.response?.data?.message || "Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'Processing': return 'info';
            case 'Confirmed': return 'primary';
            case 'Shipped': return 'secondary';
            case 'Delivered': return 'success';
            case 'Completed': return 'success';
            case 'Cancelled': return 'error';
            default: return 'default';
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (!selectedOrder) return;
        setStatusUpdateLoading(true);
        try {
            await updateOrderStatus(Number(selectedOrder.id), newStatus);
            toast.success("Order status updated");
            
            // Helper to update list
            const updateList = (list) => list.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o);
            
            setProductOrders(prev => updateList(prev));
            setBookingOrders(prev => updateList(prev));
            
            // Update selected order view
            setSelectedOrder(prev => ({ ...prev, status: newStatus }));
            
            // Refresh data from server to ensure consistency
            fetchData();
        } catch (e) {
            console.error("Status update failed:", e);
            toast.error(e?.response?.data?.message || "Failed to update status");
        } finally {
            setStatusUpdateLoading(false);
        }
    };

    const allOrders = [...productOrders, ...bookingOrders, ...posOrders].sort((a, b) => new Date(b.date) - new Date(a.date));
    const currentList = tab === 0 ? allOrders : tab === 1 ? productOrders : tab === 2 ? bookingOrders : posOrders;

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>Order History</Typography>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label={`All (${allOrders.length})`} />
                <Tab label={`Orders (${productOrders.length})`} />
                <Tab label={`Bookings (${bookingOrders.length})`} />
                <Tab label={`POS (${posOrders.length})`} />
            </Tabs>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>{tab === 2 ? "Booked On" : "Date"}</TableCell>
                            {tab === 2 && <TableCell>Service Date</TableCell>}
                            <TableCell>Source</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center"><CircularProgress /></TableCell>
                            </TableRow>
                        ) : currentList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">No records found.</TableCell>
                            </TableRow>
                        ) : currentList.map((order) => {
                             // Extract service date for booking display
                             let serviceDateDisplay = "-";
                             if (tab === 2 || (tab === 0 && order.items?.some(i => i.serviceDate))) {
                                 const sItem = order.items?.find(i => i.serviceDate);
                                 if (sItem) {
                                     serviceDateDisplay = new Date(sItem.serviceDate).toLocaleDateString();
                                 }
                             }

                            return (
                            <TableRow key={`${order.source}-${order.id}`}>
                                <TableCell>{order.displayId}</TableCell>
                                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                {tab === 2 && (
                                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                        {serviceDateDisplay}
                                    </TableCell>
                                )}
                                <TableCell>
                                    <Chip 
                                      label={order.items?.some(i => i.serviceDate) ? "Booking" : order.source} 
                                      color={order.source === "POS" ? "primary" : order.items?.some(i => i.serviceDate) ? "info" : "secondary"} 
                                      size="small" 
                                    />
                                </TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{formatPrice(Number(order.total || 0))}</TableCell>
                            <TableCell>
                                <Chip 
                                    label={order.status} 
                                    color={getStatusColor(order.status)}
                                    size="small" 
                                />
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleView(order)} color="primary"><FaEye /></IconButton>
                                {order.status === 'Completed' && (
                                    <IconButton 
                                        onClick={() => handlePrintInvoice(order)} 
                                        color="secondary"
                                        title="Print Invoice"
                                        sx={{ ml: 1 }}
                                    >
                                        <FaFileInvoice />
                                    </IconButton>
                                )}
                                <Button size="small" sx={{ ml: 1 }} variant="outlined" onClick={() => handleContact(order)}>
                                    Contact
                                </Button>
                            </TableCell>
                        </TableRow>
                        )})}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Customer Profile Dialog */}
            <Dialog open={customerProfileOpen} onClose={() => setCustomerProfileOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Customer Profile</DialogTitle>
                <DialogContent dividers>
                    {selectedCustomer && (
                        <Box>
                            {/* Header / Basic Info */}
                            <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'center' }}>
                                <Box 
                                    sx={{ 
                                        width: 80, 
                                        height: 80, 
                                        bgcolor: 'primary.main', 
                                        borderRadius: '50%', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '2rem',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {selectedCustomer.image ? (
                                        <img src={selectedCustomer.image} alt={selectedCustomer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        selectedCustomer.name.charAt(0).toUpperCase()
                                    )}
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">{selectedCustomer.name}</Typography>
                                    <Typography color="text.secondary">{selectedCustomer.email}</Typography>
                                    <Chip label="Customer" size="small" color="primary" variant="outlined" sx={{ mt: 1 }} />
                                </Box>
                            </Box>

                            {/* Contact Info Grid */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 4, bgcolor: '#f8f9fa', p: 3, borderRadius: 2 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Phone</Typography>
                                    <Typography variant="body1" fontWeight="medium">{selectedCustomer.phone || "N/A"}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Shipping Address</Typography>
                                    <Typography variant="body1" fontWeight="medium">{selectedCustomer.address || "N/A"}</Typography>
                                </Box>
                            </Box>

                            {/* Order History */}
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FaFileInvoice /> Order History ({customerHistory.length})
                            </Typography>
                            
                            {customerHistory.length > 0 ? (
                                <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Order ID</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Total</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell align="center">Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {customerHistory.map(histOrder => (
                                                <TableRow key={histOrder.id} hover>
                                                    <TableCell>{histOrder.displayId}</TableCell>
                                                    <TableCell>{new Date(histOrder.date).toLocaleDateString()}</TableCell>
                                                    <TableCell>{formatPrice(Number(histOrder.total || 0))}</TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={histOrder.status} 
                                                            size="small" 
                                                            color={getStatusColor(histOrder.status)} 
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <IconButton 
                                                            size="small" 
                                                            color="primary"
                                                            onClick={() => {
                                                                setCustomerProfileOpen(false);
                                                                handleView(histOrder);
                                                            }}
                                                        >
                                                            <FaEye />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography color="text.secondary" align="center" sx={{ py: 3 }}>No order history found.</Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCustomerProfileOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Order Details: {selectedOrder?.displayId}</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <Box>
                             <Typography variant="subtitle1" gutterBottom>
                                <strong>Date:</strong> {new Date(selectedOrder.date).toLocaleString()}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Customer:</strong> {selectedOrder.customer}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Phone:</strong> {selectedOrder.phone || "N/A"}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Address:</strong> {selectedOrder.shippingAddress || "N/A"}
                            </Typography>
                            {selectedOrder.notes && (
                                <Typography variant="subtitle1" gutterBottom sx={{ mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                    <strong>Notes:</strong> {selectedOrder.notes}
                                </Typography>
                            )}
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Source:</strong> {selectedOrder.source}
                            </Typography>
                            
                            {selectedOrder.source === "Online" && (
                                <Box sx={{ mt: 2, mb: 2, p: 2, bgcolor: '#f0f4f8', borderRadius: 1, border: '1px solid #e1e4e8' }}>
                                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: '#555' }}>
                                        Update Status
                                    </Typography>
                                    <FormControl size="small" fullWidth sx={{ bgcolor: 'white' }}>
                                        <InputLabel>Order Status</InputLabel>
                                        <Select
                                            value={selectedOrder.status}
                                            label="Order Status"
                                            onChange={(e) => handleStatusChange(e.target.value)}
                                            disabled={statusUpdateLoading}
                                        >
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="Processing">Processing</MenuItem>
                                            <MenuItem value="Confirmed">Confirmed</MenuItem>
                                            <MenuItem value="Shipped">Shipped</MenuItem>
                                            <MenuItem value="Delivered">Delivered</MenuItem>
                                            <MenuItem value="Completed">Completed</MenuItem>
                                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            )}

                            <TableContainer component={Paper} sx={{ mt: 2 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product</TableCell>
                                            <TableCell align="right">Service Date</TableCell>
                                            <TableCell align="right">Quantity</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedOrder.items.map((item, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{item.productName || item.product?.name || "Item"}</TableCell>
                                                <TableCell align="right">
                                                    {item.serviceDate ? new Date(item.serviceDate).toLocaleString() : "-"}
                                                </TableCell>
                                                <TableCell align="right">{item.quantity}</TableCell>
                                                <TableCell align="right">{formatPrice(Number(item.unitPrice || item.product?.price || 0))}</TableCell>
                                                <TableCell align="right">{formatPrice(Number(item.totalPrice || 0))}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Typography variant="h6">Total: {formatPrice(Number(selectedOrder.total || 0))}</Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button 
                        startIcon={<FaFileInvoice />} 
                        onClick={handlePrintInvoice}
                        color="primary"
                        variant="contained"
                    >
                        Generate Invoice
                    </Button>
                    <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={sendOpen} onClose={() => setSendOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Send Message</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <input
                            className="border border-gray-300 rounded p-2"
                            placeholder="Recipient email"
                            value={sendForm.to}
                            onChange={(e) => setSendForm(prev => ({ ...prev, to: e.target.value }))}
                        />
                        <input
                            className="border border-gray-300 rounded p-2"
                            placeholder="Subject"
                            value={sendForm.subject}
                            onChange={(e) => setSendForm(prev => ({ ...prev, subject: e.target.value }))}
                        />
                        <textarea
                            className="border border-gray-300 rounded p-2 h-32"
                            placeholder="Message"
                            value={sendForm.text}
                            onChange={(e) => setSendForm(prev => ({ ...prev, text: e.target.value }))}
                        />
                        {!sendForm.to && (
                            <Typography variant="caption" color="error">
                                No email available for this customer. For POS Walk-in customers, email may be missing.
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSendOpen(false)}>Cancel</Button>
                    <Button onClick={handleSendEmail} disabled={sending || !sendForm.to} variant="contained">
                        {sending ? "Sending..." : "Send"}
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Box>
    );
}
