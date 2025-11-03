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
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "profiles");
      setForm((f) => ({ ...f, profileImage: url }));
    } catch (err) {
      console.log(err);
      setError("Profile upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    setForm((s) => ({
      ...s,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!form.firstName || !form.lastName) {
      toast.error("Name Field required", {
        position: "top-center",
        autoClose: 3000,
      })
      return;
    }
    if (!form.profileImage) {
      toast.error("Profile picture is required!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!form.email || !form.username) {
      toast.error("Please fill all required fields!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("password and confirm password don't macing ", {
        position: "top-center",
        autoClose: 3000,
      })
      return;
    }

    try {
      const res = await api.post("auth/register", form);
      const data = res.data;
      if (!data) throw new Error("Registration failed");

      alert("Registration successful! Verification mail sent.");

      // auto login after register
      const loginRes = await api.post("auth/login", {
        email: form.email,
        password: form.password,
      });
      const loginData = loginRes.data;


      // Save tokens and user info
      localStorage.setItem("token", loginData.access_Token);
      localStorage.setItem("r-token", loginData.refresh_Token);
      localStorage.setItem("user", JSON.stringify(loginData.user));

      if (loginData) {
        toast.success("Login successful! Redirecting...", {
          position: "top-center",
          autoClose: 3000,
        })
      }


      //Redirect by user role
      setTimeout(() => {
        if (data.user.role === "admin") navigate("/dashboard/admin");
        if (data.user.role === "vendor") navigate("/dashboard/vendor");
        else navigate("/dashboard/user");
      }, 3000);
    } catch (err) {
      console.log(err);

      const msg = err?.response?.data?.message?.toLowerCase() || "";

      if (msg.includes("User already exists") || msg.includes("email")) {
        toast.error("This email already has an account. Please login.", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }


      toast.error(err?.response?.data?.message || "Something went wrong!", {
        position: "top-center"
      });
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-md w-full max-w-[800px] p-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Create an Account
        </h2>

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-2 ">
          <div className="flex flex-row-l gap-5 items-center justify-center ">
            {form.profileImage && (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <img
                  src={form.profileImage}
                  alt="Profile Preview"
                  style={{ width: 250, height: 250, borderRadius: "50%", objectFit: "cover" }}
                />
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button variant="outlined" component="label" startIcon={<FaUpload />}>
                Upload Profile Picture
                <input hidden type="file" accept="image/*" onChange={handleProfileUpload} />
              </Button>
              {uploading && <BiLoader size={20} />}
            </Box>
          </div>


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
            required
            className="border rounded-lg px-3 py-2 w-full"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleFormChange}
            required
            className="border rounded-lg px-3 py-2 w-full"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleFormChange}
            required
            className="border rounded-lg px-3 py-2 w-full"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleFormChange}
            required
            className="border rounded-lg px-3 py-2 w-full"
          />

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
