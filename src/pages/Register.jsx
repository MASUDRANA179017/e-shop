import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../@Services/authService";
import { BiLoader } from "react-icons/bi";
import { FaUpload, FaUser, FaEnvelope, FaLock, FaIdCard, FaImage } from "react-icons/fa";
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

      const data = await registerUser(payload);

      if (!data) throw new Error("Registration failed");

      toast.success("Registration successful! Logging in...", { autoClose: 3000 });

      // Save tokens & user info (Auto login)
      if (data.access_Token) {
        localStorage.setItem("token", data.access_Token);
        localStorage.setItem("r-token", data.refresh_Token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect by role
      setTimeout(() => {
        if (data.user?.role === "admin") navigate("/dashboard/admin");
        else if (data.user?.role === "vendor") navigate("/dashboard/vendor");
        else navigate("/dashboard/user");
      }, 3000);

    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Something went wrong!";
      toast.error(msg, { autoClose: 3000 });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative p-4"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <ToastContainer />
      
      <div className="relative z-10 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-[800px] border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="relative">
              {form.profileImage ? (
                <img
                  src={form.profileImage}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border-4 border-white shadow-inner">
                  <FaImage size={40} />
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <BiLoader className="animate-spin text-white" size={30} />
                </div>
              )}
            </div>
            
            <Button 
              variant="outlined" 
              component="label" 
              startIcon={<FaUpload />}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Upload Profile Picture
              <input hidden type="file" accept="image/*" onChange={handleProfileUpload} />
            </Button>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700">First Name</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-400">
                <FaUser className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleFormChange}
                  className="w-full outline-none text-gray-700 bg-transparent"
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700">Last Name</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-400">
                <FaUser className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleFormChange}
                  className="w-full outline-none text-gray-700 bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Username & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-400">
                <FaIdCard className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleFormChange}
                  className="w-full outline-none text-gray-700 bg-transparent"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-400">
                <FaEnvelope className="text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleFormChange}
                  className="w-full outline-none text-gray-700 bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-400">
                <FaLock className="text-gray-400 mr-2" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleFormChange}
                  className="w-full outline-none text-gray-700 bg-transparent"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-400">
                <FaLock className="text-gray-400 mr-2" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleFormChange}
                  className="w-full outline-none text-gray-700 bg-transparent"
                />
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-blue-600 transition shadow-md transform hover:scale-[1.01] mt-4"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer font-medium"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}