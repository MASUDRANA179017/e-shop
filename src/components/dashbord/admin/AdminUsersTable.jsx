import React, { useEffect, useState } from "react";
import axios from "axios";
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
    RadioGroup, FormControlLabel, Radio, FormLabel
} from "@mui/material";
import { FaEye, FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";

export default function AdminUsersTable() {
    const baseURL = "http://localhost:8000";
    const apiEndpoint = `${baseURL}/auth/all-users`;
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
    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users when typing
    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = users.filter(
            (u) =>
                u.firstName.toLowerCase().includes(term) ||
                u.lastName.toLowerCase().includes(term) ||
                u.username.toLowerCase().includes(term) ||
                u.email.toLowerCase().includes(term) ||
                u.role.toLowerCase().includes(term) ||
                (u.isActive ? "active" : "inactive").includes(term)
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    // console.log(users);


    async function fetchUsers() {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No authentication token found. Please log in.");
                return;
            }

            const res = await axios.get(apiEndpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            setUsers(res.data || []);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                setError("Session expired. Please log in again.");
            } else {
                setError(err?.response?.data?.message || err.message || "Failed to load users");
            }
        } finally {
            setLoading(false);
        }
    }


    function openView(user) {
        setActiveUser(user);
        setViewOpen(true);
    }

    function openEdit(user) {
        setActiveUser(user);
        setForm({
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            username: user.username ?? "",
            email: user.email ?? "",
            role: user.role ?? "user",
        });
        setEditOpen(true);
    }

    function openDelete(user) {
        setActiveUser(user);
        setDeleteOpen(true);
    }

    function handleFormChange(e) {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    }

    // async function submitEdit() {
    //     if (!activeUser) return;
    //     const apiEndpoint = `${baseURL}/auth/edit-profile`;
    //     try {
    //         const res = await axios.post(`${apiEndpoint}/${activeUser.id}`, form);
    //         const updated = res.data || { ...activeUser, ...form };
    //         setUsers((list) => list.map((u) => (u.id === activeUser.id ? updated : u)));
    //         setSnack({ open: true, message: "User updated", severity: "success" });
    //         setEditOpen(false);
    //         setActiveUser(null);
    //     } catch (err) {
    //         setSnack({ open: true, message: err?.response?.data?.message || "Update failed", severity: "error" });
    //     }
    // }

    async function submitEdit() {
        if (!activeUser) return;

        const apiEndpoint = `${baseURL}/auth/edit-profile`;
        const token = localStorage.getItem("token");

        const payload = { id: activeUser.id, ...form };

        // remove password if it's empty
        if (!form.password || form.password.trim() === "") {
            delete payload.password;
        }

        try {
            const res = await axios.post(apiEndpoint, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const updated = res.data || { ...activeUser, ...form };
            setUsers((list) => list.map((u) => (u.id === activeUser.id ? updated : u)));

            setSnack({ open: true, message: "User updated successfully", severity: "success" });
            setEditOpen(false);
            setActiveUser(null);
        } catch (err) {
            setSnack({
                open: true,
                message: err?.response?.data?.message || "Update failed",
                severity: "error",
            });
        }
    }






    async function confirmDelete() {
        if (!activeUser) return;
        const apiEndpoint = `${baseURL}/auth/delete-user`;
        try {
            await axios.delete(`${apiEndpoint}/${activeUser.id}`);
            setUsers((list) => list.filter((u) => u.id !== activeUser.id));
            setSnack({ open: true, message: "User deleted", severity: "info" });
            setDeleteOpen(false);
            setActiveUser(null);
        } catch (err) {
            setSnack({ open: true, message: err?.response?.data?.message || "Delete failed", severity: "error" });
        }
    }

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
                All Users List
            </Typography>

            {/* Search Bar */}
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by name, username, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <FaSearch />
                        </InputAdornment>
                    ),
                }}
            />

            <Paper>
                <TableContainer>
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Box sx={{ p: 3 }}>
                            <Typography color="error">{error}</Typography>
                            <Button onClick={fetchUsers} sx={{ mt: 1 }}>
                                Retry
                            </Button>
                        </Box>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
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
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} hover>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.firstName}</TableCell>
                                            <TableCell>{user.lastName}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="View">
                                                    <IconButton size="small" onClick={() => openView(user)}>
                                                        <FaEye />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <IconButton size="small" onClick={() => openEdit(user)}>
                                                        <FaEdit />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton size="small" onClick={() => openDelete(user)}>
                                                        <FaTrashAlt />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            No users found
                                        </TableCell>
                                    </TableRow>
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
                    {activeUser ? (
                        <Box sx={{ display: "grid", gap: 1 }}>
                            <Typography>
                                <strong>ID:</strong> {activeUser.id}
                            </Typography>
                            <Typography>
                                <strong>Name:</strong> {activeUser.firstName} {activeUser.lastName}
                            </Typography>
                            <Typography>
                                <strong>Username:</strong> {activeUser.username}
                            </Typography>
                            <Typography>
                                <strong>Email:</strong> {activeUser.email}
                            </Typography>
                            <Typography>
                                <strong>Role:</strong> {activeUser.role}
                            </Typography>
                            <Typography>
                                <strong>Active:</strong> {activeUser.isActive ? "Yes" : "No"}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography>Loading...</Typography>
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
                        {/* isActive Radio */}
                        <Box>
                            <FormLabel>Active Status</FormLabel>
                            <RadioGroup
                                row
                                name="isActive"
                                value={form.isActive !== undefined ? form.isActive.toString() : "true"}
                                onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })}
                            >
                                <FormControlLabel value="true" control={<Radio />} label="Active" />
                                <FormControlLabel value="false" control={<Radio />} label="Inactive" />
                            </RadioGroup>
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
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete user {activeUser?.username} (ID: {activeUser?.id})?
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