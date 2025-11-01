import React, { useState, useEffect } from "react";
import {
    Table, TableHead, TableBody, TableRow, TableCell,
    TableContainer, Paper, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Button, Box,
    Typography, Snackbar, Alert, CircularProgress, Tooltip,
    InputAdornment,
    Switch
} from "@mui/material";

import { FaEdit, FaTrashAlt, FaSearch, FaUpload } from "react-icons/fa";
import { BiLoader } from "react-icons/bi";

import {
    getAllStores,
    createStore,
    updateStore,
    deleteStore,
    toggleOwnerStatus,
} from "../../../@Services/StoreService";

import { uploadImage } from "../../../@Services/uploadService";

export default function AdminStoreTable() {
    const [stores, setStores] = useState([]);
    const [filteredStores, setFilteredStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeStore, setActiveStore] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);

    const [form, setForm] = useState({ name: "", ownerName: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

    const [uploading, setUploading] = useState(false);

    // Fetch stores
    const fetchStores = async () => {
        setLoading(true);
        try {
            const data = await getAllStores();
            setStores(data || []);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load stores");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    // Search filter
    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = stores.filter((s) =>
            s.name?.toLowerCase().includes(term) ||
            s.ownerName?.toLowerCase().includes(term)
        );
        setFilteredStores(filtered);
    }, [searchTerm, stores]);

    // Handle form changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    // Handle File Changes
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            // Upload to "Stores" folder
            const url = await uploadImage(file, "stores");
            setForm((f) => ({ ...f, imageUrl: url }));
            setSnack({ open: true, message: "Image uploaded successfully", severity: "success" });
        } catch (err) {
            setSnack({ open: true, message: "Failed to upload image", severity: "error" });
            console.log(err);

        } finally {
            setUploading(false);
        }
    };

    const openAdd = () => {
        setForm({ name: "", description: "", imageUrl: "" });
        setAddOpen(true);
    };

    const openEdit = (store) => {
        setActiveStore(store);
        setForm({ name: store.name || "", description: store.description || "", imageUrl: store.imageUrl || "" });
        setEditOpen(true);
    };

    const openDelete = (store) => {
        setActiveStore(store);
        setDeleteOpen(true);
    };

    // Add store
    const submitAdd = async () => {
        try {
            const newStore = await createStore(form);
            setStores((prev) => [...prev, newStore]);
            setSnack({ open: true, message: "Store added successfully", severity: "success" });
            setAddOpen(false);
        } catch (err) {
            setSnack({ open: true, message: err?.response?.data?.message || "Failed to add store", severity: "error" });
        }
    };

    // Update store
    const submitEdit = async () => {
        try {
            const updated = await updateStore(activeStore.id, form);
            setStores((prev) =>
                prev.map((s) => (s.id === activeStore.id ? updated : s))
            );
            setSnack({ open: true, message: "Store updated successfully", severity: "success" });
            setEditOpen(false);
        } catch (err) {
            setSnack({ open: true, message: err?.response?.data?.message || "Failed to update store", severity: "error" });
        }
    };

    // Delete store
    const confirmDelete = async () => {
        try {
            await deleteStore(activeStore.id);
            setStores((prev) => prev.filter((s) => s.id !== activeStore.id));
            setSnack({ open: true, message: "Store deleted successfully", severity: "info" });
            setDeleteOpen(false);
        } catch (err) {
            setSnack({ open: true, message: err?.response?.data?.message || "Failed to delete", severity: "error" });
        }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">Stores List</Typography>
                <Button variant="contained" onClick={openAdd}>Add Store</Button>
            </Box>

            <TextField
                fullWidth
                placeholder="Search by store or owner"
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
                                    <TableCell>Description</TableCell>
                                    <TableCell>Owner Name</TableCell>
                                    <TableCell>Owner Email</TableCell>
                                    <TableCell>Owner Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredStores.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">No stores found</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredStores.map((store) => (
                                        <TableRow key={store.id} hover>
                                            <TableCell>{store.id}</TableCell>
                                            <TableCell>
                                                {store.imageUrl ? (
                                                    <img src={store.imageUrl} alt={store.name} style={{ width: 60, height: 40, borderRadius: 6, objectFit: "cover" }} />
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">No Image</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>{store.name}</TableCell>
                                            <TableCell>{store.description}</TableCell>
                                            <TableCell>{store.owner.email}</TableCell>
                                            <TableCell>{store.owner.firstName} {store.owner.lastName}</TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={store.owner.isActive}
                                                    onChange={async (e) => {
                                                        try {
                                                            const updatedOwner = await toggleOwnerStatus(store.owner.id, e.target.checked);
                                                            setStores(prev =>
                                                                prev.map(s =>
                                                                    s.id === store.id
                                                                        ? { ...s, owner: { ...s.owner, isActive: updatedOwner.isActive } }
                                                                        : s
                                                                )
                                                            );
                                                        } catch (err) {
                                                            console.error("Failed to update owner status", err);
                                                        }
                                                    }}
                                                    color="primary"
                                                />

                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Edit">
                                                    <IconButton onClick={() => openEdit(store)}><FaEdit /></IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton onClick={() => openDelete(store)}><FaTrashAlt /></IconButton>
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

            {/* Add Dialog */}
            <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Store</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1, display: "grid", gap: 2 }}>
                        <TextField label="Store Name" name="name" value={form.name} onChange={handleFormChange} fullWidth sx={{ mb: 2 }} />
                        <TextField label="Description" name="description" value={form.description} onChange={handleFormChange} fullWidth />
                        {/* Upload Image */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Button variant="outlined" component="label" startIcon={<FaUpload />}>
                                Upload Image
                                <input hidden type="file" accept="image/*" onChange={handleFileChange} />
                            </Button>
                            {uploading && <BiLoader size={20} />}
                        </Box>

                        {form.imageUrl && (
                            <Box sx={{ textAlign: "center", mt: 2 }}>
                                <img src={form.imageUrl} alt="Preview" style={{ width: 150, height: 100, borderRadius: 8, objectFit: "cover" }} />
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={submitAdd}>Add</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Store</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1, display: "grid", gap: 2 }}>
                        <TextField label="Store Name" name="name" value={form.name} onChange={handleFormChange} fullWidth sx={{ mb: 2 }} />
                        <TextField label="Description" name="description" value={form.description} onChange={handleFormChange} fullWidth sx={{ mb: 2 }} />
                        
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Button variant="outlined" component="label" startIcon={<FaUpload />}>
                                Change Image
                                <input hidden type="file" accept="image/*" onChange={handleFileChange} />
                            </Button>
                            {uploading && <BiLoader size={20} />}
                        </Box>

                        {form.imageUrl && (
                            <Box sx={{ textAlign: "center", mt: 2 }}>
                                <img src={form.imageUrl} alt="Preview" style={{ width: 150, height: 100, borderRadius: 8, objectFit: "cover" }} />
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={submitEdit}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Delete Store</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete "{activeStore?.name}"?</Typography>
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
