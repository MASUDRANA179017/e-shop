import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { BiLoader } from "react-icons/bi";
import { FaUpload } from "react-icons/fa";
import { Box, Button } from "@mui/material";
import { uploadImage } from "../@Services/uploadService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    profileImage: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "profiles");
      setForm((prev) => ({ ...prev, profileImage: url }));
    } catch (err) {
      console.error(err);
      toast.error("Profile upload failed");
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

    // Validation
    if (!form.firstName || !form.lastName) {
      toast.error("First Name and Last Name are required");
      return;
    }
    if (!form.username || !form.email) {
      toast.error("Username and Email are required");
      return;
    }
    if (!form.profileImage) {
      toast.error("Profile Image is required");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const payload = {
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        profileImage: form.profileImage,
        role: form.role,
      };

      const res = await api.post("auth/register", payload);
      const data = res.data;

      if (!data) throw new Error("Registration failed");

      toast.success("Registration successful! Verification email sent.", { autoClose: 3000 });

      // Auto login after register
      const loginRes = await api.post("auth/login", {
        email: form.email,
        password: form.password,
      });

      const loginData = loginRes.data;

      // Save tokens & user info
      localStorage.setItem("token", loginData.access_Token);
      localStorage.setItem("r-token", loginData.refresh_Token);
      localStorage.setItem("user", JSON.stringify(loginData.user));

      toast.success("Login successful! Redirecting...", { autoClose: 3000 });

      // Redirect by role
      setTimeout(() => {
        if (loginData.user.role === "admin") navigate("/dashboard/admin");
        else if (loginData.user.role === "vendor") navigate("/dashboard/vendor");
        else navigate("/dashboard/user");
      }, 3000);

    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Something went wrong!";
      toast.error(msg, { autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-md w-full max-w-[800px] p-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-2">
            {form.profileImage && (
              <img
                src={form.profileImage}
                alt="Profile Preview"
                className="w-40 h-40 rounded-full object-cover"
              />
            )}
            <Button variant="outlined" component="label" startIcon={<FaUpload />}>
              Upload Profile Picture
              <input hidden type="file" accept="image/*" onChange={handleProfileUpload} />
            </Button>
            {uploading && <BiLoader size={24} />}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleFormChange}
              className="border rounded-lg px-3 py-2 w-full"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleFormChange}
              className="border rounded-lg px-3 py-2 w-full"
            />
          </div>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleFormChange}
            className="border rounded-lg px-3 py-2 w-full"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleFormChange}
            className="border rounded-lg px-3 py-2 w-full"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleFormChange}
            className="border rounded-lg px-3 py-2 w-full"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleFormChange}
            className="border rounded-lg px-3 py-2 w-full"
          />
          
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Account Type</label>
              <select
                name="role"
                value={form.role}
                onChange={handleFormChange}
                className="border rounded-lg px-3 py-2 w-full"
              >
                <option value="user">User</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg w-full transition"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-red-500 hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
