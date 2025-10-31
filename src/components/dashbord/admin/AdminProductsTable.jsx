import React, { useState, useEffect } from "react";
import {
    Table, TableHead, TableBody, TableRow, TableCell,
    TableContainer, Paper, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Button, Box,
    Typography, Snackbar, Alert, CircularProgress, Tooltip,
    InputAdornment
} from "@mui/material";

import { FaEdit, FaTrashAlt, FaSearch, FaRegEye } from "react-icons/fa";
import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../../../@Services/ProductService";
import { getAllStores } from "../../../@Services/StoreService";
import { getAllCategory } from "../../../@Services/CategoryService";

export default function AdminProductsTable() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeProduct, setActiveProduct] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);

    const [form, setForm] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

    const [categories, setCategories] = useState([]);
    const [stores, setStores] = useState([]);

    // Fetch all products
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getAllProducts();
            setProducts(data || []);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const fetchStores = async () => {
        try {
            const data = await getAllStores();
            setStores(data || []);
        } catch (err) {
            console.error("Failed to fetch Stores", err);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await getAllCategory();
            setCategories(data || []);
        } catch (err) {
            console.error("Failed to fetch Categories", err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchStores();
    }, []);


    // Search filter
    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = products.filter((p) =>
            p.name?.toLowerCase().includes(term) ||
            String(p.price)?.includes(term) ||
            p.category.name?.toLowerCase().includes(term) ||
            p.vendor.FirstName?.toLowerCase().includes(term) ||
            p.store.name?.toLowerCase().includes(term)
            
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);
    // console.log(products);
    

    // Handle form changes
    const handleFormChange = (e) => {
        const { name, value, type } = e.target;

        setForm((s) => ({
            ...s,
            [name]: (name === "storeId" || name === "categoryId") ? Number(value) : type === "number" ? Number(value) : value,
        }));
    };

    const openAdd = () => {
        setForm({
            name: "",
            description: "",
            price: 0,
            stock: 0,
            image: "",
            categoryId: "",
            storeId: "",
            vendor:[]
        });
        setAddOpen(true);
    };

    const openEdit = (product) => {
        setActiveProduct(product);
        setForm({
            name: product.name || "",
            description: product.description || "",
            price: product.price || 0,
            stock: product.stock || 0,
            image: product.image || "",
            categoryId: product.category?.id || "",
            storeId: product.store?.id || "",
        });
        setEditOpen(true);
    };

    const openView = (product) => {
        setActiveProduct(product);
        setViewOpen(true);
    };

    const openDelete = (product) => {
        setActiveProduct(product);
        setDeleteOpen(true);
    };

    // Add product
    const submitAdd = async () => {
        try {
            const newProduct = await createProduct(form, { categoryId: form.categoryId, storeId: form.storeId });
            setProducts((prev) => [...prev, newProduct]);
            setSnack({ open: true, message: "Product added successfully", severity: "success" });
            setAddOpen(false);
        } catch (err) {
            setSnack({ open: true, message: err?.response?.data?.message || "Failed to add product", severity: "error" });
        }
    };

    // Update product
    const submitEdit = async () => {
        try {
            const updated = await updateProduct(activeProduct.id, form);
            setProducts((prev) =>
                prev.map((p) => (p.id === activeProduct.id ? updated : p))
            );
            setSnack({ open: true, message: "Product updated successfully", severity: "success" });
            setEditOpen(false);
        } catch (err) {
            setSnack({ open: true, message: err?.response?.data?.message || "Failed to update product", severity: "error" });
        }
    };

    // Delete product
    const confirmDelete = async () => {
        try {
            await deleteProduct(activeProduct.id);
            setProducts((prev) => prev.filter((p) => p.id !== activeProduct.id));
            setSnack({ open: true, message: "Product deleted successfully", severity: "info" });
            setDeleteOpen(false);
        } catch (err) {
            setSnack({ open: true, message: err?.response?.data?.message || "Failed to delete", severity: "error" });
        }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">Products List</Typography>
                <Button variant="contained" onClick={openAdd}>Add Product</Button>
            </Box>

            <TextField
                fullWidth
                placeholder="Search by name or price"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><FaSearch /></InputAdornment> }}
                sx={{ mb: 2 }}
            />

            <Paper>
                <TableContainer>
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography color="error" sx={{ p: 3 }}>{error}</Typography>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Store Name</TableCell>
                                    <TableCell>Vendor Name</TableCell>
                                    <TableCell>Vendor Email</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredProducts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">No products found</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <TableRow key={product.id} hover>
                                            <TableCell>{product.id}</TableCell>
                                            <TableCell>
                                                <img
                                                    src={product.image || "/frontend/products/product01.png"}
                                                    alt={product.name}
                                                    style={{ width: 60, height: 60, borderRadius: 6 }}
                                                />
                                            </TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>${product.price}</TableCell>
                                            <TableCell>{product.stock}</TableCell>
                                            <TableCell>{product.category.name}</TableCell>
                                            <TableCell>{product.store.name}</TableCell>
                                            <TableCell>{product.vendor.firstName} {product.vendor.lastName}</TableCell>
                                            <TableCell>{product.vendor.email}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="View">
                                                    <IconButton onClick={() => openView(product)}><FaRegEye /></IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <IconButton onClick={() => openEdit(product)}><FaEdit /></IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton onClick={() => openDelete(product)}><FaTrashAlt /></IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
            </Paper>

            {/* Add Product Dialog */}

            <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Product</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
                        <TextField
                            label="Name"
                            name="name"
                            value={form.name}
                            onChange={handleFormChange}
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={form.description}
                            onChange={handleFormChange}
                        />
                        <TextField
                            label="Price"
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleFormChange}
                        />
                        <TextField
                            label="Stock"
                            name="stock"
                            type="number"
                            value={form.stock}
                            onChange={handleFormChange}
                        />

                        {/* Category */}
                        <TextField
                            select
                            label="Category"
                            name="categoryId"
                            value={form.categoryId}
                            onChange={handleFormChange}
                            slotProps={{ select: { native: true } }}
                            sx={{mb:2}}
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </TextField>

                        {/* Store */}
                        <TextField
                            select
                            label="Store"
                            name="storeId"
                            value={form.storeId}
                            onChange={handleFormChange}
                            slotProps={{ select: { native: true } }}
                            sx={{mb:2}}
                        >
                            <option value="">Select a store</option>
                            {stores.map((store) => (
                                <option key={store.id} value={store.id}>
                                    {store.name}
                                </option>
                            ))}
                        </TextField>

                        <TextField
                            label="Image URL"
                            name="image"
                            value={form.image}
                            onChange={handleFormChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={submitAdd}>Add</Button>
                </DialogActions>
            </Dialog>



            {/* View Dialog */}
            <Dialog open={viewOpen} onClose={() => setViewOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Product Details</DialogTitle>
                <DialogContent>
                    {activeProduct && (
                        <Box sx={{ display: "grid", gap: 1 }}>
                            <img
                                src={activeProduct.image || "/frontend/products/product01.png"}
                                alt={activeProduct.name}
                                style={{ width: "100%", borderRadius: 4 }}
                            />
                            <Typography><strong>Name:</strong> {activeProduct.name}</Typography>
                            <Typography><strong>Description:</strong> {activeProduct.description}</Typography>
                            <Typography><strong>Price:</strong> ${activeProduct.price}</Typography>
                            <Typography><strong>Stock:</strong> {activeProduct.stock}</Typography>
                            <Typography><strong>Category:</strong> {activeProduct.category?.name}</Typography>
                            <Typography><strong>Store:</strong> {activeProduct.store?.name}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
                        <TextField
                            label="Name"
                            name="name"
                            value={form.name}
                            onChange={handleFormChange}
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={form.description}
                            onChange={handleFormChange}
                        />
                        <TextField
                            label="Price"
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleFormChange}
                        />
                        <TextField
                            label="Stock"
                            name="stock"
                            type="number"
                            value={form.stock}
                            onChange={handleFormChange}
                        />

                        {/* Category Dropdown */}
                        <TextField
                            select
                            label="Category"
                            name="categoryId"
                            value={form.categoryId || ""}
                            onChange={handleFormChange}
                            slotProps={{ select: { native: true } }}
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </TextField>

                        {/* Store Dropdown */}
                        <TextField
                            select
                            label="Store"
                            name="storeId"
                            value={form.storeId || ""}
                            onChange={handleFormChange}
                            slotProps={{ select: { native: true } }}
                        >
                            <option value="">Select a store</option>
                            {stores.map((store) => (
                                <option key={store.id} value={store.id}>{store.name}</option>
                            ))}
                        </TextField>

                        <TextField
                            label="Image URL"
                            name="image"
                            value={form.image}
                            onChange={handleFormChange}
                        />
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
