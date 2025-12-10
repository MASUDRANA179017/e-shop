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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { FaEdit, FaTrashAlt, FaSearch, FaRegEye } from "react-icons/fa";
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../../../@Services/couponService";

export default function CouponTable() {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [activeCoupon, setActiveCoupon] = useState(null);
  const [search, setSearch] = useState("");

  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const [form, setForm] = useState({
    code: "",
    discountType: "",
    discountValue: "",
    minAmount: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
  });

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // FETCH COUPONS
  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await getAllCoupons();
      setCoupons(data);
      setFilteredCoupons(data);
    } catch (err) {
      console.log(err);
      setSnack({
        open: true,
        message: "Failed to load coupons",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  // SEARCH
  useEffect(() => {
    const term = search.toLowerCase();
    setFilteredCoupons(
      coupons.filter(
        (c) =>
          c.code?.toLowerCase().includes(term) ||
          c.discountType?.toLowerCase().includes(term) ||
          String(c.discountValue)?.includes(term)
      )
    );
  }, [search, coupons]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: Array.isArray(value) ? value : value,
    }));
  };

  const openAddDialog = () => {
    setForm({
      code: "",
      discountType: "",
      discountValue: "",
      minAmount: "",
      maxDiscount: "",
      startDate: "",
      endDate: "",
    });
    setOpenAdd(true);
  };

  const openEditDialog = (coupon) => {
    setActiveCoupon(coupon);
    setForm(coupon);
    setOpenEdit(true);
  };

  const openDeleteDialog = (coupon) => {
    setActiveCoupon(coupon);
    setOpenDelete(true);
  };

  const openViewDialog = (coupon) => {
    setActiveCoupon(coupon);
    setOpenView(true);
  };

  // CREATE
  const handleAdd = async () => {
    try {
      const payload = {
        ...form,
        productIds: form.products?.map((p) => p.id) || [],
        categoryIds: form.categories?.map((c) => c.id) || [],
      };

      const newCoupon = await createCoupon(payload);
      setCoupons((prev) => [...prev, newCoupon]);
      setSnack({ open: true, message: "Coupon created!", severity: "success" });
      setOpenAdd(false);
    } catch (err) {
      console.log(err);
      setSnack({
        open: true,
        message: "Failed to create coupon",
        severity: "error",
      });
    }
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      const payload = {
        ...form,
        productIds: form.products?.map((p) => p.id) || [],
        categoryIds: form.categories?.map((c) => c.id) || [],
      };

      const updated = await updateCoupon(activeCoupon.id, payload);
      setCoupons((prev) =>
        prev.map((c) => (c.id === activeCoupon.id ? updated : c))
      );
      setSnack({
        open: true,
        message: "Coupon updated!",
        severity: "success",
      });
      setOpenEdit(false);
    } catch (err) {
      console.log(err);
      setSnack({
        open: true,
        message: "Failed to update coupon",
        severity: "error",
      });
    }
  };

  // DELETE
  const handleDelete = async () => {
    try {
      await deleteCoupon(activeCoupon.id);
      setCoupons((prev) => prev.filter((c) => c.id !== activeCoupon.id));
      setSnack({
        open: true,
        message: "Coupon deleted!",
        severity: "info",
      });
      setOpenDelete(false);
    } catch (err) {
      console.log(err);
      setSnack({
        open: true,
        message: "Delete failed",
        severity: "error",
      });
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Coupons</Typography>
        <Button variant="contained" onClick={openAddDialog}>
          Add Coupon
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search coupons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FaSearch />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {/* Table */}
      <Paper>
        <TableContainer>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Store name</TableCell>
                  <TableCell>Category Service</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredCoupons.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.code}</TableCell>
                    <TableCell>{c.discountType}</TableCell>
                    <TableCell>{c.discountValue}</TableCell>
                    <TableCell>{c.store?.name}</TableCell>
                    <TableCell>
                      {c.categories?.length
                        ? c.categories.map((cat) => cat.name).join(", ")
                        : c.products?.length
                        ? c.products.map((p) => p.name).join(", ")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {c.expiresAt
                        ? new Date(c.expiresAt).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="View">
                        <IconButton onClick={() => openViewDialog(c)}>
                          <FaRegEye />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit">
                        <IconButton onClick={() => openEditDialog(c)}>
                          <FaEdit />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton onClick={() => openDeleteDialog(c)}>
                          <FaTrashAlt />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>

      {/* Dialogs */}
      {/* ADD / EDIT DIALOG */}
      <Dialog
        open={openAdd || openEdit}
        onClose={() => {}}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {openAdd ? "Add Coupon" : "Edit Coupon"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          {/* Coupon Code */}
          <TextField
            name="code"
            label="Coupon Code"
            value={form.code}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />

          {/* Discount Type */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="discountType-label">Discount Type</InputLabel>
            <Select
              labelId="discountType-label"
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              label="Discount Type"
            >
              <MenuItem value="PERCENTAGE">Percentage</MenuItem>
              <MenuItem value="FIXED">Fixed</MenuItem>
            </Select>
          </FormControl>

          {/* Discount Value */}
          <TextField
            name="discountValue"
            label="Discount Value"
            type="number"
            value={form.discountValue}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />

          {/* Products Multi-Select */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="products-label">Products</InputLabel>
            <Select
              labelId="products-label"
              multiple
              name="products"
              value={form.products || []}
              onChange={handleChange}
              renderValue={(selected) => selected.map((p) => p.name).join(", ")}
              label="Products"
            >
              {allProducts?.map((p) => (
                <MenuItem key={p.id} value={p}>
                  <Checkbox
                    checked={form.products?.some((prod) => prod.id === p.id)}
                  />
                  <ListItemText primary={p.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Categories Multi-Select */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="categories-label">Categories</InputLabel>
            <Select
              labelId="categories-label"
              multiple
              name="categories"
              value={form.categories || []}
              onChange={handleChange}
              renderValue={(selected) => selected.map((c) => c.name).join(", ")}
              label="Categories"
            >
              {allCategories?.map((c) => (
                <MenuItem key={c.id} value={c}>
                  <Checkbox
                    checked={form.categories?.some((cat) => cat.id === c.id)}
                  />
                  <ListItemText primary={c.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Min Amount */}
          <TextField
            name="minAmount"
            label="Minimum Amount"
            type="number"
            value={form.minAmount}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />

          {/* Max Discount */}
          <TextField
            name="maxDiscount"
            label="Maximum Discount"
            type="number"
            value={form.maxDiscount}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />

          {/* Start Date */}
          <TextField
            name="startDate"
            label="Start Date"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />

          {/* End Date */}
          <TextField
            name="endDate"
            label="End Date"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setOpenAdd(false);
              setOpenEdit(false);
            }}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={openAdd ? handleAdd : handleUpdate}
          >
            {openAdd ? "Add" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Coupon?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* VIEW DIALOG */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Coupon Details</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}
        >
          <Typography variant="subtitle1">
            <strong>Code:</strong> {activeCoupon?.code}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Discount:</strong> {activeCoupon?.discountValue} (
            {activeCoupon?.discountType})
          </Typography>
          <Typography variant="subtitle1">
            <strong>Valid From:</strong>{" "}
            {activeCoupon?.startDate
              ? new Date(activeCoupon.startDate).toLocaleDateString()
              : "-"}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Valid Until:</strong>{" "}
            {activeCoupon?.endDate
              ? new Date(activeCoupon.endDate).toLocaleDateString()
              : "-"}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Products:</strong>{" "}
            {activeCoupon?.products?.map((p) => p.name).join(", ") || "All"}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Categories:</strong>{" "}
            {activeCoupon?.categories?.map((c) => c.name).join(", ") || "All"}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Store:</strong> {activeCoupon?.store?.name}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenView(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
