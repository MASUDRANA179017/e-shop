import React, { useEffect, useState } from "react";
import {
    Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Button, Box, Typography, Snackbar, Alert, CircularProgress, Tooltip,
    InputAdornment, RadioGroup, FormControlLabel, Radio, FormLabel
} from "@mui/material";
import { FaEye, FaEdit, FaTrashAlt, FaSearch, FaUpload } from "react-icons/fa";
import { uploadImage } from "../../../@Services/uploadService";
import { getAllUsers, editProfile, toggleUserStatus } from "../../../@Services/authService";

export default function AdminUsersTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [activeUser, setActiveUser] = useState(null);
    const [form, setForm] = useState({});
    const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Fetch users
    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllUsers();
            setUsers(data || []);
        } catch (err) {
            setError(err?.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    // Filter users
    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = users.filter(
            u =>
                u.firstName?.toLowerCase().includes(term) ||
                u.lastName?.toLowerCase().includes(term) ||
                u.username?.toLowerCase().includes(term) ||
                u.email?.toLowerCase().includes(term) ||
                u.role?.toLowerCase().includes(term) ||
                (u.isActive ? "active" : "inactive").includes(term)
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const openView = (user) => { setActiveUser(user); setViewOpen(true); };
    const openEdit = (user) => {
        setActiveUser(user);
        setForm({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            username: user.username || "",
            email: user.email || "",
            role: user.role || "user",
            imageUrl: user.imageUrl || "",
            isActive: user.isActive ?? true,
        });
        setEditOpen(true);
    };
    const openDelete = (user) => { setActiveUser(user); setDeleteOpen(true); };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            // Upload to "profiles" folder
            const url = await uploadImage(file, "profiles");
            setForm((f) => ({ ...f, profileImage: url }));
            setSnack({ open: true, message: "Image uploaded successfully", severity: "success" });
        } catch (err) {
            setSnack({ open: true, message: "Upload failed", severity: "error" });
            console.log(err);

        } finally {
            setUploading(false);
        }
    };

    const submitEdit = async () => {
        if (!activeUser) return;
        try {
            // Only include non-empty values
            const payload = { id: activeUser.id };
            Object.keys(form).forEach(key => {
                if (form[key] !== "" && form[key] !== null && form[key] !== undefined) {
                    payload[key] = form[key];
                }
            });

            const updatedUser = await editProfile(payload);
            setUsers(users.map(u => u.id === activeUser.id ? updatedUser : u));
            setSnack({ open: true, message: "User updated successfully", severity: "success" });
            setEditOpen(false);
            setActiveUser(null);
        } catch (err) {
            setSnack({ open: true, message: err?.response?.data?.message || "Update failed", severity: "error" });
        }
    };


    const toggleStatus = async (user) => {
        try {
            const updated = await toggleUserStatus(user.id, !user.isActive);
            setUsers(users.map(u => u.id === user.id ? updated : u));
            setSnack({ open: true, message: "User status updated", severity: "success" });
        } catch (err) {
            setSnack({ open: true, message: err?.message || "Status update failed", severity: "error" });
        }
    };


  

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>All Users List</Typography>

            {/* Search */}
            <TextField
                fullWidth variant="outlined"
                placeholder="Search by name, username, email or role..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><FaSearch /></InputAdornment> }}
            />

            <Paper>
                <TableContainer>
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>
                    ) : error ? (
                        <Box sx={{ p: 3 }}>
                            <Typography color="error">{error}</Typography>
                            <Button onClick={fetchUsers} sx={{ mt: 1 }}>Retry</Button>
                        </Box>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Profile Image</TableCell>
                                    <TableCell>First Name</TableCell>
                                    <TableCell>Last Name</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.length ? filteredUsers.map(user => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>
                                            {user.profileImage ? (
                                                <img src={user.profileImage} alt="User" style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }} />
                                            ) : <Typography variant="body2" color="text.secondary">No Image</Typography>}
                                        </TableCell>
                                        <TableCell>{user.firstName}</TableCell>
                                        <TableCell>{user.lastName}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            <Button size="small" variant="outlined" onClick={() => toggleStatus(user)}>
                                                {user.isActive ? "Active" : "Inactive"}
                                            </Button>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="View"><IconButton onClick={() => openView(user)}><FaEye /></IconButton></Tooltip>
                                            <Tooltip title="Edit"><IconButton onClick={() => openEdit(user)}><FaEdit /></IconButton></Tooltip>
                                            {/* <Tooltip title="Delete"><IconButton onClick={() => openDelete(user)}><FaTrashAlt /></IconButton></Tooltip> */}
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow><TableCell colSpan={9} align="center">No users found</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
            </Paper>

            {/* View Dialog */}
            <Dialog open={viewOpen} onClose={() => setViewOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>User Details</DialogTitle>
                <DialogContent>
                    {activeUser && (
                        <Box sx={{ display: "grid", gap: 1 }}>
                            <img
                                src={activeUser.profileImage || "/frontend/products/product01.png"}
                                alt={activeUser.name}
                                style={{ width: "100%", borderRadius: 4 }}
                            />
                            <Typography><strong>Name:</strong> {activeUser.firstName} {activeUser.lastName}</Typography>
                            <Typography><strong>User Name:</strong> {activeUser.username}</Typography>
                            <Typography><strong>Email:</strong> {activeUser.email}</Typography>
                            <Typography><strong>Role:</strong> {activeUser.role}</Typography>
                            <TableCell>
                                <Button size="small" variant="outlined" onClick={() => toggleStatus(activeUser)}>
                                    {activeUser.isActive ? "Active" : "Inactive"}
                                </Button>
                            </TableCell>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
                        <TextField label="First name" name="firstName" value={form.firstName || ""} onChange={handleFormChange} />
                        <TextField label="Last name" name="lastName" value={form.lastName || ""} onChange={handleFormChange} />
                        <TextField label="Username" name="username" value={form.username || ""} onChange={handleFormChange} />
                        <TextField label="Email" name="email" value={form.email || ""} onChange={handleFormChange} />
                        <TextField label="Role" name="role" value={form.role || ""} onChange={handleFormChange} />

                        {/* Image Upload */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Button variant="outlined" component="label" startIcon={<FaUpload />}>
                                Upload Image
                                <input hidden type="file" accept="image/*" onChange={handleFileChange} />
                            </Button>
                            {uploading && <CircularProgress size={20} />}
                        </Box>
                        {form.profileImage && <Box sx={{ textAlign: "center", mt: 2 }}><img src={form.profileImage} alt="Preview" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover" }} /></Box>}

                        {/* Active Status */}
                        <FormLabel>Active Status</FormLabel>
                        <RadioGroup row name="isActive" value={form.isActive?.toString() || "true"} onChange={e => setForm({ ...form, isActive: e.target.value === "true" })}>
                            <FormControlLabel value="true" control={<Radio />} label="Active" />
                            <FormControlLabel value="false" control={<Radio />} label="Inactive" />
                        </RadioGroup>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={submitEdit}>Save</Button>
                </DialogActions>
            </Dialog>

         

            {/* Snackbar */}
            <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert severity={snack.severity} variant="filled">{snack.message}</Alert>
            </Snackbar>
        </Box>
    );
}
