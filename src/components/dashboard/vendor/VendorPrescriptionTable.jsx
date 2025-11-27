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
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { FaEdit, FaTrashAlt, FaSearch, FaUpload } from "react-icons/fa";
import { BiLoader } from "react-icons/bi";

// === YOUR SERVICES HERE ===
import {
  getAllPrescriptions,
  createPrescription,
  updatePrescription,
  deletePrescription,
} from "../../../@Services/PrescriptionService";

import { getAllUsers } from "../../../@Services/authService";

import { getAllProducts } from "../../../@Services/ProductService";

import { uploadImage } from "../../../@Services/uploadService";

export default function VendorPrescriptionTable() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeItem, setActiveItem] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);

  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const prods = await getAllProducts();
      setProductsList(prods);
    }
    fetchProducts();
  }, []);

  const [form, setForm] = useState({
    patientName: "",
    doctorName: "",
    medicine: "",
    note: "",
    imageUrl: "",
  });

  const [snack, setSnack] = useState({
    open: false,
    message: "",
  });

  // Fetch Data
  const loadData = async () => {
    try {
      const data = await getAllPrescriptions();
      setPrescriptions(data);
    } catch (err) {
      setError("Failed to load prescriptions");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Search
  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const filtered = prescriptions.filter((p) => {
      const title = p.title?.toLowerCase() || "";
      const description = p.description?.toLowerCase() || "";
      const advice = p.advice?.toLowerCase() || "";
      const note = p.note?.toLowerCase() || "";

      const ownerName = `${p.owner?.firstName || ""} ${
        p.owner?.lastName || ""
      }`.toLowerCase();

      const productNames = p.products
        ?.map((prod) => prod.name?.toLowerCase() || "")
        .join(" ");

      return (
        title.includes(term) ||
        description.includes(term) ||
        advice.includes(term) ||
        note.includes(term) ||
        ownerName.includes(term) ||
        productNames.includes(term)
      );
    });

    setFilteredPrescriptions(filtered);
  }, [searchTerm, prescriptions]);

  // Form Change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle Product Selection
  const toggleProduct = (product) => {
    setForm((prev) => {
      const products = prev.products || [];
      const exists = products.some((p) => p.id === product.id);
      return {
        ...prev,
        products: exists
          ? products.filter((p) => p.id !== product.id)
          : [...products, product],
      };
    });
  };

  // File Upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const imageUrl = await uploadImage(file, "prescriptions");
      setForm((prev) => ({ ...prev, imageUrl }));

      setSnack({
        open: true,
        message: "Image uploaded successfully",
      });
    } catch (err) {
      setSnack({ open: true, message: "Image upload failed" });
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  // Open Add
  const openAdd = () => {
    const ownersList = getAllUsers();
    setForm({
      title: "",
      description: "",
      note: "",
      advice: "",
      visitingDate: "",
      nextVisitingDate: "",
      owner: [...ownersList],
      products: [...productsList],
    });
    setAddOpen(true);
  };

  // Open Edit
  const openEdit = (item) => {
    setActiveItem(item);
    setForm({
      patientName: item.patientName,
      doctorName: item.doctorName,
      medicine: item.medicine,
      note: item.note,
      imageUrl: item.imageUrl,
    });
    setEditOpen(true);
  };

  // Add
  const submitAdd = async () => {
    try {
      const saved = await createPrescription(form);
      setPrescriptions((prev) => [...prev, saved]);
      setAddOpen(false);
      setSnack({ open: true, message: "Prescription added" });
    } catch {
      setSnack({ open: true, message: "Add failed" });
    }
  };

  // Edit
  const submitEdit = async () => {
    try {
      const updated = await updatePrescription(activeItem.id, form);

      setPrescriptions((prev) =>
        prev.map((p) => (p.id === activeItem.id ? updated : p))
      );

      setEditOpen(false);
      setSnack({ open: true, message: "Updated successfully" });
    } catch {
      setSnack({ open: true, message: "Update failed" });
    }
  };

  // Delete
  const confirmDelete = async () => {
    try {
      await deletePrescription(activeItem.id);

      setPrescriptions((prev) => prev.filter((p) => p.id !== activeItem.id));

      setDeleteOpen(false);
      setSnack({ open: true, message: "Deleted" });
    } catch {
      setSnack({ open: true, message: "Delete failed" });
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Prescription List</Typography>
        <Button variant="contained" onClick={openAdd}>
          Add Prescription
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search patient, doctor, medicine"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FaSearch />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <Paper sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
        <TableContainer>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#eef2ff" }}>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Advice</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Owner</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Products</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Visiting Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Next Visit</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredPrescriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No prescriptions found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrescriptions.map((item, index) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff" : "#f8f9ff",
                        "&:hover": { backgroundColor: "#eef3ff" },
                      }}
                    >
                      <TableCell>{item.id}</TableCell>

                      {/* Title */}
                      <TableCell>{item.title}</TableCell>

                      {/* Advice */}
                      <TableCell>{item.advice}</TableCell>

                      {/* Owner */}
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {item.owner.profileImage && (
                            <img
                              src={item.owner.profileImage}
                              alt={item.owner.firstName}
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          )}
                          <Typography>
                            {item.owner.firstName} {item.owner.lastName}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Products */}
                      <TableCell>
                        {item.products.map((prod) => (
                          <Box
                            key={prod.id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                              p: 1,
                              border: "1px solid #ddd",
                              borderRadius: 1,
                            }}
                          >
                            <img
                              src={prod.productThumbnail}
                              alt={prod.name}
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                {prod.name} (ID: {prod.id})
                              </Typography>
                              <Typography variant="caption">
                                {prod.description}
                              </Typography>
                              <Typography variant="caption">
                                Price: {prod.price} Tk | Stock: {prod.stock} |
                                Expire:{" "}
                                {prod.expireDate
                                  ? new Date(
                                      prod.expireDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </TableCell>

                      {/* Visiting Dates */}
                      <TableCell>
                        {new Date(item.visitingDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(item.nextVisitingDate).toLocaleDateString()}
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() => openEdit(item)}
                          >
                            <FaEdit size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => {
                              setActiveItem(item);
                              setDeleteOpen(true);
                            }}
                          >
                            <FaTrashAlt size={18} />
                          </IconButton>
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

      {/* ADD DIALOG */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Prescription</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
            {/* Prescription Info */}
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleFormChange}
            />
            <TextField
              label="Advice"
              name="advice"
              value={form.advice}
              onChange={handleFormChange}
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleFormChange}
              multiline
            />
            <TextField
              label="Note"
              name="note"
              value={form.note}
              onChange={handleFormChange}
              multiline
            />

            {/* Owner Info */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                label="Owner First Name"
                name="ownerFirstName"
                value={form.owner?.firstName || ""}
                onChange={handleFormChange}
              />
              <TextField
                label="Owner Last Name"
                name="ownerLastName"
                value={form.owner?.lastName || ""}
                onChange={handleFormChange}
              />
            </Box>

            {/* Image Upload */}
            <Button
              variant="outlined"
              component="label"
              startIcon={<FaUpload />}
            >
              Upload Image
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {uploading && <BiLoader size={20} />}
            {form.imageUrl && (
              <Box sx={{ textAlign: "center" }}>
                <img
                  src={form.imageUrl}
                  alt="Prescription"
                  style={{ width: 150, height: 100, borderRadius: 8 }}
                />
              </Box>
            )}

            {/* Product Selection */}
            <Typography variant="subtitle2">Select Products</Typography>
            {productsList.map((prod) => (
              <FormControlLabel
                key={prod.id}
                control={
                  <Checkbox
                    checked={
                      form.products?.some((p) => p.id === prod.id) || false
                    }
                    onChange={() => toggleProduct(prod)}
                  />
                }
                label={`${prod.name} (ID: ${prod.id})`}
              />
            ))}

            {/* Visiting Dates */}
            <TextField
              label="Visiting Date"
              type="date"
              value={form.visitingDate?.slice(0, 10) || ""}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Next Visiting Date"
              type="date"
              value={form.nextVisitingDate?.slice(0, 10) || ""}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitAdd}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Prescription</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
            {/* Same fields as Add dialog */}
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleFormChange}
            />
            <TextField
              label="Advice"
              name="advice"
              value={form.advice}
              onChange={handleFormChange}
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleFormChange}
              multiline
            />
            <TextField
              label="Note"
              name="note"
              value={form.note}
              onChange={handleFormChange}
              multiline
            />

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                label="Owner First Name"
                name="ownerFirstName"
                value={form.owner?.firstName || ""}
                onChange={handleFormChange}
              />
              <TextField
                label="Owner Last Name"
                name="ownerLastName"
                value={form.owner?.lastName || ""}
                onChange={handleFormChange}
              />
            </Box>

            {/* Change Image */}
            <Button
              variant="outlined"
              component="label"
              startIcon={<FaUpload />}
            >
              Change Image
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {uploading && <BiLoader size={20} />}
            {form.imageUrl && (
              <Box sx={{ textAlign: "center" }}>
                <img
                  src={form.imageUrl}
                  alt="Prescription"
                  style={{ width: 150, height: 100, borderRadius: 8 }}
                />
              </Box>
            )}

            {/* Products */}
            <Typography variant="subtitle2">Select Products</Typography>
            {productsList.map((prod) => (
              <FormControlLabel
                key={prod.id}
                control={
                  <Checkbox
                    checked={
                      form.products?.some((p) => p.id === prod.id) || false
                    }
                    onChange={() => toggleProduct(prod)}
                  />
                }
                label={`${prod.name} (ID: ${prod.id})`}
              />
            ))}

            {/* Visiting Dates */}
            <TextField
              label="Visiting Date"
              type="date"
              value={form.visitingDate?.slice(0, 10) || ""}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Next Visiting Date"
              type="date"
              value={form.nextVisitingDate?.slice(0, 10) || ""}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Prescription</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this prescription?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert variant="filled">{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
