import React, { useState } from "react";
import { Box, Button, TextField, Stack } from "@mui/material";
import { FaUpload } from "react-icons/fa";
import { BiLoader } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { uploadImage } from "../../../@Services/uploadService";
import api from "../../../api/axiosInstance";

export default function CreateStorePage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "stores");
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed", { autoClose: 3000 });
    } finally {
      setUploading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.imageUrl) {
      toast.error("All fields are required!", { autoClose: 3000 });
      return;
    }

    try {
      const res = await api.post("store/create", form, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Store created successfully!", { autoClose: 3000 });
      console.log("Store created:", res.data);
      setForm({ name: "", description: "", imageUrl: "" });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong", { autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <ToastContainer />
      <Box className="bg-white rounded-lg shadow-md w-full max-w-[600px] p-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Create Your Store
        </h2>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Image Upload */}
            <Box className="flex flex-col items-center gap-2">
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Store Preview"
                  className="w-40 h-40 rounded-lg object-cover"
                />
              )}
              <Button variant="outlined" component="label" startIcon={<FaUpload />}>
                Upload Store Image
                <input hidden type="file" accept="image/*" onChange={handleFileUpload} />
              </Button>
              {uploading && <BiLoader size={24} />}
            </Box>

            {/* Store Name */}
            <TextField
              label="Store Name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              fullWidth
            />

            {/* Description */}
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleFormChange}
              multiline
              rows={4}
              fullWidth
            />

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Store
            </Button>
          </Stack>
        </form>
      </Box>
    </div>
  );
}
