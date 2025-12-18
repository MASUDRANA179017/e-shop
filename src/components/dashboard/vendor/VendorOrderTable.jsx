import React, { useState, useEffect } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
  Typography, Box, CircularProgress, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab
} from "@mui/material";
import { FaEye } from "react-icons/fa";
import { getVendorOrders } from "../../../@Services/CheckoutService";
import { getStoreTransactions } from "../../../@Services/PosService";
import { getAllStores } from "../../../@Services/StoreService";
import { getVendorProducts } from "../../../@Services/ProductService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VendorOrderTable() {
    const [orders, setOrders] = useState([]);
    const [onlineOrders, setOnlineOrders] = useState([]);
    const [posOrders, setPosOrders] = useState([]);
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

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
                setOnlineOrders(formattedOnline);
            } catch (e) {
                console.error("Failed to fetch online orders", e);
                toast.error("Failed to load online orders", { position: "top-center", autoClose: 3000 });
            }

            // 2. Fetch POS Transactions
            let formattedPos = [];
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const allStores = await getAllStores();
                // Ensure ID comparison is type-safe
                let myStores = allStores.filter(s => String(s.ownerId || s.owner?.id) === String(user.id));
                
                // Fallback: derive store IDs from vendor products if none found
                if (myStores.length === 0) {
                    const vProducts = await getVendorProducts();
                    const storeIds = Array.from(new Set((vProducts || []).map(p => p.store?.id).filter(Boolean)));
                    myStores = allStores.filter(s => storeIds.includes(s.id));
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

            // Merge and Sort
            const all = [...formattedOnline, ...formattedPos].sort((a, b) => new Date(b.date) - new Date(a.date));
            setOrders(all);

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

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>Order History</Typography>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label={`All (${orders.length})`} />
                <Tab label={`Online (${onlineOrders.length})`} />
                <Tab label={`POS (${posOrders.length})`} />
            </Tabs>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Date</TableCell>
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
                                <TableCell colSpan={7} align="center"><CircularProgress /></TableCell>
                            </TableRow>
                        ) : (tab === 0 ? orders : tab === 1 ? onlineOrders : posOrders).length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No orders found.</TableCell>
                            </TableRow>
                        ) : (tab === 0 ? orders : tab === 1 ? onlineOrders : posOrders).map((order) => (
                            <TableRow key={`${order.source}-${order.id}`}>
                                <TableCell>{order.displayId}</TableCell>
                                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Chip label={order.source} color={order.source === "POS" ? "primary" : "secondary"} size="small" />
                                </TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>${Number(order.total).toFixed(2)}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleView(order)} color="primary"><FaEye /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
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
                                            <TableCell align="right">Quantity</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedOrder.items.map((item, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{item.productName || item.product?.name || "Item"}</TableCell>
                                                <TableCell align="right">{item.quantity}</TableCell>
                                                <TableCell align="right">${Number(item.unitPrice || item.product?.price || 0).toFixed(2)}</TableCell>
                                                <TableCell align="right">${Number(item.totalPrice || 0).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Typography variant="h6">Total: ${Number(selectedOrder.total).toFixed(2)}</Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Box>
    );
}
