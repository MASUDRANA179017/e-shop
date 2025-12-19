import React, { useEffect, useState } from "react";
import { editProfile, getProfile } from "../../@Services/authService";
import { TextField, Button, Card, CardContent, Avatar, Typography, Box, Snackbar, Alert } from "@mui/material";
import { toast } from "react-toastify";
import { uploadImage } from "../../@Services/uploadService";


const defaultCover =
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=60";

const defaultAvatar =
    "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png";

export default function UpdateProfile() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email:"",
        profileImage: "",
        password: "",
        confirmPassword: ""
    });

    const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

    const [preview, setPreview] = useState(defaultAvatar);

    useEffect(() => {
        async function fetchProfile() {
            const data = await getProfile();
            setForm({
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email:data.email,
                profileImage: data.profileImage,
                password: "",
                confirmPassword: ""
            });
            setPreview(data.profileImage || defaultAvatar);
        }
        fetchProfile();
    }, []);

    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadImage(file, "profiles");
            setForm((prev) => ({ ...prev, profileImage: url }));
            setPreview(url);
            toast.success("Image uploaded successfully!");
        } catch {
            toast.error("Image upload failed!");
        } finally {
            setUploading(false);
        }
    };


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

        if (e.target.name === "profileImage") {
            setPreview(e.target.value);
        }
    };

    const handleUpdate = async () => {
        if (form.password && form.password !== form.confirmPassword) {
            toast.error("Password & Confirm Password not matched!");
            return;
        }

        let dataToSend = { ...form };
        delete dataToSend.confirmPassword;
        delete dataToSend.role;
        if (!form.password) delete dataToSend.password;

        try {
            const updatedUser = await editProfile(dataToSend);
            setForm(prev => ({ ...prev, password: "", confirmPassword: "" }));
            setPreview(updatedUser.profileImage || defaultAvatar);
            setSnack({ open: true, message: "Profile Update successfully", severity: "info" });
        } catch (err) {
            console.log(err.response?.data || err);
            toast.error(err.response?.data?.message || "Update failed!");
        }
    };


    return (
        <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
            {/* Cover banner */}
            <Box
                sx={{
                    width: "100%",
                    height: 150,
                    backgroundImage: `url(${defaultCover})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            />

            <CardContent sx={{ textAlign: "center" }}>
                {/* Profile image */}
                <Avatar
                    src={preview}
                    sx={{
                        width: 110,
                        height: 110,
                        mx: "auto",
                        mt: -7,
                        border: "3px solid white"
                    }}
                />

                <Typography variant="h5" sx={{ mt: 2, mb: 3, fontWeight: "bold" }}>
                    Edit Profile
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {/* Choose file */}
                    <Button
                        variant="outlined"
                        component="label"
                        sx={{ width: "100%", py: 1.3 }}
                    >
                        Upload New Profile Image
                        <input hidden accept="image/*" type="file" onChange={handleFileUpload} />
                    </Button>

                    {uploading && (
                        <Typography color="primary" fontSize={14}>Uploading...</Typography>
                    )}


                    <TextField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
                    <TextField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
                    <TextField label="Username" name="username" disabled value={form.username} onChange={handleChange} />
                    <TextField label="Email" name="email" disabled value={form.email} onChange={handleChange} />

                    <TextField type="password" label="New Password" name="password" value={form.password} onChange={handleChange} />
                    <TextField type="password" label="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />

                    <Button variant="contained" onClick={handleUpdate} sx={{ py: 1.5, fontSize: 16 }}>
                        Save Changes
                    </Button>
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
            </CardContent>
        </Card>
    );
}
