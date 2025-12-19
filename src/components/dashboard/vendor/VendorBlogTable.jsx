import React, { useEffect, useState, useCallback } from "react";
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
  CircularProgress,
  Tooltip,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { FaEdit, FaTrashAlt, FaRegEye, FaSearch, FaUpload } from "react-icons/fa";
import { getVendorBlogs, createBlog, updateBlog, deleteBlog } from "../../../@Services/BlogService";
import { uploadImage } from "../../../@Services/uploadService";
import { getProfile } from "../../../@Services/authService";

export default function VendorBlogTable() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const [activeBlog, setActiveBlog] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({ title: "", content: "", image: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      let vendorId = user?.id;
      if (!vendorId) {
        try {
          const profile = await getProfile();
          vendorId = profile?.id;
          if (vendorId && profile) {
            localStorage.setItem("user", JSON.stringify(profile));
          }
        } catch {
          setError("Please login to manage your blogs");
          setBlogs([]);
          return;
        }
      }
      const data = await getVendorBlogs(vendorId, undefined);
      setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
      setError(err?.response?.data?.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    if (activeBlog) {
      setForm({
        title: activeBlog.title || "",
        content: activeBlog.content || "",
        image: activeBlog.image || activeBlog.thumbnail || "",
      });
    }
  }, [activeBlog]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = blogs.filter(
      (b) =>
        b.title?.toLowerCase().includes(term) ||
        b.content?.toLowerCase().includes(term)
    );
    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "default");
      setForm((s) => ({ ...s, image: url }));
    } finally {
      setUploading(false);
    }
  };

  const submitAdd = async () => {
    try {
      if (!form.title?.trim() || !form.content?.trim()) {
        setSnack({ open: true, message: "Title and content are required", severity: "error" });
        return;
      }
      if (blogs.length >= 3) {
        setSnack({ open: true, message: "You can post up to 3 blogs", severity: "warning" });
        return;
      }
      const payload = { title: form.title, content: form.content, image: form.image };
      await createBlog(payload);
      setAddOpen(false);
      setForm({ title: "", content: "", image: "" });
      fetchBlogs();
      setSnack({ open: true, message: "Blog created successfully", severity: "success" });
    } catch (err) {
      setSnack({ open: true, message: err?.response?.data?.message || "Failed to create blog", severity: "error" });
    }
  };

  const submitEdit = async () => {
    if (!activeBlog) return;
    try {
      if (!form.title?.trim() || !form.content?.trim()) {
        setSnack({ open: true, message: "Title and content are required", severity: "error" });
        return;
      }
      const payload = { title: form.title, content: form.content, image: form.image };
      await updateBlog(activeBlog.id, payload);
      setEditOpen(false);
      setActiveBlog(null);
      fetchBlogs();
      setSnack({ open: true, message: "Blog updated successfully", severity: "success" });
    } catch (err) {
      setSnack({ open: true, message: err?.response?.data?.message || "Failed to update blog", severity: "error" });
    }
  };

  const submitDelete = async () => {
    if (!activeBlog) return;
    try {
      await deleteBlog(activeBlog.id);
      setDeleteOpen(false);
      setActiveBlog(null);
      fetchBlogs();
      setSnack({ open: true, message: "Blog deleted", severity: "success" });
    } catch (err) {
      setSnack({ open: true, message: err?.response?.data?.message || "Failed to delete blog", severity: "error" });
    }
  };

  const openAdd = () => {
    setForm({ title: "", content: "", image: "" });
    setAddOpen(true);
  };

  const openEdit = (blog) => {
    setActiveBlog(blog);
    setEditOpen(true);
  };

  const openView = (blog) => {
    setActiveBlog(blog);
    setViewOpen(true);
  };

  const openDelete = (blog) => {
    setActiveBlog(blog);
    setDeleteOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">My Blogs</Typography>
        <Button variant="contained" onClick={openAdd} disabled={blogs.length >= 3}>Add Blog</Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search by title or content"
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
                  <TableCell>Title</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBlogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No blogs found</TableCell>
                  </TableRow>
                ) : (
                  filteredBlogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell>{blog.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {blog.image || blog.thumbnail ? (
                            <img
                              src={blog.image || blog.thumbnail}
                              alt={blog.title}
                              style={{ width: 50, height: 50, borderRadius: 6, objectFit: "cover" }}
                            />
                          ) : (
                            <Typography variant="body2" color="textSecondary">No image</Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{blog.title}</TableCell>
                      <TableCell>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="View">
                          <IconButton onClick={() => openView(blog)}><FaRegEye /></IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => openEdit(blog)}><FaEdit /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => openDelete(blog)}><FaTrashAlt /></IconButton>
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
      
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snack.severity} variant="filled">{snack.message}</Alert>
      </Snackbar>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Blog</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
            <TextField label="Title" name="title" value={form.title} onChange={handleFormChange} />
            <TextField label="Content" name="content" value={form.content} onChange={handleFormChange} multiline minRows={4} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button variant="outlined" component="label" startIcon={<FaUpload />}>
                Upload Image
                <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
              </Button>
              {uploading && <Typography variant="body2">Uploading...</Typography>}
            </Box>
            {form.image && (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <img src={form.image} alt="Preview" style={{ width: 180, height: 120, borderRadius: 8, objectFit: "cover" }} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitAdd}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Blog</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
            <TextField label="Title" name="title" value={form.title} onChange={handleFormChange} />
            <TextField label="Content" name="content" value={form.content} onChange={handleFormChange} multiline minRows={4} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button variant="outlined" component="label" startIcon={<FaUpload />}>
                Upload Image
                <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
              </Button>
              {uploading && <Typography variant="body2">Uploading...</Typography>}
            </Box>
            {form.image && (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <img src={form.image} alt="Preview" style={{ width: 180, height: 120, borderRadius: 8, objectFit: "cover" }} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Blog Details</DialogTitle>
        <DialogContent>
          {activeBlog && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {activeBlog.image && (
                <Box>
                  <img
                    src={activeBlog.image}
                    alt={activeBlog.title}
                    style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: 8 }}
                  />
                </Box>
              )}
              <Typography variant="h6">{activeBlog.title}</Typography>
              <Typography variant="body2">{activeBlog.content}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Delete Blog</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this blog?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={submitDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
