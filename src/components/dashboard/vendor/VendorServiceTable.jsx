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
} from "@mui/material";

import {
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaRegEye,
  FaUpload,
  FaBarcode
} from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";
import {
  getVendorServices,
  createService,
  updateProduct,
  deleteProduct,
} from "../../../@Services/ProductService";
import { getProductBarcode, bulkGenerateCodes } from "../../../@Services/BarcodeService";
import api from "../../../api/axiosInstance";
import { getAllStores } from "../../../@Services/StoreService";
import { getAllCategory } from "../../../@Services/CategoryService";
import { uploadImage } from "../../../@Services/uploadService";
import { getAllBrands } from "../../../@Services/BrandsService";
import { getAllWeightUnits } from "../../../@Services/weightUnitService";
import { BiLoader } from "react-icons/bi";

export default function VendorServiceTable() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeProduct, setActiveProduct] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [barcodeOpen, setBarcodeOpen] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);
  const [barcodeAllOpen, setBarcodeAllOpen] = useState(false);
  const [barcodeAllData, setBarcodeAllData] = useState([]);
  const [barcodeAllLoading, setBarcodeAllLoading] = useState(false);

  const [form, setForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [brands, setBrands] = useState([]);
  const [weightUnits, setWeightUnits] = useState([]);

  const [uploading, setUploading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const resolveImageUrl = (url) => {
    if (!url) return null;
    if (typeof url !== "string") return null;
    if (url.startsWith("data:")) return url;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `${api.defaults.baseURL}${url}`;
    return url;
  };

  const fetchBrands = async () => {
    try {
      const data = await getAllBrands();
      setBrands(data || []);
    } catch (err) {
      console.error("Failed to fetch Brands", err);
    }
  };

  const fetchWeightUnits = async () => {
    try {
      const data = await getAllWeightUnits();
      setWeightUnits(data || []);
    } catch (err) {
      console.error("Failed to fetch Weight Units", err);
    }
  };

  // Fetch each vendor products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getVendorServices();
      setProducts(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load services");
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
    fetchBrands();
    fetchWeightUnits();
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
    const filtered = products.filter(
      (p) =>
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
      [name]:
        name === "storeId" || name === "categoryId"
          ? Number(value)
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  // Thumbnail upload
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    setForm((prev) => ({
      ...prev,
      productThumbnail: URL.createObjectURL(file),
      productThumbnailFile: file, // keep file for upload
    }));

    setUploading(true);
    try {
      const url = await uploadImage(file, "products");
      setForm((prev) => ({
        ...prev,
        productThumbnail: url, // replace preview with uploaded URL
        productThumbnailFile: null,
      }));
      setSnack({
        open: true,
        message: "Thumbnail uploaded",
        severity: "success",
      });
    } catch (err) {
      setSnack({
        open: true,
        message: "Thumbnail upload failed",
        severity: "error",
      });
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  // Gallery upload (multiple files)
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Show local previews immediately
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setForm((prev) => ({
      ...prev,
      productGallery: [...(prev.productGallery || []), ...previewUrls],
      productGalleryFiles: [...(prev.productGalleryFiles || []), ...files],
    }));

    setUploading(true);
    try {
      const uploadedUrls = await Promise.all(
        files.map((file) => uploadImage(file, "products"))
      );

      // Replace local preview URLs with server URLs
      setForm((prev) => ({
        ...prev,
        productGallery: [
          ...prev.productGallery.filter((img) => !previewUrls.includes(img)), // remove previews
          ...uploadedUrls,
        ],
        productGalleryFiles: [], // clear uploaded files
      }));

      setSnack({
        open: true,
        message: "Gallery uploaded",
        severity: "success",
      });
    } catch (err) {
      setSnack({
        open: true,
        message: "Gallery upload failed",
        severity: "error",
      });
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
      barcode: "",
      manufactureDate: "",
      expireDate: "",
      storeId: "",
      categoryId: "",
      brandId: "",
      weightUnitId: "",
      productThumbnail: "",
      productGallery: [],
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
      barcode: product.barcode || "",

      manufactureDate: product.manufactureDate || "",
      expireDate: product.expireDate || "",

      storeId: Number(product.store?.id || product.storeId) || "",
      categoryId: Number(product.category?.id || product.categoryId) || "",
      brandId: Number(product.brand?.id || product.brandId) || "",
      weightUnitId:
        Number(product.weightUnit?.id || product.weightUnitId) || "",

      productThumbnail: product.productThumbnail || "",
      productThumbnailFile: null,

      productGallery: product.productGallery || [],
      productGalleryFiles: [],
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

  const openBarcode = async (product) => {
    setActiveProduct(product);
    setLoading(true);
    try {
      const data = await getProductBarcode(product.id);
      let normalized = null;
      if (typeof data === "string") {
        if (data.startsWith("data:")) {
          normalized = data;
        } else if (data.startsWith("http")) {
          normalized = data;
        } else if (data.startsWith("/")) {
          normalized = `${api.defaults.baseURL}${data}`;
        } else {
          normalized = `data:image/png;base64,${data}`;
        }
      } else if (data && typeof data === "object") {
        if (data.url) {
          normalized = data.url.startsWith("http")
            ? data.url
            : `${api.defaults.baseURL}${data.url}`;
        } else if (data.base64) {
          normalized = `data:image/png;base64,${data.base64}`;
        } else if (data.imageBase64) {
          normalized = `data:image/png;base64,${data.imageBase64}`;
        } else if (data.barcode) {
          normalized = data.barcode.startsWith('data:')
            ? data.barcode
            : `data:image/png;base64,${data.barcode}`;
        }
      }
      setBarcodeData(normalized);
      setBarcodeOpen(true);
    } catch (error) {
      console.error("Failed to generate barcode", error);
      setSnack({
        open: true,
        message: "Failed to generate barcode",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const openAllBarcodes = async () => {
    setBarcodeAllLoading(true);
    try {
      const ids = products.map(p => p.id);
      const result = await bulkGenerateCodes(ids);
      const normalized = (result || []).map(item => ({
        id: item?.product?.id || item?.productId,
        name: item?.product?.name || `Service #${item?.productId}`,
        qrCode: item?.qrCode,
        barcode: item?.barcode,
        error: item?.error,
      }));
      setBarcodeAllData(normalized);
      setBarcodeAllOpen(true);
    } catch (err) {
      setSnack({ open: true, message: err?.response?.data?.message || "Failed to load barcodes", severity: "error" });
    } finally {
      setBarcodeAllLoading(false);
    }
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

        manufactureDate: form.manufactureDate,
        expireDate: form.expireDate,

        storeId: Number(form.storeId),
        categoryId: Number(form.categoryId),
        brandId: Number(form.brandId),
        weightUnitId: Number(form.weightUnitId),

        productThumbnail: thumbnailUrl,
        productGallery: uploadedGallery,
        isService: true,
      };

      const newProduct = await createService(payload);
      setProducts((prev) => [...prev, newProduct]);
      setSnack({
        open: true,
        message: "Service added successfully",
        severity: "success",
      });
      setAddOpen(false);
    } catch (err) {
      console.error(err);
      setSnack({
        open: true,
        message: err?.response?.data?.message || "Failed to add service",
        severity: "error",
      });
    }
  };

  const submitEdit = async () => {
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

        manufactureDate: form.manufactureDate,
        expireDate: form.expireDate,

        storeId: Number(form.storeId),
        categoryId: Number(form.categoryId),
        brandId: Number(form.brandId),
        weightUnitId: Number(form.weightUnitId),

        productThumbnail: thumbnailUrl,
        productGallery: uploadedGallery,
        isService: true,
      };

      const updated = await updateProduct(activeProduct.id, payload);
      setProducts((prev) =>
        prev.map((p) => (p.id === activeProduct.id ? updated : p))
      );

      setSnack({
        open: true,
        message: "Service updated successfully",
        severity: "success",
      });
      setEditOpen(false);
    } catch (err) {
      console.log(err);
      setSnack({
        open: true,
        message: err?.response?.data?.message || "Failed to update service",
        severity: "error",
      });
    }
  };

  // Delete product
  const confirmDelete = async () => {
    try {
      await deleteProduct(activeProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== activeProduct.id));
      setSnack({
        open: true,
        message: "Service deleted successfully",
        severity: "info",
      });
      setDeleteOpen(false);
    } catch (err) {
      setSnack({
        open: true,
        message: err?.response?.data?.message || "Failed to delete",
        severity: "error",
      });
    }
  };

  return (
    <Box>
  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
    <Typography variant="h6">Services List</Typography>
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button variant="outlined" startIcon={<FaBarcode />} onClick={openAllBarcodes}>
        Show All Codes
      </Button>
      <Button variant="contained" onClick={openAdd}>
        Add Service
      </Button>
    </Box>
  </Box>

      <TextField
        fullWidth
        placeholder="Search by name or price"
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

      <Paper>
        <TableContainer>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ p: 3 }}>
              {error}
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Thumbnail</TableCell>
                  <TableCell>Gallery</TableCell>
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
                    <TableCell colSpan={6} align="center">
                      No services found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>
                        <img
                          src={
                            resolveImageUrl(product.productThumbnail) ||
                            "/frontend/products/product01.png"
                          }
                          alt={product.name}
                          style={{ width: 60, height: 60, borderRadius: 6 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          {product.productGallery &&
                          product.productGallery.length > 0 ? (
                            product.productGallery.map((img, idx) => (
                              <img
                                key={idx}
                                src={resolveImageUrl(img)}
                                alt={`Gallery ${idx + 1}`}
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 4,
                                  objectFit: "cover",
                                }}
                              />
                            ))
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              No images
                            </Typography>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell>{product.name}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.category.name}</TableCell>
                      <TableCell>{product.store.name}</TableCell>
                      <TableCell>
                        {product.vendor.firstName} {product.vendor.lastName}
                      </TableCell>
                      <TableCell>{product.vendor.email}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="View">
                          <IconButton onClick={() => openView(product)}>
                            <FaRegEye />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Barcode">
                          <IconButton onClick={() => openBarcode(product)}>
                            <FaBarcode />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => openEdit(product)}>
                            <FaEdit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => openDelete(product)}>
                            <FaTrashAlt />
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

      {/* Add Product Dialog */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Service</DialogTitle>

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
            <TextField
              label="Barcode"
              name="barcode"
              value={form.barcode}
              onChange={handleFormChange}
            />

            {/* Manufacture & Expire Date */}
            <TextField
              label="Manufacture Date"
              type="date"
              name="manufactureDate"
              value={form.manufactureDate}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Expire Date"
              type="date"
              name="expireDate"
              value={form.expireDate}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />

            {/* Category */}
            <TextField
              select
              label="Category"
              name="categoryId"
              value={form.categoryId}
              onChange={handleFormChange}
              slotProps={{ select: { native: true } }}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </TextField>

            {/* Brand */}
            <TextField
              select
              label="Brand"
              name="brandId"
              value={form.brandId}
              onChange={handleFormChange}
              slotProps={{ select: { native: true } }}
            >
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </TextField>

            {/* Weight Unit */}
            <TextField
              select
              label="Weight Unit"
              name="weightUnitId"
              value={form.weightUnitId}
              onChange={handleFormChange}
              slotProps={{ select: { native: true } }}
            >
              <option value="">Select Weight Unit</option>
              {weightUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </TextField>

            {/* Store (User's own store visible only) */}
            <TextField
              select
              label="Store"
              name="storeId"
              value={form.storeId}
              onChange={handleFormChange}
              slotProps={{ select: { native: true } }}
            >
              {stores
                .filter((s) => s.ownerId === user.id)
                .map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
            </TextField>

            {/* Thumbnail Upload */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<FaUpload />}
              >
                Upload Thumbnail
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                />
              </Button>
              {uploading && <BiLoader size={20} />}
            </Box>

            {form.productThumbnail && (
              <img
                src={form.productThumbnail}
                alt="Thumbnail"
                style={{
                  width: 150,
                  height: 100,
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />
            )}

            {/* Gallery Upload */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<FaUpload />}
              >
                Upload Gallery Images
                <input
                  hidden
                  multiple
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryUpload}
                />
              </Button>
              {uploading && <BiLoader size={20} />}
            </Box>

            {form.productGallery?.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {form.productGallery.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt=""
                    style={{ width: 80, height: 80, borderRadius: 8 }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitAdd}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/* View Product Dialog */}
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Service Details</DialogTitle>
        <DialogContent>
          {activeProduct && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Thumbnail */}
              <Box>
                <img
                  src={
                    resolveImageUrl(activeProduct.productThumbnail) ||
                    "/frontend/products/product01.png"
                  }
                  alt={activeProduct.name}
                  style={{
                    width: "100%",
                    height: 250,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </Box>

              {/* Gallery */}
              {activeProduct.productGallery?.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Gallery:
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(100px, 1fr))",
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
                          src={resolveImageUrl(img)}
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
                <strong>Barcode:</strong> {activeProduct.barcode || "N/A"}
            </Typography>
            <Typography>
                <strong>Category:</strong>{" "}
                {activeProduct.category?.name || "N/A"}
              </Typography>
              <Typography>
                <strong>Store:</strong> {activeProduct.store?.name || "N/A"}
              </Typography>
              <Typography>
                <strong>Brand:</strong> {activeProduct.brand?.name || "N/A"}
              </Typography>
              <Typography>
                <strong>Weight Unit:</strong>{" "}
                {activeProduct.weightUnit?.name || "N/A"}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* All Barcodes Dialog */}
      <Dialog
        open={barcodeAllOpen}
        onClose={() => setBarcodeAllOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>All Service Codes</DialogTitle>
        <DialogContent dividers>
          {barcodeAllLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : barcodeAllData?.length ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 2 }}>
              {barcodeAllData.map((item) => (
                <Box key={item.id} sx={{ border: '1px solid #eee', borderRadius: 2, p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>{item.name}</Typography>
                  {item.error ? (
                    <Alert severity="error">{item.error}</Alert>
                  ) : (
                    <>
                      {item.qrCode && (
                        <Box sx={{ textAlign: 'center', mb: 1 }}>
                          <img src={item.qrCode} alt={`QR ${item.id}`} style={{ maxWidth: '100%', height: 120, objectFit: 'contain' }} />
                          <Typography variant="caption">QR Code</Typography>
                        </Box>
                      )}
                      {item.barcode && (
                        <Box sx={{ textAlign: 'center' }}>
                          <img src={item.barcode} alt={`Barcode ${item.id}`} style={{ maxWidth: '100%', height: 80, objectFit: 'contain' }} />
                          <Typography variant="caption">Barcode</Typography>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <Typography>No codes found.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBarcodeAllOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Barcode Dialog */}
      <Dialog
        open={barcodeOpen}
        onClose={() => setBarcodeOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Service Barcode</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
          {barcodeData ? (
            <>
              <img src={barcodeData} alt="Barcode" style={{ maxWidth: '100%' }} />
              <Typography variant="body1" fontWeight="bold">
                {activeProduct?.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                ID: {activeProduct?.id}
              </Typography>
            </>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            const link = document.createElement('a');
            link.href = barcodeData;
            link.download = `barcode-${activeProduct?.id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}>
            Download
          </Button>
          <Button onClick={() => setBarcodeOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Service</DialogTitle>

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

            {/* Manufacture & Expire Date */}
            <TextField
              label="Manufacture Date"
              type="date"
              name="manufactureDate"
              value={form.manufactureDate}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Expire Date"
              type="date"
              name="expireDate"
              value={form.expireDate}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />

            {/* Category */}
            <TextField
              select
              label="Category"
              name="categoryId"
              value={form.categoryId}
              onChange={handleFormChange}
              slotProps={{ select: { native: true } }}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </TextField>

            {/* Brand */}
            <TextField
              select
              label="Brand"
              name="brandId"
              value={form.brandId}
              onChange={handleFormChange}
              slotProps={{ select: { native: true } }}
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </TextField>

            {/* Weight Unit */}
            <TextField
              select
              label="Weight Unit"
              name="weightUnitId"
              value={form.weightUnitId}
              onChange={handleFormChange}
              slotProps={{ select: { native: true } }}
            >
              {weightUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </TextField>

            {/* Store (User's own store visible only) */}
            <TextField
              select
              label="Store"
              name="storeId"
              value={form.storeId}
              onChange={handleFormChange}
              slotProps={{ select: { native: true } }}
            >
              {stores
                .filter((s) => s.ownerId === user.id)
                .map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
            </TextField>

            {/* Thumbnail Upload */}
            <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<FaUpload />}
              >
                {form.productThumbnail
                  ? "Replace Thumbnail"
                  : "Upload Thumbnail"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                />
              </Button>

              {form.productThumbnail && (
                <Box sx={{ position: "relative" }}>
                  <img
                    src={form.productThumbnail}
                    alt="Thumbnail"
                    style={{
                      width: 150,
                      height: 100,
                      borderRadius: 8,
                      objectFit: "cover",
                    }}
                  />
                  <Button
                    size="small"
                    color="error"
                    sx={{ position: "absolute", top: 5, right: 5 }}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        productThumbnail: "",
                        productThumbnailFile: null,
                      }))
                    }
                  >
                    ✕
                  </Button>
                </Box>
              )}
            </Box>

            {/* Gallery Upload */}
            <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<FaUpload />}
              >
                Add Gallery
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                />
              </Button>
            </Box>

            {/* Gallery Preview */}
            {form.productGallery?.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 1 }}>
                {form.productGallery.map((img, idx) => (
                  <Box
                    key={idx}
                    sx={{ width: 90, height: 90, position: "relative" }}
                  >
                    <img
                      src={img}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <Button
                      size="small"
                      color="error"
                      sx={{ position: "absolute", top: 2, right: 2 }}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          productGallery: prev.productGallery.filter(
                            (_, i) => i !== idx
                          ),
                          productGalleryFiles: prev.productGalleryFiles?.filter(
                            (_, i) => i !== idx
                          ),
                        }))
                      }
                    >
                      ✕
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
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
        <DialogTitle>Delete Service</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {activeProduct?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
