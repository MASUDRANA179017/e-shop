import React, { useState, useEffect } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
  Typography, Box, CircularProgress, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab
} from "@mui/material";
import { FaEye } from "react-icons/fa";
import { getVendorOrders } from "../../../@Services/CheckoutService";
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
    const [sendOpen, setSendOpen] = useState(false);
    const [sendForm, setSendForm] = useState({ to: "", subject: "", text: "" });
    const [sending, setSending] = useState(false);
    const [myStores, setMyStores] = useState([]);

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
                    customer: o.user ? `${o.user.firstName} ${o.user.lastName}` : "Guest",
                    total: o.totalAmount, 
                    status: "Completed", 
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
                            <TableCell>{order.status}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleView(order)} color="primary"><FaEye /></IconButton>
                                <Button size="small" sx={{ ml: 1 }} variant="outlined" onClick={() => handleContact(order)}>
                                    Contact
                                </Button>
                            </TableCell>
                        </TableRow>
                        )})}
                    </TableBody>
                </Table>
            </TableContainer>

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
                                <strong>Source:</strong> {selectedOrder.source}
                            </Typography>
                            
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
