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
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  ListItemText,
  Autocomplete,
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
import { getAllStores } from "../../../@Services/StoreService";

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
  const [usersList, setUsersList] = useState([]);
  const [storesList, setStoresList] = useState([]);

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function fetchStores() {
      const stores = await getAllStores();
      setStoresList(stores);
    }
    fetchStores();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      const users = await getAllUsers();
      setUsersList(users);
    }
    fetchUsers();
  }, []);

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

  // OPEN ADD
  const openAdd = () => {
    setForm({
      title: "",
      advice: "",
      description: "",
      note: "",
      storeId: null,
      owner: null,
      products: [],
      visitingDate: "",
      nextVisitingDate: "",
      imageUrl: "",
    });
    setAddOpen(true);
  };

  // OPEN EDIT
  const openEdit = (item) => {
    setActiveItem(item);

    setForm({
      title: item.title || "",
      advice: item.advice || "",
      description: item.description || "",
      note: item.note || "",
      storeId: item.store?.id || null,
      owner: item.owner || null,
      products: item.products || [],
      visitingDate: item.visitingDate || "",
      nextVisitingDate: item.nextVisitingDate || "",
      imageUrl: item.imageUrl || "",
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
                  <TableCell sx={{ fontWeight: 600 }}>Pet Owner</TableCell>
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

            {/* Store id */}
            <Autocomplete
              options={storesList.filter(
                (store) => store.owner?.id === loggedUser.id
              )}
              getOptionLabel={(option) => option.name || ""}
              value={
                storesList.find((store) => store.id === form.storeId) || null
              }
              onChange={(event, newValue) =>
                setForm((prev) => ({ ...prev, storeId: newValue?.id || null }))
              }
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Avatar
                    src={option.imageUrl}
                    alt={option.name}
                    sx={{ width: 30, height: 30 }}
                  />
                  <Typography sx={{ color: "black" }}>{option.name}</Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Select Your Store" />
              )}
            />

            {/* Owner Autocomplete */}
            <Autocomplete
              options={usersList}
              getOptionLabel={(option) =>
                `${option.firstName + " " + option.lastName}` || ""
              }
              value={form.owner || null}
              onChange={(event, newValue) =>
                setForm((prev) => ({ ...prev, owner: newValue }))
              }
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Avatar
                    src={option.profileImage}
                    alt={option.firstName}
                    sx={{ width: 30, height: 30 }}
                  />
                  <Typography sx={{ color: "black" }}>
                    {option.firstName} {option.lastName || "Unnamed"}
                  </Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Select Owner" />
              )}
            />

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
              value={
                form.visitingDate
                  ? new Date(form.visitingDate).toISOString().slice(0, 10)
                  : ""
              }
              onChange={(e) =>
                setForm((prev) => ({ ...prev, visitingDate: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Next Visiting Date"
              type="date"
              value={
                form.nextVisitingDate
                  ? new Date(form.nextVisitingDate).toISOString().slice(0, 10)
                  : ""
              }
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  nextVisitingDate: e.target.value,
                }))
              }
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

            <Autocomplete
              options={usersList}
              getOptionLabel={(option) => option.name || ""}
              value={form.owner || null}
              onChange={(event, newValue) =>
                setForm((prev) => ({ ...prev, owner: newValue }))
              }
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Avatar
                    src={option.profileImage}
                    alt={option.name}
                    sx={{ width: 30, height: 30 }}
                  />
                  <Typography sx={{ color: "black" }}>
                    {option.firstName + " " + option.lastName || "Unnamed"}
                  </Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Select Owner" />
              )}
            />

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

            <TextField
              label="Visiting Date"
              type="date"
              value={
                form.visitingDate
                  ? new Date(form.visitingDate).toISOString().slice(0, 10)
                  : ""
              }
              onChange={(e) =>
                setForm((prev) => ({ ...prev, visitingDate: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Next Visiting Date"
              type="date"
              value={
                form.nextVisitingDate
                  ? new Date(form.nextVisitingDate).toISOString().slice(0, 10)
                  : ""
              }
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  nextVisitingDate: e.target.value,
                }))
              }
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
