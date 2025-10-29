import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, Typography, Snackbar, Alert, CircularProgress,
    Tooltip, InputAdornment
} from "@mui/material";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";

export default function AdminProductsTable() {
    const baseURL = "http://localhost:8000/product";
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeProduct, setActiveProduct] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [form, setForm] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

    // Fetch products on mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter products on search
    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = products.filter((p) =>
            p.name.toLowerCase().includes(term) ||
            (p.category?.name || "").toLowerCase().includes(term) ||
            p.price.toString().includes(term) ||
            (p.vendor?.email || "").toLowerCase().includes(term)
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    // Fetch all products
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("No authentication token found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get(`${baseURL}/getAll`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(res.data || []);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                setError("Session expired. Please log in again.");
            } else {
                setError(err?.response?.data?.message || err.message || "Failed to load products");
            }
        } finally {
            setLoading(false);
        }
    };

    // Open Edit dialog
    const openEdit = (product) => {
        setActiveProduct(product);
        setForm({
            name: product.name || "",
            description: product.description || "",
            price: product.price || 0,
            stock: product.stock || 0,
            image: product.image || "",
            categoryName: product.category?.name || "",
            vendorEmail: product.vendor?.email || "",
            storeName: product.store?.name || "",
        });
        setEditOpen(true);
    };

    // Open Delete dialog
    const openDelete = (product) => {
        setActiveProduct(product);
        setDeleteOpen(true);
    };

    // Handle form changes
    const handleFormChange = (e) => {
        const { name, value, type } = e.target;
        setForm((s) => ({
            ...s,
            [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
        }));
    };

    // Submit Edit
    const submitEdit = async () => {
        if (!activeProduct) return;

        const payload = {
            ...form,
            category: { name: form.categoryName },
            vendor: { email: form.vendorEmail },
            store: { name: form.storeName },
        };

        try {
            const res = await axios.put(`${baseURL}/update/${activeProduct.id}`, payload);
            const updated = res.data || { ...activeProduct, ...payload };
            setProducts((list) => list.map((p) => (p.id === activeProduct.id ? updated : p)));
            setSnack({ open: true, message: "Product updated", severity: "success" });
            setEditOpen(false);
        } catch (err) {
            setSnack({ open: true, message: err?.response?.data?.message || "Update failed", severity: "error" });
        }
    };

    // Confirm Delete
    const confirmDelete = async () => {
        if (!activeProduct) return;

        try {
            await axios.delete(`${baseURL}/delete/${activeProduct.id}`);
            setProducts((list) => list.filter((p) => p.id !== activeProduct.id));
            setSnack({ open: true, message: "Product deleted", severity: "info" });
            setDeleteOpen(false);
        } catch (err) {
            setSnack({ open: true, message: err?.response?.data?.message || "Delete failed", severity: "error" });
        }
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Products List</Typography>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by name, category, price, or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><FaSearch /></InputAdornment> }}
            />

            <Paper>
                <TableContainer>
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>
                    ) : error ? (
                        <Box sx={{ p: 3 }}>
                            <Typography color="error">{error}</Typography>
                            <Button onClick={fetchProducts} sx={{ mt: 1 }}>Retry</Button>
                        </Box>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Vendor</TableCell>
                                    <TableCell>Store</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredProducts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">No products found</TableCell>
                                    </TableRow>
                                )}
                                {filteredProducts.map((product) => (
                                    <TableRow key={product.id} hover>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>
                                            <img
                                                src={product.image || "/frontend/products/product01.png"}
                                                alt={product.name}
                                                style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
                                            />
                                        </TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.category?.name}</TableCell>
                                        <TableCell>{product.vendor?.email}</TableCell>
                                        <TableCell>{product.store?.name}</TableCell>
                                        <TableCell>${product.price}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={() => openEdit(product)}><FaEdit /></IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" onClick={() => openDelete(product)}><FaTrashAlt /></IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
            </Paper>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
                        <TextField label="Name" name="name" value={form.name} onChange={handleFormChange} />
                        <TextField label="Description" name="description" value={form.description} onChange={handleFormChange} />
                        <TextField label="Category" name="categoryName" value={form.categoryName} onChange={handleFormChange} />
                        <TextField label="Vendor Email" name="vendorEmail" value={form.vendorEmail} onChange={handleFormChange} />
                        <TextField label="Store Name" name="storeName" value={form.storeName} onChange={handleFormChange} />
                        <TextField label="Price" name="price" type="number" value={form.price} onChange={handleFormChange} />
                        <TextField label="Stock" name="stock" type="number" value={form.stock} onChange={handleFormChange} />
                        <TextField label="Image URL" name="image" value={form.image} onChange={handleFormChange} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={submitEdit}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Delete Product</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete {activeProduct?.name}?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snack.open}
                autoHideDuration={4000}
                onClose={() => setSnack((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert severity={snack.severity} variant="filled">{snack.message}</Alert>
            </Snackbar>
        </Box>
    );
}
