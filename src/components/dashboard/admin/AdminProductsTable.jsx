import React, { useState, useEffect } from "react";
import {
    Table, TableHead, TableBody, TableRow, TableCell,
    TableContainer, Paper, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Button, Box,
    Typography, Snackbar, Alert, CircularProgress, Tooltip,
    InputAdornment
} from "@mui/material";

import { FaEdit, FaTrashAlt, FaSearch, FaRegEye, FaUpload } from "react-icons/fa";
import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../../../@Services/ProductService";
import { getAllStores } from "../../../@Services/StoreService";
import { getAllCategory } from "../../../@Services/CategoryService";
import { uploadImage } from "../../../@Services/uploadService";
import { BiLoader } from "react-icons/bi";


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

    const [uploading, setUploading] = useState(false);

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


    useEffect(() => {
        if (activeProduct) {
            setForm({
                ...activeProduct,
                productGallery:
                    typeof activeProduct.productGallery === "string"
                        ? activeProduct.productGallery.split(",")
                        : activeProduct.productGallery || [],
            });
        }
    }, [activeProduct]);



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

    // Thumbnail upload
    const handleThumbnailUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadImage(file, "products");
            setForm((f) => ({ ...f, productThumbnail: url }));
            setSnack({ open: true, message: "Thumbnail uploaded", severity: "success" });
        } catch (err) {
            setSnack({ open: true, message: "Thumbnail upload failed", severity: "error" });
            console.log(err);
            
        } finally {
            setUploading(false);
        }
    };

    // Gallery upload (multiple files)
    const handleGalleryUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);
        try {
            const urls = await Promise.all(files.map(file => uploadImage(file, "products")));
            setForm((f) => ({ ...f, productGallery: urls }));
            setSnack({ open: true, message: "Gallery uploaded", severity: "success" });
        } catch (err) {
            setSnack({ open: true, message: "Gallery upload failed", severity: "error" });
            console.log(err);
            
        } finally {
            setUploading(false);
        }
    };


    const openAdd = () => {
        setForm({
            name: "",
            description: "",
            price: 0,
            stock: 0,
            productThumbnail: "",
            productGallery: [],
            categoryId: "",
            storeId: "",
            vendor: []
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
            productThumbnail: product.productThumbnail || "",
            productGallery: product.productGallery || [],
            categoryId: Number(product.category?.id) || "",
            storeId: Number(product.store?.id) || "",
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

    const submitAdd = async () => {
        try {
            let thumbnailUrl = form.productThumbnail;
            let galleryUrls = form.productGallery;

            // Upload thumbnail if it's a file
            if (form.productThumbnail instanceof File) {
                thumbnailUrl = await uploadImage(form.productThumbnail, "products");
            }

            // Upload gallery images if they are files
            const uploadedGallery = [];
            for (const file of galleryUrls) {
                if (file instanceof File) {
                    const url = await uploadImage(file, "products");
                    uploadedGallery.push(url);
                } else {
                    uploadedGallery.push(file);
                }
            }

            const payload = {
                name: form.name,
                description: form.description,
                price: Number(form.price),
                stock: Number(form.stock),
                productThumbnail: thumbnailUrl,
                productGallery: uploadedGallery,
                categoryId: Number(form.categoryId),
                storeId: Number(form.storeId),
            };

            const newProduct = await createProduct(payload);
            setProducts((prev) => [...prev, newProduct]);
            setSnack({ open: true, message: "Product added successfully", severity: "success" });
            setAddOpen(false);
        } catch (err) {
            console.error(err);
            setSnack({
                open: true,
                message: err?.response?.data?.message || "Failed to add product",
                severity: "error",
            });
        }
    };

    const submitEdit = async () => {
        try {
            let thumbnailUrl = form.productThumbnail;
            let galleryUrls = form.productGallery;

            if (form.productThumbnail instanceof File) {
                thumbnailUrl = await uploadImage(form.productThumbnail, "products");
            }

            const uploadedGallery = [];
            for (const file of galleryUrls) {
                if (file instanceof File) {
                    const url = await uploadImage(file, "products");
                    uploadedGallery.push(url);
                } else {
                    uploadedGallery.push(file);
                }
            }

            const payload = {
                name: form.name,
                description: form.description,
                price: Number(form.price),
                stock: Number(form.stock),
                productThumbnail: thumbnailUrl,
                productGallery: uploadedGallery,
                categoryId: Number(form.categoryId),
                storeId: Number(form.storeId),
            };

            const updated = await updateProduct(activeProduct.id, payload);
            setProducts((prev) =>
                prev.map((p) => (p.id === activeProduct.id ? updated : p))
            );

            setSnack({ open: true, message: "Product updated successfully", severity: "success" });
            setEditOpen(false);
        } catch (err) {
            console.log(err);
            setSnack({
                open: true,
                message: err?.response?.data?.message || "Failed to update product",
                severity: "error",
            });
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
                                    <TableCell>Thumbnail</TableCell>
                                    <TableCell>Product Gallery</TableCell>
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
                                                    src={product.productThumbnail || "/frontend/products/product01.png"}
                                                    alt={product.name}
                                                    style={{ width: 60, height: 60, borderRadius: 6 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                                    {product.productGallery && product.productGallery.length > 0 ? (
                                                        product.productGallery.map((img, idx) => (
                                                            <img
                                                                key={idx}
                                                                src={img}
                                                                alt={`Gallery ${idx + 1}`}
                                                                style={{ width: 40, height: 40, borderRadius: 4, objectFit: "cover" }}
                                                            />
                                                        ))
                                                    ) : (
                                                        <Typography variant="body2" color="textSecondary">No images</Typography>
                                                    )}
                                                </Box>
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
                            sx={{ mb: 2 }}
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
                            sx={{ mb: 2 }}
                        >
                            <option value="">Select a store</option>
                            {stores.map((store) => (
                                <option key={store.id} value={store.id}>
                                    {store.name}
                                </option>
                            ))}
                        </TextField>

                        {/* Upload Thumbnail */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Button variant="outlined" component="label" startIcon={<FaUpload />}>
                                Upload Thumbnail
                                <input hidden type="file" accept="image/*" onChange={handleThumbnailUpload} />
                            </Button>
                            {uploading && <BiLoader size={20} />}
                        </Box>

                        {form.productThumbnail && (
                            <Box sx={{ textAlign: "center", mt: 2 }}>
                                <img
                                    src={form.productThumbnail}
                                    alt="Thumbnail Preview"
                                    style={{ width: 150, height: 100, borderRadius: 8, objectFit: "cover" }}
                                />
                            </Box>
                        )}

                        {/* Upload Gallery */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
                            <Button variant="outlined" component="label" startIcon={<FaUpload />}>
                                Upload Gallery Images
                                <input hidden type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
                            </Button>
                            {uploading && <BiLoader size={20} />}
                        </Box>

                        {form.productGallery?.length > 0 && (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                                {form.productGallery.map((img, idx) => (
                                    <img key={idx} src={img} alt={`Gallery ${idx}`} style={{ width: 80, height: 80, borderRadius: 8 }} />
                                ))}
                            </Box>
                        )}

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={submitAdd}>Add</Button>
                </DialogActions>
            </Dialog>



            {/* View Dialog */}
            <Dialog
                open={viewOpen}
                onClose={() => setViewOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Product Details</DialogTitle>
                <DialogContent>
                    {activeProduct && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {/* Thumbnail */}
                            <Box>
                                <img
                                    src={activeProduct.productThumbnail || "/frontend/products/product01.png"}
                                    alt={activeProduct.name}
                                    style={{
                                        width: "100%",
                                        height: 250,
                                        objectFit: "cover",
                                        borderRadius: 8,
                                    }}
                                />
                            </Box>

                            {/* Gallery (if available) */}
                            {activeProduct.productGallery?.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                        Gallery:
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                                            gap: 1,
                                        }}
                                    >
                                        {activeProduct.productGallery.map((img, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    borderRadius: 2,
                                                    overflow: "hidden",
                                                    boxShadow: 1,
                                                }}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Gallery ${index + 1}`}
                                                    style={{
                                                        width: "100%",
                                                        height: 100,
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Product Info */}
                            <Typography>
                                <strong>Name:</strong> {activeProduct.name}
                            </Typography>
                            <Typography>
                                <strong>Description:</strong> {activeProduct.description}
                            </Typography>
                            <Typography>
                                <strong>Price:</strong> ${activeProduct.price}
                            </Typography>
                            <Typography>
                                <strong>Stock:</strong> {activeProduct.stock}
                            </Typography>
                            <Typography>
                                <strong>Category:</strong> {activeProduct.category?.name}
                            </Typography>
                            <Typography>
                                <strong>Store:</strong> {activeProduct.store?.name}
                            </Typography>
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
                        {/* --- Text Fields --- */}
                        <TextField label="Name" name="name" value={form.name} onChange={handleFormChange} />
                        <TextField label="Description" name="description" value={form.description} onChange={handleFormChange} />
                        <TextField label="Price" name="price" type="number" value={form.price} onChange={handleFormChange} />
                        <TextField label="Stock" name="stock" type="number" value={form.stock} onChange={handleFormChange} />

                        {/* --- Category --- */}
                        <TextField
                            select
                            label="Category"
                            name="categoryId"
                            value={form.categoryId}
                            onChange={handleFormChange}
                            slotProps={{ select: { native: true } }}
                        >
                            {/* <option value="">Select a category</option> */}
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </TextField>

                        {/* --- Store --- */}
                        <TextField
                            select
                            label="Store"
                            name="storeId"
                            value={form.storeId}
                            onChange={handleFormChange}
                            slotProps={{ select: { native: true } }}
                        >
                            {/* <option value="">Select a store</option> */}
                            {stores.map((store) => (
                                <option key={store.id} value={store.id}>
                                    {store.name}
                                </option>
                            ))}
                        </TextField>

                        {/* --- Thumbnail Upload + Preview --- */}
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">Thumbnail Image</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                                <Button variant="outlined" component="label" startIcon={<FaUpload />}>
                                    {form.productThumbnail ? "Replace Thumbnail" : "Upload Thumbnail"}
                                    <input hidden type="file" accept="image/*" onChange={handleThumbnailUpload} />
                                </Button>
                                {uploading && <BiLoader size={20} />}
                            </Box>

                            {/* Existing Thumbnail Preview */}
                            {form.productThumbnail && (
                                <Box sx={{ mt: 2, textAlign: "center", position: "relative", display: "inline-block" }}>
                                    <img
                                        src={form.productThumbnail}
                                        alt="Thumbnail Preview"
                                        style={{
                                            width: 150,
                                            height: 100,
                                            borderRadius: 8,
                                            objectFit: "cover",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                        }}
                                    />
                                    {/* Remove Thumbnail Button */}
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => setForm((prev) => ({ ...prev, productThumbnail: "" }))}
                                        sx={{
                                            position: "absolute",
                                            top: 4,
                                            right: 4,
                                            minWidth: "auto",
                                            p: 0.5,
                                        }}
                                    >
                                        ✕
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        {/* --- Gallery Upload + Preview --- */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1">Gallery Images</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                                <Button variant="outlined" component="label" startIcon={<FaUpload />}>
                                    Add Gallery Images
                                    <input hidden type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
                                </Button>
                                {uploading && <BiLoader size={20} />}
                            </Box>

                            {/* Existing Gallery Preview */}
                            {form.productGallery?.length > 0 && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 1.5,
                                        mt: 2,
                                    }}
                                >
                                    {form.productGallery.map((img, idx) => (
                                        <Box
                                            key={idx}
                                            sx={{
                                                position: "relative",
                                                borderRadius: 2,
                                                overflow: "hidden",
                                                width: 90,
                                                height: 90,
                                                boxShadow: "0 1px 6px rgba(0,0,0,0.15)",
                                            }}
                                        >
                                            <img
                                                src={img}
                                                alt={`Gallery ${idx}`}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />

                                            {/* Remove button for gallery item */}
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        productGallery: prev.productGallery.filter((_, i) => i !== idx),
                                                    }))
                                                }
                                                sx={{
                                                    position: "absolute",
                                                    top: 2,
                                                    right: 2,
                                                    minWidth: "auto",
                                                    p: 0.3,
                                                    fontSize: "0.8rem",
                                                    background: "rgba(255,0,0,0.7)",
                                                    color: "white",
                                                    "&:hover": { background: "rgba(255,0,0,0.9)" },
                                                }}
                                            >
                                                ✕
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>

                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={submitEdit}>
                        Save
                    </Button>
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
