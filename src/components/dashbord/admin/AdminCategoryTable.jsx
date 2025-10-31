import React, { useState, useEffect } from "react";
import {
    Table, TableHead, TableBody, TableRow, TableCell,
    TableContainer, Paper, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Button, Box,
    Typography, Snackbar, Alert, CircularProgress, Tooltip,
    InputAdornment
} from "@mui/material";

import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import {
    getAllCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../../../@Services/CategoryService";

export default function AdminCategoryTable() {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeCategory, setActiveCategory] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);

    const [form, setForm] = useState({ name: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

    // Fetch categories
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await getAllCategory();
            setCategories(data || []);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Search filter
    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = categories.filter((c) =>
            c.name?.toLowerCase().includes(term) ||
            c.description?.toLowerCase().includes(term)
        );
        setFilteredCategories(filtered);
    }, [searchTerm, categories]);

    // Handle form changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const openAdd = () => {
        setForm({ name: "", description: "" });
        setAddOpen(true);
    };

    const openEdit = (category) => {
        setActiveCategory(category);
        setForm({ name: category.name || "", description: category.description || "" });
        setEditOpen(true);
    };

    const openDelete = (category) => {
        setActiveCategory(category);
        setDeleteOpen(true);
    };

    // Add category
    const submitAdd = async () => {
        try {
            const newCategory = await createCategory(form);
            setCategories((prev) => [...prev, newCategory]);
            setSnack({ open: true, message: "Category added successfully", severity: "success" });
            setAddOpen(false);
        } catch (err) {
            setSnack({ open: true, message: err?.response?.data?.message || "Failed to add category", severity: "error" });
        }
    };

    // Update category
    const submitEdit = async () => {
        try {
            const updated = await updateCategory(activeCategory.id, form);
            setCategories((prev) =>
                prev.map((c) => (c.id === activeCategory.id ? updated : c))
            );
            setSnack({ open: true, message: "Category updated successfully", severity: "success" });
            setEditOpen(false);
        } catch (err) {
            setSnack({ open: true, message: err?.response?.data?.message || "Failed to update category", severity: "error" });
        }
    };

    // Delete category
    const confirmDelete = async () => {
        try {
            await deleteCategory(activeCategory.id);
            setCategories((prev) => prev.filter((c) => c.id !== activeCategory.id));
            setSnack({ open: true, message: "Category deleted successfully", severity: "info" });
            setDeleteOpen(false);
        } catch (err) {
            setSnack({ open: true, message: err?.response?.data?.message || "Failed to delete", severity: "error" });
        }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">Categories List</Typography>
                <Button variant="contained" onClick={openAdd}>Add Category</Button>
            </Box>

            <TextField
                fullWidth
                placeholder="Search by category name"
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
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCategories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">No categories found</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCategories.map((category) => (
                                        <TableRow key={category.id} hover>
                                            <TableCell>{category.id}</TableCell>
                                            <TableCell>{category.name}</TableCell>
                                            <TableCell>{category.description}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Edit">
                                                    <IconButton onClick={() => openEdit(category)}><FaEdit /></IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton onClick={() => openDelete(category)}><FaTrashAlt /></IconButton>
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
                <DialogTitle>Add Category</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1, display: "grid", gap: 2, mt: 1 }}>
                        <TextField label="Name" name="name" value={form.name} onChange={handleFormChange} fullWidth />
                        <TextField label="description" name="description" value={form.description} onChange={handleFormChange} fullWidth />
                    </Box>
                   
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={submitAdd}>Add</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Category</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1, display: "grid", gap: 2, mt: 1 }}>
                        <TextField label="Name" name="name" value={form.name} onChange={handleFormChange} fullWidth />
                        <TextField label="description" name="description" value={form.description} onChange={handleFormChange} fullWidth />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={submitEdit}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete "{activeCategory?.name}"?</Typography>
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
