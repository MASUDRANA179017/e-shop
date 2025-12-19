import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

import {
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaPlus
} from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";
import {
  getVendorCategories,
  createVendorCategory,
  updateVendorCategory,
  deleteVendorCategory
} from "../../../@Services/CategoryService";

export default function VendorCategoryTable() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    parentId: "",
    type: "product" // Default to 'product'
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getVendorCategories();
      setCategories(data || []);
      setFilteredCategories(data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleSnackClose = () => {
    setSnack((prev) => ({ ...prev, open: false }));
  };

  const showSnack = (msg, severity = "success") => {
    setSnack({ open: true, message: msg, severity });
  };

  // --- Add Category ---
  const handleAddOpen = () => {
    setForm({ name: "", description: "", parentId: "", type: "product" });
    setAddOpen(true);
  };

  const handleAddClose = () => {
    setAddOpen(false);
  };

  const handleCreateSubmit = async () => {
    if (!form.name) {
      showSnack("Name is required", "error");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        parentId: form.parentId ? parseInt(form.parentId) : null,
        type: form.type
      };
      await createVendorCategory(payload);
      showSnack("Category created successfully!");
      setAddOpen(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to create category";
      showSnack(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Edit Category ---
  const handleEditOpen = (category) => {
    setActiveCategory(category);
    setForm({
      name: category.name,
      description: category.description || "",
      parentId: category.parent ? category.parent.id : "",
      type: category.type || "product"
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setActiveCategory(null);
  };

  const handleEditSubmit = async () => {
    if (!form.name) {
      showSnack("Name is required", "error");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        parentId: form.parentId ? parseInt(form.parentId) : null,
        type: form.type
      };
      await updateVendorCategory(activeCategory.id, payload);
      showSnack("Category updated successfully!");
      setEditOpen(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to update category";
      showSnack(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Delete Category ---
  const handleDeleteOpen = (category) => {
    setActiveCategory(category);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setActiveCategory(null);
  };

  const handleDeleteConfirm = async () => {
    setSubmitting(true);
    try {
      await deleteVendorCategory(activeCategory.id);
      showSnack("Category deleted successfully!");
      setDeleteOpen(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to delete category";
      showSnack(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to filter out self from parent options (to avoid cyclic parent)
  const getParentOptions = (currentId = null) => {
    return categories.filter(c => c.id !== currentId);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          My Categories
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPlus />}
          onClick={handleAddOpen}
          sx={{ textTransform: "none" }}
        >
          Add Category
        </Button>
      </Box>

      {/* Search Bar */}
      <Box display="flex" mb={3} gap={2}>
        <TextField
          label="Search Categories"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <FaSearch color="gray" style={{ marginRight: 8 }} />,
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Parent Category</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description || "-"}</TableCell>
                  <TableCell>{category.type || "product"}</TableCell>
                  <TableCell>
                    {category.parent ? category.parent.name : <span style={{ color: "#aaa" }}>None</span>}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => handleEditOpen(category)}>
                        <FaEdit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteOpen(category)}>
                        <FaTrashAlt />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Dialog */}
      <Dialog open={addOpen} onClose={handleAddClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Category Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={form.type}
              label="Type"
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <MenuItem value="product">Product</MenuItem>
              <MenuItem value="service">Service</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Parent Category (Optional)</InputLabel>
            <Select
              value={form.parentId}
              label="Parent Category (Optional)"
              onChange={(e) => setForm({ ...form, parentId: e.target.value })}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {getParentOptions().map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateSubmit} variant="contained" color="primary" disabled={submitting}>
            {submitting ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Category Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={form.type}
              label="Type"
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <MenuItem value="product">Product</MenuItem>
              <MenuItem value="service">Service</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Parent Category (Optional)</InputLabel>
            <Select
              value={form.parentId}
              label="Parent Category (Optional)"
              onChange={(e) => setForm({ ...form, parentId: e.target.value })}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {getParentOptions(activeCategory?.id).map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary" disabled={submitting}>
            {submitting ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete category <strong>{activeCategory?.name}</strong>?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={submitting}>
            {submitting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackClose} severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
