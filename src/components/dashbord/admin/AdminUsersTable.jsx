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
} from "@mui/material";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

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

    useEffect(() => {
        fetchUsers();
    }, []);

    console.log(users);


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

    async function submitEdit() {
        if (!activeUser) return;
        const apiEndpoint = `${baseURL}/auth/edit-profile`;
        try {
            const res = await axios.put(`${apiEndpoint}/${activeUser.id}`, form);
            const updated = res.data || { ...activeUser, ...form };
            setUsers((list) => list.map((u) => (u.id === activeUser.id ? updated : u)));
            setSnack({ open: true, message: "User updated", severity: "success" });
            setEditOpen(false);
            setActiveUser(null);
        } catch (err) {
            setSnack({ open: true, message: err?.response?.data?.message || "Update failed", severity: "error" });
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
                Admin — Users
            </Typography>

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
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.firstName}</TableCell>
                                        <TableCell>{user.lastName}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
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
                                ))}
                                {users.length === 0 && (
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

            <Dialog open={viewOpen} onClose={() => setViewOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>User details</DialogTitle>
                <DialogContent>
                    {activeUser ? (
                        <Box sx={{ display: "grid", gap: 1 }}>
                            <Typography><strong>ID:</strong> {activeUser.id}</Typography>
                            <Typography><strong>Name:</strong> {activeUser.firstName} {activeUser.lastName}</Typography>
                            <Typography><strong>Username:</strong> {activeUser.username}</Typography>
                            <Typography><strong>Email:</strong> {activeUser.email}</Typography>
                            <Typography><strong>Role:</strong> {activeUser.role}</Typography>
                        </Box>
                    ) : (
                        <Typography>Loading...</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit user</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
                        <TextField label="First name" name="firstName" value={form.firstName || ""} onChange={handleFormChange} />
                        <TextField label="Last name" name="lastName" value={form.lastName || ""} onChange={handleFormChange} />
                        <TextField label="Username" name="username" value={form.username || ""} onChange={handleFormChange} />
                        <TextField label="Email" name="email" value={form.email || ""} onChange={handleFormChange} />
                        <TextField label="Role" name="role" value={form.role || "user"} onChange={handleFormChange} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={submitEdit}>Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Delete user</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete user {activeUser?.username} (ID: {activeUser?.id})?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
                </DialogActions>
            </Dialog>

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